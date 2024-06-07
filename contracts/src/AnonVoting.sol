// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import { ISemaphoreVerifier } from "semaphore/interfaces/ISemaphoreVerifier.sol";
import { SemaphoreVoting } from "semaphore/extensions/SemaphoreVoting.sol";

import { IEAS, Attestation } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";

import { OPTIMISM_ATTESTER, EAS } from "src/constants.sol";

contract AnonVoting is SemaphoreVoting {
    error InvalidAttestation(string message);
    error AlreadyRegistered(address voter);
    error SelfEnrollmentOnly();

    IEAS internal eas = IEAS(EAS);

    mapping(address => bool) internal alreadyRegistered;

    constructor(ISemaphoreVerifier _verifier) SemaphoreVoting(_verifier) { }

    function addVoter(uint256 pollId, uint256 identityCommitment, bytes32 uid) external {
        Attestation memory att = eas.getAttestation(uid);

        if (att.attester != OPTIMISM_ATTESTER) revert InvalidAttestation("Not from trusted attester");
        if (att.recipient != msg.sender) revert InvalidAttestation("Does not belong to voter");
        if (alreadyRegistered[msg.sender]) revert AlreadyRegistered(msg.sender);

        if (polls[pollId].state != PollState.Created) {
            revert Semaphore__PollHasAlreadyBeenStarted();
        }

        alreadyRegistered[msg.sender] = true;

        _addMember(pollId, identityCommitment);
    }

    function _addMember(uint256 pollId, uint256 identityCommitment) internal override {
        if (msg.sender == polls[pollId].coordinator) revert SelfEnrollmentOnly();

        super._addMember(pollId, identityCommitment);
    }
}
