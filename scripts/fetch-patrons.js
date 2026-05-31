import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function fetchPatrons() {
  const creatorToken = process.env.PATREON_CREATOR_TOKEN;
  const campaignId = process.env.PATREON_CAMPAIGN_ID;
  const outputPath = path.join(__dirname, '../public/patrons.json');

  if (!creatorToken || !campaignId) {
    console.warn('\n⚠️  Missing Patreon configuration (PATREON_CREATOR_TOKEN or PATREON_CAMPAIGN_ID).');
    console.warn('⚠️  Writing empty patrons file.\n');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify({ patrons: [] }, null, 2));
    return;
  }

  try {
    const response = await fetch(
      `https://www.patreon.com/api/oauth2/v2/campaigns/${campaignId}/members?fields[member]=full_name,image_url,patron_status&filter[patron_status]=active_patron`,
      {
        headers: {
          Authorization: `Bearer ${creatorToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Patreon API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract patrons
    const patrons = (data.data || []).map((member) => ({
      id: member.id,
      name: member.attributes.full_name,
      imageUrl: member.attributes.image_url,
    }));

    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify({ patrons }, null, 2));
    console.log('✅ Successfully fetched and saved Patreon data.\n');
  } catch (error) {
    console.error('❌ Error fetching patrons:', error);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify({ error: error.message, patrons: [] }, null, 2));
  }
}

// Load env variables if dotenv is available (useful for local dev)
import('dotenv').then(dotenv => {
  dotenv.config();
  fetchPatrons();
}).catch(() => {
  fetchPatrons();
});
