// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

import { ISemaphoreVerifier } from "semaphore/interfaces/ISemaphoreVerifier.sol";
import { SemaphoreVoting } from "semaphore/extensions/SemaphoreVoting.sol";

contract AnonVoting is SemaphoreVoting {
    constructor(ISemaphoreVerifier _verifier) SemaphoreVoting(_verifier) { }
}
