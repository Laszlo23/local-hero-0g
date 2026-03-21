// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC1155} from "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import {ERC1155URIStorage} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import {ERC1155Supply} from "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155Supply.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {Pausable} from "@openzeppelin/contracts/utils/Pausable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
/**
 * @title LocalHeroBadges
 * @notice ERC-1155 achievement badges for Local Hero.
 * @dev
 * - **Earned in app / minted on-chain**: backend issues EIP-712 `MintVoucher` signatures; users call `mintWithSignature` (gas).
 * - **Agent / event drops**: `AGENT_ROLE` can `agentMint` registered badge types (e.g. special events).
 * - **Badge catalog**: `REGISTRAR_ROLE` registers `badgeId`, metadata URI, optional max supply, and soulbound (non-transferable) flag.
 */
contract LocalHeroBadges is ERC1155URIStorage, ERC1155Supply, AccessControl, Pausable, ReentrancyGuard, EIP712 {
    using ECDSA for bytes32;

    bytes32 public constant REGISTRAR_ROLE = keccak256("REGISTRAR_ROLE");
    bytes32 public constant SIGNER_ROLE = keccak256("SIGNER_ROLE");
    bytes32 public constant AGENT_ROLE = keccak256("AGENT_ROLE");

    /// @notice EIP-712 type for user-initiated mints (matches backend / frontend signing).
    struct MintVoucher {
        address minter;
        uint256 badgeId;
        uint256 amount;
        uint256 nonce;
        uint256 deadline;
    }

    bytes32 private constant MINT_VOUCHER_TYPEHASH =
        keccak256("MintVoucher(address minter,uint256 badgeId,uint256 amount,uint256 nonce,uint256 deadline)");

    mapping(uint256 badgeId => bool) public badgeRegistered;
    mapping(uint256 badgeId => uint256) public maxSupplyForBadge;
    /// @notice If true, transfers of this id are blocked (still mint/burn).
    mapping(uint256 badgeId => bool) public soulbound;
    mapping(address => uint256) private _nonces;

    event BadgeTypeRegistered(uint256 indexed badgeId, string tokenURI, uint256 maxSupply, bool soulbound);
    event MintedWithSignature(address indexed minter, uint256 indexed badgeId, uint256 amount);
    event AgentMint(address indexed to, uint256 indexed badgeId, uint256 amount);

    error BadgeNotRegistered(uint256 badgeId);
    error AlreadyRegistered(uint256 badgeId);
    error InvalidSigner();
    error ExpiredDeadline();
    error BadNonce();
    error WrongMinter();
    error MaxSupplyExceeded(uint256 badgeId);
    error Soulbound(uint256 badgeId);

    constructor(address admin) ERC1155("") EIP712("LocalHeroBadges", "1") {
        if (admin == address(0)) revert();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(REGISTRAR_ROLE, admin);
    }

    /// @dev Resolve `uri` diamond inheritance between {ERC1155URIStorage} and {ERC1155}.
    function uri(uint256 tokenId) public view virtual override(ERC1155URIStorage, ERC1155) returns (string memory) {
        return super.uri(tokenId);
    }

    function nonces(address account) external view returns (uint256) {
        return _nonces[account];
    }

    /// @notice Register a badge type before any mint. `maxSupply == 0` means unlimited.
    function registerBadgeType(
        uint256 badgeId,
        string calldata tokenURI_,
        uint256 maxSupply_,
        bool soulbound_
    ) external onlyRole(REGISTRAR_ROLE) {
        if (badgeRegistered[badgeId]) revert AlreadyRegistered(badgeId);
        badgeRegistered[badgeId] = true;
        maxSupplyForBadge[badgeId] = maxSupply_;
        soulbound[badgeId] = soulbound_;
        _setURI(badgeId, tokenURI_);
        emit BadgeTypeRegistered(badgeId, tokenURI_, maxSupply_, soulbound_);
    }

    /// @notice Update metadata URI for a registered badge (e.g. IPFS fix).
    function setBadgeURI(uint256 badgeId, string calldata tokenURI_) external onlyRole(REGISTRAR_ROLE) {
        if (!badgeRegistered[badgeId]) revert BadgeNotRegistered(badgeId);
        _setURI(badgeId, tokenURI_);
    }

    /// @notice User pays gas; `signature` must be from an address with `SIGNER_ROLE`.
    function mintWithSignature(MintVoucher calldata voucher, bytes calldata signature) external nonReentrant whenNotPaused {
        if (block.timestamp > voucher.deadline) revert ExpiredDeadline();
        if (voucher.minter != _msgSender()) revert WrongMinter();
        if (!badgeRegistered[voucher.badgeId]) revert BadgeNotRegistered(voucher.badgeId);
        if (voucher.amount == 0 || voucher.amount > 1_000) revert();
        if (voucher.nonce != _nonces[voucher.minter]) revert BadNonce();

        bytes32 structHash = keccak256(
            abi.encode(
                MINT_VOUCHER_TYPEHASH,
                voucher.minter,
                voucher.badgeId,
                voucher.amount,
                voucher.nonce,
                voucher.deadline
            )
        );
        bytes32 digest = _hashTypedDataV4(structHash);
        address recovered = ECDSA.recover(digest, signature);
        if (!hasRole(SIGNER_ROLE, recovered)) revert InvalidSigner();

        _mintChecked(voucher.minter, voucher.badgeId, voucher.amount);
        unchecked {
            _nonces[voucher.minter]++;
        }
        emit MintedWithSignature(voucher.minter, voucher.badgeId, voucher.amount);
    }

    /// @notice Agent mint for campaigns / one-off events (badge must be registered).
    function agentMint(address to, uint256 badgeId, uint256 amount) external onlyRole(AGENT_ROLE) nonReentrant whenNotPaused {
        if (to == address(0)) revert();
        if (!badgeRegistered[badgeId]) revert BadgeNotRegistered(badgeId);
        if (amount == 0 || amount > 1_000) revert();
        _mintChecked(to, badgeId, amount);
        emit AgentMint(to, badgeId, amount);
    }

    function pause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }

    function unpause() external onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }

    function _mintChecked(address to, uint256 id, uint256 amount) internal {
        uint256 max = maxSupplyForBadge[id];
        if (max != 0) {
            if (totalSupply(id) + amount > max) revert MaxSupplyExceeded(id);
        }
        _mint(to, id, amount, "");
    }

    function _update(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory values
    ) internal virtual override(ERC1155Supply, ERC1155) {
        if (paused() && from != address(0) && to != address(0)) {
            revert EnforcedPause();
        }
        if (from != address(0) && to != address(0)) {
            uint256 len = ids.length;
            for (uint256 i = 0; i < len; ) {
                if (soulbound[ids[i]]) revert Soulbound(ids[i]);
                unchecked {
                    ++i;
                }
            }
        }
        super._update(from, to, ids, values);
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControl, ERC1155) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
