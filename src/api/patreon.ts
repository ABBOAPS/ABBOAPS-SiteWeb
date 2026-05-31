// Mock serverless route logic for Vite SPA environment
import { PatreonStats } from "../types";

const FALLBACK_DATA: PatreonStats = {
  subscriberCount: 42,
  monthlyIncome: 1250,
};

export async function fetchPatreonMetrics(): Promise<PatreonStats> {
  try {
    // In a Next.js environment, this would be a fetch to /api/patreon/route
    // For this PoC, we mock the network delay and return our static fallback logic
    await new Promise((resolve) => setTimeout(resolve, 800));

    // Simulate reading from an external API
    // const response = await fetch('https://api.patreon.com/v1/...');
    // if (!response.ok) throw new Error('API Error');
    // return await response.json();

    return FALLBACK_DATA;
  } catch (error) {
    console.error("Failed to fetch Patreon metrics, using fallback", error);
    return FALLBACK_DATA;
  }
}
