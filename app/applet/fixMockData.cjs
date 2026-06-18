const fs = require('fs');

let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

// The file currently has `buyNowPrice: <price> ` where price was calculated as startPrice * 3
// Also there might be `hasBuyNow: true`

// It's probably easier to just replace all `buyNowPrice: <price>` by recalculating it based on `startPrice`
content = content.replace(/startPrice:\s*(\d+),\s*hasBuyNow:\s*true,\s*buyNowPrice:\s*\d+/g, (match, startPrice) => {
  const buyNowPrice = Math.floor(parseInt(startPrice) * 1.4);
  return `startPrice: ${startPrice},\n    hasBuyNow: true,\n    buyNowPrice: ${buyNowPrice}`;
});

fs.writeFileSync('src/data/mockData.ts', content, 'utf8');
console.log('Fixed mockData again!');
