// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Script, console2} from "forge-std/Script.sol";
import {LocalHeroBadges} from "../src/LocalHeroBadges.sol";
import {LocalHeroSoulboundIdentity} from "../src/LocalHeroSoulboundIdentity.sol";
import {HeroToken} from "../src/HeroToken.sol";

/// @notice Deploy badges, soulbound identity, and HERO ERC-20. The broadcast wallet is `admin`.
contract Deploy is Script {
    function run() external {
        vm.startBroadcast();
        address admin = msg.sender;

        LocalHeroBadges badges = new LocalHeroBadges(admin);
        LocalHeroSoulboundIdentity heroId = new LocalHeroSoulboundIdentity(admin, "https://api.localhero.example/metadata/identity/");
        HeroToken hero = new HeroToken(admin);

        vm.stopBroadcast();

        console2.log("LocalHeroBadges:", address(badges));
        console2.log("LocalHeroSoulboundIdentity:", address(heroId));
        console2.log("HeroToken (HERO):", address(hero));
    }
}
