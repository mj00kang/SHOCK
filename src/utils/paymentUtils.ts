// Payment structures and utilities

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'card' | 'bank_transfer';
  provider: string; // e.g., '신한카드', '국민은행'
  maskedNumber: string; // e.g., '**** **** **** 1234', '123-****-7890'
  nickname: string;
  isDefault: boolean;
  createdAt: string;
}

export interface PayoutAccount {
  id: string;
  userId: string;
  bankName: string;
  maskedAccountNumber: string;
  accountHolder: string;
  nickname: string;
  isDefault: boolean;
  createdAt: string;
}

export interface ShippingAddress {
  receiverName: string;
  phone: string;
  postalCode: string;
  address1: string;
  address2: string;
  deliveryMemo?: string;
}

export interface EscrowOrder {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  auctionId?: string;
  buyerId: string;
  buyerNickname: string;
  sellerId: string;
  sellerNickname: string;
  orderType?: 'instant_deal' | 'auction_win';
  
  couponId?: string | null;
  couponName?: string;
  couponDiscount?: number;
  originalTotalAmount?: number;
  
  // Pricing & escrow properties
  itemPrice: number;
  serviceFeeRate: number;      // 0.03
  serviceFee: number;
  shippingFee: number;         // 3000
  totalPaymentAmount: number;  // itemPrice + serviceFee + shippingFee
  finalPrice: number;          // equivalent to itemPrice
  
  paymentMethodId?: string;
  paymentStatus: 'unpaid' | 'paid' | 'failed' | 'refunded';
  escrowStatus: 'none' | 'holding' | 'released' | 'refunded';
  deliveryStatus: 'preparing' | 'pickup_requested' | 'pickup_ready' | 'picked_up' | 'shipping' | 'delivered' | 'confirmed';
  orderStatus: 'pending_payment' | 'paid' | 'pickup_requested' | 'pickup_ready' | 'picked_up' | 'shipping' | 'delivered' | 'completed' | 'cancelled' | 'refund_requested';
  
  // Address 정보
  shippingAddress?: ShippingAddress;
  
  // Courier & Tracking
  carrier?: string;
  courier?: string; // sync alias
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  shippingEnteredAt?: string;
  shippingMemo?: string;

  // Visitor Pickup delivery fields (샥 계약택배 방문수거 배송 시스템)
  pickupRequestedAt?: string;
  pickupAddress?: string;
  pickupDate?: string;
  pickupTimeSlot?: string;
  pickupMethod?: string;
  pickupMemo?: string;
  packagePhoto?: string;
  pickupPlacePhoto?: string;
  pickupStatus?: 'requested' | 'picked_up';
  pickedUpAt?: string;
  
  // Refund properties
  refundAvailableUntil?: string;
  refundStatus: 'none' | 'requested' | 'approved' | 'rejected' | 'refunded' | 'completed';
  refundReason?: string;
  refundDetail?: string;
  refundRequestedAt?: string;
  refundProcessedAt?: string;
  buyerConfirmedAt?: string;
  
  createdAt: string;
  paidAt?: string;
  escrowReleasedAt?: string;
}

const PAYMENT_METHODS_KEY = 'shock_payment_methods';
const PAYOUT_ACCOUNTS_KEY = 'shock_payout_accounts';
const ESCROW_ORDERS_KEY = 'shock_orders';

// Utility helper for masking strings
export function maskCardNumber(cardNumber: string): string {
  const cleaned = cardNumber.replace(/[- ]/g, '');
  if (cleaned.length < 4) return '****';
  const lastFour = cleaned.slice(-4);
  return `**** **** **** ${lastFour}`;
}

export function maskAccountNumber(accountNumber: string): string {
  const cleaned = accountNumber.replace(/[- ]/g, '');
  if (cleaned.length < 4) return '***-***';
  const lastFour = cleaned.slice(-4);
  const prefix = cleaned.length > 8 ? cleaned.slice(0, 3) : '';
  return `${prefix ? prefix + '-' : ''}****-****-${lastFour}`;
}

// Service fee calculation (3%)
export const SERVICE_FEE_RATE = 0.03;

export function calculateServiceFee(finalPrice: number): number {
  return Math.round(finalPrice * SERVICE_FEE_RATE);
}

// Total payment calculation: item Price + service Fee + shipping Fee (default 3000)
export function calculateTotalPayment(finalPrice: number, shippingFee = 3000): number {
  return finalPrice + calculateServiceFee(finalPrice) + shippingFee;
}

// Secure alarm notifications dispatcher
export function addNotification(
  type: string, 
  message: string, 
  targetPayload?: { targetType?: string, targetId?: string, targetTab?: string }
) {
  try {
    const raw = localStorage.getItem('shock_notifications_unreads');
    const list = raw ? JSON.parse(raw) : [];
    const newNotif = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      message,
      createdAt: new Date().toISOString(),
      isRead: false,
      ...targetPayload
    };
    list.unshift(newNotif);
    localStorage.setItem('shock_notifications_unreads', JSON.stringify(list));
  } catch (e) {
    console.error('Error dispatching notifications inline', e);
  }
}


// 1. Payment Methods
export function getPaymentMethods(userId: string): PaymentMethod[] {
  try {
    const raw = localStorage.getItem(PAYMENT_METHODS_KEY);
    const methods: PaymentMethod[] = raw ? JSON.parse(raw) : [];
    return methods.filter(m => m.userId === userId);
  } catch {
    return [];
  }
}

export function addPaymentMethod(
  userId: string,
  type: 'card' | 'bank_transfer',
  provider: string,
  rawNumber: string,
  holderOrPassword?: string,
  nicknameValue?: string
): PaymentMethod {
  try {
    const raw = localStorage.getItem(PAYMENT_METHODS_KEY);
    const methods: PaymentMethod[] = raw ? JSON.parse(raw) : [];

    const isDefault = methods.filter(m => m.userId === userId).length === 0;
    const maskedNumber = type === 'card' ? maskCardNumber(rawNumber) : maskAccountNumber(rawNumber);
    const nickname = nicknameValue?.trim() || (type === 'card' ? `${provider} 카드` : `${provider} 계좌`);

    const newMethod: PaymentMethod = {
      id: `pay-${Date.now()}`,
      userId,
      type,
      provider,
      maskedNumber,
      nickname,
      isDefault,
      createdAt: new Date().toISOString()
    };

    methods.push(newMethod);
    localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(methods));
    return newMethod;
  } catch (e) {
    throw new Error('결제수단 등록에 실패하였습니다.');
  }
}

export function deletePaymentMethod(userId: string, methodId: string) {
  try {
    const raw = localStorage.getItem(PAYMENT_METHODS_KEY);
    let methods: PaymentMethod[] = raw ? JSON.parse(raw) : [];
    
    // Find if the deleted item was default
    const target = methods.find(m => m.userId === userId && m.id === methodId);
    const wasDefault = target?.isDefault;

    methods = methods.filter(m => !(m.userId === userId && m.id === methodId));
    
    if (wasDefault) {
      const remainOfUser = methods.filter(m => m.userId === userId);
      if (remainOfUser.length > 0) {
        remainOfUser[0].isDefault = true;
      }
    }

    localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(methods));
  } catch (e) {
    console.error(e);
  }
}

export function setDefaultPaymentMethod(userId: string, methodId: string) {
  try {
    const raw = localStorage.getItem(PAYMENT_METHODS_KEY);
    let methods: PaymentMethod[] = raw ? JSON.parse(raw) : [];
    
    methods.forEach(m => {
      if (m.userId === userId) {
        m.isDefault = m.id === methodId;
      }
    });
    
    localStorage.setItem(PAYMENT_METHODS_KEY, JSON.stringify(methods));
  } catch (e) {
    console.error(e);
  }
}

// 2. Payout Accounts
export function getPayoutAccounts(userId: string): PayoutAccount[] {
  try {
    const raw = localStorage.getItem(PAYOUT_ACCOUNTS_KEY);
    const accounts: PayoutAccount[] = raw ? JSON.parse(raw) : [];
    return accounts.filter(a => a.userId === userId);
  } catch {
    return [];
  }
}

export function addPayoutAccount(
  userId: string,
  bankName: string,
  rawAccountNumber: string,
  accountHolder: string,
  nicknameValue?: string
): PayoutAccount {
  try {
    const raw = localStorage.getItem(PAYOUT_ACCOUNTS_KEY);
    const accounts: PayoutAccount[] = raw ? JSON.parse(raw) : [];

    const isDefault = accounts.filter(a => a.userId === userId).length === 0;
    const maskedAccountNumber = maskAccountNumber(rawAccountNumber);
    const nickname = nicknameValue?.trim() || `${bankName} 정산계좌`;

    const newProg: PayoutAccount = {
      id: `payout-${Date.now()}`,
      userId,
      bankName,
      maskedAccountNumber,
      accountHolder,
      nickname,
      isDefault,
      createdAt: new Date().toISOString()
    };

    accounts.push(newProg);
    localStorage.setItem(PAYOUT_ACCOUNTS_KEY, JSON.stringify(accounts));
    return newProg;
  } catch (e) {
    throw new Error('정산계좌 등록에 실패하였습니다.');
  }
}

export function deletePayoutAccount(userId: string, accountId: string) {
  try {
    const raw = localStorage.getItem(PAYOUT_ACCOUNTS_KEY);
    let accounts: PayoutAccount[] = raw ? JSON.parse(raw) : [];

    // Find if default
    const target = accounts.find(a => a.userId === userId && a.id === accountId);
    const wasDefault = target?.isDefault;

    accounts = accounts.filter(a => !(a.userId === userId && a.id === accountId));

    if (wasDefault) {
      const remainOfUser = accounts.filter(a => a.userId === userId);
      if (remainOfUser.length > 0) {
        remainOfUser[0].isDefault = true;
      }
    }

    localStorage.setItem(PAYOUT_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error(e);
  }
}

export function setDefaultPayoutAccount(userId: string, accountId: string) {
  try {
    const raw = localStorage.getItem(PAYOUT_ACCOUNTS_KEY);
    let accounts: PayoutAccount[] = raw ? JSON.parse(raw) : [];
    
    accounts.forEach(a => {
      if (a.userId === userId) {
        a.isDefault = a.id === accountId;
      }
    });

    localStorage.setItem(PAYOUT_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error(e);
  }
}

// 3. Escrow Orders
export function getEscrowOrders(): EscrowOrder[] {
  try {
    const raw = localStorage.getItem(ESCROW_ORDERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (e) {
    console.error('Failed to parse escrow orders:', e);
    return [];
  }
}

export function saveEscrowOrders(orders: EscrowOrder[]) {
  localStorage.setItem(ESCROW_ORDERS_KEY, JSON.stringify(orders));
}

export function getEscrowOrdersForUser(userId: string) {
  return getEscrowOrders().filter(o => o.buyerId === userId || o.sellerId === userId);
}

export function createEscrowOrder(params: {
  productId: string;
  productName: string;
  productImage: string;
  buyerId: string;
  buyerNickname: string;
  sellerId: string;
  sellerNickname: string;
  finalPrice: number;
  shippingAddress?: ShippingAddress;
  orderType?: 'instant_deal' | 'auction_win';
  couponId?: string | null;
  couponName?: string;
  couponDiscount?: number;
  originalTotalAmount?: number;
  totalPaymentAmount?: number;
}): EscrowOrder {
  const orders = getEscrowOrders();
  const fee = calculateServiceFee(params.finalPrice);
  const shipFee = 3000; // 기본 배송비 3,000원
  const totAmount = params.totalPaymentAmount !== undefined ? params.totalPaymentAmount : (params.finalPrice + fee + shipFee);

  const newOrder: EscrowOrder = {
    id: `ord-${Date.now()}`,
    productId: params.productId,
    productName: params.productName,
    productImage: params.productImage,
    buyerId: params.buyerId,
    buyerNickname: params.buyerNickname,
    sellerId: params.sellerId,
    sellerNickname: params.sellerNickname,
    orderType: params.orderType || 'instant_deal',
    
    itemPrice: params.finalPrice,
    serviceFeeRate: SERVICE_FEE_RATE,
    serviceFee: fee,
    shippingFee: shipFee,
    totalPaymentAmount: totAmount,
    finalPrice: params.finalPrice, // For legacy backward compatibility
    
    couponId: params.couponId || null,
    couponName: params.couponName || '',
    couponDiscount: params.couponDiscount || 0,
    originalTotalAmount: params.originalTotalAmount !== undefined ? params.originalTotalAmount : (params.finalPrice + fee + shipFee),
    
    paymentStatus: 'unpaid',
    escrowStatus: 'none',
    deliveryStatus: 'preparing',
    orderStatus: 'pending_payment',
    shippingAddress: params.shippingAddress,
    refundStatus: 'none',
    createdAt: new Date().toISOString()
  };

  orders.push(newOrder);
  saveEscrowOrders(orders);
  return newOrder;
}

import { getProducts, saveProducts, getOrders, saveOrders, OrderState } from './storageUtils';

export function payEscrowOrder(orderId: string, paymentMethodId: string): EscrowOrder | null {
  const orders = getEscrowOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx > -1) {
    orders[idx].paymentMethodId = paymentMethodId;
    orders[idx].paymentStatus = 'paid';
    orders[idx].escrowStatus = 'holding';
    orders[idx].orderStatus = 'paid';
    orders[idx].paidAt = new Date().toISOString();
    
    saveEscrowOrders(orders);
    
    // Sync to shock_orders
    try {
      const legacyOrders = getOrders();
      const legacyIdx = legacyOrders.findIndex(o => o.id === orderId);
      const newLegacy: OrderState = {
        id: orders[idx].id,
        productId: orders[idx].productId,
        title: orders[idx].productName,
        productTitle: orders[idx].productName,
        image: orders[idx].productImage,
        productImage: orders[idx].productImage,
        buyerId: orders[idx].buyerId,
        buyerNickname: orders[idx].buyerNickname,
        sellerId: orders[idx].sellerId,
        sellerNickname: orders[idx].sellerNickname,
        finalPrice: orders[idx].finalPrice || orders[idx].itemPrice,
        orderType: orders[idx].orderType as any,
        paymentStatus: 'paid',
        escrowStatus: 'holding',
        deliveryStatus: 'preparing',
        orderStatus: 'paid',
        itemPrice: orders[idx].itemPrice,
        serviceFee: orders[idx].serviceFee,
        shippingFee: orders[idx].shippingFee,
        totalPaymentAmount: orders[idx].totalPaymentAmount,
        shippingAddress: orders[idx].shippingAddress,
        couponId: orders[idx].couponId,
        couponName: orders[idx].couponName,
        couponDiscount: orders[idx].couponDiscount,
        originalTotalAmount: orders[idx].originalTotalAmount,
        paidAt: orders[idx].paidAt,
        createdAt: new Date().toISOString(),
      };
      if (legacyIdx > -1) legacyOrders[legacyIdx] = newLegacy;
      else legacyOrders.push(newLegacy);
      saveOrders(legacyOrders);
    } catch(e) {}
    
    // Also update product status to 'sold'
    try {
      const products = getProducts();
      const pIdx = products.findIndex(p => p.id === orders[idx].productId);
      if (pIdx > -1) {
        products[pIdx].status = 'sold';
        products[pIdx].buyerId = orders[idx].buyerId;
        products[pIdx].buyerNickname = orders[idx].buyerNickname;
        products[pIdx].soldAt = new Date().toISOString();
        products[pIdx].finalPrice = orders[idx].itemPrice;
        products[pIdx].orderId = orderId;
        saveProducts(products);
      }
    } catch (e) {
      console.error('Failed to update product status on payment:', e);
    }
    
    // Notifications
    addNotification('deal_complete', `💵 [${orders[idx].productName}] 에스크로 결제가 완료되었습니다. 낙찰가: ${orders[idx].itemPrice.toLocaleString()}원 / 총결제: ${orders[idx].totalPaymentAmount.toLocaleString()}원`, { targetType: 'order', targetId: orderId, targetTab: 'purchases' });
    addNotification('deal_complete', `🔔 [판매알림] 내 소장품 '${orders[idx].productName}'이 낙찰되어 대금이 입금 완료되었습니다. 구매자 배송지를 확인하고 배송을 시작해 주세요.`, { targetType: 'order', targetId: orderId, targetTab: 'sales' });
    
    return orders[idx];
  }
  return null;
}

export function enterShippingInfo(orderId: string, carrier: string, trackingNumber: string, shippedAt: string = new Date().toISOString(), shippingMemo: string = ''): any {
  const orders = getEscrowOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  let orderTitle = '';
  
  if (idx > -1) {
    orders[idx].carrier = carrier;
    orders[idx].courier = carrier; // Dual support
    orders[idx].trackingNumber = trackingNumber;
    orders[idx].shippedAt = shippedAt;
    orders[idx].shippingMemo = shippingMemo;
    orders[idx].deliveryStatus = 'shipping';
    orders[idx].orderStatus = 'shipping';
    orders[idx].shippingEnteredAt = new Date().toISOString();
    orderTitle = orders[idx].productName;
    saveEscrowOrders(orders);
  }

  // Sync to shock_orders
  let legacyFound = false;
  try {
    const legacyOrders = getOrders();
    const legacyIdx = legacyOrders.findIndex(o => o.id === orderId);
    if (legacyIdx > -1) {
      legacyOrders[legacyIdx].deliveryStatus = 'shipping';
      legacyOrders[legacyIdx].orderStatus = 'shipping';
      legacyOrders[legacyIdx].courier = carrier;
      legacyOrders[legacyIdx].trackingNumber = trackingNumber;
      legacyOrders[legacyIdx].shippedAt = shippedAt;
      orderTitle = legacyOrders[legacyIdx].productTitle || legacyOrders[legacyIdx].title || orderTitle;
      saveOrders(legacyOrders);
      legacyFound = true;
    }
  } catch(e) {}

  if (idx > -1 || legacyFound) {
    // Notification
    addNotification('delivery_shipping', `📦 판매자가 '${orderTitle}' 상품을 발송했습니다. 운송장번호를 확인해주세요.`, { targetType: 'order', targetId: orderId, targetTab: 'purchases' });
    addNotification('delivery_shipping', `📦 [판매알림] '${orderTitle}' 배송정보가 등록되었습니다.`, { targetType: 'order', targetId: orderId, targetTab: 'sales' });
    return idx > -1 ? orders[idx] : true;
  }
  return null;
}

export function buyerConfirmDelivery(orderId: string): EscrowOrder | null {
  const orders = getEscrowOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx > -1) {
    const deliveredAtStr = new Date().toISOString();
    const until = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(); // +3 days
    
    orders[idx].deliveryStatus = 'delivered';
    orders[idx].orderStatus = 'delivered';
    orders[idx].deliveredAt = deliveredAtStr;
    orders[idx].refundAvailableUntil = until;
    
    saveEscrowOrders(orders);
    
    // Sync to shock_orders & shock_products
    try {
      const legacyOrders = getOrders();
      const legacyIdx = legacyOrders.findIndex(o => o.id === orderId);
      if (legacyIdx > -1) {
        legacyOrders[legacyIdx].deliveryStatus = 'delivered';
        legacyOrders[legacyIdx].orderStatus = 'delivered';
        legacyOrders[legacyIdx].paymentStatus = 'paid';
        (legacyOrders[legacyIdx] as any).deliveredAt = deliveredAtStr;
        (legacyOrders[legacyIdx] as any).refundAvailableUntil = until;
        saveOrders(legacyOrders);
        
        const products = JSON.parse(localStorage.getItem('shock_products') || '[]');
        const pIdx = products.findIndex((p:any) => String(p.id) === String(legacyOrders[legacyIdx].productId) || String(p.orderId) === String(legacyOrders[legacyIdx].id));
        if (pIdx > -1) {
          products[pIdx].deliveryStatus = 'delivered';
          products[pIdx].deliveredAt = deliveredAtStr;
          products[pIdx].orderId = legacyOrders[legacyIdx].id;
          localStorage.setItem('shock_products', JSON.stringify(products));
        }
      }
    } catch(e) {}
    
    // Notifications
    addNotification('delivery_done', `📦 [${orders[idx].productName}] 수령확인이 완료되었습니다. 3일 이내(~${new Date(until).toLocaleString()}) 환불 요청이 가능합니다.`, { targetType: 'order', targetId: orderId, targetTab: 'purchases' });
    addNotification('delivery_done', `🔔 [판매알림] 구매자가 '${orders[idx].productName}' 상품 수령을 확인했습니다. 환불 가능 기간 종료 후 정산이 진행됩니다.`, { targetType: 'order', targetId: orderId, targetTab: 'sales' });
    
    return orders[idx];
  }
  return null;
}

export function mockMarkAsDelivered(orderId: string): EscrowOrder | null {
  const orders = getEscrowOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx > -1) {
    const deliveredAtStr = new Date().toISOString();
    const until = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(); // +3 days
    
    orders[idx].deliveryStatus = 'delivered';
    orders[idx].orderStatus = 'delivered';
    orders[idx].deliveredAt = deliveredAtStr;
    orders[idx].refundAvailableUntil = until;
    
    saveEscrowOrders(orders);
    
    addNotification('delivery_done', `📦 [${orders[idx].productName}] 상품 배송 수령 완료! 3일 이내(~${new Date(until).toLocaleString()}) 환불 신청이 가능합니다.`, { targetType: 'order', targetId: orderId, targetTab: 'orders' });
    
    return orders[idx];
  }
  return null;
}

export function confirmOrderDelivery(orderId: string): EscrowOrder | null {
  const orders = getEscrowOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx > -1) {
    orders[idx].deliveryStatus = 'delivered';
    orders[idx].orderStatus = 'completed';
    orders[idx].escrowStatus = 'released';
    orders[idx].escrowReleasedAt = new Date().toISOString();
    orders[idx].buyerConfirmedAt = new Date().toISOString();
    
    saveEscrowOrders(orders);

    addNotification('deal_complete', `🎉 [${orders[idx].productName}] 구매확정이 최종 완료되었습니다! 에스크로 기금이 안전히 해제되었습니다.`, { targetType: 'order', targetId: orderId, targetTab: 'orders' });
    addNotification('deal_complete', `💰 [정산 알림] '${orders[idx].productName}' 거래의 구매확정 정산액이 판매자 계좌로 정상 이체 완료되었습니다.`, { targetType: 'order', targetId: orderId, targetTab: 'submissions' });
    
    return orders[idx];
  }
  return null;
}

// 4. Update Shipping Address (only if deliveryStatus is preparing and no trackingNumber)
export function updateOrderAddress(orderId: string, address: ShippingAddress): { success: boolean; message: string; order?: EscrowOrder } {
  const orders = getEscrowOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) {
    return { success: false, message: '주문을 찾을 수 없습니다.' };
  }
  
  const o = orders[idx];
  if (o.deliveryStatus !== 'preparing' || o.trackingNumber) {
    return { success: false, message: '이미 배송이 시작되어 주소를 변경할 수 없습니다.' };
  }
  
  o.shippingAddress = address;
  orders[idx] = o;
  saveEscrowOrders(orders);
  
  addNotification('address_change', `🏠 [${o.productName}] 구매자가 배송지 변경을 신청하여 정보가 안전히 갱신되었습니다.`, { targetType: 'order', targetId: orderId, targetTab: 'orders' });
  addNotification('address_change', `🔔 [판매알림] '${o.productName}' 주문의 배송지가 변경되었습니다. 새로운 주소를 확인하세요.`, { targetType: 'order', targetId: orderId, targetTab: 'submissions' });
  
  return { success: true, message: '배송지 주소가 수정되었습니다.', order: o };
}

// 5. Request Refund (delivered, before confirmed, within 3 days, refundStatus === 'none')
export function requestRefund(orderId: string, reason: string, detail?: string): { success: boolean; message: string; order?: EscrowOrder } {
  const orders = getEscrowOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) {
    return { success: false, message: '주문을 찾을 수 없습니다.' };
  }
  
  const o = orders[idx];
  if (o.deliveryStatus !== 'delivered') {
    return { success: false, message: '배송이 아직 수령 완료(delivered) 상태가 아닙니다.' };
  }
  if (o.buyerConfirmedAt) {
    return { success: false, message: '이미 구매확정이 완료되어 환불이 제한됩니다.' };
  }
  if (o.refundAvailableUntil && Date.now() > new Date(o.refundAvailableUntil).getTime()) {
    return { success: false, message: '수령 후 3일 환불 유효기한이 초과하여 일반 환불 신청이 불가합니다.' };
  }
  if (o.refundStatus !== 'none') {
    return { success: false, message: '이미 환불 절차가 진행 중이거나 마감되었습니다.' };
  }
  
  o.refundStatus = 'requested';
  o.orderStatus = 'refund_requested';
  o.refundReason = reason;
  o.refundDetail = detail;
  o.refundRequestedAt = new Date().toISOString();
  
  orders[idx] = o;
  saveEscrowOrders(orders);
  
  addNotification('refund_request', `⚠️ [${o.productName}] 환불 요청서가 성공적으로 접수되었습니다. 에스크로 정산이 일시 보류(holding) 처리됩니다.`, { targetType: 'order', targetId: orderId, targetTab: 'orders' });
  addNotification('refund_request', `🔔 [판매알림] '${o.productName}' 주문에 대해 구매자가 환불을 요청하였습니다. 사유: ${reason}`, { targetType: 'order', targetId: orderId, targetTab: 'submissions' });
  
  return { success: true, message: '환불 심사 요청이 접수되었습니다. 관리자/Mock 승인을 대기합니다.', order: o };
}

// 6. Process Refund (Mock admin approve/reject)
export function processRefund(orderId: string, status: 'approved' | 'rejected'): { success: boolean; message: string; order?: EscrowOrder } {
  const orders = getEscrowOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  if (idx === -1) {
    return { success: false, message: '주문을 찾을 수 없습니다.' };
  }
  
  const o = orders[idx];
  if (o.refundStatus !== 'requested') {
    return { success: false, message: '환불 대상 주문이 검안 요청 상태가 아닙니다.' };
  }
  
  o.refundProcessedAt = new Date().toISOString();
  
  if (status === 'approved') {
    o.refundStatus = 'refunded';
    o.escrowStatus = 'refunded';
    o.paymentStatus = 'refunded';
    o.orderStatus = 'cancelled';
    
    // Notifications
    addNotification('refund_approved', `✅ [환불 완료] [${o.productName}] 환불 요청이 최종 승인되었습니다. 결제 대금이 주문자에게 정상 환급되었습니다.`, { targetType: 'order', targetId: orderId, targetTab: 'orders' });
    addNotification('refund_approved', `🔔 [판매알림] '${o.productName}'에 대한 구매자의 환불 요청이 승인되어 대금이 환불 종결 처리되었습니다.`, { targetType: 'order', targetId: orderId, targetTab: 'submissions' });
  } else {
    o.refundStatus = 'rejected';
    o.orderStatus = 'delivered'; // revert back to delivered
    
    // Notifications
    addNotification('refund_rejected', `❌ [환불 거절] [${o.productName}] 환불 요청이 반려되었습니다. 기입한 상품 불일치가 유해 부적합 사유에 포함되지 않습니다.`, { targetType: 'order', targetId: orderId, targetTab: 'orders' });
    addNotification('refund_rejected', `🔔 [판매알림] '${o.productName}'에 대한 구매자 환불 요청이 거절 누적 반려되었습니다.`, { targetType: 'order', targetId: orderId, targetTab: 'submissions' });
  }
  
  orders[idx] = o;
  saveEscrowOrders(orders);
  return { success: true, message: `환불 요청을 ${status === 'approved' ? '승인' : '반려'}하였습니다.`, order: o };
}

// Spark visitor pickup delivery flow functions
export function requestPickupOrder(
  orderId: string,
  pickupAddress: string,
  pickupDate: string,
  pickupTimeSlot: string,
  pickupMethod: string,
  pickupMemo: string,
  packagePhoto: string,
  pickupPlacePhoto: string,
  customCarrier?: string,
  customTrackingNumber?: string
): any {
  const orders = getEscrowOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  let orderTitle = '';
  
  const isConvenience = pickupMethod === '편의점 위탁 접수';
  const carrier = isConvenience ? (customCarrier || '편의점택배') : '샥 계약택배';
  const trackingNumber = isConvenience ? (customTrackingNumber || '') : ('SYAK-' + Date.now());

  if (idx > -1) {
    orders[idx].deliveryStatus = 'pickup_requested';
    orders[idx].orderStatus = 'pickup_requested';
    (orders[idx] as any).pickupRequestedAt = new Date().toISOString();
    (orders[idx] as any).pickupAddress = pickupAddress;
    (orders[idx] as any).pickupDate = pickupDate;
    (orders[idx] as any).pickupTimeSlot = pickupTimeSlot;
    (orders[idx] as any).pickupMethod = pickupMethod;
    (orders[idx] as any).pickupMemo = pickupMemo;
    (orders[idx] as any).packagePhoto = packagePhoto;
    (orders[idx] as any).pickupPlacePhoto = pickupPlacePhoto;
    orders[idx].carrier = carrier;
    orders[idx].courier = carrier;
    orders[idx].trackingNumber = trackingNumber;
    (orders[idx] as any).pickupStatus = 'requested';
    orderTitle = orders[idx].productName;
    saveEscrowOrders(orders);
  }

  // Sync to shock_orders
  let legacyFound = false;
  try {
    const legacyOrders = getOrders();
    const legacyIdx = legacyOrders.findIndex(o => o.id === orderId);
    if (legacyIdx > -1) {
      (legacyOrders[legacyIdx] as any).deliveryStatus = 'pickup_requested';
      (legacyOrders[legacyIdx] as any).orderStatus = 'pickup_requested';
      (legacyOrders[legacyIdx] as any).pickupRequestedAt = new Date().toISOString();
      (legacyOrders[legacyIdx] as any).pickupAddress = pickupAddress;
      (legacyOrders[legacyIdx] as any).pickupDate = pickupDate;
      (legacyOrders[legacyIdx] as any).pickupTimeSlot = pickupTimeSlot;
      (legacyOrders[legacyIdx] as any).pickupMethod = pickupMethod;
      (legacyOrders[legacyIdx] as any).pickupMemo = pickupMemo;
      (legacyOrders[legacyIdx] as any).packagePhoto = packagePhoto;
      (legacyOrders[legacyIdx] as any).pickupPlacePhoto = pickupPlacePhoto;
      (legacyOrders[legacyIdx] as any).courier = carrier;
      (legacyOrders[legacyIdx] as any).trackingNumber = trackingNumber;
      (legacyOrders[legacyIdx] as any).pickupStatus = 'requested';
      orderTitle = legacyOrders[legacyIdx].productTitle || legacyOrders[legacyIdx].title || orderTitle;
      saveOrders(legacyOrders);
      legacyFound = true;
    }
  } catch(e) {}

  if (idx > -1 || legacyFound) {
    addNotification('delivery_shipping', `📦 판매자가 '${orderTitle}' 상품의 샥 계약택배 방문수거를 신청 완료했습니다.`, { targetType: 'order', targetId: orderId, targetTab: 'purchases' });
    addNotification('delivery_shipping', `📦 [판매알림] '${orderTitle}' 상품의 방문수거 신청이 정상 접수되었습니다.`, { targetType: 'order', targetId: orderId, targetTab: 'sales' });
    return idx > -1 ? orders[idx] : true;
  }
  return null;
}

export function markAsPickedUp(orderId: string): any {
  const orders = getEscrowOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  let orderTitle = '';
  
  if (idx > -1) {
    orders[idx].deliveryStatus = 'picked_up';
    orders[idx].orderStatus = 'picked_up' as any;
    (orders[idx] as any).pickedUpAt = new Date().toISOString();
    (orders[idx] as any).pickupStatus = 'picked_up';
    orderTitle = orders[idx].productName;
    saveEscrowOrders(orders);
  }

  let legacyFound = false;
  try {
    const legacyOrders = getOrders();
    const legacyIdx = legacyOrders.findIndex(o => o.id === orderId);
    if (legacyIdx > -1) {
      legacyOrders[legacyIdx].deliveryStatus = 'picked_up' as any;
      legacyOrders[legacyIdx].orderStatus = 'picked_up' as any;
      (legacyOrders[legacyIdx] as any).pickedUpAt = new Date().toISOString();
      (legacyOrders[legacyIdx] as any).pickupStatus = 'picked_up';
      orderTitle = legacyOrders[legacyIdx].productTitle || legacyOrders[legacyIdx].title || orderTitle;
      saveOrders(legacyOrders);
      legacyFound = true;
    }
  } catch(e) {}

  if (idx > -1 || legacyFound) {
    addNotification('delivery_shipping', `🚚 [${orderTitle}] 택배사 수거가 완료되었습니다. 발송을 대기 중입니다.`, { targetType: 'order', targetId: orderId, targetTab: 'purchases' });
    addNotification('delivery_shipping', `🚚 [${orderTitle}] 택배사의 방문 수거가 성공적으로 처리되었습니다.`, { targetType: 'order', targetId: orderId, targetTab: 'sales' });
    return idx > -1 ? orders[idx] : true;
  }
  return null;
}

export function markAsShipping(orderId: string): any {
  const orders = getEscrowOrders();
  const idx = orders.findIndex(o => o.id === orderId);
  let orderTitle = '';
  
  if (idx > -1) {
    orders[idx].deliveryStatus = 'shipping';
    orders[idx].orderStatus = 'shipping';
    orders[idx].shippedAt = new Date().toISOString();
    orderTitle = orders[idx].productName;
    saveEscrowOrders(orders);
  }

  let legacyFound = false;
  try {
    const legacyOrders = getOrders();
    const legacyIdx = legacyOrders.findIndex(o => o.id === orderId);
    if (legacyIdx > -1) {
      legacyOrders[legacyIdx].deliveryStatus = 'shipping';
      legacyOrders[legacyIdx].orderStatus = 'shipping';
      legacyOrders[legacyIdx].shippedAt = new Date().toISOString();
      orderTitle = legacyOrders[legacyIdx].productTitle || legacyOrders[legacyIdx].title || orderTitle;
      saveOrders(legacyOrders);
      legacyFound = true;
    }
  } catch(e) {}

  if (idx > -1 || legacyFound) {
    addNotification('delivery_shipping', `📦 ['${orderTitle}'] 배송이 시작되어 구매자에게 전달중입니다.`, { targetType: 'order', targetId: orderId, targetTab: 'purchases' });
    addNotification('delivery_shipping', `📦 ['${orderTitle}'] 상품의 배송 발송 처리가 완료되었습니다.`, { targetType: 'order', targetId: orderId, targetTab: 'sales' });
    return idx > -1 ? orders[idx] : true;
  }
  return null;
}


