/**
 * RunMyPG Automated Lead Scraper & RapidRouter Pitch Generator (English Outreach)
 * 
 * Usage:
 *   node scripts/scrape-and-pitch.mjs [city]
 * Example:
 *   node scripts/scrape-and-pitch.mjs kota
 *   node scripts/scrape-and-pitch.mjs bangalore
 */

import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const RAPIDROUTER_API_KEY = process.env.RAPIDROUTER_API_KEY || 'sk-rr-v1-eIDjjYBIT7yvqYoa1SJt8YCqwCEETISN';
const RAPIDROUTER_BASE_URL = 'https://rapidrouter.ai/api/v1';
const RAPIDROUTER_MODEL = 'google/gemma-4-31b-it:free';

const targetCity = process.argv[2]?.toLowerCase() || 'kota';

console.log(`\n🚀 RunMyPG Lead Scraper & AI Pitch Generator`);
console.log(`📍 Target City: ${targetCity.toUpperCase()}`);
console.log(`🤖 AI Engine: RapidRouter (${RAPIDROUTER_MODEL})\n`);

async function generatePitch(lead) {
  const cleanOwner = (lead.owner || '').replace(/\s*(ji|garu|kaka|bhaiya|bhai|mr\.?|shri)\s*$/i, '').trim();
  const salutation = cleanOwner ? `Mr. ${cleanOwner}` : 'Sir';
  const location = lead.area ? `${lead.area}, ${lead.city}` : lead.city;

  const systemPrompt = `You are a B2B sales outreach copywriter for RunMyPG (https://www.runmypg.in).
Write a SHORT, professional, high-converting WhatsApp message in plain ENGLISH (no Hindi/Hinglish) to a PG / Hostel owner.
Do NOT sound like an automated ad. Sound like a polite, helpful human asking a genuine question.

Rules:
1. Address politely in English: "Hello ${salutation},"
2. Mention property: "Hope you're well! Reaching out regarding ${lead.name} in ${location}."
3. Trigger curiosity about manual diary work: "Quick question: are you still calculating electricity sub-meters and rent manually in paper diaries?"
4. Low friction ask: "We built a free 1-click tool at runmypg.in to send automated WhatsApp slips. Mind if I share a 1-min demo?"
5. Keep it strictly under 35-40 words in 3 short lines.
6. Output ONLY raw English text. No quotes.`;

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
          { role: 'user', content: `Generate English WhatsApp outreach message for ${lead.name} in ${location}` },
        ],
        max_tokens: 160,
        temperature: 0.3,
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
  const cleanOwner = (lead.owner || '').replace(/\s*(ji|garu|kaka|bhaiya|bhai|mr\.?|shri)\s*$/i, '').trim();
  const salutation = cleanOwner ? `Mr. ${cleanOwner}` : 'Sir';
  const location = lead.area ? `${lead.area}, ${lead.city}` : lead.city;
  return `Hello ${salutation},\n\nHope you're well! Reaching out regarding ${lead.name} in ${location}.\n\nQuick question: are you still calculating electricity sub-meters and rent manually in diaries? We built a free 1-click management tool at runmypg.in to send automated WhatsApp slips. Mind if I share a 1-min demo?`;
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
    process.stdout.write(`⚡ Generating English pitch for: ${lead.name}... `);
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
  console.log(`\nSample English WhatsApp Pitch:\n-------------------------`);
  if (enriched[0]) {
    console.log(enriched[0].pitch);
    console.log(`\nClick to chat: ${enriched[0].whatsapp_url}\n`);
  }
}

void run();
