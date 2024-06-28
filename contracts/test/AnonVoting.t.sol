// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import { Test } from "forge-std/src/Test.sol";
//solhint-disable-next-line
import { console2 } from "forge-std/src/console2.sol";

import { SemaphoreVerifier } from "semaphore/base/SemaphoreVerifier.sol";
import { ISemaphoreVoting } from "src/vendor/SemaphoreVoting.sol";

import { IEAS, Attestation } from "@ethereum-attestation-service/eas-contracts/contracts/IEAS.sol";

import { AnonVoting } from "src/AnonVoting.sol";

import { EAS } from "src/constants.sol";

import { Constants } from "test/Constants.sol";

contract AnonVotingTest is Test, Constants {
    SemaphoreVerifier public verifier;
    AnonVoting public anonVoting;

    address internal immutable COORDINATOR = makeAddr("coordinator");

    uint256 internal pollId = 1;
    // generated from the string "super-secret-string"
    uint256 internal identityCommitment =
        15_496_707_633_537_264_750_768_393_125_461_693_718_536_245_296_054_813_987_456_368_988_786_470_942_619;

    uint256 internal encryptionKey = 12_345;
    uint256 internal decryptionKey = 67_890;

    IEAS internal eas = IEAS(EAS);

    function setUp() public virtual {
        vm.createSelectFork("optimism", 120_069_420);

        verifier = new SemaphoreVerifier();
        anonVoting = new AnonVoting(verifier);

        anonVoting.createPoll(pollId, COORDINATOR, 32);
    }
}

contract AddVoter is AnonVotingTest {
    function test_CanAddSelfByAttestationUID() public {
        Attestation memory att = eas.getAttestation(REAL_UID);

        vm.expectEmit(true, true, true, false, address(anonVoting));
        emit MemberAdded(pollId, 0, identityCommitment, 0);

        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, identityCommitment, REAL_UID);
    }

    function test_CanEnrollForMultiplePolls() public {
        Attestation memory att = eas.getAttestation(REAL_UID);
        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, identityCommitment, REAL_UID);

        anonVoting.createPoll(69, COORDINATOR, 32);

        vm.expectEmit(true, true, true, false, address(anonVoting));
        emit MemberAdded(69, 0, identityCommitment, 0);

        vm.prank(att.recipient);
        anonVoting.addVoter(69, identityCommitment, REAL_UID);
    }

    function test_RevertIf_AttestationDoesNotBelongToVoter() public {
        vm.expectRevert(abi.encodeWithSelector(AnonVoting.InvalidAttestation.selector, "Does not belong to voter"));
        anonVoting.addVoter(pollId, identityCommitment, REAL_UID);
    }

    function test_RevertIf_AttestationIsNotFromTrustedAttester() public {
        vm.expectRevert(abi.encodeWithSelector(AnonVoting.InvalidAttestation.selector, "Not from trusted attester"));
        anonVoting.addVoter(pollId, identityCommitment, FAKE_UID);
    }

    function test_RevertIf_CoordinatorAttemptsToAddVoter() public {
        vm.expectRevert(AnonVoting.SelfEnrollmentOnly.selector);
        vm.prank(COORDINATOR);
        anonVoting.addVoter(pollId, identityCommitment);
    }

    function test_RevertIf_VoterAttemptsDoubleEnrollment() public {
        Attestation memory att = eas.getAttestation(REAL_UID);
        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, identityCommitment, REAL_UID);

        vm.expectRevert(abi.encodeWithSelector(AnonVoting.AlreadyEnrolled.selector, att.recipient, pollId));
        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, 69, REAL_UID);
    }

    function test_StoresVotersIdentityCommitment() public {
        Attestation memory att = eas.getAttestation(REAL_UID);
        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, identityCommitment, REAL_UID);

        assertEq(anonVoting.voters(pollId)[0], identityCommitment);
    }

    event MemberAdded(uint256 indexed groupId, uint256 index, uint256 identityCommitment, uint256 merkleTreeRoot);
}

contract StartPoll is AnonVotingTest {
    function test_StoresEncryptionKey() public {
        vm.prank(COORDINATOR);
        anonVoting.startPoll(pollId, encryptionKey);

        assertEq(anonVoting.encryptionKey(pollId), encryptionKey);
    }

    function test_RevertWhen_NotCalledByCoordinator() public {
        vm.expectRevert(ISemaphoreVoting.Semaphore__CallerIsNotThePollCoordinator.selector);
        anonVoting.startPoll(pollId, encryptionKey);
    }
}

contract EndPoll is AnonVotingTest {
    function setUp() public override {
        super.setUp();

        vm.prank(COORDINATOR);
        anonVoting.startPoll(pollId, encryptionKey);
    }

    function test_StoresDecryptionKey() public {
        vm.prank(COORDINATOR);
        anonVoting.endPoll(pollId, decryptionKey);

        assertEq(anonVoting.decryptionKey(pollId), decryptionKey);
    }

    function test_RevertWhen_NotCalledByCoordinator() public {
        vm.expectRevert(ISemaphoreVoting.Semaphore__CallerIsNotThePollCoordinator.selector);
        anonVoting.endPoll(pollId, decryptionKey);
    }
}

contract CastVote is AnonVotingTest {
    function setUp() public override {
        super.setUp();

        Attestation memory att = eas.getAttestation(REAL_UID);
        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, identityCommitment, REAL_UID);

        vm.prank(COORDINATOR);
        anonVoting.startPoll(pollId, encryptionKey);
    }

    function test_StoresVote() public {
        anonVoting.castVote(vote, nullifierHash, pollId, proof);
        assertEq(anonVoting.votes(pollId).length, 1);
        assertEq(anonVoting.votes(pollId)[0], vote);
    }
}
