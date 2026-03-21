// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title LocalHeroSoulboundIdentity
 * @notice Non-transferable ERC-721 “Hero ID” (soulbound). One token per address.
 * @dev Mint via signature (`claimWithSignature`) or `agentMint` for ops / events.
 */
contract LocalHeroSoulboundIdentity is ERC721, AccessControl, Pausable, ReentrancyGuard, EIP712 {
    using ECDSA for bytes32;
    using Strings for uint256;

    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");

    struct ClaimVoucher {
        address claimer;
        uint256 nonce;
        uint256 deadline;
    }

    bytes32 private constant CLAIM_VOUCHER_TYPEHASH =
        keccak256("ClaimVoucher(address claimer,uint256 nonce,uint256 deadline)");

    string private _baseTokenURI;
    mapping(address => uint256) private _nonces;

    event IdentityClaimed(address indexed claimer, uint256 indexed tokenId);
    event AgentIdentityMint(address indexed to, uint256 indexed tokenId);

    error AlreadyClaimed();
    error InvalidSigner();
    error ExpiredDeadline();
    error BadNonce();
    error WrongClaimer();
    error SoulboundTransfer();

    constructor(address admin, string memory baseURI_) ERC721("Local Hero Identity", "HERO-ID") EIP712("LocalHeroSoulboundIdentity", "1") {
        if (admin == address(0)) revert();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _baseTokenURI = baseURI_;
    }

    function nonces(address account) external view returns (uint256) {
        return _nonces[account];
    }

    function setBaseURI(string calldata baseURI_) external onlyRole(DEFAULT_ADMIN_ROLE) {
        _baseTokenURI = baseURI_;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        _requireOwned(tokenId);
        return bytes(_baseTokenURI).length > 0 ? string.concat(_baseTokenURI, tokenId.toString()) : "";
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    /// @notice User pays gas; `signature` must be from an address with `SIGNER_ROLE`.
    function claimWithSignature(ClaimVoucher calldata voucher, bytes calldata signature) external nonReentrant whenNotPaused {
        if (balanceOf(msg.sender) > 0) revert AlreadyClaimed();
        if (block.timestamp > voucher.deadline) revert ExpiredDeadline();
        if (voucher.claimer != msg.sender) revert WrongClaimer();
        if (voucher.nonce != _nonces[voucher.claimer]) revert BadNonce();

        bytes32 structHash = keccak256(abi.encode(CLAIM_VOUCHER_TYPEHASH, voucher.claimer, voucher.nonce, voucher.deadline));
        uint256 tokenId = uint256(uint160(voucher.claimer));

        address recovered = ECDSA.recover(_hashTypedDataV4(structHash), signature);
        if (!hasRole(SIGNER_ROLE, recovered)) revert InvalidSigner();

        _safeMint(voucher.claimer, tokenId);
        unchecked {
            _nonces[voucher.claimer]++;
        }
        emit IdentityClaimed(voucher.claimer, tokenId);
    }

    /// @notice Agent mint for campaigns (same one-per-address rule).
    function agentMint(address to) external onlyRole(AGENT_ROLE) nonReentrant whenNotPaused {
        if (to == address(0)) revert();
        if (balanceOf(to) > 0) revert AlreadyClaimed();
        uint256 tokenId = uint256(uint160(to));
        if (_ownerOf(tokenId) != address(0)) revert AlreadyClaimed();
        _safeMint(to, tokenId);
        emit AgentIdentityMint(to, tokenId);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        if (from != address(0) && to != address(0)) revert SoulboundTransfer();
        return super._update(to, tokenId, auth);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721, AccessControl) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
