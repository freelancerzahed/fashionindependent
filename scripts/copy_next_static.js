const fs = require('fs');
const path = require('path');

function copyDirectory(src, dest) {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function run() {
  const repoRoot = path.resolve(__dirname, '..');
  const nextStaticDir = path.join(repoRoot, '.next', 'static');
  const publicNextDir = path.join(repoRoot, 'public', '_next');

  try {
    if (!fs.existsSync(nextStaticDir)) {
      console.log('No .next/static output found; skipping copy step.');
      return;
    }

    fs.rmSync(publicNextDir, { recursive: true, force: true });
    copyDirectory(nextStaticDir, path.join(publicNextDir, 'static'));
    console.log(`Copied Next.js static assets to ${path.relative(repoRoot, publicNextDir)}`);
  } catch (err) {
    console.error('Build output copy failed:', err.message || err);
    process.exit(0);
  }
}

run();
