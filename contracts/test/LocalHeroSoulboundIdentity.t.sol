// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Test} from "forge-std/Test.sol";
import {LocalHeroSoulboundIdentity} from "../src/LocalHeroSoulboundIdentity.sol";

contract LocalHeroSoulboundIdentityTest is Test {
    LocalHeroSoulboundIdentity internal id;
    uint256 internal signerPk = 0xB0B;
    address internal signer;
    address internal admin = address(0xAD);

    bytes32 internal constant CLAIM_VOUCHER_TYPEHASH =
        keccak256("ClaimVoucher(address claimer,uint256 nonce,uint256 deadline)");

    function setUp() public {
        signer = vm.addr(signerPk);
        vm.startPrank(admin);
        id = new LocalHeroSoulboundIdentity(admin, "https://meta.localhero.test/");
        id.grantRole(id.SIGNER_ROLE(), signer);
        vm.stopPrank();
    }

    function _domainSeparator(address verifyingContract) internal view returns (bytes32) {
        bytes32 typeHash = keccak256("EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)");
        return
            keccak256(
                abi.encode(
                    typeHash,
                    keccak256(bytes("LocalHeroSoulboundIdentity")),
                    keccak256(bytes("1")),
                    block.chainid,
                    verifyingContract
                )
            );
    }

    function test_ClaimWithSignature() public {
        address user = address(0xBEEF);
        uint256 deadline = block.timestamp + 1 hours;
        LocalHeroSoulboundIdentity.ClaimVoucher memory v =
            LocalHeroSoulboundIdentity.ClaimVoucher({claimer: user, nonce: 0, deadline: deadline});

        bytes32 structHash = keccak256(abi.encode(CLAIM_VOUCHER_TYPEHASH, v.claimer, v.nonce, v.deadline));
        bytes32 digest = keccak256(abi.encodePacked(hex"1901", _domainSeparator(address(id)), structHash));
        (uint8 sigV, bytes32 sigR, bytes32 sigS) = vm.sign(signerPk, digest);
        bytes memory sig = abi.encodePacked(sigR, sigS, sigV);

        vm.prank(user);
        id.claimWithSignature(v, sig);

        uint256 tokenId = uint256(uint160(user));
        assertEq(id.ownerOf(tokenId), user);
    }

    function test_TransferReverts() public {
        address user = address(0xCAFE);
        vm.startPrank(admin);
        id.grantRole(id.AGENT_ROLE(), admin);
        id.agentMint(user);
        vm.stopPrank();

        uint256 tokenId = uint256(uint160(user));
        vm.prank(user);
        vm.expectRevert(LocalHeroSoulboundIdentity.SoulboundTransfer.selector);
        id.transferFrom(user, address(0xDEAD), tokenId);
    }
}
