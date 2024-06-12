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

contract AnonVotingTest is Test {
    SemaphoreVerifier public verifier;
    AnonVoting public anonVoting;

    address internal immutable COORDINATOR = makeAddr("coordinator");

    bytes32 internal constant REAL_UID = 0xe9d4e5a14ec840656d9def34075d9523d1536176d5f0a7d574f2e93bea641b66;
    bytes32 internal constant FAKE_UID = 0x95f6eaa137853e15e93bd6e0b3d62a28529a5b04aa0ea5d2092bb7764464c812;

    uint256 internal pollId = 1;
    uint256 internal identityCommitment = 42;

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

    function test_RevertIf_VoterAttemptsDoubleRegistration() public {
        Attestation memory att = eas.getAttestation(REAL_UID);
        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, identityCommitment, REAL_UID);

        vm.expectRevert(abi.encodeWithSelector(AnonVoting.AlreadyRegistered.selector, att.recipient));
        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, 69, REAL_UID);
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
