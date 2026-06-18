import { generateMockProducts } from './src/utils/productGenerator';
import * as fs from 'fs';

const products = generateMockProducts();
const now = new Date("2026-06-13T19:22:22.000Z"); // Use consistent time

let newProductsStr = "";
let newAuctionsStr = "";

let idCounter = 81;

for (const p of products) {
  const prodId = `prod_${String(idCounter).padStart(3, '0')}`;
  const aucId = `auc_${String(idCounter).padStart(3, '0')}`;
  
  newProductsStr += `  {
    id: "${prodId}",
    sellerId: "seller_${Math.floor(Math.random() * 10) + 101}",
    title: "${p.title.replace(/"/g, '\\"')}",
    category: "${p.categoryName}",
    description: "${p.title.replace(/"/g, '\\"')} 상품입니다. 소장 가치가 뛰어납니다. 많은 관심 바랍니다.",
    images: ["${p.image}"],
    condition: ${p.title.includes("미개봉") ? '"새상품"' : p.title.includes("빈티지") ? '"빈티지"' : '"거의 새것"'},
    auctionType: "${p.auctionType}",
    status: "live",
    viewCount: ${Math.floor(Math.random() * 500) + 50},
    likeCount: ${p.likeCount},
    createdAt: "2026-06-13T19:22:22.000Z"
  },\n`;
  
  if (p.auctionType === "ascending") {
    newAuctionsStr += `  {
    id: "${aucId}",
    productId: "${prodId}",
    auctionType: "ascending",
    startPrice: ${p.startPrice},
    currentPrice: ${p.currentPrice},
    ${p.buyNowPrice ? `buyNowPrice: ${p.buyNowPrice},` : ""}
    minBidIncrement: ${Math.floor(p.startPrice * 0.05 / 1000) * 1000 || 1000},
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: "2026-06-16T19:22:22.000Z",
    status: "live"
  },\n`;
  } else {
    newAuctionsStr += `  {
    id: "${aucId}",
    productId: "${prodId}",
    auctionType: "descending",
    startPrice: ${p.currentPrice || p.startPrice},
    currentPrice: ${p.currentPrice || p.startPrice},
    floorPrice: ${Math.floor((p.currentPrice || p.startPrice) * 0.5)},
    decrementAmount: ${Math.floor((p.currentPrice || p.startPrice) * 0.05 / 1000) * 1000 || 1000},
    decrementInterval: 3600,
    startAt: "2026-06-13T19:22:22.000Z",
    endAt: "2026-06-16T19:22:22.000Z",
    status: "live"
  },\n`;
  }

  idCounter++;
}

fs.writeFileSync('generated_products.ts', newProductsStr);
fs.writeFileSync('generated_auctions.ts', newAuctionsStr);
