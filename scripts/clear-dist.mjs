import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
    const distDir = path.resolve(__dirname, '../dist');
    await fs.rm(distDir, { recursive: true, force: true });
    
} catch (err) {
    console.error(err);
    process.exit(1);
};