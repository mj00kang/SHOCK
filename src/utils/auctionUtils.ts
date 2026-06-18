import { Product } from '../data/mockData';
import { BidRecord, getBids, saveBids, saveProducts, getProducts, getUser, saveUser, getOrders, saveOrders, OrderState } from './storageUtils';

/**
 * Checks if the auction is active currently.
 */
export const isAuctionActive = (product: Product): boolean => {
  if (product.status !== 'live') return false;
  const end = new Date(product.endAt).getTime();
  return Date.now() < end;
};

/**
 * Handles placing an upward bid on a live product auction.
 * Checks min increment (10,000 KRW) and auto-extends 5 minutes if bid is placed within 5 minutes of deadline.
 */
export const placeBid = (
  productId: string,
  bidAmount: number,
  userId: string,
  userNickname: string
): { success: boolean; message: string; updatedProduct?: Product } => {
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return { success: false, message: '경매 상품을 찾을 수 없습니다.' };
  }

  const product = products[productIndex];
  const end = new Date(product.endAt).getTime();

  // 1. Live status check
  if (product.status !== 'live' || Date.now() >= end) {
    product.status = product.bidCount > 0 ? 'sold' : 'ended';
    saveProducts(products);
    return { success: false, message: '이미 마감 완료된 경매입니다.' };
  }

  // 2. Prevent self-bidding
  if (product.sellerNickname === userNickname) {
    return { success: false, message: '본인이 출품 등록한 취향 애장품에는 입찰 신청이 불가능합니다.' };
  }

  // 3. Increment validation check
  const minimumRequired = product.currentPrice + 10000;
  if (bidAmount < minimumRequired) {
    return {
      success: false,
      message: `입찰금액은 현재가 대비 최소 10,000원 이상 가산되어야 합니다. 최소 입력가: ${minimumRequired.toLocaleString()}원`
    };
  }

  // 4. Create internal Bid Record
  const newBid: BidRecord = {
    id: `bid-${Date.now()}`,
    productId: product.id,
    bidderNickname: userNickname,
    bidderId: userId,
    bidPrice: bidAmount,
    bidAt: new Date().toISOString()
  };

  const bids = getBids();
  bids.push(newBid);
  saveBids(bids);

  // 5. Update product properties
  product.currentPrice = bidAmount;
  product.bidCount += 1;

  // 6. Sniping defense - extend 5 minutes if bid within 5 minutes of deadline
  const remainingTimeMs = end - Date.now();
  const FIVE_MINUTES_MS = 5 * 60 * 1000;
  let timeExtended = false;

  if (remainingTimeMs <= FIVE_MINUTES_MS) {
    const newEndMs = Date.now() + FIVE_MINUTES_MS;
    product.endAt = new Date(newEndMs).toISOString();
    timeExtended = true;
  }

  products[productIndex] = product;
  saveProducts(products);

  const finalMsg = timeExtended
    ? '🔥 최고 입찰가 갱신 성공! 마감 직전 불꽃 튀는 입찰로 인해 경매 잔여 시간이 5분 수렴 연장되었습니다!'
    : '📈 최고 입찰 기입 성공! 호가 레이스의 최고 입찰 주도권이 나의 닉네임으로 갱신되었습니다.';

  return { success: true, message: finalMsg, updatedProduct: product };
};

/**
 * Handles immediate purchase (Buy Now) for an ascending auction.
 * Resolves immediately as sold, creates order, and deducts user virtual coins.
 */
export const buyNowAscending = (
  productId: string,
  userId: string,
  userNickname: string
): { success: boolean; message: string; updatedProduct?: Product; order?: OrderState } => {
  const products = getProducts();
  const productIndex = products.findIndex(p => p.id === productId);

  if (productIndex === -1) {
    return { success: false, message: '해당 출품작을 찾을 수 없습니다.' };
  }

  const product = products[productIndex];
  if (product.status !== 'live' || Date.now() >= new Date(product.endAt).getTime()) {
    return { success: false, message: '이미 마감되었거나 판매 완료된 경매 목록입니다.' };
  }

  if (!product.buyNowPrice) {
    return { success: false, message: '이 애장품은 즉시구매 옵션이 상정되지 않은 경매 독점 상품입니다.' };
  }

  const dealPrice = product.buyNowPrice;

  // Prevent self-buying
  if (product.sellerNickname === userNickname) {
    return { success: false, message: '자신이 출품 완료한 보물은 즉시구매할 수 없습니다.' };
  }

  // Virtual coins balance check
  const user = getUser();
  if (user.coins < dealPrice) {
    return {
      success: false,
      message: `가상 샥머니가 부족합니다. 타결 합의금: ${dealPrice.toLocaleString()}원 / 보유 머니: ${user.coins.toLocaleString()}원`
    };
  }

  // 1. Mutate product status to sold
  product.status = 'sold';
  product.currentPrice = dealPrice;
  product.bidCount += 1;
  products[productIndex] = product;
  saveProducts(products);

  // 2. Subtract user's virtual coins
  user.coins -= dealPrice;
  saveUser(user);

  // 3. Create a paid order record in shipping status
  const orders = getOrders();
  const newOrder: OrderState = {
    id: `ord-${Date.now()}`,
    productId: product.id,
    title: product.title,
    image: product.image,
    buyerId: userId,
    buyerNickname: userNickname,
    sellerNickname: product.sellerNickname,
    finalPrice: dealPrice,
    orderType: 'buy_now',
    paymentStatus: 'paid',
    deliveryStatus: 'preparing',
    createdAt: new Date().toISOString()
  };
  orders.push(newOrder);
  saveOrders(orders);

  return {
    success: true,
    message: `⚡ 즉시구매 체결 완성! 즉시낙찰가 ${dealPrice.toLocaleString()}원이 무사히 에스크로 가상 결제되었으며, 이제 배송 인도 단계를 준비합니다.`,
    updatedProduct: product,
    order: newOrder
  };
};
