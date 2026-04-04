import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawnSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rootDir = path.resolve(__dirname, '..');
const vercelOutputRoot = path.join(rootDir, '.vercel', 'output');
const vercelOutputFunctions = path.join(vercelOutputRoot, 'functions');
const vercelOutputStatic = path.join(vercelOutputRoot, 'static');
const distDir = path.join(rootDir, 'dist');

console.log('Building Vercel output via Build Output API...');

// Create directories
fs.mkdirSync(vercelOutputRoot, { recursive: true });
fs.mkdirSync(vercelOutputFunctions, { recursive: true });

// We must also create a config.json for Vercel
// Since we have an SPA (Vite), we might want to configure routes so that
// unknown routes fall back to index.html, matching Vercel's SPA behavior.
const outputConfig = {
  version: 3,
  routes: [
    { handle: 'filesystem' },
    { src: '/(.*)', dest: '/index.html' }
  ]
};
fs.writeFileSync(
  path.join(vercelOutputRoot, 'config.json'),
  JSON.stringify(outputConfig, null, 2)
);

// We need to build the API endpoints directly into `.vercel/output/functions/api/name.func/`
const apis = fs.readdirSync(path.join(rootDir, 'api-src'))
  .filter(file => file.endsWith('.ts'))
  .map(file => path.parse(file).name);

for (const api of apis) {
  const funcDir = path.join(vercelOutputFunctions, 'api', `${api}.func`);
  fs.mkdirSync(funcDir, { recursive: true });

  // 1. Write the .vc-config.json for the function
  const vcConfig = {
    runtime: 'nodejs22.x',
    handler: `${api}.js`,
    launcherType: 'Nodejs',
    shouldAddHelpers: true,
  };
  fs.writeFileSync(
    path.join(funcDir, '.vc-config.json'),
    JSON.stringify(vcConfig, null, 2)
  );

  // 2. Build the function into the folder using esbuild
  const result = spawnSync('npx', [
    'esbuild',
    `api-src/${api}.ts`,
    '--bundle',
    '--platform=node',
    '--format=cjs',
    '--define:import.meta.env.MODE=\'"production"\'',
    '--define:import.meta.env=\'{"MODE":"production"}\'',
    `--outfile=${path.join(funcDir, `${api}.js`)}`
  ], { stdio: 'inherit', cwd: rootDir });

  if (result.status !== 0) {
    console.error(`Failed to build ${api}`);
    process.exit(1);
  }
}

console.log('Copying static assets to .vercel/output/static...');
if (fs.existsSync(distDir)) {
  fs.cpSync(distDir, vercelOutputStatic, { recursive: true });
} else {
  console.warn('dist directory not found. Please run npm run build first if you expect static files.');
}

console.log('Successfully built Vercel output');
