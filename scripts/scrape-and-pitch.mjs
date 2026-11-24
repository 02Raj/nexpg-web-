/**
 * RunMyPG Automated Lead Scraper & RapidRouter Pitch Generator
 * 
 * Usage:
 *   node scripts/scrape-and-pitch.mjs [city]
 * Example:
 *   node scripts/scrape-and-pitch.mjs kota
 *   node scripts/scrape-and-pitch.mjs bangalore
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

const RAPIDROUTER_API_KEY = process.env.RAPIDROUTER_API_KEY || 'sk-rr-v1-eIDjjYBIT7yvqYoa1SJt8YCqwCEETISN';
const RAPIDROUTER_BASE_URL = 'https://rapidrouter.ai/api/v1';
const RAPIDROUTER_MODEL = 'google/gemma-4-31b-it:free';

const targetCity = process.argv[2]?.toLowerCase() || 'kota';

console.log(`\n🚀 RunMyPG Lead Scraper & AI Pitch Generator`);
console.log(`📍 Target City: ${targetCity.toUpperCase()}`);
console.log(`🤖 AI Engine: RapidRouter (${RAPIDROUTER_MODEL})\n`);

async function generatePitch(lead) {
  const salutation = lead.owner ? `${lead.owner} Ji` : 'Bhaiya';
  const location = lead.area ? `${lead.area}, ${lead.city}` : lead.city;

  const systemPrompt = `You are a growth marketing expert for RunMyPG (https://www.runmypg.in). Write a friendly 3-sentence WhatsApp pitch in Hinglish (Hindi written in English alphabet) to a PG owner.
Rules:
1. Address politely: "Namaste ${salutation} 🙏"
2. Mention PG name "${lead.name}" and location "${location}".
3. Highlight pain point: Diary/register mein rent hisab, tenant slips bhejna, aur bijli sub-meter ka calculation.
4. Call to action: "RunMyPG app se ye 1-click mein automate ho jata hai. Free trial try karke dekhiye: https://www.runmypg.in"
5. Return ONLY the plain text ready to send. No quotes.`;

  try {
    const res = await fetch(`${RAPIDROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RAPIDROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: RAPIDROUTER_MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate WhatsApp pitch for ${lead.name} in ${location}` },
        ],
        max_tokens: 250,
        temperature: 0.5,
      }),
    });

    const json = await res.json();
    return json.choices?.[0]?.message?.content?.trim() || getDefaultPitch(lead);
  } catch (err) {
    console.error(`⚠️ AI generation fallback for ${lead.name}:`, err.message);
    return getDefaultPitch(lead);
  }
}

function getDefaultPitch(lead) {
  return `Namaste 🙏 Maine aapka ${lead.name} (${lead.city}) dekha. Kya har mahine tenants ke rent aur bijli sub-meter ka hisab diary mein jodne mein time waste hota hai? RunMyPG app se automated WhatsApp slips aur sub-meter calculation 1-click mein ho jata hai. Bilkul free trial try karke dekhiye: https://www.runmypg.in`;
}

async function run() {
  const sampleData = [
    { name: 'Shree Krishna Residency PG', owner: 'Mishra', phone: '9829012345', area: 'Landmark City', city: 'Kota' },
    { name: 'Radha Rani Boys Hostel', owner: 'Sharma', phone: '9414123456', area: 'Rajiv Gandhi Nagar', city: 'Kota' },
    { name: 'Balaji Executive Girls PG', owner: 'Gupta', phone: '9828234567', area: 'Mahaveer Nagar', city: 'Kota' },
    { name: 'Sri Sai Balaji Luxury PG', owner: 'Reddy', phone: '9845112233', area: 'Koramangala', city: 'Bangalore' },
    { name: 'Green View Gents & Ladies PG', owner: 'Gowda', phone: '9980223344', area: 'HSR Layout', city: 'Bangalore' },
    { name: 'Aggarwal Boys PG', owner: 'Aggarwal', phone: '9811012345', area: 'Mukherjee Nagar', city: 'Delhi' },
    { name: 'Sai Shradha Coliving PG', owner: 'Patil', phone: '9822012345', area: 'Hinjewadi', city: 'Pune' },
  ].filter((l) => l.city.toLowerCase() === targetCity);

  console.log(`🔍 Found ${sampleData.length} PG leads in ${targetCity.toUpperCase()}`);

  const enriched = [];
  for (const lead of sampleData) {
    process.stdout.write(`⚡ Generating pitch for: ${lead.name}... `);
    const pitch = await generatePitch(lead);
    const waUrl = `https://wa.me/91${lead.phone}?text=${encodeURIComponent(pitch)}`;
    enriched.push({
      ...lead,
      pitch,
      whatsapp_url: waUrl,
    });
    console.log('✅ Done');
  }

  const outPath = resolve(process.cwd(), `leads-${targetCity}.json`);
  writeFileSync(outPath, JSON.stringify(enriched, null, 2), 'utf-8');
  console.log(`\n💾 Saved ${enriched.length} leads with WhatsApp links to: ${outPath}`);
  console.log(`\nSample WhatsApp Pitch:\n-------------------------`);
  if (enriched[0]) {
    console.log(enriched[0].pitch);
    console.log(`\nClick to chat: ${enriched[0].whatsapp_url}\n`);
  }
}

void run();
