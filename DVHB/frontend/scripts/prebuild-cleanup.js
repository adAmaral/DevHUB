const fs = require('fs');
const path = require('path');

const legacyPagesMarketplaceDir = path.join(process.cwd(), 'pages', 'marketplace-refactor');

if (fs.existsSync(legacyPagesMarketplaceDir)) {
  fs.rmSync(legacyPagesMarketplaceDir, { recursive: true, force: true });
  console.log(`Removed legacy pages directory: ${legacyPagesMarketplaceDir}`);
} else {
  console.log('No legacy pages/marketplace-refactor directory found.');
}
