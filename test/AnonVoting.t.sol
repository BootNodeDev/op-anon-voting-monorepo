// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import { Test } from "forge-std/src/Test.sol";
import { console2 } from "forge-std/src/console2.sol";

import { SemaphoreVerifier } from "semaphore/base/SemaphoreVerifier.sol";

import { AnonVoting } from "src/AnonVoting.sol";

contract AnonVotingTest is Test {
    SemaphoreVerifier public verifier;
    AnonVoting public anonVoting;

    function setUp() public {
        verifier = new SemaphoreVerifier();
        anonVoting = new AnonVoting(verifier);
    }

    function test_Works() public view {
        assertNotEq(address(anonVoting), address(0));
    }
}
