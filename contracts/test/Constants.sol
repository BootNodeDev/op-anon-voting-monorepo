// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.4;

abstract contract Constants {
    address internal constant OPTIMISM_ATTESTER = 0x621477dBA416E12df7FF0d48E14c4D20DC85D7D9;

    bytes32 internal constant REAL_ATT_UID = 0xe9d4e5a14ec840656d9def34075d9523d1536176d5f0a7d574f2e93bea641b66;
    bytes32 internal constant FAKE_ATT_UID = 0x95f6eaa137853e15e93bd6e0b3d62a28529a5b04aa0ea5d2092bb7764464c812;
    bytes32 internal constant INVALID_ATT_UID = 0x8e2183fbd147e36577c3fb7df71a3643f8216a0b02f8fca04bf78a1db303cd29;
}
