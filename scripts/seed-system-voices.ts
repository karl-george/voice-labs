import 'dotenv/config';

import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { z } from 'zod';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient, VoiceCategory } from '@/lib/generated/prisma';
import { CANONICAL_SYSTEM_VOICE_NAMES } from '@/lib/constants';

const SYSTEM_VOICES_DIR = path.join(path.dirname(fileURLToPath(import.meta.url)), 'system-voices');

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  R2_ACCOUNT_ID: z.string().min(1),
  R2_ACCESS_KEY_ID: z.string().min(1),
  R2_SECRET_ACCESS_KEY: z.string().min(1),
  R2_BUCKET_NAME: z.string().min(1),
});

const env = envSchema.parse(process.env);

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// const r2 = new S3Client({
//   region: 'auto',
//   endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
//   credentials: {
//     accessKeyId: env.R2_ACCESS_KEY_ID,
//     secretAccessKey: env.R2_SECRET_ACCESS_KEY,
//   },
// });

interface VoiceMetadata {
  description: string;
  category: VoiceCategory;
  language: string;
}

const systemVoiceMetadata: Record<string, VoiceMetadata> = {
  Aaron: {
    description: 'Soothing and calm, like a self-help audiobook narrator',
    category: 'AUDIOBOOK',
    language: 'en-US',
  },
  Abigail: {
    description: 'Friendly and conversational with a warm, approachable tone',
    category: 'CONVERSATIONAL',
    language: 'en-GB',
  },
  Anaya: {
    description: 'Polite and professional, suited for customer service',
    category: 'CUSTOMER_SERVICE',
    language: 'en-IN',
  },
  Andy: {
    description: 'Versatile and clear, a reliable all-purpose narrator',
    category: 'GENERAL',
    language: 'en-US',
  },
  Archer: {
    description: 'Laid-back and reflective with a steady, storytelling pace',
    category: 'NARRATIVE',
    language: 'en-US',
  },
};

/**
 * Load a system voice WAV file from the local system-voices directory.
 *
 * @param name - Canonical system voice name (without the `.wav` extension)
 * @returns An object with `buffer` containing the file bytes and `contentType` set to `'audio/wav'`
 */
async function readSystemVoiceAudio(name: string) {
  const filePath = path.join(SYSTEM_VOICES_DIR, `${name}.wav`);
  const buffer = Buffer.from(await fs.readFile(filePath));
  return { buffer, contentType: 'audio/wav' };
}

// async function uploadSystemVoiceAudio({
//   key,
//   buffer,
//   contentType,
// }: {
//   key: string;
//   buffer: Buffer;
//   contentType: string;
// }) {
//   const commandInput: PutObjectCommandInput = {
//     Bucket: env.R2_BUCKET_NAME,
//     Key: key,
//     Body: buffer,
//     ContentType: contentType,
//   };
//
//   await r2.send(new PutObjectCommand(commandInput));
/**
 * Ensure a SYSTEM voice record exists for the given canonical voice name and attach its storage key and metadata when available.
 *
 * If a matching voice exists, its `r2ObjectKey` and any available metadata are updated. If none exists, a new SYSTEM voice record is created and its `r2ObjectKey` is set. If setting the storage key fails after creation, the newly created record is deleted and the original error is re-thrown.
 *
 * @param name - The canonical system voice name to seed (e.g., "Aaron", "Abigail")
 *
 * @throws Re-throws any error encountered while setting the storage key after creating a voice; the newly created record is deleted before the error is re-thrown.
 */

async function seedSystemVoice(name: string) {
  const { buffer, contentType } = await readSystemVoiceAudio(name);

  const existingSystemVoice = await prisma.voice.findFirst({
    where: {
      variant: 'SYSTEM',
      name,
    },
    select: { id: true },
  });

  if (existingSystemVoice) {
    const r2ObjectKey = `voices/system/${existingSystemVoice.id}`;
    const meta = systemVoiceMetadata[name];

    // await uploadSystemVoiceAudio({
    //   key: r2ObjectKey,
    //   buffer,
    //   contentType,
    // });

    await prisma.voice.update({
      where: { id: existingSystemVoice.id },
      data: {
        r2ObjectKey,
        ...(meta && {
          description: meta.description,
          category: meta.category,
          language: meta.language,
        }),
      },
    });
    return;
  }

  const meta = systemVoiceMetadata[name];

  const voice = await prisma.voice.create({
    data: {
      name,
      variant: 'SYSTEM',
      orgId: null,
      ...(meta && {
        description: meta.description,
        category: meta.category,
        language: meta.language,
      }),
    },
    select: {
      id: true,
    },
  });

  const r2ObjectKey = `voices/system/${voice.id}`;

  try {
    // await uploadSystemVoiceAudio({
    //   key: r2ObjectKey,
    //   buffer,
    //   contentType,
    // });

    await prisma.voice.update({
      where: {
        id: voice.id,
      },
      data: {
        r2ObjectKey,
      },
    });
  } catch (error) {
    await prisma.voice
      .delete({
        where: {
          id: voice.id,
        },
      })
      .catch(() => {});

    throw error;
  }
}

/**
 * Seeds canonical system voice records into the database and logs progress.
 *
 * Iterates over CANONICAL_SYSTEM_VOICE_NAMES, invoking seedSystemVoice for each name while emitting start, per-name, and completion log messages.
 */
async function main() {
  console.log(`Seeding ${CANONICAL_SYSTEM_VOICE_NAMES.length} system voices...`);

  for (const name of CANONICAL_SYSTEM_VOICE_NAMES) {
    console.log(`- ${name}`);
    await seedSystemVoice(name);
  }

  console.log('System voice seed completed.');
}

main()
  .catch((error) => {
    console.error('Failed to seed system voices:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
