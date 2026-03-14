import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Pools for procedural generation
const firstNames = [
  "Aiko","Amara","Anya","Aria","Ash","Atlas","Aurora","Basil","Bay","Beck","Blair","Blake","Bo","Briar","Brooks",
  "Cael","Cairo","Cal","Cam","Cedar","Cleo","Cole","Cruz","Cy","Dale","Dana","Dara","Dash","Devon","Dion",
  "Eden","Eli","Ellis","Ember","Emery","Ezra","Fable","Fern","Finn","Flora","Flynn","Fox","Gael","Gem","Glen",
  "Gray","Hana","Harbor","Hart","Haven","Hawk","Hayden","Haze","Heath","Hero","Holly","Indi","Iris","Ivy","Jade",
  "Jai","Jazz","Jesse","Jet","Jo","Jules","June","Kai","Kaya","Kit","Knox","Lake","Lane","Lark","Leaf",
  "Leo","Lior","Luca","Lux","Lynn","Mace","Maple","Mars","Max","Mika","Milan","Milo","Moss","Nash","Neve",
  "Nico","Noa","Nova","Oak","Opal","Ori","Orla","Pace","Park","Pax","Penn","Phoenix","Piper","Quinn","Rae",
  "Rain","Reed","Reef","Remy","Rhea","Rio","River","Robin","Rory","Rowan","Rue","Rune","Sage","Sam","Scout",
  "Shea","Shiloh","Sky","Sol","Storm","Tala","Tate","Teal","Thea","Tide","True","Vale","Vesper","Vex","Wren",
  "Yael","Yara","Zara","Zeke","Zen","Zion","Zuri","Alder","Alpine","Aspen","Birch","Blaze","Bloom","Canyon","Clay",
  "Cloud","Coral","Cove","Crane","Cypress","Delta","Drift","Dune","Echo","Elm","Ember","Fjord","Flint","Grove","Harbor",
  "Heron","Jasper","Juniper","Linden","Luna","Lyric","Meadow","Mica","Onyx","Peridot","Pine","Quill","Ridge","Ripple","Sable",
  "Sequoia","Slate","Sparrow","Stone","Talon","Terra","Thistle","Timber","Torrent","Willow"
];

const lastInitials = "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z".split(" ");

const traits = [
  "endlessly curious","quietly brave","warmly encouraging","gently humorous","fiercely kind",
  "thoughtfully patient","energetically optimistic","calmly resilient","creatively resourceful","deeply empathetic",
  "playfully wise","steadfastly loyal","refreshingly honest","joyfully spontaneous","peacefully grounded",
  "boldly compassionate","humbly confident","tenderly strong","vibrantly hopeful","serenely adventurous"
];

const specialties = [
  "urban gardening","river cleanups","elder care","youth mentoring","bike commuting",
  "local business support","community cooking","tree planting","neighborhood watch","recycling drives",
  "park restoration","animal rescue","literacy programs","food bank coordination","climate action",
  "cultural exchange","disability advocacy","housing support","mental health awareness","sustainable fashion"
];

const tones = [
  "warm and nurturing","cheerful and upbeat","calm and reassuring","witty and playful",
  "wise and gentle","energetic and motivating","poetic and reflective","down-to-earth and real",
  "bubbly and enthusiastic","steady and grounding"
];

const questTypes = ["Outdoors","Community","Business","Wellness","Education","Environment","Social","Creative"];

const emojis = [
  "🌱","🌿","🌳","🌻","🌊","🌈","⚡","🔥","💎","🦋","🌸","🍀","🦉","🐝","🌙",
  "☀️","🎯","🛡️","🏔️","🌾","🍃","🐋","🦅","🌺","💫","🎭","🎨","🎵","📖","🧭"
];

const mottoTemplates = [
  "Every small act ripples outward.",
  "The world changes one neighborhood at a time.",
  "Kindness is the bravest thing you can do.",
  "Plant seeds you may never see bloom.",
  "Community is the real currency.",
  "Show up. That's the whole secret.",
  "Be the neighbor you wish you had.",
  "The earth remembers every hand that helped.",
  "Together we're unruggable.",
  "Heroes don't need capes — just heart.",
  "Real impact starts at your doorstep.",
  "Leave every place better than you found it.",
  "Connection is the ultimate reward.",
  "Your story inspires someone you'll never meet.",
  "One good deed mints a thousand more."
];

const backstoryTemplates = [
  "Grew up in {city} watching their grandmother tend a community garden. Now they channel that same care into everything they do.",
  "Former {job} who realized the best algorithm is a kind word at the right time. Joined HERO to make that scale.",
  "Started their hero journey by cleaning up a single block. That block became a neighborhood. That neighborhood became a movement.",
  "A lifelong {hobby} enthusiast who discovered that teaching others is the greatest adventure of all.",
  "Moved to a new city knowing nobody. Built a community from scratch by knocking on doors. Now they help others do the same.",
  "Witnessed the power of one tree planted in the right place. Has been planting — and inspiring others to plant — ever since.",
  "Lost everything in a storm and was rebuilt by neighbors. Now pays it forward every single day.",
  "Quiet observer who noticed that the loneliest people are often the wisest. Makes sure no one sits alone.",
  "Tech-savvy dreamer who believes blockchain should serve communities, not just portfolios.",
  "Former teacher who now mentors across the entire HERO ecosystem. Believes everyone has something to teach."
];

const cities = ["Portland","Brooklyn","Austin","San Francisco","Denver","Seattle","Miami","Chicago","Boston","Nashville",
  "Asheville","Oakland","Minneapolis","Detroit","Philadelphia","Savannah","Boise","Tucson","Raleigh","Richmond"];
const jobs = ["software engineer","barista","nurse","teacher","designer","musician","chef","librarian","firefighter","artist"];
const hobbies = ["hiking","cooking","photography","cycling","yoga","painting","running","gardening","reading","surfing"];

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function pick<T>(arr: T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

function generateGuide(id: number) {
  const rng = seededRandom(id * 7919 + 42);
  const firstName = pick(firstNames, rng);
  const lastInit = pick(lastInitials, rng);
  const name = `${firstName} ${lastInit}.`;
  const trait = pick(traits, rng);
  const specialty = pick(specialties, rng);
  const tone = pick(tones, rng);
  const questType = pick(questTypes, rng);
  const emoji = pick(emojis, rng);
  const motto = pick(mottoTemplates, rng);

  let backstory = pick(backstoryTemplates, rng);
  backstory = backstory.replace("{city}", pick(cities, rng));
  backstory = backstory.replace("{job}", pick(jobs, rng));
  backstory = backstory.replace("{hobby}", pick(hobbies, rng));

  return {
    name,
    emoji,
    personality_trait: trait,
    specialty,
    backstory,
    tone,
    favorite_quest_type: questType,
    impact_trees: Math.floor(rng() * 50) + 1,
    impact_neighbors: Math.floor(rng() * 100) + 5,
    impact_quests: Math.floor(rng() * 200) + 10,
    hero_points: Math.floor(rng() * 15000) + 500,
    motto,
    avatar_seed: id,
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check if already seeded
    const { count } = await supabase.from("community_guides").select("*", { count: "exact", head: true });
    if (count && count >= 777) {
      return new Response(JSON.stringify({ message: "Already seeded", count }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate all 777 guides
    const guides = [];
    for (let i = 1; i <= 777; i++) {
      guides.push(generateGuide(i));
    }

    // Insert in batches of 100
    let inserted = 0;
    for (let i = 0; i < guides.length; i += 100) {
      const batch = guides.slice(i, i + 100);
      const { error } = await supabase.from("community_guides").insert(batch);
      if (error) throw error;
      inserted += batch.length;
    }

    return new Response(JSON.stringify({ success: true, inserted }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("seed error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
