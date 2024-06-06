// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import { ISemaphoreVerifier } from "semaphore/interfaces/ISemaphoreVerifier.sol";
import { SemaphoreVoting } from "semaphore/extensions/SemaphoreVoting.sol";

import { IEAS, Attestation } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";

import { OPTIMISM_ATTESTER, EAS } from "src/constants.sol";

contract AnonVoting is SemaphoreVoting {
    IEAS internal eas = IEAS(EAS);

    mapping(address => bool) internal alreadyRegistered;

    constructor(ISemaphoreVerifier _verifier) SemaphoreVoting(_verifier) { }

    function addVoter(uint256 pollId, uint256 identityCommitment, bytes32 uid) external {
        Attestation memory att = eas.getAttestation(uid);

        require(att.attester == OPTIMISM_ATTESTER, "Attestation is not from trusted attester");
        require(att.recipient == msg.sender, "Attestation does not belong to voter");
        require(!alreadyRegistered[msg.sender], "Already registered");

        if (polls[pollId].state != PollState.Created) {
            revert Semaphore__PollHasAlreadyBeenStarted();
        }

        alreadyRegistered[msg.sender] = true;

        _addMember(pollId, identityCommitment);
    }
}
