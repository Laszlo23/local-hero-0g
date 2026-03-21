// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {LocalHeroBadges} from "../src/LocalHeroBadges.sol";
contract LocalHeroBadgesTest is Test {
    LocalHeroBadges internal badges;
    uint256 internal signerPk = 0xA11CE;
    address internal signer;
    address internal admin = address(0xAD);

    bytes32 internal constant MINT_VOUCHER_TYPEHASH =
        keccak256("MintVoucher(address minter,uint256 badgeId,uint256 amount,uint256 nonce,uint256 deadline)");

    function setUp() public {
        signer = vm.addr(signerPk);
        vm.prank(admin);
        badges = new LocalHeroBadges(admin);
        vm.startPrank(admin);
        badges.grantRole(badges.SIGNER_ROLE(), signer);
        badges.grantRole(badges.AGENT_ROLE(), address(0xA6E4));
        vm.stopPrank();
    }

    function _domainSeparator(address verifyingContract) internal view returns (bytes32) {
        bytes32 typeHash = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
        return keccak256(abi.encode(typeHash, keccak256(bytes("LocalHeroBadges")), keccak256(bytes("1")), block.chainid, verifyingContract));
    }

    function _signMintVoucher(
        address minter,
        uint256 badgeId,
        uint256 amount,
        uint256 nonce,
        uint256 deadline
    ) internal view returns (bytes memory) {
        bytes32 structHash = keccak256(abi.encode(MINT_VOUCHER_TYPEHASH, minter, badgeId, amount, nonce, deadline));
        bytes32 digest = keccak256(abi.encodePacked(hex"1901", _domainSeparator(address(badges)), structHash));
        (uint8 v, bytes32 r, bytes32 s) = vm.sign(signerPk, digest);
        return abi.encodePacked(r, s, v);
    }

    function test_RegisterAndMintWithSignature() public {
        uint256 badgeId = 1;
        vm.prank(admin);
        badges.registerBadgeType(badgeId, "ipfs://meta/1.json", 100, false);

        address user = address(0xBEEF);
        uint256 deadline = block.timestamp + 1 hours;
        LocalHeroBadges.MintVoucher memory v = LocalHeroBadges.MintVoucher({
            minter: user,
            badgeId: badgeId,
            amount: 1,
            nonce: 0,
            deadline: deadline
        });
        bytes memory sig = _signMintVoucher(user, badgeId, 1, 0, deadline);

        vm.prank(user);
        badges.mintWithSignature(v, sig);

        assertEq(badges.balanceOf(user, badgeId), 1);
        assertEq(badges.nonces(user), 1);
    }

    function test_AgentMint() public {
        uint256 badgeId = 2;
        vm.prank(admin);
        badges.registerBadgeType(badgeId, "ipfs://meta/2.json", 0, false);

        address agent = address(0xA6E4);
        address recipient = address(0xCAFE);
        vm.prank(agent);
        badges.agentMint(recipient, badgeId, 3);

        assertEq(badges.balanceOf(recipient, badgeId), 3);
    }

    function test_SoulboundBlocksTransfer() public {
        uint256 badgeId = 3;
        vm.prank(admin);
        badges.registerBadgeType(badgeId, "ipfs://meta/3.json", 10, true);

        address user = address(0xBEEF);
        uint256 deadline = block.timestamp + 1 hours;
        LocalHeroBadges.MintVoucher memory v = LocalHeroBadges.MintVoucher({
            minter: user,
            badgeId: badgeId,
            amount: 1,
            nonce: 0,
            deadline: deadline
        });
        bytes memory sig = _signMintVoucher(user, badgeId, 1, 0, deadline);

        vm.prank(user);
        badges.mintWithSignature(v, sig);

        vm.prank(user);
        vm.expectRevert(abi.encodeWithSelector(LocalHeroBadges.Soulbound.selector, badgeId));
        badges.safeTransferFrom(user, address(0xDEAD), badgeId, 1, "");
    }
}
