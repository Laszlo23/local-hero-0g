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

    function test_MaxSupplyConstant() public view {
        assertEq(token.MAX_SUPPLY(), 77_777_777 * 1e18);
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

    function test_MintUpToMaxSupply() public {
        address user = address(0xBEEF);
        uint256 max = token.MAX_SUPPLY();
        vm.prank(admin);
        token.mint(user, max);
        assertEq(token.totalSupply(), max);
        assertEq(token.remainingMintable(), 0);
    }

    function test_MintBeyondMaxReverts() public {
        address user = address(0xBEEF);
        uint256 max = token.MAX_SUPPLY();
        vm.prank(admin);
        token.mint(user, max);

        vm.expectRevert(abi.encodeWithSelector(HeroToken.MaxSupplyExceeded.selector, max + 1, max));
        vm.prank(admin);
        token.mint(user, 1);
    }

    function test_PartialMintRemaining() public {
        vm.prank(admin);
        token.mint(address(0x1), 1e18);
        assertEq(token.remainingMintable(), token.MAX_SUPPLY() - 1e18);
    }
}
