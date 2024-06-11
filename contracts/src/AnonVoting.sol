// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import { ISemaphoreVerifier } from "semaphore/interfaces/ISemaphoreVerifier.sol";
import { SemaphoreVoting } from "src/vendor/SemaphoreVoting.sol";

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

    /// @notice Disable adding voters via coordinator to prevent double/multi
    ///         enrollment with different identity commitments for the same
    ///         voter.
    /// @dev    Only callable by poll coordinator to maintain original behaviour,
    ///         although for now it will always revert with `SelfEnrollmentOnly`.
    function addVoter(uint256 pollId, uint256) public view override onlyCoordinator(pollId) {
        revert SelfEnrollmentOnly();
    }
}
