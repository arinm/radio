import { PrismaClient } from '@prisma/client';
import { seedStationsExtended } from '../src/data/seed-stations-extended';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with extended station list...');

  for (const station of seedStationsExtended) {
    await prisma.station.upsert({
      where: { slug: station.slug },
      update: {
        name: station.name,
        streamUrl: station.streamUrl,
        streamUrlBackup: station.streamUrlBackup,
        homepage: station.homepage,
        description: station.description,
        genres: JSON.stringify(station.genres),
        city: station.city,
        region: station.region,
        language: station.language,
        logoUrl: station.logoUrl,
        brandColor: station.brandColor || null,
        bitrate: station.bitrate,
        codec: station.codec,
        frequency: station.frequency,
        isActive: station.isActive,
        isFeatured: station.isFeatured,
        listenScore: station.listenScore,
        socialLinks: station.socialLinks ? JSON.stringify(station.socialLinks) : null,
      },
      create: {
        name: station.name,
        slug: station.slug,
        streamUrl: station.streamUrl,
        streamUrlBackup: station.streamUrlBackup,
        homepage: station.homepage,
        description: station.description,
        genres: JSON.stringify(station.genres),
        city: station.city,
        region: station.region,
        language: station.language,
        logoUrl: station.logoUrl,
        brandColor: station.brandColor || null,
        bitrate: station.bitrate,
        codec: station.codec,
        frequency: station.frequency,
        isActive: station.isActive,
        isFeatured: station.isFeatured,
        listenScore: station.listenScore,
        socialLinks: station.socialLinks ? JSON.stringify(station.socialLinks) : null,
        status: 'unknown',
      },
    });
  }

  console.log(`Seeded ${seedStationsExtended.length} stations.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
