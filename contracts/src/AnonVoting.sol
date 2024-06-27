// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import { ISemaphoreVerifier } from "semaphore/interfaces/ISemaphoreVerifier.sol";
import { SemaphoreVoting } from "src/vendor/SemaphoreVoting.sol";

import { IEAS, Attestation } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";

import { OPTIMISM_ATTESTER, EAS } from "src/constants.sol";

contract AnonVoting is SemaphoreVoting {
    error InvalidAttestation(string message);
    error AlreadyEnrolled(address voter, uint256 pollId);
    error SelfEnrollmentOnly();

    IEAS internal eas = IEAS(EAS);

    mapping(uint256 => mapping(address => bool)) internal enrolled;

    mapping(uint256 => uint256) public encryptionKey;
    mapping(uint256 => uint256) public decryptionKey;

    mapping(uint256 => uint256[]) internal _votes;
    mapping(uint256 => uint256[]) internal _voters;

    constructor(ISemaphoreVerifier _verifier) SemaphoreVoting(_verifier) { }

    function addVoter(uint256 pollId, uint256 identityCommitment, bytes32 uid) external {
        Attestation memory att = eas.getAttestation(uid);

        if (att.attester != OPTIMISM_ATTESTER) revert InvalidAttestation("Not from trusted attester");
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

    function votes(uint256 pollId) public view returns (uint256[] memory) {
        return _votes[pollId];
    }

    function voters(uint256 pollId) public view returns (uint256[] memory) {
        return _voters[pollId];
    }
}
