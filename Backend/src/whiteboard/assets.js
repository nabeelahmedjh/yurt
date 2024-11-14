import { mkdir, readFile, writeFile } from 'fs/promises';
import { join, resolve } from 'path';
import { Readable } from 'stream';

// We are just using the filesystem to store assets
const DIR = resolve('./uploads/.assets');

export async function storeAsset(id, stream) {
  await mkdir(DIR, { recursive: true });
  await writeFile(join(DIR, id), stream);
}

export async function loadAsset(id) {
  return await readFile(join(DIR, id));
}
