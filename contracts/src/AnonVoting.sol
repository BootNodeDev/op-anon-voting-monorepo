// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import { ISemaphoreVerifier } from "semaphore/interfaces/ISemaphoreVerifier.sol";
import { SemaphoreVoting } from "src/vendor/SemaphoreVoting.sol";

import { IEAS, Attestation } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";

import { EAS } from "src/constants.sol";

contract AnonVoting is SemaphoreVoting {
    error InvalidAttestation(string message);
    error AlreadyEnrolled(address voter, uint256 pollId);
    error SelfEnrollmentOnly();
    error InvalidArguments(string message);

    bytes32 public constant SCHEMA_UID = 0xfdcfdad2dbe7489e0ce56b260348b7f14e8365a8a325aef9834818c00d46b31b;
    address public immutable TRUSTED_ATTESTER;

    IEAS internal eas = IEAS(EAS);

    mapping(uint256 => mapping(address => bool)) internal enrolled;

    mapping(uint256 => uint256) public encryptionKey;
    mapping(uint256 => uint256) public decryptionKey;

    mapping(uint256 => uint256[]) internal _votes;
    mapping(uint256 => uint256[]) internal _voters;
    uint256[] internal _pollIds;
    mapping(uint256 => string) internal _pollRetroPgfRound;

    uint256 private creatingPoll = 1;

    struct PollData {
        uint256 id;
        address coordinator;
        PollState state;
        uint256[] votes;
        uint256[] voters;
        string round;
    }

    constructor(ISemaphoreVerifier _verifier, address trustedAttester) SemaphoreVoting(_verifier) {
        TRUSTED_ATTESTER = trustedAttester;
    }

    function createPoll(uint256 pollId, address coordinator, uint256 merkleTreeDepth) public override {
        if (creatingPoll != 2) revert InvalidArguments("RetroPGF Round required");

        super.createPoll(pollId, coordinator, merkleTreeDepth);
    }

    function createPoll(uint256 pollId, address coordinator, uint256 merkleTreeDepth, string calldata round) public {
        creatingPoll = 2;
        createPoll(pollId, coordinator, merkleTreeDepth);
        creatingPoll = 1;
        _pollIds.push(pollId);
        _pollRetroPgfRound[pollId] = round;
    }

    function addVoter(uint256 pollId, uint256 identityCommitment, bytes32 uid) external {
        Attestation memory att = eas.getAttestation(uid);

        if (att.schema != SCHEMA_UID) revert InvalidAttestation("Not a valid schema");
        if (att.attester != TRUSTED_ATTESTER) revert InvalidAttestation("Not from trusted attester");
        // decode after checking attester is trusted, data may be maliciously constructed
        (string memory round,,) = abi.decode(att.data, (string, address, string));
        if (keccak256(bytes(round)) != keccak256(bytes(_pollRetroPgfRound[pollId]))) {
            revert InvalidAttestation("Invalid RetroPGF round");
        }
        if (att.recipient != msg.sender) revert InvalidAttestation("Does not belong to voter");
        if (enrolled[pollId][msg.sender]) revert AlreadyEnrolled(msg.sender, pollId);

        if (polls[pollId].state != PollState.Created) {
            revert Semaphore__PollHasAlreadyBeenStarted();
        }

        enrolled[pollId][msg.sender] = true;
        _voters[pollId].push(identityCommitment);

        _addMember(pollId, identityCommitment);
    }

    /// @notice Disable adding voters via coordinator to prevent double/multi
    ///         enrollment with different identity commitments for the same
    ///         voter.
    /// @dev    Only callable by poll coordinator to maintain original behaviour,
    ///         although for now it will always revert with `SelfEnrollmentOnly`.
    function addVoter(uint256 pollId, uint256) public view override onlyCoordinator(pollId) {
        revert SelfEnrollmentOnly();
    }

    function startPoll(uint256 pollId, uint256 _encryptionKey) public override onlyCoordinator(pollId) {
        super.startPoll(pollId, _encryptionKey);
        encryptionKey[pollId] = _encryptionKey;
    }

    function endPoll(uint256 pollId, uint256 _decryptionKey) public override onlyCoordinator(pollId) {
        super.endPoll(pollId, _decryptionKey);
        decryptionKey[pollId] = _decryptionKey;
    }

    function castVote(uint256 vote, uint256 nullifierHash, uint256 pollId, uint256[8] calldata proof) public override {
        super.castVote(vote, nullifierHash, pollId, proof);
        _votes[pollId].push(vote);
    }

    function getPoll(uint256 pollId) public view returns (PollData memory) {
        PollData memory pollData;
        Poll storage poll = polls[pollId];
        pollData.id = pollId;
        pollData.coordinator = poll.coordinator;
        pollData.state = poll.state;
        pollData.votes = _votes[pollId];
        pollData.voters = _voters[pollId];
        pollData.round = _pollRetroPgfRound[pollId];

        return pollData;
    }

    function getPolls() public view returns (PollData[] memory) {
        PollData[] memory allPolls = new PollData[](_pollIds.length);

        for (uint256 i; i < _pollIds.length; ++i) {
            uint256 pollId = _pollIds[i];
            allPolls[i] = getPoll(pollId);
        }

        return allPolls;
    }
}
