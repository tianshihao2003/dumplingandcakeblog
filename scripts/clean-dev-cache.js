import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();

const targets = [
	path.join(projectRoot, 'node_modules', '.vite'),
	path.join(projectRoot, '.astro'),
];

async function rm(targetPath) {
	try {
		await fs.rm(targetPath, { recursive: true, force: true });
		process.stdout.write(`removed ${targetPath}\n`);
	} catch (err) {
		process.stderr.write(`failed to remove ${targetPath}: ${String(err)}\n`);
	}
}

await Promise.all(targets.map(rm));

