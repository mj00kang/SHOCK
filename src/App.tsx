import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Gift, SlidersHorizontal, ArrowUpRight, HelpCircle, User, 
  Coins, CheckCircle, Flame, MessageSquare, BookOpen, AlertCircle, Plus, 
  Trash2, Landmark, CheckSquare, Bell, Heart, Send, RefreshCw, X, ChevronUp
} from 'lucide-react';

import { 
  initStorage, getProducts, saveProducts, getUser, saveUser, 
  getBids, saveBids, getCommunityPosts, saveCommunityPosts, 
  getNotices, getLuckyEvents, saveLuckyEvents, getOrders, saveOrders, 
  updateCoins, OrderState, LuckyEventState, UserState, initCouponsForUser,
  getCoupons, saveCoupons, CommunityPost
} from './utils/storageUtils';
import { joinMeetupRoom } from './utils/meetupGenerator';
import { placeBid, buyNowAscending, isAuctionActive } from './utils/auctionUtils';
import { SERVICE_FEE_RATE, getPayoutAccounts, addPayoutAccount } from './utils/paymentUtils';
import { Category, Product, Banner, Notice, INITIAL_CATEGORIES } from './data/mockData';

import Header from './components/Header';
import HeroBanner from './components/HeroBanner';
import RecommendAuction from './components/RecommendAuction';
import CategorySection from './components/CategorySection';
import CategoryIconGrid from './components/CategoryIconGrid';
import DeadlineAuction from './components/DeadlineAuction';
import CommunitySection from './components/CommunitySection';
import EventSection from './components/EventSection';
import Modal from './components/Modal';
import CategoryPage from './pages/CategoryPage';
import ProductImage from './components/ProductImage';
import ListProductPage from './pages/ListProductPage';
import CommunityPage from './pages/CommunityPage';
import EventPage from './pages/EventPage';
import MyPage from './pages/MyPage';
import AuctionListPage from './pages/AuctionListPage';
import ChatRoomPage from './pages/ChatRoomPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import CheckoutPage from './pages/CheckoutPage';
import ProductDetailPage from './pages/ProductDetailPage';
import RankingPage from './pages/RankingPage';
import NoticePage from './pages/NoticePage';
import FAQPage from './pages/FAQPage';
import InquiryPage from './pages/InquiryPage';
import ReportPage from './pages/ReportPage';
import MarketTrendPage from './pages/MarketTrendPage';
import CommunityDetailPage from './pages/CommunityDetailPage';
import ScrollToTopButton from './components/ScrollToTopButton';

export default function App() {
  // Page view state: 'main' or others
  const [currentView, setCurrentView] = useState<'main' | 'POP' | 'SPORTS' | 'ANALOG' | 'list_product' | 'community' | 'communityDetail' | 'event' | 'notice' | 'mypage' | 'auction_list' | 'chat_room' | 'login' | 'signup' | 'checkout' | 'product_detail' | 'ranking' | 'market_trend'>('main');
  const [previousView, setPreviousView] = useState<string>('main');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [checkoutProductId, setCheckoutProductId] = useState<string>('');
  const [checkoutPrice, setCheckoutPrice] = useState<number>(0);
  const [activeChatRoomId, setActiveChatRoomId] = useState<string>('trading-card');
  const [communityInitialTab, setCommunityInitialTab] = useState<'board' | 'meetup'>('board');
  const [myPageInitialTab, setMyPageInitialTab] = useState<'bids' | 'likes' | 'submissions' | 'orders' | 'addresses' | 'payment_methods' | 'payout_accounts' | 'meetups' | 'my-community' | 'notifs' | 'payments' | undefined>(undefined);
  const [myPageTargetOrderId, setMyPageTargetOrderId] = useState<string | undefined>(undefined);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  const [auctionListTab, setAuctionListTab] = useState<'all' | 'live' | 'buyNow'>('all');

  const handleNavigateToProductDetail = (prod: any) => {
    const id = typeof prod === 'object' && prod !== null ? prod.id : prod;
    setSelectedProductId(id);
    setPreviousView(currentView);
    setCurrentView('product_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToCategoryPage = (group: 'POP' | 'SPORTS' | 'ANALOG', subCategory?: string) => {
    setCurrentView(group);
    setSelectedSubCategory(subCategory || 'all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 1. Storage initialization
  useEffect(() => {
    initStorage();
    const unreads = localStorage.getItem('shock_notifications_unreads');
    if (!unreads) {
      localStorage.setItem('shock_notifications_unreads', JSON.stringify([
        {
          id: 'notif-1',
          type: 'system',
          message: '🎉 샥에 오신 것을 환영합니다! 취향에 맞는 다양한 아이템을 수집해보세요.',
          createdAt: new Date().toISOString(),
          isRead: false
        },
        {
          id: 'notif-2',
          type: 'outbid',
          message: '⚠️ 경고: [포켓몬 리자몽 카드]에 다른 수집가가 상위 호가를 갱신하여 찜한 경합 대기열을 위협하고 있습니다.',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          isRead: false
        }
      ]));
    }

    // Normalize existing orders service fee to 3%
    try {
      const ordersRaw = localStorage.getItem('shock_orders');
      if (ordersRaw) {
        const orders = JSON.parse(ordersRaw);
        let updated = false;
        
        const normalizedOrders = orders.map((o: any) => {
          const itemPrice = Number(o.itemPrice || o.finalPrice || o.price || 0);
          const expectedFee = Math.round(itemPrice * SERVICE_FEE_RATE);
          if (o.serviceFeeRate !== SERVICE_FEE_RATE || o.serviceFee !== expectedFee) {
            updated = true;
            return {
              ...o,
              serviceFeeRate: SERVICE_FEE_RATE,
              serviceFee: expectedFee,
              totalPaymentAmount: itemPrice + expectedFee + Number(o.shippingFee ?? 3000)
            };
          }
          return o;
        });

        if (updated) {
          localStorage.setItem('shock_orders', JSON.stringify(normalizedOrders));
        }
      }
    } catch (e) {
      console.error('Order normalization failed', e);
    }

    // Normalize existing product conditions
    try {
      const productsRaw = localStorage.getItem('shock_products');
      if (productsRaw) {
        const pList = JSON.parse(productsRaw);
        let updated = false;
        const normalized = pList.map((p: any) => {
          let updatedCond = p.condition;
          if (['mint', '민트급', '상태 좋음', 'excellent'].includes(p.condition)) {
            updatedCond = '상태우수';
          } else if (['unopened', '미개봉', '거의 새것', 'like_new', '새상품'].includes(p.condition)) {
            updatedCond = '새상품급';
          } else if (['used', '양호', '사용감 약간'].includes(p.condition)) {
            updatedCond = '사용감 있음';
          } else if (['damaged', '하자 있음', 'flaw', '스크래치 있음', '세월감 있음', 'old'].includes(p.condition)) {
            updatedCond = '빈티지';
          }
          if (updatedCond && updatedCond !== p.condition) {
            updated = true;
            return { ...p, condition: updatedCond };
          }
          return p;
        });

        if (updated) {
          localStorage.setItem('shock_products', JSON.stringify(normalized));
        }
      }
    } catch (e) {
      console.error('Product condition normalization failed', e);
    }

    // Fix active auction products safely
    try {
      const alreadyRepaired = sessionStorage.getItem("syak_products_repaired_once_6");
      if (!alreadyRepaired) {
        const storedProducts = getProducts();
        if (storedProducts.length > 0) {
          let updated = false;
          const now = Date.now();

          const repairedProducts = storedProducts.map((product) => {
            if (!product) return product;

            const status = String(product.status || "").toLowerCase();
            const pAny = product as any;
            const hasOrder = pAny.orderId || pAny.soldAt || pAny.buyerConfirmedAt || pAny.winnerId || ["sold", "completed", "confirmed", "shipping", "deleted", "removed"].includes(status);

            if (hasOrder) return product;

            updated = true;
            return {
              ...product,
              status: "live",
              endAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
              endedAt: undefined
            };
          });

          if (updated) {
            saveProducts(repairedProducts as Product[]);
          }
        }
        sessionStorage.setItem("syak_products_repaired_once_6", "true");
        // Reload all data after repair to trigger UI propagation immediately
        setTimeout(() => reloadAllData(), 50);
      }
    } catch (e) {
      console.error('Active auction product repair failed under initialization', e);
    }
  }, []);

  // 2. Central React States
  const [products, setProducts] = useState<Product[]>([]);
  const [user, setUser] = useState<UserState | null>(getUser());
  const [luckyEvents, setLuckyEvents] = useState<LuckyEventState[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);

  // 3. Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('endingSoon');

  // 4. Modal Triggers
  const [activeBidProduct, setActiveBidProduct] = useState<Product | null>(null);
  const [bidAmountInput, setBidAmountInput] = useState('');
  const [activeBuyProduct, setActiveBuyProduct] = useState<Product | null>(null);

  const [sellModalOpen, setSellModalOpen] = useState(false);

  // 5b. Product Creation - Payout account states
  const [appPayoutAccounts, setAppPayoutAccounts] = useState<any[]>([]);
  const [sellPayoutSelectedId, setSellPayoutSelectedId] = useState<string>('new');
  const [sellPayoutBank, setSellPayoutBank] = useState('국민은행');
  const [sellPayoutAccountNum, setSellPayoutAccountNum] = useState('');
  const [sellPayoutHolder, setSellPayoutHolder] = useState('');
  const [sellPayoutNickname, setSellPayoutNickname] = useState('');

  useEffect(() => {
    if (sellModalOpen && user) {
      const accs = getPayoutAccounts(user.id);
      setAppPayoutAccounts(accs);
      if (accs.length > 0) {
        const defaultAcc = accs.find(a => a.isDefault) || accs[0];
        setSellPayoutSelectedId(defaultAcc.id);
      } else {
        setSellPayoutSelectedId('new');
      }
    }
  }, [sellModalOpen, user]);
  const [myPageModalOpen, setMyPageModalOpen] = useState(false);
  const [notificationsModalOpen, setNotificationsModalOpen] = useState(false);
  const [likesModalOpen, setLikesModalOpen] = useState(false);

  const [selectedPost, setSelectedPost] = useState<CommunityPost | null>(null);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // 5. Product Creation Form States (Only Upward Bidding)
  const [newProdTitle, setNewProdTitle] = useState('');
  const [newProdCategoryGroup, setNewProdCategoryGroup] = useState<'POP' | 'SPORTS' | 'ANALOG'>('POP');
  const [newProdCategoryName, setNewProdCategoryName] = useState('피규어');
  const [newProdImagePreset, setNewProdImagePreset] = useState('toy');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCondition, setNewProdCondition] = useState<'S' | 'A' | 'B'>('A');

  const [newProdStartPrice, setNewProdStartPrice] = useState('150000');
  const [newProdBuyNowPrice, setNewProdBuyNowPrice] = useState('300000');
  const [newProdHours, setNewProdHours] = useState('3'); 

  // 6. Test Environment Admin Switcher link
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user');

  // Reload state engine
  const reloadAllData = () => {
    // 0. Auto-resolve expired auctions and normalize legacy orders
    const rawOrders = getOrders();
    const prods = getProducts();
    const bids = getBids();
    let ordersDirty = false;
    let prodsDirty = false;
    let notifsToSend: any[] = [];

    // Process all products for auto-resolve and pending fix
    prods.forEach(prod => {
      const isExpired = prod.status === 'live' && new Date(prod.endAt).getTime() <= Date.now();
      const isPending = (prod.status as any) === 'payment_pending' || (prod.status as any) === 'pending_payment';
      
      if (isExpired || isPending) {
        const prodBids = bids.filter(b => b.productId === prod.id);
        if (prodBids.length > 0) {
          const highestBid = prodBids.reduce((max, b) => b.bidPrice > max.bidPrice ? b : max, prodBids[0]);
          const itemPrice = highestBid.bidPrice;
          const serviceFee = Math.round(itemPrice * SERVICE_FEE_RATE);
          const shippingFee = 3000;
          const totalAmount = itemPrice + serviceFee + shippingFee;
          const now = new Date().toISOString();
          
          let targetOrder = rawOrders.find(o => o.productId === prod.id && (o.orderType === 'auction_win' || o.orderType === 'bid_win'));
          if (targetOrder) {
            if (targetOrder.paymentStatus !== 'paid') {
              targetOrder.paymentStatus = 'paid';
              targetOrder.escrowStatus = 'holding';
              targetOrder.deliveryStatus = 'preparing';
              targetOrder.orderStatus = 'paid';
              if (!targetOrder.paidAt) targetOrder.paidAt = now;
              ordersDirty = true;
            }
          } else {
            targetOrder = {
              id: `ord-auto-${Date.now()}-${Math.floor(Math.random()*1000)}`,
              productId: prod.id,
              productTitle: prod.title,
              productImage: prod.image,
              buyerId: highestBid.bidderId,
              buyerNickname: highestBid.bidderNickname,
              sellerId: prod.sellerId,
              sellerNickname: prod.sellerNickname || '정통수집가',
              finalPrice: totalAmount,
              orderType: 'auction_win',
              paymentStatus: 'paid',
              escrowStatus: 'holding',
              deliveryStatus: 'preparing',
              orderStatus: 'paid',
              itemPrice: itemPrice,
              serviceFee: serviceFee,
              shippingFee: shippingFee,
              totalPaymentAmount: totalAmount,
              paidAt: now,
              createdAt: now,
            } as any;
            rawOrders.push(targetOrder);
            ordersDirty = true;
            
            notifsToSend.push({
              type: 'auto_paid',
              message: '축하합니다. 낙찰과 자동결제가 완료되었습니다. 판매자의 배송을 기다려주세요.',
              targetPayload: { targetType: 'order', targetId: targetOrder.id, targetTab: 'purchases' }
            });
            notifsToSend.push({
              type: 'auto_paid',
              message: '내 출품 상품이 낙찰되어 결제가 완료되었습니다. 배송정보를 입력해주세요.',
              targetPayload: { targetType: 'order', targetId: targetOrder.id, targetTab: 'sales' }
            });
          }
          
          if (prod.status !== 'sold') {
            prod.status = 'sold';
            (prod as any).buyerId = highestBid.bidderId;
            (prod as any).buyerNickname = highestBid.bidderNickname;
            (prod as any).winnerId = highestBid.bidderId;
            (prod as any).winnerNickname = highestBid.bidderNickname;
            (prod as any).winningBidId = highestBid.id;
            (prod as any).finalPrice = itemPrice;
            (prod as any).orderId = targetOrder.id;
            if (!(prod as any).soldAt) (prod as any).soldAt = now;
            if (!(prod as any).endedAt) (prod as any).endedAt = now;
            prodsDirty = true;
          }
        } else if (isExpired) {
          prod.status = 'unsold' as any;
          (prod as any).endedAt = new Date().toISOString();
          prodsDirty = true;
        }
      }
    });

    const normalizedOrders = rawOrders.map(o => {
      let changed = false;
      const prod = prods.find(p => String(p.id) === String(o.productId));
      if (prod && (!o.sellerId || o.sellerId === 'seller-admin')) {
        o.sellerId = prod.sellerId;
        o.sellerNickname = prod.sellerNickname;
        if (!o.productTitle && !(o as any).title) (o as any).productTitle = prod.title;
        if (!o.productImage && !(o as any).image) (o as any).productImage = prod.images?.[0] || (prod as any).imageUrl || prod.image || '';
        changed = true;
      }
      if (o.orderStatus === 'pending_payment' || o.paymentStatus === 'unpaid') {
        o.orderStatus = 'paid';
        o.paymentStatus = 'paid';
        o.escrowStatus = 'holding';
        o.deliveryStatus = 'preparing';
        if (!o.paidAt) o.paidAt = new Date().toISOString();
        changed = true;
      }
      if (!o.trackingNumber && !o.courier && (o.deliveryStatus === 'shipping' || o.deliveryStatus === 'delivered' || (o.deliveryStatus as any) === 'confirmed')) {
        o.deliveryStatus = 'preparing';
        o.orderStatus = 'paid';
        changed = true;
      }
      if (!o.paymentStatus) { o.paymentStatus = 'paid'; changed = true; }
      if (!o.escrowStatus) { o.escrowStatus = 'holding'; changed = true; }
      if (!o.deliveryStatus) { o.deliveryStatus = 'preparing'; changed = true; }
      if (!o.orderStatus) { o.orderStatus = 'paid'; changed = true; }
      if (changed) ordersDirty = true;
      return o;
    });

    if (ordersDirty) saveOrders(normalizedOrders);
    if (prodsDirty) saveProducts(prods);

    setProducts(getProducts());
    setLuckyEvents(getLuckyEvents());
    setPosts(getCommunityPosts());
    setNotices(getNotices());
    
    // dispatch new notifications
    if (notifsToSend.length > 0) {
      const rawNotif = localStorage.getItem('shock_notifications_unreads');
      const list = rawNotif ? JSON.parse(rawNotif) : [];
      notifsToSend.forEach(n => {
        list.unshift({
          id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          type: n.type,
          message: n.message,
          createdAt: new Date().toISOString(),
          isRead: false,
          ...n.targetPayload
        });
      });
      localStorage.setItem('shock_notifications_unreads', JSON.stringify(list));
    }

    // Optional migration for syak_notifications as requested
    const legacySyakNotifs = localStorage.getItem('syak_notifications');
    let baseNotifsToParse = localStorage.getItem('shock_notifications_unreads');
    if (!baseNotifsToParse && legacySyakNotifs) {
      baseNotifsToParse = legacySyakNotifs;
      localStorage.removeItem('syak_notifications');
    }

    if (baseNotifsToParse) {
      const parsedNotifs = JSON.parse(baseNotifsToParse);
      
      const blockedKeywords = ["모의 충전", "샥머니", "초코머니", "가상머니", "5,000,000", "충전 완료", "지급 완료", "쇼크머니", "테스트 머니", "mock money", "virtual money"];
      
      const cleanedNotifs = parsedNotifs.filter((n: any) => {
        const text = `${n.title || ""} ${n.message || ""}`;
        return !blockedKeywords.some(kw => text.includes(kw));
      }).map((n: any) => {
        if (n.message) {
          n.message = n.message
            .replace(/SHOCK|쇼크|샥가상|PLATFORM SHOCK/gi, '샥')
            .replace(/샥\s*\(샥\)/g, '샥')
            .replace(/샥에 머물러주셔서/g, '샥을 이용해주셔서');
        }
        return n;
      });

      const uniqueNotifs = cleanedNotifs.filter((val: any, idx: number, arr: any[]) => arr.findIndex(t => t.id === val.id) === idx);
      
      setNotifications(uniqueNotifs);
      
      // Save back if changed
      if (uniqueNotifs.length !== parsedNotifs.length || JSON.stringify(uniqueNotifs) !== baseNotifsToParse) {
        localStorage.setItem('shock_notifications_unreads', JSON.stringify(uniqueNotifs));
      }
    } else {
      setNotifications([]);
    }

    const cur = localStorage.getItem('shock_current_user');
    if (cur) {
      try {
        const uObj = JSON.parse(cur);
        const fullUser = getUser();
        if (fullUser && fullUser.id === uObj.id) {
          if (!fullUser.likes) fullUser.likes = [];
          if (!fullUser.joinedLuckyEvents) fullUser.joinedLuckyEvents = [];
          setUser(fullUser);
        } else {
          const fallbackUser: UserState = {
            id: uObj.id || 'usr-temp',
            nickname: uObj.nickname || '임시 수집가',
            email: uObj.email || '',
            role: uObj.role || 'user',
            coins: uObj.coins ?? 5000000,
            likes: uObj.likes ?? [],
            joinedLuckyEvents: uObj.joinedLuckyEvents ?? []
          };
          setUser(fallbackUser);
          saveUser(fallbackUser);
        }
        setIsLoggedIn(true);
      } catch (err) {
        setUser(getUser());
        setIsLoggedIn(false);
      }
    } else {
      const defaultUser = getUser();
      if (defaultUser) {
        if (!defaultUser.likes) defaultUser.likes = [];
        if (!defaultUser.joinedLuckyEvents) defaultUser.joinedLuckyEvents = [];
      }
      setUser(defaultUser);
      setIsLoggedIn(false);
    }

    // Initialize coupons if a user exists
    const finalUser = getUser();
    if (finalUser && finalUser.id) {
      initCouponsForUser(finalUser.id);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('shock_current_user');
    setIsLoggedIn(false);
    reloadAllData();
    setCurrentView('main');
    alert('로그아웃 되었습니다.');
  };

  const handleLoginSuccess = (loggedInUser: any) => {
    reloadAllData();
    setIsLoggedIn(true);
    setCurrentView('main');
  };

  const handleSignupSuccess = (newUser: any) => {
    reloadAllData();
    setIsLoggedIn(true);
    setCurrentView('main');
  };

  useEffect(() => {
    reloadAllData();
  }, [currentView]);

  // System full database reset (For easy client evaluation)
  const handleResetData = () => {
    if (confirm('모든 입찰, 출품 내역, 가상 정산, 래플 및 샥머니 보유고를 전면 초기화하시겠습니까?')) {
      initStorage(true);
      localStorage.removeItem('shock_notifications_unreads');
      reloadAllData();
      alert('성공적으로 공장 초기 샥 보드로 복원 완료되었습니다!');
    }
  };

  if (!user) return <div className="text-slate-800 p-20 text-center font-bold">샥 데이터베이스 동기화 수집 중...</div>;

  // Add virtual alarm alerts
  const dispatchNotification = (type: string, message: string, targetPayload?: { targetType?: string, targetId?: string, targetTab?: string }) => {
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
    setNotifications(list);
  };

  // Heart toggle likes
  const handleToggleLike = (productId: string) => {
    if (!isLoggedIn) {
      alert('찜하기 기능을 이용하시려면 로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const currentUser = user ? { ...user } : null;
    if (!currentUser) return;
    if (!currentUser.likes) currentUser.likes = [];
    let liked = false;
    if (currentUser.likes.includes(productId)) {
      currentUser.likes = currentUser.likes.filter(id => id !== productId);
    } else {
      currentUser.likes.push(productId);
      liked = true;
    }
    
    const prods = [...products];
    const item = prods.find(p => p.id === productId);
    if (item) {
      item.likeCount += liked ? 1 : -1;
      saveProducts(prods);
      setProducts(prods);
    }

    saveUser(currentUser);
    setUser(currentUser);
    
    if (liked) {
      dispatchNotification('bid_success', `❤️ [관심 찜 목록 추가]: "${item?.title.substring(0, 15)}..." 소장 애장품을 나의 북마크함에 추가 완료하였습니다.`);
    }
  };

  // Upward Bidding Dialog opening trigger
  const handleBidClick = (prod: Product) => {
    if (!isLoggedIn) {
      alert('경매 입찰 참여를 위해 로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setActiveBidProduct(prod);
    setBidAmountInput((prod.currentPrice + 10000).toString());
  };

  const handleConfirmBid = () => {
    if (!activeBidProduct) return;
    const bidVal = parseInt(bidAmountInput);
    if (isNaN(bidVal) || bidVal <= 0) {
      alert('정상적인 입찰 정금액을 수동 기입해 주세요.');
      return;
    }

    const res = placeBid(activeBidProduct.id, bidVal, user.id, user.nickname);
    if (res.success) {
      reloadAllData();
      setActiveBidProduct(null);
      dispatchNotification('bid_success', `📈 입찰 성공: [${activeBidProduct.title.substring(0, 15)}...] 상품에 ${(bidVal ?? 0).toLocaleString()}원으로 최고가 입찰을 갱신하였습니다!`);
      alert(res.message);
    } else {
      alert(res.message);
    }
  };

  // Buy Now quick transaction triggers
  const handleBuyNowClick = (prod: Product) => {
    if (!isLoggedIn) {
      alert('즉시 구매를 하려면 로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    setCheckoutProductId(prod.id);
    setCheckoutPrice(prod.buyNowPrice || prod.currentPrice);
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConfirmBuyNow = () => {
    if (!activeBuyProduct) return;

    if (activeBuyProduct.auctionType === 'ascending') {
      const res = buyNowAscending(activeBuyProduct.id, user.id, user.nickname);
      if (res.success) {
        reloadAllData();
        setActiveBuyProduct(null);
        dispatchNotification('buy_now_success', `⚡ 즉시 낙찰 완료: [${activeBuyProduct.title.substring(0, 15)}...] 애장품의 즉시구매 절차가 마무리되었습니다!`);
        alert(res.message);
      } else {
        alert(res.message);
      }
    }
  };

  // Lucky 100 Won apply ticker
  const handleLuckyApply = (eventId: string) => {
    if (!isLoggedIn) {
      alert('100원 응모 이벤트에 참여하시려면 로그인이 필요합니다. 로그인 페이지로 이동합니다.');
      setCurrentView('login');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const evs = getLuckyEvents();
    const targetIdx = evs.findIndex(e => e.id === eventId);
    if (targetIdx === -1) return;

    const target = evs[targetIdx];
    if (target.participants.includes(user.nickname)) {
       alert('이미 응모가 무사 수임 완료된 특별 래플 굿즈입니다.');
       return;
    }

    target.participants.push(user.nickname);
    saveLuckyEvents(evs);
    setLuckyEvents(evs);

    const uState = user ? { ...user } : null;
    if (uState) {
      if (!uState.joinedLuckyEvents) uState.joinedLuckyEvents = [];
      uState.joinedLuckyEvents.push(eventId);
      saveUser(uState);
      setUser(uState);
    }

    // Lucky Syak event coupon issuance
    try {
      if (uState && uState.id) {
        const userCoupons = getCoupons();
        const hasLuckyCoupon = userCoupons.some(c => c.userId === uState.id && c.couponId === 'lucky-syak-1000');
        if (!hasLuckyCoupon) {
          const nowISO = new Date().toISOString();
          const newCoupon = {
            id: "coupon-lucky-syak-event-" + Date.now(),
            userId: uState.id,
            couponId: "lucky-syak-1000",
            name: "럭키샥 참여자 1,000원 할인 쿠폰",
            type: "fixed" as const,
            discountAmount: 1000,
            description: "럭키샥 100원 응모 이벤트 참여자 전용 쿠폰입니다.",
            minOrderAmount: 5000,
            usableOn: ["auction_win", "buy_now", "instant_buy"],
            isUsed: false,
            issuedAt: nowISO,
            expiresAt: "2026-12-31T23:59:59.000Z"
          };
          userCoupons.push(newCoupon);
          saveCoupons(userCoupons);
          dispatchNotification('deal_complete', `🎟️ 럭키샥 참여 감사 쿠폰 발급: '럭키샥 참여자 1,000원 할인 쿠폰'이 즉시 증정되었습니다! MyPage 내 쿠폰함에서 확인하세요.`);
        }
      }
    } catch (couponErr) {
      console.error('Failed to issue lucky-syak event coupon:', couponErr);
    }

    dispatchNotification('bid_success', `🎁 래플 응모 완료: [${target.productName.substring(0, 12)}...] 100원 응모 접수 대기 상태에 접수되었습니다!`);
    alert('모의 응모에 성공하였습니다! 다른 정원 응모자들과 무작위 기계 난수 매칭됩니다.');
  };

  // Lucky 100 Won manual draw button (Admin exclusive)
  const handleLuckyDraw = (eventId: string) => {
    const evs = getLuckyEvents();
    const targetIdx = evs.findIndex(e => e.id === eventId);
    if (targetIdx === -1) return;

    const target = evs[targetIdx];
    if (target.status === 'drawn') {
      alert('이미 추첨 난수 분할이 모두 완료된 래플입니다.');
      return;
    }

    if (target.participants.length === 0) {
      alert('정상 작동을 위해 최소 1명 이상의 응모 접수가 완료되어야 추첨 룰이 시연 가능합니다.');
      return;
    }

    const winnerIdx = Math.floor(Math.random() * target.participants.length);
    const winnerName = target.participants[winnerIdx];

    target.winners = [winnerName];
    target.status = 'drawn';
    saveLuckyEvents(evs);
    setLuckyEvents(evs);

    if (winnerName === user.nickname) {
       dispatchNotification('lucky_event_won', `🎊 [대축하!] 대망의 가상 100원 래플 [${target.productName.substring(0, 15)}...] 최종 낙찰자로 지정 완료되었습니다! 즉시 결제를 누르세요!`);
    } else {
       dispatchNotification('ending_soon', `😢 래플 결과 공정 안내: [${target.productName.substring(0, 15)}...] 행운권 추첨 결과 ${winnerName}님이 낙찰 안착되었습니다.`);
    }

    alert(`추첨 시연 결과 발표 완료!\n최종 당첨 콜렉트 행운 닉네임: [${winnerName}]`);
  };

  // Lucky reward claim receipt check
  const handleLuckyClaim = (eventId: string, finalPrice: number) => {
    if (user.coins < finalPrice) {
      alert('보유 중인 모의 샥머니가 부족하여 청구 영수증이 기각되었습니다.');
      return;
    }

    const uState = { ...user };
    uState.coins -= finalPrice;
    saveUser(uState);
    setUser(uState);

    const orders = getOrders();
    const newLuckyOrder: OrderState = {
      id: `ord-lucky-${Date.now()}`,
      productId: eventId,
      title: '🎁 [LUCKY RYAK] 100원 오피셜 한정판 당첨 경품 수령',
      image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?w=600&auto=format&fit=crop&q=80',
      buyerId: user.id,
      buyerNickname: user.nickname,
      sellerNickname: '샥 OFFICIAL',
      finalPrice: finalPrice,
      orderType: 'lucky_win',
      paymentStatus: 'paid',
      deliveryStatus: 'preparing',
      createdAt: new Date().toISOString()
    };
    orders.push(newLuckyOrder);
    saveOrders(orders);

    alert('결제 성공! 단돈 100원 모의 샥머니 인월 완료 후, 가송장 패키지가 준비 리스트에 수렴되었습니다.');
    reloadAllData();
  };

  // Safe seller custom product uploading
  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newProdTitle.trim() || !newProdDesc.trim()) {
      alert('모든 애장품 출품 스펙(성상 시나리오 및 제목)을 입력하세요.');
      return;
    }

    const startVal = parseInt(newProdStartPrice);
    const buyNowVal = parseInt(newProdBuyNowPrice);

    if (isNaN(startVal) || startVal <= 0) {
      alert('정상적인 최소 시작 경매 단가를 설정해 주세요.');
      return;
    }

    if (newProdBuyNowPrice && buyNowVal <= startVal) {
      alert('상향식 흥정 경매장 구조 상 즉시낙찰가는 반드시 시작 출품가 대비 높게 설정되어야 합니다.');
      return;
    }

    // Payout account integration
    if (sellPayoutSelectedId === 'new') {
      if (!sellPayoutAccountNum.trim()) {
        alert('정산 계좌번호를 입력해주세요.');
        return;
      }
      const cleanNum = sellPayoutAccountNum.replace(/[- ]/g, '');
      if (!/^[0-9]+$/.test(cleanNum)) {
        alert('계좌번호는 숫자와 하이픈(-)만 허용됩니다.');
        return;
      }
      if (cleanNum.length < 8) {
        alert('올바른 계좌번호를 입력해주세요.');
        return;
      }
      if (!sellPayoutHolder.trim()) {
        alert('정산계좌 예금주명을 입력해주세요.');
        return;
      }

      if (user?.id) {
        try {
          addPayoutAccount(
            user.id,
            sellPayoutBank,
            sellPayoutAccountNum,
            sellPayoutHolder,
            sellPayoutNickname || `${sellPayoutBank} 정산계좌`
          );
        } catch (err: any) {
          alert(err.message || '정산계좌 등록 중 오류가 발생했습니다.');
          return;
        }
      }
    }

    const imageMap: Record<string, string> = {
      toy: 'https://images.unsplash.com/photo-1608889174633-8a9d18c190a5?w=600&auto=format&fit=crop&q=80',
      camera: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&auto=format&fit=crop&q=80',
      lp: 'https://images.unsplash.com/photo-1539628399213-d6aa89c93074?w=600&auto=format&fit=crop&q=80',
      shoes: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      pack: 'https://images.unsplash.com/photo-1627856013091-fed6e4e30025?w=600&auto=format&fit=crop&q=80'
    };

    const newProdItem: Product = {
      id: `prod-custom-${Date.now()}`,
      title: newProdTitle,
      categoryGroup: newProdCategoryGroup,
      categoryName: newProdCategoryName,
      image: imageMap[newProdImagePreset] || imageMap.toy,
      currentPrice: startVal,
      startPrice: startVal,
      buyNowPrice: newProdBuyNowPrice ? buyNowVal : null,
      hasBuyNow: !!newProdBuyNowPrice,
      bidCount: 0,
      likeCount: 0,
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + parseInt(newProdHours) * 60 * 60 * 1000).toISOString(),
      auctionType: 'ascending', // Strictly upward bidding
      status: 'live',
      tags: ['수집매니아', '안전입찰', newProdCategoryName],
      description: newProdDesc,
      sellerNickname: user.nickname,
      sellerId: user.id || 'usr-928',
      sellerRating: 5.0
    };

    const prods = getProducts();
    prods.unshift(newProdItem);
    saveProducts(prods);
    setProducts(prods);

    setNewProdTitle('');
    setNewProdDesc('');
    setSellModalOpen(false);

    dispatchNotification('product_sold', `✨ 애장품 출품 승인: 나의 애중 보물 [${newProdTitle.substring(0, 10)}...] 경매장에 전면 기명 등록되었습니다!`);
    alert('출품에 성공하였습니다! 메인 아클란스 경매 보드에서 실시간 입찰 레이딩 확인이 가능합니다.');
  };

  const handleAddNewProductFromForm = (newProduct: Partial<Product>) => {
    const fullProduct: Product = {
      id: `prod-user-custom-${Date.now()}`,
      title: newProduct.title || '',
      categoryGroup: newProduct.categoryGroup || 'POP',
      categoryName: newProduct.categoryName || '',
      image: newProduct.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      description: newProduct.description || '',
      condition: newProduct.condition as any || '상태우수',
      startPrice: Number(newProduct.startPrice) || 1000,
      currentPrice: Number(newProduct.startPrice) || 1000,
      minBidIncrement: Number(newProduct.minBidIncrement) || 100,
      buyNowPrice: newProduct.buyNowPrice ? Number(newProduct.buyNowPrice) : null,
      hasBuyNow: !!newProduct.buyNowPrice,
      bidCount: 0,
      likeCount: 0,
      startAt: newProduct.startAt || new Date().toISOString(),
      endAt: newProduct.endAt || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      auctionType: 'ascending',
      status: 'live',
      tags: newProduct.tags || [],
      sellerNickname: user?.nickname || '샤커 콜렉터',
      sellerId: user?.id || 'usr-928',
      sellerRating: 5.0,
      isUserListed: true,
      createdAt: new Date().toISOString()
    } as Product;

    const prods = getProducts();
    prods.unshift(fullProduct);
    saveProducts(prods);
    setProducts(prods);

    dispatchNotification('product_sold', `✨ 애장품 출품 승인: 나의 소중한 애장품 [${fullProduct.title.substring(0, 15)}...] 경매장에 등록되었습니다!`);
    alert('출품이 완료되었습니다! 🦈');
    
    // Redirect to the newly added product's category group and set the filter
    setCurrentView(fullProduct.categoryGroup);
    setSelectedSubCategory(fullProduct.categoryName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Virtual wallet setting helper
  const handleModifyCoins = (amount: number) => {
    const nextCoins = updateCoins(amount);
    const u = { ...user };
    u.coins = nextCoins;
    setUser(u);
    alert(`${amount > 0 ? '가상 입금' : '가상 출금'} 완료! 샥 지갑 현 잔액: ${(nextCoins ?? 0).toLocaleString()}원`);
  };

  // Package delivery processings
  const handleShipOrder = (orderId: string) => {
    const orders = getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return;

    orders[idx].deliveryStatus = 'shipping';
    saveOrders(orders);
    reloadAllData();
    alert('오피셜 운송장 트래킹 부여 및 배송 중 상태로 이전 완료!');
  };

  const handleConfirmReceived = (orderId: string) => {
    const orders = getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return;

    orders[idx].deliveryStatus = 'delivered';
    orders[idx].paymentStatus = 'paid';
    saveOrders(orders);

    reloadAllData();
    alert('성공적으로 수령 승인이 완료되었습니다! 소장가 정산 대금이 셀러 계좌에 이간되었습니다.');
  };

  const menuSectionScroll = (sectionId: string, filterValue?: string) => {
    if (filterValue !== undefined) {
      setActiveFilter(filterValue);
    }
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleMarkAllNotificationsAsRead = () => {
    const notifs = notifications.map(n => ({ ...n, isRead: true }));
    localStorage.setItem('shock_notifications_unreads', JSON.stringify(notifs));
    setNotifications(notifs);
    alert('모든 보관함 메시지가 읽음 상태 일괄 해제 처리되었습니다.');
  };

  const handleNotificationClick = (notif: any) => {
    // 0. Normalize on the fly for legacy notifications
    let tType = notif.targetType;
    let tTab = notif.targetTab;
    let tId = notif.targetId;

    if ((notif.message && notif.message.includes('배송정보를 입력해주세요')) || 
        notif.type === 'sale_paid' || 
        notif.type === 'seller_payment_completed') {
      tType = 'order';
      tTab = 'sales';
      if (!tId && user) {
        // Find latest order where sellerId is current user and status is preparing
        const myOrders = getOrders().filter(o => o.sellerId === user.id && o.paymentStatus === 'paid' && o.deliveryStatus === 'preparing');
        if (myOrders.length > 0) {
          tId = myOrders[myOrders.length - 1].id;
        }
      }
    } else if (notif.type === 'auto_paid' && notif.message && notif.message.includes('낙찰과 자동결제가 완료되었습니다')) {
      tType = 'order';
      tTab = 'purchases';
    }

    // Mark as read
    if (!notif.isRead) {
      const notifs = notifications.map(n => n.id === notif.id ? { ...n, isRead: true } : n);
      localStorage.setItem('shock_notifications_unreads', JSON.stringify(notifs));
      setNotifications(notifs);
    }
    
    setNotificationsModalOpen(false);

    if (tType === 'order') {
      const tab = tTab || 'purchases';
      setMyPageInitialTab(tab);
      setMyPageTargetOrderId(tId);
      setCurrentView('mypage');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (tType === 'product' && tId) {
      setSelectedProductId(tId);
      setPreviousView(currentView);
      setCurrentView('product_detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Default: go to notifications tab if specified
    if (tType === 'mypage') {
      setMyPageInitialTab(tTab || 'notifications');
      setCurrentView('mypage');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between selection:bg-sky-50/20 selection:text-sky-850">
      
      {/* 5-Menu Sticky Navigation Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        userCoins={user ? user.coins : 0}
        userNickname={user ? user.nickname : ''}
        userRole={userRole}
        setUserRole={setUserRole}
        onOpenSellModal={() => setSellModalOpen(true)}
        onOpenMyPageModal={() => {
          if (!isLoggedIn) {
            alert('마이페이지를 이용하시려면 로그인이 필요합니다. 로그인 페이지로 이동합니다.');
            setCurrentView('login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          setMyPageInitialTab(undefined);
          setCurrentView('mypage');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenNotificationsModal={() => setNotificationsModalOpen(true)}
        onOpenLikesModal={() => setLikesModalOpen(true)}
        unreadNotificationsCount={notifications.filter(n => !n.isRead).length}
        currentView={currentView}
        setCurrentView={setCurrentView as any}
        onNavigateToCategoryPage={handleNavigateToCategoryPage}
        onNavigateToListProduct={() => {
          if (!isLoggedIn) {
            alert('애장품을 출품하시려면 로그인이 필요합니다. 로그인 페이지로 이동합니다.');
            setCurrentView('login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
          }
          setCurrentView('list_product');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isLoggedIn={isLoggedIn}
        onNavigateToLogin={() => {
          setCurrentView('login');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigateToSignup={() => {
          setCurrentView('signup');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={handleLogout}
      />

      {currentView === 'login' ? (
        <LoginPage
          onBackToMain={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToSignup={() => {
            setCurrentView('signup');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : currentView === 'signup' ? (
        <SignupPage
          onBackToMain={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToLogin={() => {
            setCurrentView('login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSignupSuccess={handleSignupSuccess}
        />
      ) : currentView === 'checkout' ? (
        <CheckoutPage
          productId={checkoutProductId}
          price={checkoutPrice}
          currentUserId={user ? user.id : ''}
          currentUserNickname={user ? user.nickname : ''}
          onBackToMain={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onSuccess={() => {
            reloadAllData();
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToMyPage={(tab, targetOrderId) => {
            reloadAllData();
            setMyPageInitialTab(tab as any);
            setMyPageTargetOrderId(targetOrderId);
            setCurrentView('mypage');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'list_product' ? (
        <ListProductPage
          onAddProduct={handleAddNewProductFromForm}
          onBackToMain={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          user={user}
        />
      ) : currentView === 'community' ? (
        <CommunityPage
          currentUserNickname={user.nickname}
          initialTab={communityInitialTab}
          onEnterRoom={(id) => {
            if (!isLoggedIn) {
              alert('소모임 및 채팅 참여를 위해 로그인이 필요합니다. 로그인 페이지로 이동합니다.');
              setCurrentView('login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              return;
            }
            if (user && user.id) {
              joinMeetupRoom(user.id, id);
            }
            setActiveChatRoomId(id);
            setCurrentView('chat_room');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onBackToMain={() => {
            setCurrentView('main');
            setCommunityInitialTab('board');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'communityDetail' && selectedPostId ? (
        <CommunityDetailPage
          postId={selectedPostId}
          posts={posts}
          currentUserNickname={user?.nickname || ''}
          onBack={() => {
            setCurrentView('community');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'chat_room' ? (
        <ChatRoomPage
          roomId={activeChatRoomId}
          currentUserId={user?.id}
          currentUserNickname={user.nickname}
          onBackToCommunity={() => {
            setCommunityInitialTab('meetup');
            setCurrentView('community');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToProductDetail={handleNavigateToProductDetail}
        />
      ) : currentView === 'event' ? (
        <EventPage
          events={luckyEvents}
          userAppliedIds={user.joinedLuckyEvents}
          onApply={handleLuckyApply}
          onDraw={handleLuckyDraw}
          currentUserNickname={user.nickname}
          userRole={userRole}
          onBackToMain={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'notice' ? (
        <NoticePage
          notices={notices}
          onSelectNotice={(notice) => setSelectedNotice(notice)}
          onBackToMain={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'faq' ? (
        <FAQPage
          onBack={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'inquiry' ? (
        <InquiryPage
          currentUser={user}
          onBack={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'report' ? (
        <ReportPage
          currentUser={user}
          onBack={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'ranking' ? (
        <RankingPage
          products={products}
          likedProductIds={user ? user.likes : []}
          onToggleLike={handleToggleLike}
          onProductClick={handleNavigateToProductDetail}
          onBackToMain={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'market_trend' ? (
        <MarketTrendPage
          products={products}
          onBackToMain={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onProductClick={handleNavigateToProductDetail}
        />
      ) : currentView === 'product_detail' && selectedProductId ? (
        <ProductDetailPage
          productId={selectedProductId}
          currentUser={user}
          onBack={() => {
            setCurrentView((previousView as any) || 'main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onRequireLogin={() => {
            alert('이 호가 경매에 입찰하거나 즉시낙찰을 성사시키려면 회원 로그인이 필요합니다. 로그인 화면으로 이동합니다.');
            setPreviousView('product_detail');
            setCurrentView('login');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToCheckout={(productId, price) => {
            setCheckoutProductId(productId);
            setCheckoutPrice(price);
            setPreviousView('product_detail');
            setCurrentView('checkout');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onToggleLike={handleToggleLike}
          likedProductIds={user ? user.likes : []}
          onRefreshData={reloadAllData}
        />
      ) : currentView === 'mypage' ? (
        <MyPage
          user={user}
          products={products}
          orders={getOrders()}
          bids={getBids()}
          notifications={notifications}
          initialTab={myPageInitialTab}
          targetOrderId={myPageTargetOrderId}
          onBackToMain={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onToggleLike={handleToggleLike}
          onShipOrder={handleShipOrder}
          onConfirmReceived={handleConfirmReceived}
          onMarkAllNotificationsAsRead={handleMarkAllNotificationsAsRead}
          onNotificationClick={handleNotificationClick}
          onRefreshData={reloadAllData}
          onNavigateToProductDetail={(id) => {
            setSelectedProductId(id);
            setPreviousView('mypage');
            setCurrentView('product_detail');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onEnterMeetupRoom={(roomId) => {
            if (!isLoggedIn) {
              alert('소모임 및 채팅 참여를 위해 로그인이 필요합니다. 로그인 페이지로 이동합니다.');
              setCurrentView('login');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              return;
            }
            if (user && user.id) {
              joinMeetupRoom(user.id, roomId);
            }
            setActiveChatRoomId(roomId);
            setCurrentView('chat_room');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onNavigateToCommunityMeetups={() => {
            setCommunityInitialTab('meetup');
            setCurrentView('community');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />
      ) : currentView === 'auction_list' ? (
        <AuctionListPage
          products={products}
          likedProductIds={user?.likes || []}
          onToggleLike={handleToggleLike}
          onBidClick={handleBidClick}
          onBuyNowClick={handleBuyNowClick}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          initialTab={auctionListTab}
          onBackToMain={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onProductClick={handleNavigateToProductDetail}
        />
      ) : currentView === 'main' ? (
        <>
          {/* Main Banner Slider Carousel */}
          <HeroBanner onScrollToSection={menuSectionScroll} />

          {/* 15 circular interactive category shortcut menus */}
          <CategoryIconGrid onNavigateToCategoryPage={handleNavigateToCategoryPage} />

          {/* Real-Time Recommended Showcase Bento Grid */}
          <RecommendAuction
            products={products}
            likedProductIds={user?.likes || []}
            onToggleLike={handleToggleLike}
            onBidClick={handleBidClick}
            onBuyNowClick={handleBuyNowClick}
            onProductClick={handleNavigateToProductDetail}
          />

          {/* Main Auctions Search Board Container with Snipe Counter */}
          <DeadlineAuction
            products={products}
            likedProductIds={user?.likes || []}
            onToggleLike={handleToggleLike}
            onBidClick={handleBidClick}
            onBuyNowClick={handleBuyNowClick}
            onViewMore={(tab) => {
              setAuctionListTab(tab || 'all');
              setCurrentView('auction_list');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onProductClick={handleNavigateToProductDetail}
          />

          {/* 100-Won Official Lucky draws Events wrapper */}
          <EventSection
            events={luckyEvents}
            onApply={handleLuckyApply}
            onDraw={handleLuckyDraw}
            onClaim={handleLuckyClaim}
            currentUserId={user?.id || ''}
            currentUserNickname={user?.nickname || ''}
            userRole={userRole}
            userAppliedIds={user?.joinedLuckyEvents || []}
            onViewAll={() => {
              setCurrentView('event');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />

          {/* 3-Group Aesthetic Category Boards */}
          <CategorySection 
            onSelectCategory={(name) => {
              if (name.startsWith('all_group:')) {
                setActiveFilter(name);
              } else {
                setActiveFilter(`category:${name}`);
              }
              const target = document.querySelector('#deadline-section');
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
            onNavigateToCategoryPage={(group, subCat) => {
              handleNavigateToCategoryPage(group, subCat);
            }}
            activeFilter={activeFilter}
          />

          {/* Friendly Community Plaza and Official Broadcasts */}
          <CommunitySection
            posts={posts}
            notices={notices}
            onSelectPost={(post) => {
              if (post && post.id) {
                setSelectedPostId(post.id);
                setCurrentView('communityDetail');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            onSelectNotice={(notice) => setSelectedNotice(notice)}
            onViewAll={() => {
              setCommunityInitialTab('board');
              setCurrentView('community');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onViewAllMeetups={() => {
              setCommunityInitialTab('meetup');
              setCurrentView('community');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onEnterMeetupRoom={(roomId) => {
              if (!isLoggedIn) {
                alert('소모임 및 채팅 참여를 위해 로그인이 필요합니다. 로그인 페이지로 이동합니다.');
                setCurrentView('login');
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
              }
              if (user && user.id) {
                joinMeetupRoom(user.id, roomId);
              }
              setActiveChatRoomId(roomId);
              setCurrentView('chat_room');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </>
      ) : (
        <CategoryPage
          group={currentView as 'POP' | 'SPORTS' | 'ANALOG'}
          products={products}
          likedProductIds={user?.likes || []}
          onToggleLike={handleToggleLike}
          onBidClick={handleBidClick}
          onBuyNowClick={handleBuyNowClick}
          initialSub={selectedSubCategory}
          onBackToMain={() => {
            setCurrentView('main');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          onProductClick={handleNavigateToProductDetail}
        />
      )}

      {/* Elegant minimalist Human Food footer */}
      <footer className="w-full bg-slate-900 border-t border-slate-850 py-12 px-4 md:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h4 className="font-display font-black text-2xl tracking-tight text-white mb-1">
              SHOCK
            </h4>
            <p className="text-[11px] text-slate-400">C2C 취향 애장품 및 수집 명예품 전용 상향식 중고 경매 거래 플랫폼</p>
            <p className="text-[10px] text-slate-500 mt-2 font-semibold">© 2026 SHOCK Tech Inc. 모든 안전결제 모의 에스크로는 LocalStorage 암호화 처리됩니다.</p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-5 text-[11px] text-slate-350">
            <a href="#recommendation-bento" className="hover:text-white transition-colors">이용 가이드률</a>
            <span className="text-slate-700 select-none">•</span>
            <a href="#deadline-section" className="hover:text-white transition-colors">경매 최고가 흥정제</a>
            <span className="text-slate-700 select-none">•</span>
            <a href="#event-section" className="hover:text-white transition-colors">100원 오피셜 래플</a>
            <span className="text-slate-700 select-none">•</span>
            <button 
              onClick={handleResetData} 
              className="hover:text-white cursor-pointer underline text-sky-400 font-bold"
            >
              시스템 일괄 리셋
            </button>
          </div>
        </div>
      </footer>


      {/* ========================================================================= */}
      {/* 1. Modal Dialog - Upward Bidding Input Sheet */}
      <Modal
        isOpen={activeBidProduct !== null}
        onClose={() => setActiveBidProduct(null)}
        title="📈 애장품 경매 최고 호가 입찰 대기열"
        size="md"
      >
        {activeBidProduct && (
          <div className="space-y-5">
            <div className="flex gap-4 p-4 bg-sky-50 border border-sky-100 rounded-xl">
              <ProductImage 
                src={activeBidProduct.image} 
                alt="" 
                categoryGroup={activeBidProduct.categoryGroup}
                categoryName={activeBidProduct.categoryName}
                className="h-16 w-16 object-cover rounded-lg border border-slate-100/60 flex-shrink-0"
              />
              <div className="text-left">
                <span className="inline-block text-[9px] text-sky-600 font-bold bg-sky-100 px-2 py-0.5 rounded-sm uppercase font-mono tracking-wide mb-1">
                  {activeBidProduct.categoryName}
                </span>
                <h4 className="font-sans font-bold text-slate-900 text-sm line-clamp-1">{activeBidProduct.title}</h4>
                <p className="text-xs text-slate-500 mt-1">
                  현재 최고 입찰 호가: <strong className="text-slate-950 font-mono text-xs">{(activeBidProduct.currentPrice ?? 0).toLocaleString()}원</strong>
                </p>
              </div>
            </div>

            <div className="space-y-2 text-left">
              <label className="block text-xs font-bold text-slate-700">나의 입찰 응찰가 수동 세팅 (KRW)</label>
              <div className="relative">
                <input 
                  type="number"
                  value={bidAmountInput}
                  onChange={(e) => setBidAmountInput(e.target.value)}
                  className="w-full bg-slate-50 border border-sky-150 rounded-xl py-3 px-4 font-mono font-bold text-slate-900 text-base focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-100"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-xs font-bold">원</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-sans">
                ⚠️ 최소 입찰 가능 단가는 수집 규칙 기준 <strong className="text-sky-600">{((activeBidProduct.currentPrice ?? 0) + 10000).toLocaleString() }원</strong> 이상입니다. (1만 원 이상 상향) 출품자와 동일 계정 입찰은 자동 보류 통제됩니다.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setActiveBidProduct(null)}
                className="cursor-pointer flex-1 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 py-3 rounded-xl transition-all"
              >
                입찰 중지 및 복귀
              </button>
              
              <button
                onClick={handleConfirmBid}
                className="cursor-pointer flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-all"
              >
                최고가 입찰 보강 완료
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* 2. Modal Dialog - Buy Now Payment Validation Sheet */}
      <Modal
        isOpen={activeBuyProduct !== null}
        onClose={() => setActiveBuyProduct(null)}
        title="⚡ 즉시 낙찰체결 및 가상 안전 결제수임"
        size="md"
      >
        {activeBuyProduct && (
          <div className="space-y-5">
            <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-start gap-2.5 text-xs text-rose-700 leading-relaxed">
              <AlertCircle size={15} className="mt-0.5 flex-shrink-0 text-rose-500" />
              <div className="text-left">
                <strong>안심 타결 유의사항:</strong> 즉시구매를 선택하면 최고 입찰가가 바로 종결 즉시 낙찰 승인 처리되며 보유 보유고 샥머니에서 결제 대금이 즉시 전매 징수 수용됩니다.
              </div>
            </div>

            <div className="flex gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <ProductImage 
                src={activeBuyProduct.image} 
                alt="" 
                categoryGroup={activeBuyProduct.categoryGroup}
                categoryName={activeBuyProduct.categoryName}
                className="h-16 w-16 object-cover rounded-lg border border-slate-200 flex-shrink-0"
              />
              <div className="flex-1 text-left">
                <span className="text-[9px] text-sky-600 font-extrabold bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-sm uppercase font-mono">{activeBuyProduct.categoryName}</span>
                <h4 className="font-sans font-bold text-slate-900 text-sm line-clamp-1 mt-1">{activeBuyProduct.title}</h4>
                <div className="flex items-center justify-between mt-2.5">
                  <span className="text-xs text-slate-500 font-medium">안심 즉시 낙찰 타결금액</span>
                  <strong className="text-slate-900 font-mono text-sm">
                    {activeBuyProduct.buyNowPrice?.toLocaleString()}원
                  </strong>
                </div>
              </div>
            </div>

            {/* Money match wallet status card */}
            <div className="p-3.5 bg-sky-50/45 rounded-xl border border-sky-100 text-xs space-y-2 text-left font-sans">
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">내 지갑 가상 샥머니 잔량</span>
                <span className="font-mono text-slate-800 font-bold">{((user && user.coins) ?? 0).toLocaleString()}원</span>
              </div>
              <div className="flex justify-between border-t border-slate-150 pt-2 text-sky-700 font-bold text-xs">
                <span>구매 완료 후 가쇄 예정 잔고</span>
                <span className="font-mono">
                  {(((user && user.coins) ?? 0) - (activeBuyProduct?.buyNowPrice || 0)).toLocaleString()}원
                </span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setActiveBuyProduct(null)}
                className="cursor-pointer flex-1 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 py-3 rounded-xl transition-all"
              >
                낙찰 철회
              </button>
              
              <button
                onClick={handleConfirmBuyNow}
                className="cursor-pointer flex-1 sky-gradient hover:opacity-95 text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-colors"
              >
                ⚡ 즉시 낙찰체결 및 결제완료
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* ========================================================================= */}
      {/* 3. Modal Dialog - Safe Custom Product Uploading */}
      <Modal
        isOpen={sellModalOpen}
        onClose={() => setSellModalOpen(false)}
        title="✨ 나의 보전 애장품 경매 출품 등록 양식"
        size="lg"
      >
        <form onSubmit={handleAddProduct} className="space-y-4 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Essential specifics */}
            <div className="space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs text-slate-600 font-bold">1) 애장품 기명 타이틀 제목</label>
                <input 
                  type="text" 
                  placeholder="예: 라이카 필름카메라 M3 초기형 더블스트로크 완박스"
                  value={newProdTitle}
                  onChange={(e) => setNewProdTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-bold">2) 대분류 카테고리</label>
                  <select
                    value={newProdCategoryGroup}
                    onChange={(e) => {
                      const val = e.target.value as 'POP' | 'SPORTS' | 'ANALOG';
                      setNewProdCategoryGroup(val);
                      const subs = INITIAL_CATEGORIES.filter(c => c.group === val);
                      if (subs.length > 0) {
                        setNewProdCategoryName(subs[0].name);
                      }
                    }}
                    className="w-full bg-slate-55 border border-slate-200 rounded-xl py-2 px-2.5 text-xs text-slate-800 cursor-pointer focus:outline-none"
                  >
                    <option value="POP">POP Culture</option>
                    <option value="SPORTS">SPORTS Collect</option>
                    <option value="ANALOG">ANALOG Vintage</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-bold">3) 세부 카테고리 선택</label>
                  <select
                    value={newProdCategoryName}
                    onChange={(e) => setNewProdCategoryName(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 rounded-xl py-2 px-2.5 text-xs text-slate-800 cursor-pointer focus:outline-none"
                  >
                    {INITIAL_CATEGORIES.filter(c => c.group === newProdCategoryGroup).map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-bold">4) 상품 보존 상태 등급</label>
                  <select
                    value={newProdCondition}
                    onChange={(e) => setNewProdCondition(e.target.value as 'S' | 'A' | 'B')}
                    className="w-full bg-slate-55 border border-slate-200 rounded-xl py-2 px-2.5 text-xs text-slate-800 cursor-pointer focus:outline-none"
                  >
                    <option value="S">S급 (완전 미기스 장식 보존급)</option>
                    <option value="A">A급 (양호한 정취 수집 컨디션)</option>
                    <option value="B">B급 (세월의 풍파 흔적 보임)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-600 font-bold">5) 가상 대표 엠블럼 이미지</label>
                  <select
                    value={newProdImagePreset}
                    onChange={(e) => setNewProdImagePreset(e.target.value)}
                    className="w-full bg-slate-55 border border-slate-200 rounded-xl py-2 px-2.5 text-xs text-slate-800 cursor-pointer focus:outline-none"
                  >
                    <option value="toy">🧸 빈티지 피규어/토이 매칭</option>
                    <option value="camera">📷 클래식 광학 고전 카메라</option>
                    <option value="lp">📻 아카이브 음반/포스트 LP</option>
                    <option value="shoes">👟 한정판 OG 리퀴드 운동화</option>
                    <option value="pack">🃏 포켓몬/유희왕 초판 카드</option>
                  </select>
                </div>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 flex items-center gap-2">
                <Flame size={14} className="text-sky-500" />
                <span className="text-[11px] text-sky-800 font-bold">샥 옥션은 공정한 C2C 상향식 입찰 제도를 채택합니다.</span>
              </div>
            </div>

            {/* Price mapping details */}
            <div className="space-y-3.5 bg-slate-50 p-4 rounded-xl border border-slate-150 self-start">
              <h4 className="text-xs font-bold text-slate-900 pb-1.5 border-b border-slate-200 font-sans">
                📈 상향식 입찰 체결 세부 조건 기재
              </h4>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600">출품 시작 경매가 설정 (원)</label>
                  <input 
                    type="number" 
                    value={newProdStartPrice}
                    onChange={(e) => setNewProdStartPrice(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 font-mono text-slate-900 text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600">⚡ 안심 즉시구매 타결가 (원, 미지정 시 즉시구매 불가)</label>
                  <input 
                    type="number" 
                    value={newProdBuyNowPrice}
                    onChange={(e) => setNewProdBuyNowPrice(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 font-mono text-slate-900 text-xs focus:outline-none focus:border-sky-400"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600">호가 경합 마감 시간 적용</label>
                  <select
                    value={newProdHours}
                    onChange={(e) => setNewProdHours(e.target.value)}
                    className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-slate-800 font-mono text-xs focus:outline-none cursor-pointer"
                  >
                    <option value="1">1시간 (초조 긴급 흥정코너)</option>
                    <option value="3">3시간 마감 코어대기벨트</option>
                    <option value="12">12시간 마감 대장정 레이스</option>
                    <option value="24">24시간 정기 경매 보드</option>
                  </select>
                </div>
              </div>
            </div>

          </div>

          {/* Payout Account setup section in Custom Modal */}
          <div className="space-y-2 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex items-center gap-2">
              <Landmark size={15} className="text-slate-800" />
              <span className="text-xs text-slate-800 font-bold">💰 판매 정산계좌 연동</span>
            </div>
            
            {appPayoutAccounts.length > 0 ? (
              <div className="space-y-2">
                <label className="block text-[11px] text-slate-600 font-bold">정산계좌 선택</label>
                <select
                  value={sellPayoutSelectedId}
                  onChange={(e) => setSellPayoutSelectedId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs text-slate-800 focus:outline-none"
                >
                  {appPayoutAccounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.bankName} - {acc.accountNumber} ({acc.accountHolder}) {acc.nickname ? `[${acc.nickname}]` : ''}
                    </option>
                  ))}
                  <option value="new">➕ 새 정산계좌 추가</option>
                </select>
              </div>
            ) : null}

            {(appPayoutAccounts.length === 0 || sellPayoutSelectedId === 'new') && (
              <div className="space-y-2.5 pt-2 border-t border-slate-150">
                <p className="text-[10px] text-slate-500 font-bold">새 정산계좌 세부 정보 기재</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-600">은행명</label>
                    <select
                      value={sellPayoutBank}
                      onChange={(e) => setSellPayoutBank(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2 text-xs text-slate-800 focus:outline-none"
                    >
                      {['국민은행', '신한은행', '우리은행', '하나은행', 'IBK기업은행', 'NH농협은행', '카카오뱅크', '토스뱅크', '새마을금고', '우체국'].map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-[10px] text-slate-600">예금주</label>
                    <input
                      type="text"
                      placeholder="홍길동"
                      value={sellPayoutHolder}
                      onChange={(e) => setSellPayoutHolder(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="block text-[10px] text-slate-600">계좌번호 (하이픈 포함)</label>
                    <input
                      type="text"
                      placeholder="123-456-789012"
                      value={sellPayoutAccountNum}
                      onChange={(e) => setSellPayoutAccountNum(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 font-mono text-xs focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="block text-[10px] text-slate-600">계좌 별칭 (선택)</label>
                    <input
                      type="text"
                      placeholder="주거래 계좌"
                      value={sellPayoutNickname}
                      onChange={(e) => setSellPayoutNickname(e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg py-1.5 px-2.5 text-xs focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs text-slate-600 font-bold">6) 보정 및 수집 스토리 설명</label>
            <textarea
              rows={4}
              placeholder="예: 100% 무변색에 클로즈 아웃 처리된 극미 원장 보물입니다. 방진 가습 데스크에서 조심스럽게 꺼내 에어 마사지 가죽 파우치에 넣어 안전히 송부드립니다."
              value={newProdDesc}
              onChange={(e) => setNewProdDesc(e.target.value)}
              className="w-full bg-slate-50 border border-slate-150 rounded-xl py-2 px-3 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-sky-400"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex gap-3">
            <button
              type="button"
              onClick={() => setSellModalOpen(false)}
              className="cursor-pointer flex-1 bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 py-3 rounded-xl transition-all"
            >
              출품 양식 포기
            </button>
            <button
              type="submit"
              className="cursor-pointer flex-1 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs py-3 rounded-xl shadow-xs transition-all animate-pulse"
            >
              ✨ 샥 애장품 정식 출품 승인하기
            </button>
          </div>
        </form>
      </Modal>

      {/* ========================================================================= */}
      {/* 5. Modal Dialog - Notifications Center */}
      <Modal
        isOpen={notificationsModalOpen}
        onClose={() => setNotificationsModalOpen(false)}
        title="🔔 샥 알림 센터"
        size="md"
      >
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <p className="text-xs text-slate-550">읽지 않은 알림 <strong className="text-sky-650 font-mono font-bold">{notifications.filter(n => !n.isRead).length}</strong>개 대기 중</p>
            
            <button 
              onClick={handleMarkAllNotificationsAsRead}
              className="cursor-pointer text-[10px] font-extrabold text-sky-600 hover:text-sky-800 font-sans"
            >
              모두 읽음 처리
            </button>
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  onClick={() => handleNotificationClick(notif)}
                  className={`p-3.5 rounded-xl text-xs border transition-all cursor-pointer ${
                    notif.isRead 
                      ? 'bg-slate-50/70 border-slate-100 text-slate-400 hover:bg-slate-100' 
                      : 'bg-sky-50/45 border-sky-150 text-slate-800 font-medium hover:bg-sky-100'
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[9px] font-bold font-mono px-1.5 py-0.5 rounded-sm ${
                      notif.type === 'bid_success' ? 'bg-sky-100 text-sky-700' :
                      notif.type === 'outbid' ? 'bg-rose-100 text-rose-750' :
                      'bg-indigo-100 text-indigo-700'
                    }`}>
                      {notif.type.toUpperCase()}
                    </span>
                    <span className="text-[9px] text-slate-400 font-mono">{notif.createdAt.split('T')[1].substring(0, 5)}</span>
                  </div>
                  <p className="font-sans leading-relaxed text-left">{notif.message}</p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-450 text-center py-10 font-bold">메시지함이 조용합니다.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-right">
            <button
              onClick={() => setNotificationsModalOpen(false)}
              className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 px-5 py-2 rounded-xl"
            >
              닫기
            </button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 6. Modal Dialog - Wishlists Box */}
      <Modal
        isOpen={likesModalOpen}
        onClose={() => setLikesModalOpen(false)}
        title="❤️ 내 가슴 속에 찜한 소목록"
        size="md"
      >
        <div className="space-y-4 text-left">
          <p className="text-xs text-slate-500 font-sans">수집가 경매 보드 중 당신이 하트를 클릭해 담아둔 위시리스트입니다.</p>

          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
            {user && user.likes && user.likes.length > 0 ? (
              products.filter(p => user.likes.includes(p.id)).map((item) => (
                <div 
                  key={item.id}
                  onClick={() => {
                    setLikesModalOpen(false);
                    const target = document.querySelector('#deadline-section');
                    if (target) {
                      target.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                  }}
                  className="p-3 bg-slate-50 hover:bg-sky-50/40 border border-slate-150 hover:border-sky-300 rounded-xl text-xs flex gap-3 items-center cursor-pointer group shadow-3xs transition-all"
                >
                  <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border border-slate-200">
                    <ProductImage src={item.image} alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-sans font-bold text-slate-800 group-hover:text-sky-600 transition-colors line-clamp-1">{item.title}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-mono">현재가: {(item.currentPrice ?? 0).toLocaleString()}원 / 실시간 입찰: {item.bidCount}회</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleLike(item.id);
                    }}
                    className="p-1 px-2 text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                    title="찜 즉각 삭제"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-450 text-xs font-bold bg-slate-50 rounded-xl border border-dashed border-slate-200">
                💡 보물함이 공란입니다. 관심 가는 수집 카드 하트에 영예를 전하세요!
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 text-right">
            <button
              onClick={() => setLikesModalOpen(false)}
              className="cursor-pointer bg-slate-150 hover:bg-slate-200 text-slate-700 text-xs font-bold px-4 py-2 rounded-xl"
            >
              닫기
            </button>
          </div>
        </div>
      </Modal>

      {/* ========================================================================= */}
      {/* 8. Modal Dialog - Notice detailed info */}
      <Modal
        isOpen={selectedNotice !== null}
        onClose={() => setSelectedNotice(null)}
        title="📢 샥 공식 안내 공지문"
        size="md"
      >
        {selectedNotice && (
          <div className="space-y-4 text-left">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs text-slate-400 font-mono font-bold">
              <span className="text-sky-600 uppercase">SYSTEM OFFICAL REPORT</span>
              <span>보도 공표일: {selectedNotice.createdAt}</span>
            </div>

            <h3 className="font-display font-black text-slate-900 text-base">
              {selectedNotice.title}
            </h3>

            <p className="p-4 bg-slate-50 border border-slate-150 rounded-xl text-slate-700 text-xs leading-relaxed font-sans">
              {selectedNotice.content}
            </p>

            <button
              onClick={() => setSelectedNotice(null)}
              className="cursor-pointer w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs"
            >
              공지사항 확인 닫기
            </button>
          </div>
        )}
      </Modal>

      <ScrollToTopButton />
    </div>
  );
}
