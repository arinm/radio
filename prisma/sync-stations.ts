/**
 * Sync stream URLs, genres and the active flag from the seed into the DB.
 * Unlike seed.ts it leaves descriptions (seed-descriptions.ts) and everything else untouched.
 * Run with: npx tsx prisma/sync-stations.ts
 */
import { PrismaClient } from '@prisma/client';
import { seedStationsExtended } from '../src/data/seed-stations-extended';

const prisma = new PrismaClient();

async function main() {
  let updated = 0;
  for (const station of seedStationsExtended) {
    const result = await prisma.station.updateMany({
      where: { slug: station.slug },
      data: {
        streamUrl: station.streamUrl,
        streamUrlBackup: station.streamUrlBackup,
        genres: JSON.stringify(station.genres),
        isActive: station.isActive,
      },
    });
    if (result.count === 0) console.warn(`Not in DB, skipped: ${station.slug}`);
    updated += result.count;
  }
  console.log(`Synced ${updated} stations.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
