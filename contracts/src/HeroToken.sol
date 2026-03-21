// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title HeroToken
 * @notice ERC-20 for redeeming in-app HERO points. Only `MINTER_ROLE` may mint, and never beyond `MAX_SUPPLY`.
 * @dev Deploy with `admin` = a multisig (e.g. Gnosis Safe) on mainnet. Grant `MINTER_ROLE` to a dedicated hot wallet for redemptions.
 */
contract HeroToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @notice Fixed maximum supply: 77,777,777 HERO (18 decimals). No mint can exceed this.
    uint256 public constant MAX_SUPPLY = 77_777_777 * 1e18;

    error MaxSupplyExceeded(uint256 totalSupplyAfterMint, uint256 maxSupply);

    constructor(address admin) ERC20("Hero Token", "HERO") {
        if (admin == address(0)) revert();
        _grantRole(DEFAULT_ADMIN_ROLE, admin);
        _grantRole(MINTER_ROLE, admin);
    }

    function decimals() public pure override returns (uint8) {
        return 18;
    }

    /// @notice HERO still available to mint under the hard cap.
    function remainingMintable() external view returns (uint256) {
        uint256 s = totalSupply();
        if (s >= MAX_SUPPLY) return 0;
        return MAX_SUPPLY - s;
    }

    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        uint256 s = totalSupply();
        if (s + amount > MAX_SUPPLY) {
            revert MaxSupplyExceeded(s + amount, MAX_SUPPLY);
        }
        _mint(to, amount);
    }
}
