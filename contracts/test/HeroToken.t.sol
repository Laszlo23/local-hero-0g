// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {HeroToken} from "../src/HeroToken.sol";

contract HeroTokenTest is Test {
    HeroToken internal token;
    address internal admin = address(0xA);

    function setUp() public {
        vm.prank(admin);
        token = new HeroToken(admin);
    }

    function test_Mint() public {
        address user = address(0xBEEF);
        vm.prank(admin);
        token.mint(user, 1e18);
        assertEq(token.balanceOf(user), 1e18);
    }

    function test_NonMinterCannotMint() public {
        vm.expectRevert();
        token.mint(address(0xBEEF), 1e18);
    }
}
