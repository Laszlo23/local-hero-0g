import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const WHITEPAPER_CONTENT = `
%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R /Resources << /Font << /F1 5 0 R >> >> >>
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>
endobj
4 0 obj
<< /Length 44 >>
stream
BT /F1 24 Tf 72 720 Td (Local Hero Whitepaper) Tj ET
endstream
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000266 00000 n 
0000000206 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
360
%%EOF
`;

// Build a proper multi-page whitepaper PDF programmatically
function buildWhitepaperPDF(): Uint8Array {
  const sections = [
    { title: "LOCAL HERO", subtitle: "Whitepaper v1.0", body: "A Decentralized Impact Economy Protocol\n\nTurning real-world actions into verifiable on-chain rewards.\nPowered by quests, carbon credits, and Bitcoin mining.\n\nBuilt on 0G Chain Infrastructure" },
    { title: "1. Executive Summary", body: "Local Hero is a decentralized platform that transforms real-world community actions - from environmental restoration to neighborhood service - into verifiable, on-chain rewards.\n\nThe platform creates a self-sustaining impact economy where:\n- Creators design and fund real-world quests\n- Community members complete verified actions\n- Carbon credits power green Bitcoin mining\n- Rewards flow back as BTC and HERO tokens\n- Soulbound NFTs prove permanent reputation\n\nLocal Hero sits at the intersection of four rapidly growing markets: the $300B+ volunteer economy, the $2T carbon credit market, the expanding Web3 gaming sector, and the 200M+ creator economy." },
    { title: "2. The Problem", body: "The global impact economy faces critical infrastructure failures:\n\nUNPAID VOLUNTEER WORK\nBillions of hours of community service go unrecognized and unrewarded. There is no mechanism to capture, verify, or compensate real-world impact at scale.\n\nOPAQUE CHARITY SYSTEMS\n80% of donors are unsure where their funds actually go. Traditional charity lacks the transparency needed to build trust.\n\nMISALIGNED INCENTIVES\nSocial media rewards influence and attention, not genuine community impact. Follower counts determine value, not actions taken.\n\nFRAGMENTED CARBON MARKETS\nThe $2T carbon credit market by 2030 remains fragmented, with no unified system connecting carbon offsets to community action.\n\nNO DIGITAL OWNERSHIP\nReal-world impact has zero digital representation. There is no portable, verifiable proof of community contribution." },
    { title: "3. The Local Hero Solution", body: "Three pillars form the foundation of the Local Hero protocol:\n\nPILLAR 1: REAL-WORLD QUESTS\nLocation-verified missions including tree planting, park cleanups, community teaching, and neighborhood service. Quests are created by anyone and funded through carbon credits.\n\nPILLAR 2: ON-CHAIN VERIFICATION\nMulti-layer proof of action using QR codes, GPS verification, and photo evidence. Every action is cryptographically verified and permanently recorded on-chain.\n\nPILLAR 3: TOKENIZED REWARDS\nParticipants earn HERO tokens, reputation NFTs (soulbound), and Bitcoin rewards generated through green mining operations.\n\nPlatform Flow:\nCreator -> Quest -> Community -> Verification -> Rewards -> Reputation" },
    { title: "4. Economic Engine", body: "THE CARBON-BITCOIN-REWARDS LOOP\n\nReal economic value flows through the system via a novel circular economy:\n\n1. Creators fund quests with carbon credits\n2. Carbon credits power green BTC mining operations\n3. Bitcoin rewards are generated through mining\n4. Users complete verified real-world quests\n5. Rewards distributed in BTC + HERO tokens\n\nThis creates genuine economic value - not speculative tokenomics. Every HERO token is backed by real-world action and real Bitcoin mining revenue.\n\nThe system is designed to be self-sustaining: more quests lead to more carbon credits, which power more mining, generating more rewards, attracting more participants." },
    { title: "5. Market Opportunity", body: "Local Hero operates at the convergence of four mega-trends:\n\nIMPACT ECONOMY: $300B+ globally, growing 12% year-over-year\nVolunteer work, community service, and environmental action represent a massive untapped market.\n\nCARBON CREDIT MARKETS: $2T projected by 2030\nExponential growth driven by corporate net-zero commitments and government regulation.\n\nWEB3 GAMING: $65B and rapidly expanding\nPlay-to-earn and move-to-earn models prove that tokenized activities drive engagement.\n\nCREATOR ECONOMY: 200M+ creators worldwide\nThe creator economy needs new monetization models beyond advertising.\n\nLocal Hero is the first protocol to unify these four markets into a single, coherent platform." },
    { title: "6. Tokenomics", body: "HERO TOKEN\nTotal Supply: 1,000,000,000 HERO\n\nTOKEN DISTRIBUTION:\n- 60% Community Rewards: Earned through quest completion\n- 15% Ecosystem Development: Protocol improvements and grants  \n- 10% Liquidity: DEX liquidity pools, locked\n- 10% Strategic Partnerships: Ecosystem growth partners\n- 5% DAO Treasury: Community-governed reserve\n\nKEY PRINCIPLES:\n\nNo Insider Allocation: Zero hidden team tokens. Complete transparency from genesis.\n\nLiquidity Locked: Smart contract enforced lockup periods prevent rug pulls.\n\nGovernance DAO: Token holders govern protocol direction through on-chain voting.\n\nFair Distribution: 1 share = 1 share. Follower counts don't determine allocation. Organic engagement equally weighted." },
    { title: "7. Technology Stack", body: "INFRASTRUCTURE:\n\n0G.ai Decentralized AI: AI compute infrastructure for quest verification and content moderation.\n\nSmart Contract Architecture: Automated reward distribution, governance voting, and carbon credit integration.\n\nSoulbound NFTs: Non-transferable reputation badges (ERC-5192) that prove real-world impact. Cannot be bought or sold.\n\nQR + GPS Verification: Multi-layer proof combining QR code scanning, GPS geofencing, and photographic evidence.\n\nCross-Chain NFT Standards: ERC-721 and ERC-1155 support for multi-chain interoperability.\n\n0G Chain: Data availability layer providing decentralized storage and compute.\n\nSECURITY:\nAll contracts are audited. Liquidity is locked via immutable smart contracts. No admin keys or backdoors." },
    { title: "8. Roadmap", body: "PHASE 1 - FOUNDATION (Current)\n- Core app launch with quest engine v1\n- Community beta program\n- Initial NFT drop series\n- Mobile PWA deployment\n\nPHASE 2 - GROWTH\n- Carbon credit integration\n- BTC mining partnership execution\n- 100K active user milestone\n- Creator marketplace launch\n\nPHASE 3 - SCALE\n- DAO governance launch\n- Cross-chain expansion\n- Enterprise partnership program\n- 1M heroes milestone\n\nPHASE 4 - ECOSYSTEM\n- Protocol SDK for third-party developers\n- Third-party integrations marketplace\n- Global impact network federation\n- Self-sustaining economic model achieved" },
    { title: "9. Governance", body: "DECENTRALIZED AUTONOMOUS ORGANIZATION\n\nLocal Hero transitions to full DAO governance, where HERO token holders vote on:\n\nTreasury Allocation: Community decides how protocol funds are deployed across development, marketing, and ecosystem grants.\n\nFeature Upgrades: Protocol improvement proposals are submitted and voted on by the community.\n\nEcosystem Partnerships: Strategic collaborations and integrations require community approval.\n\nProtocol Rules: Quest verification standards, reward formulas, and economic parameters are community-governed.\n\nVOTING MECHANISM:\n1 HERO = 1 vote. Quadratic voting for fairness. Time-locked staking for governance participation. Proposal threshold: 100,000 HERO minimum." },
    { title: "10. Growth Flywheel", body: "THE SELF-REINFORCING IMPACT LOOP:\n\n1. Creators launch quests funded by carbon credits\n2. Community members discover and complete quests\n3. Real-world impact is generated and verified on-chain\n4. Rewards (BTC + HERO) distributed to participants\n5. Soulbound reputation NFTs increase trust scores\n6. Higher trust attracts more creators to the platform\n7. More creators launch more quests\n8. Network effects compound\n\nThis creates a self-reinforcing cycle where every participant action strengthens the entire network.\n\nThe flywheel accelerates over time as reputation data accumulates, creating an increasingly valuable trust layer for the impact economy." },
    { title: "Legal Disclaimer", body: "This document is for informational purposes only and does not constitute financial advice, an offer to sell, or a solicitation of an offer to buy any securities or tokens.\n\nHERO tokens are utility tokens designed for use within the Local Hero protocol. They are not securities and do not represent ownership in any entity.\n\nParticipation in the Local Hero ecosystem involves risks. Past performance is not indicative of future results. Cryptocurrency and token investments are subject to market volatility.\n\nThis whitepaper may be updated periodically. The most current version is available at localhero.space.\n\nContact: investors@localhero.space\nWebsite: localhero.space\nBuilt on 0G Chain\n\n(c) 2025 Local Hero Protocol. All rights reserved." },
  ];

  // Build PDF manually
  const objects: string[] = [];
  let objCount = 0;

  const newObj = (content: string) => {
    objCount++;
    objects.push(content);
    return objCount;
  };

  // Catalog
  const catalogId = newObj(""); // placeholder
  // Pages
  const pagesId = newObj(""); // placeholder

  // Font
  const fontId = newObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>`);
  const fontBoldId = newObj(`<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>`);

  // Create page objects
  const pageIds: number[] = [];
  const contentIds: number[] = [];

  for (const section of sections) {
    // Build content stream
    const lines: string[] = [];
    let y = 720;
    
    // Title
    lines.push(`BT /F2 22 Tf 72 ${y} Td (${escapePdf(section.title)}) Tj ET`);
    y -= 40;
    
    if (section.subtitle) {
      lines.push(`BT /F1 14 Tf 72 ${y} Td (${escapePdf(section.subtitle)}) Tj ET`);
      y -= 30;
    }
    
    y -= 10;
    
    // Body text - wrap lines
    const bodyLines = section.body.split('\n');
    for (const line of bodyLines) {
      if (y < 60) break; // page margin
      
      if (line.trim() === '') {
        y -= 14;
        continue;
      }
      
      // Check if it's a header-like line (ALL CAPS or starts with number)
      const isHeader = line === line.toUpperCase() && line.length > 3 && !line.startsWith('-');
      const fontSize = isHeader ? 13 : 11;
      const font = isHeader ? '/F2' : '/F1';
      
      // Simple word wrap at ~80 chars
      const maxChars = 85;
      let remaining = line;
      while (remaining.length > 0 && y > 60) {
        let chunk: string;
        if (remaining.length <= maxChars) {
          chunk = remaining;
          remaining = '';
        } else {
          let breakAt = remaining.lastIndexOf(' ', maxChars);
          if (breakAt === -1) breakAt = maxChars;
          chunk = remaining.substring(0, breakAt);
          remaining = remaining.substring(breakAt + 1);
        }
        lines.push(`BT ${font} ${fontSize} Tf 72 ${y} Td (${escapePdf(chunk)}) Tj ET`);
        y -= fontSize + 5;
      }
    }
    
    // Footer
    lines.push(`BT /F1 8 Tf 72 30 Td (Local Hero Whitepaper v1.0 | localhero.app | Built on 0G Chain) Tj ET`);
    
    const stream = lines.join('\n');
    const contentId = newObj(`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`);
    contentIds.push(contentId);
    
    const pageId = newObj(""); // placeholder
    pageIds.push(pageId);
  }

  // Now fill in placeholders
  objects[catalogId - 1] = `<< /Type /Catalog /Pages ${pagesId} 0 R >>`;
  objects[pagesId - 1] = `<< /Type /Pages /Kids [${pageIds.map(id => `${id} 0 R`).join(' ')}] /Count ${pageIds.length} >>`;
  
  for (let i = 0; i < pageIds.length; i++) {
    objects[pageIds[i] - 1] = `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 612 792] /Contents ${contentIds[i]} 0 R /Resources << /Font << /F1 ${fontId} 0 R /F2 ${fontBoldId} 0 R >> >> >>`;
  }

  // Build final PDF
  let pdf = '%PDF-1.4\n';
  const offsets: number[] = [];
  
  for (let i = 0; i < objects.length; i++) {
    offsets.push(pdf.length);
    pdf += `${i + 1} 0 obj\n${objects[i]}\nendobj\n`;
  }
  
  const xrefOffset = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (const offset of offsets) {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  }
  
  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogId} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  
  return new TextEncoder().encode(pdf);
}

function escapePdf(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  try {
    const pdfBytes = buildWhitepaperPDF();
    
    return new Response(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=LocalHero-Whitepaper-v1.pdf",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" },
    });
  }
});
