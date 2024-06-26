// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import { BaseScript } from "./Base.s.sol";
import { AnonVoting } from "src/AnonVoting.sol";
import { SemaphoreVerifier } from "semaphore/base/SemaphoreVerifier.sol";

/// @dev See the Solidity Scripting tutorial: https://book.getfoundry.sh/tutorials/solidity-scripting
contract Deploy is BaseScript {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        SemaphoreVerifier verifier = new SemaphoreVerifier();

        AnonVoting anonVoting = new AnonVoting(verifier);

        vm.stopBroadcast();
    }
}
