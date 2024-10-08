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
    uint256 internal altPollId = 42;

    // generated from the string "super-secret-string"
    uint256 internal identityCommitment =
        15_496_707_633_537_264_750_768_393_125_461_693_718_536_245_296_054_813_987_456_368_988_786_470_942_619;
    uint256 internal nullifierHash =
        3_104_961_544_468_417_692_805_194_094_132_174_734_896_645_457_928_851_740_490_793_192_542_543_097_682;
    uint256 internal vote = 1;
    uint256[8] internal proof = [
        17_652_806_250_142_043_265_677_738_243_538_359_450_801_542_485_688_757_153_312_140_731_643_224_877_377,
        13_744_166_169_785_134_796_158_811_356_908_033_609_548_482_217_171_979_767_389_435_265_740_553_487_517,
        7_785_674_129_376_896_614_081_581_666_857_661_900_504_398_666_452_227_963_821_950_045_900_934_183_757,
        20_087_263_059_123_575_343_716_528_323_902_370_545_476_701_351_435_820_529_161_469_506_067_572_950_940,
        20_033_816_488_664_444_161_753_713_673_280_900_450_322_447_174_269_464_332_845_133_803_726_242_399_001,
        15_504_682_991_042_552_429_961_919_851_249_671_079_443_122_305_258_162_487_864_461_339_336_789_839_589,
        3_169_490_819_723_670_831_069_058_715_634_425_517_185_174_425_680_627_234_161_092_554_755_043_229_507,
        18_617_199_750_602_324_979_667_465_078_511_901_015_698_716_429_734_487_391_056_688_979_349_462_682_641
    ];

    uint256 internal encryptionKey = 12_345;
    uint256 internal decryptionKey = 67_890;

    IEAS internal eas = IEAS(EAS);

    function setUp() public virtual {
        vm.createSelectFork("optimism", 120_069_420);

        verifier = new SemaphoreVerifier();
        anonVoting = new AnonVoting(verifier, OPTIMISM_ATTESTER);

        anonVoting.createPoll(pollId, COORDINATOR, 32, "3", "Title 1");
        anonVoting.createPoll(altPollId, COORDINATOR, 32, "3", "Title 2");
    }
}

contract CreatePoll is AnonVotingTest {
    function test_RevertIf_AttemptingToCreatePollWithoutRound() public {
        vm.expectRevert(
            abi.encodeWithSelector(AnonVoting.InvalidArguments.selector, "RetroPGF Round and poll title required")
        );
        anonVoting.createPoll(2, COORDINATOR, 32);
    }
}

contract AddVoter is AnonVotingTest {
    function test_CanAddSelfByAttestationUID() public {
        Attestation memory att = eas.getAttestation(REAL_ATT_UID);

        vm.expectEmit(true, true, true, false, address(anonVoting));
        emit MemberAdded(pollId, 0, identityCommitment, 0);

        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, identityCommitment, REAL_ATT_UID);
    }

    function test_CanEnrollForMultiplePolls() public {
        Attestation memory att = eas.getAttestation(REAL_ATT_UID);
        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, identityCommitment, REAL_ATT_UID);

        vm.expectEmit(true, true, true, false, address(anonVoting));
        emit MemberAdded(altPollId, 0, identityCommitment, 0);

        vm.prank(att.recipient);
        anonVoting.addVoter(altPollId, identityCommitment, REAL_ATT_UID);
    }

    function test_RevertIf_AttestationDoesNotBelongToVoter() public {
        vm.expectRevert(abi.encodeWithSelector(AnonVoting.InvalidAttestation.selector, "Does not belong to voter"));
        anonVoting.addVoter(pollId, identityCommitment, REAL_ATT_UID);
    }

    function test_RevertIf_AttestationIsNotFromTrustedAttester() public {
        vm.expectRevert(abi.encodeWithSelector(AnonVoting.InvalidAttestation.selector, "Not from trusted attester"));
        anonVoting.addVoter(pollId, identityCommitment, FAKE_ATT_UID);
    }

    function test_RevertIf_AttestationIsNotForValidSchema() public {
        vm.expectRevert(abi.encodeWithSelector(AnonVoting.InvalidAttestation.selector, "Not a valid schema"));
        anonVoting.addVoter(pollId, identityCommitment, INVALID_ATT_UID);
    }

    function test_RevertIf_AttestationIsForDifferentRound() public {
        vm.expectRevert(abi.encodeWithSelector(AnonVoting.InvalidAttestation.selector, "Invalid RetroPGF round"));
        anonVoting.addVoter(pollId, identityCommitment, DIFFERENT_ROUND_ATT_UID);
    }

    function test_RevertIf_CoordinatorAttemptsToAddVoter() public {
        vm.expectRevert(AnonVoting.SelfEnrollmentOnly.selector);
        vm.prank(COORDINATOR);
        anonVoting.addVoter(pollId, identityCommitment);
    }

    function test_RevertIf_VoterAttemptsDoubleEnrollment() public {
        Attestation memory att = eas.getAttestation(REAL_ATT_UID);
        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, identityCommitment, REAL_ATT_UID);

        vm.expectRevert(abi.encodeWithSelector(AnonVoting.AlreadyEnrolled.selector, att.recipient, pollId));
        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, 69, REAL_ATT_UID);
    }

    function test_StoresVotersIdentityCommitment() public {
        Attestation memory att = eas.getAttestation(REAL_ATT_UID);
        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, identityCommitment, REAL_ATT_UID);

        AnonVoting.PollData memory pollData = anonVoting.getPoll(pollId);
        assertEq(pollData.voters[0], identityCommitment);
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

        Attestation memory att = eas.getAttestation(REAL_ATT_UID);
        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, identityCommitment, REAL_ATT_UID);

        vm.prank(COORDINATOR);
        anonVoting.startPoll(pollId, encryptionKey);
    }

    function test_StoresVote() public {
        anonVoting.castVote(vote, nullifierHash, pollId, proof);

        AnonVoting.PollData memory pollData = anonVoting.getPoll(pollId);
        assertEq(pollData.votes.length, 1);
        assertEq(pollData.votes[0], vote);
    }
}

abstract contract GetPollTest is AnonVotingTest {
    function setUp() public override {
        super.setUp();

        Attestation memory att = eas.getAttestation(REAL_ATT_UID);
        vm.prank(att.recipient);
        anonVoting.addVoter(pollId, identityCommitment, REAL_ATT_UID);

        vm.prank(COORDINATOR);
        anonVoting.startPoll(pollId, encryptionKey);
        anonVoting.castVote(vote, nullifierHash, pollId, proof);
    }
}

contract GetPoll is GetPollTest {
    function test_ReturnsPollMetadata() public view {
        AnonVoting.PollData memory pollData = anonVoting.getPoll(altPollId);
        assertEq(pollData.id, altPollId);
        assertEq(pollData.coordinator, COORDINATOR);
        assertEq(uint256(pollData.state), uint256(ISemaphoreVoting.PollState.Created));
        assertEq(pollData.votes.length, 0);
        assertEq(pollData.voters.length, 0);
        assertEq(pollData.round, "3");
        assertEq(pollData.title, "Title 2");
    }

    function test_ReturnsMetadataForOngoingPoll() public view {
        AnonVoting.PollData memory pollData = anonVoting.getPoll(pollId);
        assertEq(pollData.id, pollId);
        assertEq(pollData.coordinator, COORDINATOR);
        assertEq(uint256(pollData.state), uint256(ISemaphoreVoting.PollState.Ongoing));
        assertEq(pollData.votes.length, 1);
        assertEq(pollData.voters.length, 1);
        assertEq(pollData.round, "3");
        assertEq(pollData.title, "Title 1");
    }
}

contract GetPolls is GetPollTest {
    function test_ReturnsAllPollsMetadata() public view {
        AnonVoting.PollData[] memory pollData = anonVoting.getPolls();
        assertEq(pollData.length, 2);

        assertEq(pollData[0].id, pollId);
        assertEq(pollData[0].coordinator, COORDINATOR);
        assertEq(uint256(pollData[0].state), uint256(ISemaphoreVoting.PollState.Ongoing));
        assertEq(pollData[0].voters.length, 1);
        assertEq(pollData[0].votes.length, 1);
        assertEq(pollData[0].votes[0], vote);
        assertEq(pollData[0].round, "3");
        assertEq(pollData[0].title, "Title 1");

        assertEq(pollData[1].id, altPollId);
        assertEq(pollData[1].coordinator, COORDINATOR);
        assertEq(uint256(pollData[1].state), uint256(ISemaphoreVoting.PollState.Created));
        assertEq(pollData[1].voters.length, 0);
        assertEq(pollData[1].votes.length, 0);
        assertEq(pollData[1].round, "3");
        assertEq(pollData[1].title, "Title 2");
    }
}
