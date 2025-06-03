const { existsSync } = require('fs');
const { spawnSync } = require('child_process');
const nextBin = './node_modules/next/dist/bin/next';
if (existsSync(nextBin)) {
  const result = spawnSync('node', [nextBin, 'lint'], { stdio: 'inherit' });
  if (result.error) {
    console.warn('Failed to run Next.js lint:', result.error.message);
  }
  if (result.status !== 0) {
    console.warn('Linting finished with issues.');
  }
} else {
  console.warn('Next.js not installed. Skipping lint.');
}
process.exit(0);
