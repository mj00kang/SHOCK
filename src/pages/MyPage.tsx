import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Heart, Bell, ShoppingBag, Box, Tag, Award, 
  ArrowLeft, Trash2, Clock, CheckCircle2, AlertCircle, 
  Eye, Check, Truck, Sparkles, ChevronRight, Landmark, CreditCard, ShieldCheck, MessageSquare, Plus, CheckCircle, MapPin, Hash
} from 'lucide-react';
import { Product } from '../data/mockData';
import ProductCard from '../components/ProductCard';
import { 
  OrderState, BidRecord, UserState, getBids, getProducts, getOrders, saveOrders,
  getCommunityPosts, saveCommunityPosts, getComments, saveComments, saveProducts, Comment,
  UserCoupon, getCoupons
} from '../utils/storageUtils';
import { getCurrentUser, updateNicknameAndSync } from '../utils/authUtils';
import { 
  getMeetupRooms, 
  getChatMessages, 
  getJoinedMeetupRooms,
  updateMeetupLastVisited,
  MeetupRoom,
  ChatMessage
} from '../utils/meetupGenerator';
import { 
  getPaymentMethods, 
  getPayoutAccounts, 
  getEscrowOrders,
  getEscrowOrdersForUser, 
  deletePaymentMethod, 
  deletePayoutAccount, 
  enterShippingInfo, 
  confirmOrderDelivery,
  buyerConfirmDelivery,
  updateOrderAddress,
  requestRefund,
  processRefund,
  mockMarkAsDelivered,
  EscrowOrder,
  PaymentMethod,
  PayoutAccount,
  setDefaultPaymentMethod,
  setDefaultPayoutAccount,
  SERVICE_FEE_RATE,
  requestPickupOrder,
  markAsPickedUp,
  markAsShipping
} from '../utils/paymentUtils';
import PaymentMethodForm from '../components/PaymentMethodForm';
import PayoutAccountForm from '../components/PayoutAccountForm';
import EscrowStatusCard from '../components/EscrowStatusCard';
import ProductImage from '../components/ProductImage';

// Address & Confirm imports
import { 
  getAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress, 
  Address 
} from '../utils/addressUtils';
import AddressForm from '../components/AddressForm';
import ConfirmModal from '../components/ConfirmModal';

// Modals and dialog overlays
import PostModal from '../components/PostModal';
import PostEditModal from '../components/PostEditModal';
import ProductEditModal from '../components/ProductEditModal';
import ConfirmDialog from '../components/ConfirmDialog';

interface MyPageProps {
  user: UserState;
  products: Product[];
  orders: OrderState[];
  bids: BidRecord[];
  notifications: any[];
  onBackToMain: () => void;
  onToggleLike: (productId: string) => void;
  onShipOrder: (orderId: string) => void;
  onConfirmReceived: (orderId: string) => void;
  onMarkAllNotificationsAsRead: () => void;
  onNotificationClick?: (notif: any) => void;
  onEnterMeetupRoom?: (roomId: string) => void; // For room redirect
  onRefreshData?: () => void;
  onNavigateToProductDetail?: (productId: string) => void;
  onNavigateToCommunityMeetups?: () => void;
  initialTab?: 'bids' | 'favorites' | 'listings' | 'sales' | 'purchases' | 'addresses' | 'payments' | 'payout' | 'meetups' | 'my-community' | 'notifications' | 'coupons';
  targetOrderId?: string;
}

export default function MyPage({
  user,
  products,
  orders,
  bids,
  notifications,
  onBackToMain,
  onToggleLike,
  onShipOrder,
  onConfirmReceived,
  onMarkAllNotificationsAsRead,
  onNotificationClick,
  onEnterMeetupRoom,
  onRefreshData,
  onNavigateToProductDetail,
  onNavigateToCommunityMeetups,
  initialTab,
  targetOrderId
}: MyPageProps) {
  // Tabs expanded
  const [activeTab, setActiveTab] = useState<'bids' | 'favorites' | 'listings' | 'sales' | 'purchases' | 'shippingPayment' | 'meetups' | 'my-community' | 'notifications' | 'coupons'>(
    (initialTab as any) || 'bids'
  );

  useEffect(() => {
    if (initialTab) {
      if (['payments', 'payment_methods', 'addresses', 'payout', 'payout_accounts', 'shippingPayment'].includes(initialTab as string)) {
        setActiveTab('shippingPayment');
      } else if (['meetups', 'my-community', 'communityActivity'].includes(initialTab as string)) {
        setActiveTab('communityActivity');
      } else {
        setActiveTab(initialTab);
      }
    }
  }, [initialTab]);

  const [ticker, setTicker] = useState<number>(Date.now());

  // Address book states
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressFormOpen, setAddressFormOpen] = useState(false);

  // Custom delete confirmation modal states
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalTitle, setConfirmModalTitle] = useState('');
  const [confirmModalMessage, setConfirmModalMessage] = useState('');
  const [deleteType, setDeleteType] = useState<'payment' | 'payout' | 'address' | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Product Edit Modal state
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [isEditProductModalOpen, setIsEditProductModalOpen] = useState(false);

  // Post Edit Modal state
  const [editPost, setEditPost] = useState<any>(null);
  const [isEditPostModalOpen, setIsEditPostModalOpen] = useState(false);

  // Selected post for viewing in PostModal
  const [selectedPostForView, setSelectedPostForView] = useState<any>(null);

  // Confirm dialog state
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState('');
  const [confirmMessage, setConfirmMessage] = useState('');
  const [confirmAction, setConfirmAction] = useState<() => void>(() => {});

  // Comment edit state
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingCommentText, setEditingCommentText] = useState<string>('');

  // Local sync triggers
  const triggerConfirm = (title: string, message: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setIsConfirmOpen(true);
  };

  // Payment/Payout forms triggers inside MyPage
  const [paymentFormOpen, setPaymentFormOpen] = useState(false);
  const [accountFormOpen, setAccountFormOpen] = useState(false);
  const [escrowsList, setEscrowsList] = useState<EscrowOrder[]>([]);
  const [localPaymentMethods, setLocalPaymentMethods] = useState<PaymentMethod[]>([]);
  const [localPayoutAccounts, setLocalPayoutAccounts] = useState<PayoutAccount[]>([]);

  // Delivery carrier/tracking popup triggers per escrow order
  const [shippingInputOrderId, setShippingInputOrderId] = useState<string | null>(null);
  const [shippingCarrier, setShippingCarrier] = useState('CJ대한통운');
  const [shippingTrackingNumber, setShippingTrackingNumber] = useState('');
  const [shippingDispatchDate, setShippingDispatchDate] = useState(() => new Date().toISOString().substring(0, 10));
  const [shippingMemo, setShippingMemo] = useState('');

  // Visitor pickup states (샥 계약택배 방문수거 배송 시스템)
  const [pickupAddress, setPickupAddress] = useState('서울특별시 마포구 독막로 123, 4층 102호');
  const [pickupDate, setPickupDate] = useState(() => {
    const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return tomorrow.toISOString().substring(0, 10);
  });
  const [pickupTimeSlot, setPickupTimeSlot] = useState('오전 09:00~12:00');
  const [pickupMethod, setPickupMethod] = useState('문앞 수거');
  const [packagePhoto, setPackagePhoto] = useState('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=300'); // Pre-packaged box mock
  const [pickupPlacePhoto, setPickupPlacePhoto] = useState('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=300'); // Front door mock

  // actual upload previews
  const [packagePhotoPreview, setPackagePhotoPreview] = useState<string>('');
  const [pickupPlacePhotoPreview, setPickupPlacePhotoPreview] = useState<string>('');

  const packageFileInputRef = useRef<HTMLInputElement>(null);
  const pickupPlaceFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (shippingInputOrderId) {
      setPackagePhotoPreview('');
      setPickupPlacePhotoPreview('');
    }
  }, [shippingInputOrderId]);

  const handlePackagePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPackagePhotoPreview(String(reader.result));
    };
    reader.readAsDataURL(file);
  };

  const handlePickupPlacePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setPickupPlacePhotoPreview(String(reader.result));
    };
    reader.readAsDataURL(file);
  };


  // Loaded joined meetups state
  const [joinedRooms, setJoinedRooms] = useState<{ room: MeetupRoom; lastVisitedAt: string; joinedAt: string; lastMessage?: ChatMessage }[]>([]);

  // Expanded escrow order item
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  useEffect(() => {
    if (targetOrderId) {
      setExpandedOrderId(targetOrderId);
      setTimeout(() => {
        const el = document.getElementById(`order-card-${targetOrderId}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          el.classList.add('ring-2', 'ring-gray-300', 'ring-offset-2');
          setTimeout(() => el.classList.remove('ring-2', 'ring-gray-300', 'ring-offset-2'), 3000);
        }
      }, 300);
    }
  }, [targetOrderId, activeTab]);

  // Refund request modal states
  const [refundRequestOrderId, setRefundRequestOrderId] = useState<string | null>(null);
  const [refundReasonInput, setRefundReasonInput] = useState('');

  // Integrated Order details & Actions
  const [selectedEscrowDetail, setSelectedEscrowDetail] = useState<EscrowOrder | null>(null);
  const [selectedConfirmOrderId, setSelectedConfirmOrderId] = useState<string | null>(null);
  const [isConfirmPurchaseModalOpen, setIsConfirmPurchaseModalOpen] = useState(false);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);
  const [selectedRefundOrderId, setSelectedRefundOrderId] = useState<string | null>(null);
  const [refundReasonType, setRefundReasonType] = useState<string>('');
  const [refundReasonDetail, setRefundReasonDetail] = useState<string>('');
  const [refundValidationError, setRefundValidationError] = useState<string | null>(null);

  // Detail Modal & Receive Confirm Modal
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  
  const [selectedReceiveOrderId, setSelectedReceiveOrderId] = useState<string | null>(null);
  const [isReceiveConfirmOpen, setIsReceiveConfirmOpen] = useState(false);


  // Nickname inline editing states
  const [isEditingNickname, setIsEditingNickname] = useState(false);
  const [editedNickname, setEditedNickname] = useState(user.nickname);

  useEffect(() => {
    setEditedNickname(user.nickname);
  }, [user.nickname]);

  // Address editing inline states
  const [addressEditOrderId, setAddressEditOrderId] = useState<string | null>(null);
  const [editReceiverName, setEditReceiverName] = useState('');
  const [editContactPhone, setEditContactPhone] = useState('');
  const [editPostalCode, setEditPostalCode] = useState('');
  const [editAddress1, setEditAddress1] = useState('');
  const [editAddress2, setEditAddress2] = useState('');
  const [editDeliveryMemo, setEditDeliveryMemo] = useState('');

  // Synchronise local details
  useEffect(() => {
    const timer = setInterval(() => {
      setTicker(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch / Synchronise meetup rooms, payment credentials, and escrow status logs
  // Existing data correction (for delivered product status)
  useEffect(() => {
    let changed = false;
    const currentProducts = getProducts();
    const currentOrders = getOrders();

    currentOrders.forEach(order => {
      if (order.deliveryStatus === 'delivered' || order.orderStatus === 'delivered') {
        const product = currentProducts.find(p => String(p.id) === String(order.productId) || String(p.orderId) === String(order.id));
        if (product && product.deliveryStatus !== 'delivered') {
          product.deliveryStatus = 'delivered';
          (product as any).deliveredAt = (order as any).deliveredAt;
          product.orderId = order.id;
          changed = true;
        }
      }
    });

    if (changed) {
      saveProducts(currentProducts);
      if (onRefreshData) onRefreshData();
    }
  }, [orders, onRefreshData]);

  const loadLocalFinanceAndMeetups = () => {
    if (!user) return;
    
    // 1. Load active Escrows
    setEscrowsList(getEscrowOrdersForUser(user.id));

    // 2. Load methods and bank codes
    setLocalPaymentMethods(getPaymentMethods(user.id));
    setLocalPayoutAccounts(getPayoutAccounts(user.id));

    // 2b. Load saved addresses
    setAddresses(getAddresses(user.id));

    // 3. Gather joined meetup keys
    const joinedMeta = getJoinedMeetupRooms(user.id);
    const allMeetups = getMeetupRooms();
    const resolved = joinedMeta.map(meta => {
      const liveRoom = allMeetups.find(r => r.id === meta.roomId);
      if (liveRoom) {
        const chatMsgs = getChatMessages(liveRoom.id);
        const lastMsg = chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1] : undefined;
        return {
          room: liveRoom,
          lastVisitedAt: meta.lastVisitedAt,
          joinedAt: meta.joinedAt,
          lastMessage: lastMsg
        };
      }
      return null;
    }).filter(Boolean) as { room: MeetupRoom; lastVisitedAt: string; joinedAt: string; lastMessage?: ChatMessage }[];

    setJoinedRooms(resolved);
  };

  useEffect(() => {
    loadLocalFinanceAndMeetups();
  }, [user, activeTab, ticker]);

  // Handle ship action (for EscrowOrders as Seller using visitation pickup)
  const handleSellerShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingInputOrderId) return;

    if (pickupMethod === '편의점 위탁 접수') {
      if (!shippingCarrier) {
        alert('편의점 위탁 접수 시 이용할 택배회사명을 선택해주세요.');
        return;
      }
      if (!shippingTrackingNumber.trim()) {
        alert('편의점 위탁 접수 시 직접 발부받은 운송장번호를 입력해주세요.');
        return;
      }
    } else {
      // Validate photos exist
      if (!packagePhotoPreview || !pickupPlacePhotoPreview) {
        alert('포장 완료 사진과 수거 장소 사진을 모두 등록해주세요.');
        return;
      }
    }

    const finalPackagePhoto = packagePhotoPreview || '';
    const finalPickupPlacePhoto = pickupPlacePhotoPreview || '';

    // Process visitor pickup registration
    requestPickupOrder(
      shippingInputOrderId,
      pickupAddress,
      pickupDate,
      pickupTimeSlot,
      pickupMethod,
      shippingMemo || '',
      finalPackagePhoto,
      finalPickupPlacePhoto,
      pickupMethod === '편의점 위탁 접수' ? shippingCarrier : '샥 계약택배',
      pickupMethod === '편의점 위탁 접수' ? shippingTrackingNumber : undefined
    );
    
    // Also trigger onShipOrder callback wrapper to update legacy app products list
    onShipOrder(shippingInputOrderId);

    setShippingInputOrderId(null);
    setShippingTrackingNumber('');
    setShippingMemo('');
    setShippingDispatchDate(new Date().toISOString().substring(0, 10));
    loadLocalFinanceAndMeetups();
    alert('📦 샥 계약택배 방문수거 배송 수리(신청)가 완료되었습니다!');
  };

  // Handle confirm delivery received (for EscrowOrders as Buyer)
  const handleBuyerConfirmEscrowDelivery = (orderId: string) => {
    if (!window.confirm('상품을 수령하셨나요?\n수령확인을 하면 환불 가능 기간 3일이 시작됩니다. 상품 상태와 구성품을 확인한 뒤 진행해주세요.\n\n수령확인 후 3일 이내에는 환불 요청이 가능하며, 구매확정을 완료하면 판매자에게 정산됩니다.')) {
      return;
    }

    buyerConfirmDelivery(orderId);
    
    // Also trigger legacy state update
    onConfirmReceived(orderId);

    loadLocalFinanceAndMeetups();
    alert('수령확인이 완료되었습니다. 3일 이내에 환불 요청을 진행하실 수 있습니다.');
  };

  const handleConfirmPurchase = (orderId: string) => {
    const confirmedAt = new Date().toISOString();
    
    // Update orders
    const updatedOrders = getOrders().map(order => {
      if (String(order.id) !== String(orderId)) return order;
      return {
        ...order,
        buyerConfirmedAt: confirmedAt,
        orderStatus: "completed" as const,
        deliveryStatus: "confirmed" as const,
        escrowStatus: "released" as const,
        escrowReleasedAt: confirmedAt,
        payoutStatus: "completed",
        refundStatus: order.refundStatus || "none"
      };
    });
    saveOrders(updatedOrders);

    // Update shock_products
    const updatedOrder = updatedOrders.find(o => String(o.id) === String(orderId));
    if (updatedOrder) {
      const updatedProducts = getProducts().map(product => {
        if (String(product.id) !== String(updatedOrder.productId)) return product;
        return {
          ...product,
          deliveryStatus: "confirmed",
          orderStatus: "completed",
          buyerConfirmedAt: confirmedAt,
          completedAt: confirmedAt,
          orderId: updatedOrder.id
        };
      });
      saveProducts(updatedProducts);
    }

    setIsConfirmPurchaseModalOpen(false);
    setSelectedConfirmOrderId(null);

    loadLocalFinanceAndMeetups();
    if (onRefreshData) {
      onRefreshData();
    }
    
    // Force ui refresh
    setTicker(Date.now());
  };

  const handleConfirmReceive = (orderId: string) => {
    if (!window.confirm('상품을 수령하셨나요?\n수령확인을 하면 환불 가능 기간 3일이 시작됩니다. 상품 상태와 구성품을 확인한 뒤 진행해주세요.\n\n수령확인 후 3일 이내에는 환불 요청이 가능하며, 구매확정을 완료하면 판매자에게 정산됩니다.')) return;
    buyerConfirmDelivery(orderId);
    
    // Also trigger legacy state update
    onConfirmReceived(orderId);
    
    loadLocalFinanceAndMeetups();
    if (onRefreshData) {
      onRefreshData();
    }
    const updated = getEscrowOrders().find(o => o.id === orderId);
    if (updated && selectedEscrowDetail && selectedEscrowDetail.id === orderId) {
      setSelectedEscrowDetail(updated);
    }
    alert('상품 수령확인이 완료되었습니다. 3일 이내에 환불을 요청할 수 있으며, 이의가 없을 시 구매확정을 눌러 거래를 종료해주세요.');
  };

  const handleRefundSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRefundOrderId) return;
    if (!refundReasonType) {
      setRefundValidationError('환불 사유를 선택해주세요.');
      return;
    }
    if (!refundReasonDetail.trim()) {
      setRefundValidationError('상세 사유를 입력해주세요.');
      return;
    }
    
    setRefundValidationError(null);
    
    const updatedOrders = getOrders();
    const idx = updatedOrders.findIndex(o => o.id === selectedRefundOrderId);
    if (idx > -1) {
      updatedOrders[idx].refundStatus = "requested";
      updatedOrders[idx].orderStatus = "refund_requested" as any;
      (updatedOrders[idx] as any).refundReason = refundReasonType;
      (updatedOrders[idx] as any).refundDetail = refundReasonDetail.trim();
      (updatedOrders[idx] as any).refundRequestedAt = new Date().toISOString();
      saveOrders(updatedOrders);
      
      const ord = updatedOrders[idx];
      const updatedNotifs = JSON.parse(localStorage.getItem('shock_notifications_unreads') || '[]');
      updatedNotifs.unshift({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        userId: ord.buyerId,
        type: 'refund_request',
        title: '환불 요청이 접수되었습니다.',
        message: `[${ord.productTitle || (ord as any).title || (ord as any).productName}]에 대한 환불 요청이 접수되었습니다.`,
        targetType: 'order',
        targetId: ord.id,
        targetTab: 'purchases',
        read: false,
        createdAt: new Date().toISOString()
      });
      if (ord.sellerId) {
        updatedNotifs.unshift({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
          userId: String(ord.sellerId),
          type: 'refund_request',
          title: '구매자가 환불을 요청했습니다.',
          message: `[${ord.productTitle || (ord as any).title || (ord as any).productName}]에 대한 구매자의 환불 요청이 있습니다.`,
          targetType: 'order',
          targetId: ord.id,
          targetTab: 'sales',
          read: false,
          createdAt: new Date().toISOString()
        });
      }
      localStorage.setItem('shock_notifications_unreads', JSON.stringify(updatedNotifs));
    }
    
    // Sync Escrow orders legacy as well
    requestRefund(selectedRefundOrderId, refundReasonType, refundReasonDetail);
    
    setIsRefundModalOpen(false);
    setSelectedRefundOrderId(null);
    setRefundReasonType('');
    setRefundReasonDetail('');
    
    loadLocalFinanceAndMeetups();
    if (onRefreshData) {
      onRefreshData();
    }
  };

  // Start editing address form
  const handleStartEditAddress = (escrow: EscrowOrder | OrderState) => {
    setAddressEditOrderId(escrow.id);
    setEditReceiverName(escrow.shippingAddress?.receiverName || '');
    setEditContactPhone(escrow.shippingAddress?.phone || '');
    setEditPostalCode(escrow.shippingAddress?.postalCode || '');
    setEditAddress1(escrow.shippingAddress?.address1 || '');
    setEditAddress2(escrow.shippingAddress?.address2 || '');
    setEditDeliveryMemo(escrow.shippingAddress?.deliveryMemo || '');
  };

  // Save edited address
  const handleSaveAddress = (orderId: string) => {
    if (!editReceiverName.trim() || !editContactPhone.trim() || !editPostalCode.trim() || !editAddress1.trim() || !editAddress2.trim()) {
      alert('필수 주소 정보를 모두 입력해 주세요.');
      return;
    }

    const res = updateOrderAddress(orderId, {
      receiverName: editReceiverName.trim(),
      phone: editContactPhone.trim(),
      postalCode: editPostalCode.trim(),
      address1: editAddress1.trim(),
      address2: editAddress2.trim(),
      deliveryMemo: editDeliveryMemo.trim() || undefined
    });

    if (res.success) {
      alert(res.message);
      setAddressEditOrderId(null);
      loadLocalFinanceAndMeetups();
    } else {
      alert(res.message);
    }
  };

  // Request refund
  const handleStartRefundRequest = (orderId: string) => {
    setRefundRequestOrderId(orderId);
    setRefundReasonInput('');
  };

  const handleSubmitRefundRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!refundRequestOrderId) return;
    if (!refundReasonInput.trim()) {
      alert('환불 사유를 정확하게 기입해 주세요.');
      return;
    }

    const res = requestRefund(refundRequestOrderId, refundReasonInput.trim());
    if (res.success) {
      alert(res.message);
      setRefundRequestOrderId(null);
      setRefundReasonInput('');
      loadLocalFinanceAndMeetups();
    } else {
      alert(res.message);
    }
  };

  // Mock Admin: Approve / Reject refund
  const handleProcessAdminRefund = (orderId: string, status: 'approved' | 'rejected') => {
    if (!window.confirm(`환불 요청을 정말로 ${status === 'approved' ? '승인' : '반려'}하시겠습니까?`)) {
      return;
    }
    const res = processRefund(orderId, status);
    alert(res.message);
    loadLocalFinanceAndMeetups();
  };

  // Mock Admin / Courier: mark order as delivered
  const handleMockDeliverOrder = (orderId: string) => {
    if (!window.confirm('테스트용: 상품 배송수령이 완료된 상태로 강제 변경하여 3일 환불 적용 조건을 테스트하시겠습니까?')) {
      return;
    }
    mockMarkAsDelivered(orderId);
    loadLocalFinanceAndMeetups();
    alert('상품 배송이 수령 완료(delivered) 상태로 강제 전환되었습니다. 이제 구매자로 접속해 환불 요청을 테스트할 수 있습니다.');
  };

  // Delete payment method helper
  const handleDeleteMethod = (methodId: string) => {
    setConfirmModalTitle('결제수단 삭제');
    setConfirmModalMessage('이 결제수단을 정말로 삭제하시겠습니까? 해당 정보가 주소록에서 안전하게 영구 일소됩니다.');
    setDeleteType('payment');
    setDeleteTargetId(methodId);
    setIsConfirmModalOpen(true);
  };

  // Delete payout account helper
  const handleDeleteAccount = (accountId: string) => {
    setConfirmModalTitle('정산계좌 삭제');
    setConfirmModalMessage('이 정산계좌를 정말로 삭제하시겠습니까? 정산 입금을 위해 유효한 대체 계좌를 수기 연동해야 합니다.');
    setDeleteType('payout');
    setDeleteTargetId(accountId);
    setIsConfirmModalOpen(true);
  };

  // Delete shipping address helper
  const handleDeleteAddress = (addressId: string) => {
    setConfirmModalTitle('배송지 삭제');
    setConfirmModalMessage('선택하신 배송지 주소를 정말로 삭제하시겠습니까?');
    setDeleteType('address');
    setDeleteTargetId(addressId);
    setIsConfirmModalOpen(true);
  };

  // Format countdown string
  const getCountdownStr = (endAt: string, status?: string) => {
    const end = new Date(endAt).getTime();
    const remainMs = end - ticker;
    
    if (remainMs <= 0 || status === 'sold' || status === 'ended') {
      return '경매 종료';
    }

    const hours = Math.floor(remainMs / (1000 * 60 * 60));
    const mins = Math.floor((remainMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((remainMs % (1000 * 60)) / 1000);

    const pad = (num: number) => num.toString().padStart(2, '0');
    return `${pad(hours)}시간 ${pad(mins)}분 ${pad(secs)}초 남음`;
  };

  // 1) Calc statistics
  const likesCount = (user?.likes || []).length;
  const userBidProductIds = Array.from(new Set(
    bids.filter(b => b && b.bidderId === user?.id).map(b => b.productId)
  ));
  const biddingCount = products.filter(p => p && userBidProductIds.includes(p.id) && p.status === 'live').length;
  const submissionsCount = products.filter(p => p && p.sellerNickname === user?.nickname).length;

  // 2) Data lists
  const userBids = bids.filter(b => b && b.bidderId === user?.id);
  const highestBidMap: Record<string, number> = {};
  userBids.forEach(bid => {
    if (bid && (!highestBidMap[bid.productId] || bid.bidPrice > highestBidMap[bid.productId])) {
      highestBidMap[bid.productId] = bid.bidPrice;
    }
  });

  const biddedProductsList = products.filter(p => p && p.id in highestBidMap);
  const likedProductsList = products.filter(p => p && (user?.likes || []).includes(p.id));
  const submittedProductsList = products.filter(p => {
    if (!p) return false;
    if (p.sellerNickname !== user?.nickname && String(p.sellerId) !== String(user?.id)) return false;

    const relatedOrder = orders.find(order => 
      String(order.productId) === String(p.id) || String(order.id) === String(p.orderId)
    );

    const shouldHideFromListings = relatedOrder && (
      (relatedOrder.deliveryStatus as string) === 'confirmed' ||
      (relatedOrder.orderStatus as string) === 'completed' ||
      (relatedOrder.refundStatus as string) === 'requested' || 
      (relatedOrder.refundStatus as string) === 'refunded' ||
      (relatedOrder.escrowStatus as string) === 'released' ||
      !!relatedOrder.buyerConfirmedAt
    );

    return !shouldHideFromListings;
  });
  const purchasedOrdersList = orders.filter(o => String(o.buyerId) === String(user?.id) || o.buyerNickname === user?.nickname);
  const salesOrdersList = orders.filter(o => 
    (String(o.sellerId) === String(user?.id) || o.sellerNickname === user?.nickname) && 
    (
      !!o.buyerConfirmedAt || 
      (o.deliveryStatus as string) === 'confirmed' || 
      (o.orderStatus as string) === 'completed' || 
      (o.escrowStatus as string) === 'released'
    )
  );

  // Dynamic dashboard stats calculations
  const liveSubmissionsCount = products.filter(p => p && (p.sellerNickname === user?.nickname || String(p.sellerId) === String(user?.id)) && p.status === 'live').length;
  const buyerWonCount = purchasedOrdersList.length;
  const buyerShippingCount = purchasedOrdersList.filter(o => 
    (o.deliveryStatus as string) === 'shipping' || 
    (o.deliveryStatus as string) === 'delivered' || 
    (o.deliveryStatus as string) === 'confirmed'
  ).length;
  const allSellerOrders = orders.filter(o => String(o.sellerId) === String(user?.id) || o.sellerNickname === user?.nickname);
  const salesPendingCount = allSellerOrders.filter(o => 
    !o.buyerConfirmedAt && 
    (o.deliveryStatus as string) !== 'confirmed' && 
    (o.orderStatus as string) !== 'completed'
  ).length;
  const salesCompletedCount = allSellerOrders.filter(o => 
    !!o.buyerConfirmedAt || 
    (o.deliveryStatus as string) === 'confirmed' || 
    (o.orderStatus as string) === 'completed'
  ).length;

  return (
    <div className="bg-white min-h-screen pb-16 selection:bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-6 pt-6">
        
        {/* Navigation Breadcrumb */}
        <div className="hidden">
           {/* Removing the old breadcrumb and '관심수집' for a cleaner look */}
        </div>

        {/* Profile Details header - Black styling like the screenshot */}
        <div className="bg-[#111827] rounded-2xl w-full p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between shadow-sm">
          
          <div className="flex items-center gap-5">
            <div className="h-[72px] w-[72px] rounded-full bg-gray-900 text-white flex items-center justify-center font-display font-black text-2xl border border-gray-700 shrink-0">
              {user.nickname.substring(0, 2).toUpperCase() || 'SH'}
            </div>
            
            <div className="space-y-1.5 text-left">
              <div className="flex items-center gap-2">
                <h2 className="font-display font-black text-2xl text-white">
                  {user.nickname}
                </h2>
                <span className="bg-[#EF4444] text-white font-sans font-bold text-[10px] px-2 py-0.5 rounded-full select-none">
                  VIP 회원
                </span>
              </div>
              <p className="text-[12px] text-gray-400 font-mono">
                회원 고유 식별코드: usr_{user.id.substring(0, 10).padEnd(10, '0')}
              </p>
            </div>
          </div>

        </div>

        {/* Dashboard 2-Column Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* Box 1: 나의 구매 참여 현황 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <span className="text-blue-500">📥</span> 나의 구매 참여 현황 (입찰/낙찰)
              </h3>
              <span className="text-[11px] text-gray-400 font-medium">최근 3개월</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-[11px] text-gray-500 font-bold mb-1">입찰 중</p>
                <p className="text-xl font-display font-black text-gray-900">{biddingCount}건</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-[11px] text-gray-500 font-bold mb-1">낙찰/구매완료</p>
                <p className="text-xl font-display font-black text-gray-900">{buyerWonCount}건</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-[11px] text-gray-500 font-bold mb-1">배송/완료</p>
                <p className="text-xl font-display font-black text-gray-900">{buyerShippingCount}건</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-4">※ 낙찰 및 구매 완료된 상품은 배송 진행 상태에 따라 확인할 수 있습니다.</p>
          </div>

          {/* Box 2: 나의 등록 판매 현황 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                <span className="text-emerald-500">🏷️</span> 나의 등록 판매 현황
              </h3>
              <span className="text-[11px] text-gray-400 font-medium">최근 3개월</span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-[11px] text-gray-500 font-bold mb-1">경매 진행 중</p>
                <p className="text-xl font-display font-black text-gray-900">{liveSubmissionsCount}건</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-[11px] text-gray-500 font-bold mb-1">배송/정산 대기</p>
                <p className="text-xl font-display font-black text-gray-900">{salesPendingCount}건</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-[11px] text-gray-500 font-bold mb-1">판매 완료</p>
                <p className="text-xl font-display font-black text-gray-900">{salesCompletedCount}건</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-400 mt-4">※ 판매 완료된 상품은 배송 및 구매확정 상태에 따라 판매내역에서 확인할 수 있습니다.</p>
          </div>

        </div>

        {/* Tab Selection menu bar - Styled clean and monochrome with perfect flow alignment */}
        <div className="flex flex-wrap items-center justify-start gap-2 border-b border-gray-200 pb-4 pt-6 w-full">
          {([
            { id: 'bids', label: '🔥 내 입찰', count: biddingCount },
            { id: 'favorites', label: '❤️ 찜한 애장품', count: likedProductsList.length },
            { id: 'listings', label: '📦 내 출품', count: liveSubmissionsCount },
            { id: 'coupons', label: '🎟️ 내 쿠폰', count: getCoupons().filter(c => String(c.userId) === String(user.id) && !c.isUsed).length },
            { id: 'sales', label: '📈 판매내역' },
            { id: 'purchases', label: '🏆 낙찰/구매내역' },
            { id: 'shippingPayment', label: '🚚 배송·결제 관리' },
            { id: 'communityActivity', label: '💬 커뮤니티 활동' },
          ] as { id: string; label: string; count?: number }[]).map((tab) => (
            <button
               key={tab.id}
               onClick={() => setActiveTab(tab.id as any)}
               className={`cursor-pointer h-[42px] px-4 rounded-xl font-sans font-bold text-[13px] sm:text-[14px] inline-flex items-center justify-center gap-1.5 whitespace-nowrap box-border transition-all outline-none border shrink-0 ${
                 activeTab === tab.id
                   ? 'bg-[#111827] text-white border-[#111827]'
                   : 'bg-white border-[#E5E7EB] text-[#111827] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
               }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 h-4 min-w-4 inline-flex items-center justify-center text-[9px] font-mono rounded-full font-bold shrink-0 ${tab.count > 0 ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Tab Panes */}
        <div className="text-left pb-10">
          
          {/* TAB 1: 내 입찰 (My Bids) */}
          {activeTab === 'bids' && (
            <div className="space-y-4">
              {biddedProductsList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 select-none space-y-1.5">
                  <p className="font-sans font-bold text-sm">아직 입찰 중인 애장품이 없어요.</p>
                  <p className="text-xs">실시간 입찰 호가 레이스에 참가하여 영롱한 레어 컬렉션을 차지하세요!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-1">
                  {biddedProductsList.map((product) => {
                    const myBidVal = highestBidMap[product.id] || 0;
                    const isWinning = product.currentPrice === myBidVal && product.status === 'live';
                    const hasEnded = product.status !== 'live' || new Date(product.endAt).getTime() <= ticker;

                    let statusTagColor = 'bg-emerald-50 text-emerald-700 border-emerald-250';
                    let statusLabel = '최고가 입찰 중 👑';

                    if (hasEnded) {
                      statusTagColor = 'bg-gray-100 text-gray-500 border-gray-200';
                      statusLabel = '경매 종료 ⛔';
                    } else if (!isWinning) {
                      statusTagColor = 'bg-rose-50 text-rose-700 border-rose-200';
                      statusLabel = '상위 경합 발생 ⚠️';
                    }

                    return (
                      <div key={product.id} className="bg-white rounded-2xl border border-gray-200 p-4.5 flex gap-4 shadow-sm items-center justify-between">
                        <div 
                          onClick={() => onNavigateToProductDetail?.(product.id)}
                          className="cursor-pointer hover:opacity-90 flex gap-4 items-center flex-1 min-w-0"
                        >
                          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100">
                            <ProductImage src={product.image} alt="" className="h-full w-full object-cover" />
                          </div>
                          <div className="space-y-1.5 min-w-0 flex-1 text-left">
                            <h4 className="font-sans font-bold text-sm text-gray-900 line-clamp-1">{product.title}</h4>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                              <span className="text-gray-500 font-medium">현재가: <strong className="text-gray-900 font-mono font-extrabold">{(product.currentPrice ?? 0).toLocaleString()}원</strong></span>
                              <span className="text-gray-400">|</span>
                              <span className="text-gray-500 font-medium">내 입찰가: <strong className="text-gray-900 font-mono font-black">{(myBidVal ?? 0).toLocaleString()}원</strong></span>
                            </div>
                            <div className="flex items-center gap-1 text-[11px] text-slate-450 font-medium">
                              <Clock size={11} className="text-gray-400" />
                              <span>{getCountdownStr(product.endAt, product.status)}</span>
                            </div>
                          </div>
                        </div>

                        <div>
                          <span className={`text-[10px] font-sans font-black px-2.5 py-1 rounded-md border ${statusTagColor}`}>
                            {statusLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 찜한 애장품 (Liked products) */}
          {activeTab === 'favorites' && (
            <div className="space-y-4">
              {likedProductsList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 select-none space-y-1.5">
                  <p className="font-sans font-bold text-sm">찜한 애장품이 없습니다.</p>
                  <p className="text-xs">관심 있는 수집품 카드 상단 하트를 눌러 여기에 킵해둘 수 있으십니다.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[480px] overflow-y-auto pr-1">
                  {likedProductsList.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onBidClick={() => {}} // Not needed in list view according to new design
                      onBuyNowClick={() => {}}
                      onToggleLike={onToggleLike}
                      isLiked={true}
                      onProductClick={(prod) => onNavigateToProductDetail?.(prod.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 내 출품 (My Submissions) */}
          {activeTab === 'listings' && (
            <div className="space-y-4">
              {submittedProductsList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 select-none space-y-1.5">
                  <p className="font-sans font-bold text-sm">아직 출품한 애장품이 없습니다.</p>
                  <p className="text-xs">상단 [애장품 출품하기] 버튼을 통해 평생 모아온 수집품 경매를 개장해 보세요!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[480px] overflow-y-auto pr-1">
                  {submittedProductsList.map((product) => {
                    const hasEnded = product.status !== 'live' || new Date(product.endAt).getTime() <= ticker;
                    const isSold = product.status === 'sold';
                    const isCancelled = product.status === 'cancelled';
                    
                    let statusLabel = '경매 진행 중 ⚡';
                    let statusTagColor = 'bg-gray-100 text-gray-900 border-gray-200';

                    if (isSold) {
                      statusLabel = '낙찰 및 주문완료 🏆';
                      statusTagColor = 'bg-rose-50 text-rose-700 border-rose-200';
                    } else if (isCancelled) {
                      statusLabel = '경매 취소됨';
                      statusTagColor = 'bg-rose-100 text-rose-600 border-rose-200';
                    } else if (hasEnded) {
                      statusLabel = '경매 종료';
                      statusTagColor = 'bg-gray-100 text-gray-600 border-gray-200';
                    }

                    // Matching trade orders
                    const isSeller =
                      product.sellerId === user?.id ||
                      String(product.sellerId) === String(user?.id);

                    const relatedOrder = orders.find(order => 
                      (order.productId === product.id || String(order.productId) === String(product.id) || order.id === product.orderId || String(order.id) === String(product.orderId))
                    );

                    // Force the button to show up based on relatedOrder since seller might not explicitly match if legacy,
                    if (relatedOrder && (!relatedOrder.sellerId || relatedOrder.sellerId === 'seller-admin' || relatedOrder.sellerId !== product.sellerId)) {
                      relatedOrder.sellerId = product.sellerId;
                      relatedOrder.sellerNickname = product.sellerNickname;
                      if (!relatedOrder.productTitle && !(relatedOrder as any).title) (relatedOrder as any).productTitle = product.title;
                      saveOrders(orders);
                    }

                    // Fix missing fields on matching order
                    if (relatedOrder && relatedOrder.paymentStatus === "paid" && !relatedOrder.trackingNumber && (!relatedOrder.deliveryStatus || relatedOrder.deliveryStatus === "preparing")) {
                      relatedOrder.escrowStatus = relatedOrder.escrowStatus || "holding";
                      relatedOrder.deliveryStatus = "preparing";
                      relatedOrder.orderStatus = "paid";
                      saveOrders(orders);
                    }

                    const canEnterTracking =
                      relatedOrder &&
                      (String(relatedOrder.sellerId) === String(user?.id) || isSeller) &&
                      relatedOrder.paymentStatus === "paid" &&
                      (relatedOrder.escrowStatus === "holding" || !relatedOrder.escrowStatus) &&
                      (relatedOrder.deliveryStatus === "preparing" || !relatedOrder.deliveryStatus) &&
                      !relatedOrder.trackingNumber;

                    return (
                      <div key={product.id} className="bg-white rounded-2xl border border-gray-200 p-4.5 flex flex-col gap-3 shadow-sm justify-between text-left">
                        <div className="flex gap-4 items-center justify-between">
                          <div className="flex gap-4 items-center">
                            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100">
                              <ProductImage src={product.image} alt="" className="h-full w-full object-cover" />
                            </div>
                            <div className="space-y-1 text-left">
                              <h4 className="font-sans font-bold text-sm text-gray-900 line-clamp-1">{product.title}</h4>
                              <p className="text-xs font-medium text-slate-450">{product.categoryGroup} / {product.categoryName}</p>
                              <div className="flex flex-wrap items-center gap-x-3 text-xs">
                                <span className="text-gray-500 font-medium">체결희망가: <strong className="text-slate-850 font-mono font-extrabold">{(product.currentPrice ?? 0).toLocaleString()}원</strong></span>
                              </div>
                            </div>
                          </div>
                          
                          <span className={`text-[10px] font-sans font-black px-2 py-0.5 rounded-md border shrink-0 ${statusTagColor}`}>
                            {statusLabel}
                          </span>
                        </div>

                        {relatedOrder && (
                          <div className="p-3.5 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between flex-wrap gap-2 text-xs">
                            <div className="space-y-1">
                              <p className="text-[12px] text-gray-400 font-medium">최종 낙찰 수집가: <strong className="text-gray-900 font-bold">[{relatedOrder.buyerNickname}]</strong></p>
                              {(!relatedOrder.deliveryStatus || relatedOrder.deliveryStatus === 'preparing') && relatedOrder.paymentStatus === 'paid' && !relatedOrder.trackingNumber && (
                                <div className="mt-1 space-y-1.5">
                                  <p className="text-[12px] text-gray-900 font-medium font-sans">
                                    구매자 결제가 완료되었습니다. 배송 또는 수거 정보를 등록해주세요.
                                  </p>
                                </div>
                              )}
                              {relatedOrder.deliveryStatus === 'shipping' && relatedOrder.trackingNumber && (
                                <div className="mt-1 text-[12px] text-gray-600">
                                  <p className="font-bold">발송 정보: {relatedOrder.courier} ({relatedOrder.trackingNumber})</p>
                                  <p className="text-gray-400">발송일: {relatedOrder.shippedAt?.substring(0,10)}</p>
                                </div>
                              )}
                            </div>
                            
                            <div className={canEnterTracking ? "order-status-action compact ml-auto mt-2 sm:mt-0" : "flex flex-col gap-1 items-end ml-auto mt-2 sm:mt-0"}>
                              {canEnterTracking ? (
                                <>
                                  <div className="order-status-chip-row">
                                    <span className="order-status-chip bg-gray-100 border border-gray-200 text-gray-900">
                                      결제 완료
                                    </span>
                                    <span className="order-status-chip bg-gray-100 border border-gray-200 text-gray-600">
                                      배송대기
                                    </span>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setShippingInputOrderId(relatedOrder.id)}
                                    className="order-action-button-compact cursor-pointer bg-gray-900 hover:bg-gray-800 text-white transition-colors"
                                  >
                                    배송정보 등록
                                  </button>
                                </>
                              ) : relatedOrder.deliveryStatus === 'shipping' && relatedOrder.trackingNumber ? (
                                <span className="text-gray-600 font-black text-[10px] bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-md">
                                  배송중
                                </span>
                              ) : null}
                            </div>
                          </div>
                        )}

                        {/* Action buttons list */}
                        <div className="flex gap-2 justify-end pt-2 border-t border-gray-100 mt-2 flex-wrap">
                          <button
                            onClick={() => onNavigateToProductDetail?.(product.id)}
                            className="cursor-pointer px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 rounded-lg text-[10px] font-extrabold transition-all"
                          >
                            상세 보기
                          </button>
                          
                          {product.status !== 'sold' && product.status !== 'cancelled' && (
                            <>
                              <button
                                onClick={() => {
                                  triggerConfirm(
                                    '데모 구매 완료 처리',
                                    `[${product.title}]을 가상의 즉시구매자(정밀수집덕후)가 실제 구매 완료한 상태로 강제 전환하시겠습니까?\n\n이 작업이 완료되면 즉시 '운송장 정보 입력' 및 '배송 관리' 등 후속 정산과 배송 운송 시뮬레이션 테스트가 활성화됩니다.`,
                                    () => {
                                      const storedProducts = getProducts();
                                      const storedOrders = getOrders();
                                      
                                      const targetPrice = product.buyNowPrice || product.currentPrice || product.startPrice || 100000;
                                      
                                      // Update product status
                                      const updatedProducts = storedProducts.map(p => {
                                        if (p.id === product.id) {
                                          return {
                                            ...p,
                                            status: 'sold' as any,
                                            currentPrice: targetPrice,
                                            bidCount: (p.bidCount || 0) + 1
                                          };
                                        }
                                        return p;
                                      });
                                      
                                      // Create matching Paid Order
                                      const newOrder: OrderState = {
                                        id: `order-demo-${Date.now()}`,
                                        productId: product.id,
                                        productTitle: product.title,
                                        productImage: product.image,
                                        buyerId: 'user-demo-collector',
                                        buyerNickname: '정밀수집덕후',
                                        sellerId: product.sellerId || user?.id || 'seller_current',
                                        sellerNickname: product.sellerNickname || user?.nickname || '판매자',
                                        finalPrice: targetPrice,
                                        orderType: 'buy_now',
                                        paymentStatus: 'paid',
                                        escrowStatus: 'holding',
                                        deliveryStatus: 'preparing',
                                        orderStatus: 'paid',
                                        itemPrice: targetPrice,
                                        serviceFee: Math.round(targetPrice * 0.05),
                                        shippingFee: 3000,
                                        totalPaymentAmount: targetPrice + 3000,
                                        createdAt: new Date().toISOString(),
                                        paidAt: new Date().toISOString()
                                      };
                                      
                                      storedOrders.unshift(newOrder);
                                      
                                      saveProducts(updatedProducts);
                                      saveOrders(storedOrders);
                                      
                                      alert(`💡 데모 구매 완료가 무사히 성사되었습니다!\n- 가상 구매자: 정밀수집덕후\n- 거래 체결가: ${targetPrice.toLocaleString()}원\n\n이제 목록의 [배송정보 등록] 버튼을 통해 발송 흐름을 계속 테스트해 보세요!`);
                                      onRefreshData?.();
                                    }
                                  );
                                }}
                                className="cursor-pointer px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[10px] font-extrabold transition-all"
                              >
                                ⚡ 데모 구매 처리
                              </button>

                              <button
                                onClick={() => {
                                  setEditProduct(product);
                                  setIsEditProductModalOpen(true);
                                }}
                                className="cursor-pointer px-3 py-1.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-[10px] font-extrabold transition-all"
                              >
                                수정
                              </button>
                              
                              <button
                                onClick={() => {
                                  const bidCount = product.bidCount || 0;
                                  if (bidCount === 0) {
                                    triggerConfirm(
                                      '출품 삭제 확인',
                                      `[${product.title}]의 출품을 완전히 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`,
                                      () => {
                                        const updated = getProducts().filter(p => p.id !== product.id);
                                        localStorage.setItem('shock_products_v2', JSON.stringify(updated));
                                        alert('출품이 완전히 삭제되었습니다.');
                                        onRefreshData?.();
                                      }
                                    );
                                  } else {
                                    triggerConfirm(
                                      '경매 취소 확인',
                                      `현재 입찰자(${bidCount}명)가 있는 상품입니다. 완전히 삭제하는 대신 '경매 취소' 처리하시겠습니까?`,
                                      () => {
                                        const updated = getProducts().map(p => p.id === product.id ? { ...p, status: 'cancelled' as any } : p);
                                        localStorage.setItem('shock_products_v2', JSON.stringify(updated));
                                        alert('입찰자가 존재하므로 완전 삭제 대신 [경매 취소] 처리로 전환하였습니다.');
                                        onRefreshData?.();
                                      }
                                    );
                                  }
                                }}
                                className="cursor-pointer px-3 py-1.5 bg-red-500 hover:bg-rose-600 text-white rounded-lg text-[10px] font-extrabold transition-all"
                              >
                                {product.bidCount > 0 ? '경매 취소' : '삭제'}
                              </button>
                            </>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: 내 쿠폰 (My Coupons) */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                <h3 className="font-sans font-black text-slate-900 text-base">내 보유 쿠폰</h3>
                <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full font-bold">
                  총 {getCoupons().filter(c => String(c.userId) === String(user.id) && !c.isUsed).length}장 사용 가능
                </span>
              </div>
              
              {getCoupons().filter(c => String(c.userId) === String(user.id)).length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 select-none space-y-1.5">
                  <p className="font-sans font-bold text-sm">보유 중인 쿠폰이 없습니다.</p>
                  <p className="text-xs">첫 거래 낙찰 및 이벤트 참여를 통해 특별 혜택 쿠폰을 받아보세요!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {getCoupons()
                    .filter(c => String(c.userId) === String(user.id))
                    .sort((a, b) => {
                      // Show unused coupons first
                      if (a.isUsed && !b.isUsed) return 1;
                      if (!a.isUsed && b.isUsed) return -1;
                      return new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime();
                    })
                    .map((coupon) => (
                      <div 
                        key={coupon.id} 
                        className={`relative overflow-hidden bg-white rounded-2xl border transition-all p-5 flex justify-between items-center ${
                          coupon.isUsed 
                            ? 'border-gray-100 bg-gray-50/50 text-gray-400 opacity-60' 
                            : 'border-slate-205 shadow-sm hover:shadow'
                        }`}
                      >
                        {/* Decorative side ticket notches */}
                        <div className="absolute top-1/2 -translate-y-1/2 -left-3 w-6 h-6 rounded-full bg-gray-50 border-r border-[#CBD5E1]" />
                        <div className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 rounded-full bg-gray-50 border-l border-[#CBD5E1]" />
                        
                        <div className="pl-4 pr-2 space-y-2">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            coupon.isUsed 
                              ? 'bg-gray-100 text-gray-400' 
                              : coupon.type === 'shipping' 
                                ? 'bg-blue-50 text-blue-600' 
                                : 'bg-red-50 text-red-600'
                          }`}>
                            {coupon.type === 'shipping' ? '배송비무료' : '할인쿠폰'}
                          </span>
                          <h4 className="font-sans font-black text-sm text-gray-900 leading-tight">
                            {coupon.name}
                          </h4>
                          <p className="text-[11px] text-gray-500 font-sans">
                            {coupon.description}
                          </p>
                          <div className="font-sans text-[11px] flex gap-2.5 text-gray-400 mt-1">
                            <span>최소주문금액: <strong className="font-mono text-gray-700 font-bold">{coupon.minOrderAmount.toLocaleString()}원</strong></span>
                            <span>•</span>
                            <span>만료일: <strong className="font-mono text-gray-700 font-bold">{new Date(coupon.expiresAt).toLocaleDateString()}</strong></span>
                          </div>
                        </div>
                        
                        <div className="text-right pr-4 flex-shrink-0 flex flex-col justify-center items-end border-l border-dashed border-gray-200 pl-4 h-full">
                          <span className={`font-mono font-black text-lg ${coupon.isUsed ? 'text-gray-400' : 'text-gray-900'}`}>
                            {coupon.type === 'shipping' ? '배송비 무료' : `-${coupon.discountAmount.toLocaleString()}원`}
                          </span>
                          <span className="text-[10px] font-bold text-gray-400/80 uppercase tracking-wider mt-1">
                            {coupon.isUsed ? '사용완료' : '사용가능'}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3.5: 판매 내역 (My sales) */}
          {activeTab === 'sales' && (
            <div className="space-y-6">
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[19px] px-[21px] py-[19px] text-left text-[#334155]">
                <p className="text-[14px] font-sans leading-relaxed">
                  💡 <strong className="text-[14px]">안전 결제 판매 안내:</strong><br />
                  <span className="text-[13px] text-[#475569] mt-1 block leading-[1.5]">
                    - 구매자가 결제를 완료하면 <strong>배송정보</strong>를 입력해야 합니다.<br />
                    - 구매자가 <strong>구매확정</strong>을 완료한 뒤 정산됩니다.
                  </span>
                </p>
              </div>

              {salesOrdersList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 select-none space-y-1.5">
                  <p className="font-sans font-bold text-sm">아직 판매 완료된 주문이 없습니다.</p>
                  <p className="text-xs">출품한 상품이 판매되면 이곳에서 확인할 수 있습니다.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[480px] overflow-y-auto pr-1">
                  {salesOrdersList.map((order) => {
                    const isBuyer = false;
                    const isExpanded = expandedOrderId === order.id;
                    const isEditingAddress = addressEditOrderId === order.id;
                    const itemImg = order.productImage || order.image;
                    const itemName = order.productTitle || order.title;
                    const finalPrice = order.totalPaymentAmount || order.finalPrice || order.itemPrice || 0;
                    
                    const isConfirmed = !!order.buyerConfirmedAt || order.deliveryStatus === 'confirmed' || order.orderStatus === 'completed' || order.escrowStatus === 'released';
                    const isDelivered = isConfirmed || order.deliveryStatus === 'delivered';
                    const itemPriceVal = order.itemPrice || order.finalPrice || 0;
                    const serviceFeeVal = order.serviceFee || Math.round(itemPriceVal * SERVICE_FEE_RATE);
                    const shippingFeeVal = order.shippingFee ?? 3000;
                    const totalPaymentVal = order.totalPaymentAmount || (itemPriceVal + serviceFeeVal + shippingFeeVal);
                    
                    return (
                      <div id={`order-card-${order.id}`} key={order.id} className="bg-white border border-[#E5E7EB] rounded-[25px] p-[20px] md:p-[26px] shadow-[0_8px_24px_rgba(15,23,42,0.05)] text-left relative overflow-hidden order-card hover:border-gray-300 transition-all">
                        {/* 1단 Left Column: Product & Type Details */}
                        <div className="flex gap-4 items-start min-w-0">
                          <img
                            src={itemImg}
                            alt=""
                            className="w-[95px] h-[95px] shrink-0 object-cover rounded-[19px] border border-gray-200 bg-[#F3F4F6] pointer-events-none"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {order.orderType === 'instant_deal' ? (
                                <span className="bg-[#F8FAFC] text-gray-900 border border-gray-200 text-[11px] font-black px-2 py-0.5 rounded-md">
                                  ⚡ 즉시낙찰
                                </span>
                              ) : (
                                <span className="bg-[#F8FAFC] text-gray-650 border border-gray-150 text-[11px] font-black px-2 py-0.5 rounded-md">
                                  🏆 경매낙찰
                                </span>
                              )}
                              
                              <span className="text-[12px] font-mono font-bold text-slate-400">
                                No. {order.id.split('-').pop()}
                              </span>
                            </div>
                            
                            <h4 
                              onClick={() => onNavigateToProductDetail?.(order.productId)}
                              className="cursor-pointer hover:underline font-sans font-black text-[18px] text-[#111827] leading-[1.35] line-clamp-2"
                            >
                              {itemName}
                            </h4>
                            <div className="text-[13px] text-[#64748B] space-y-0.5 mt-1.5">
                              <p>
                                구매 낙찰자: <strong className="text-gray-900 font-bold">{order.buyerNickname}</strong>
                              </p>
                              <p>
                                안전 결제일: {order.paidAt ? order.paidAt.split('T')[0] : order.createdAt.split('T')[0]}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 2단 Center Column: Price Details & Shipping Address */}
                        <div className="flex flex-col gap-3 min-w-0 w-full">
                          <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[18px] p-[16px_18px] w-[250px] min-w-[240px] shrink-0 order-payment-summary">
                            <p className="text-[14px] font-extrabold text-[#111827] uppercase tracking-wider mb-2 order-payment-summary-title">
                              결제 내역 상세
                            </p>
                            <div className="space-y-[7px]">
                              <div className="flex justify-between items-center text-[13px] order-payment-row">
                                <span className="text-[#64748B]">상품금액:</span>
                                <span className="font-mono text-[#111827] font-semibold">{itemPriceVal.toLocaleString()}원</span>
                              </div>
                              <div className="flex justify-between items-center text-[13px] order-payment-row">
                                <span className="text-[#64748B]">수수료 (3%):</span>
                                <span className="font-mono text-[#111827]">{serviceFeeVal.toLocaleString()}원</span>
                              </div>
                              <div className="flex justify-between items-center text-[13px] order-payment-row">
                                <span className="text-[#64748B]">배송비:</span>
                                <span className="font-mono text-[#111827]">{shippingFeeVal.toLocaleString()}원</span>
                              </div>
                              <div className="flex justify-between items-center text-[#111827] pt-2 border-t border-[#E5E7EB] mt-2 order-payment-total">
                                <span className="font-extrabold">최종 결제금액:</span>
                                <span className="font-mono text-[18px] font-black">{totalPaymentVal.toLocaleString()}원</span>
                              </div>
                            </div>
                          </div>


                        </div>

                        {/* 3단 Right Column: Status Icons & User Decisions */}
                        <div className="flex flex-col gap-4 w-full h-full justify-between order-status-actions">
                          <div>
                            {/* Badges Stack */}
                            <div className="flex flex-nowrap items-center gap-[6px] mb-3 whitespace-nowrap overflow-visible select-none status-badge-row">
                              {order.paymentStatus === 'paid' && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 text-[11px] font-extrabold px-[9px] py-[5px] status-badge">
                                  💳 결제 완료
                                </span>
                              )}
                              
                              {order.escrowStatus === 'holding' && !isConfirmed && (
                                <span className="bg-blue-50 text-blue-700 border border-blue-150 text-[11px] font-extrabold px-[9px] py-[5px] status-badge">
                                  🛡️ 에스크로 보관중
                                </span>
                              )}
                              
                              {order.refundStatus === 'requested' ? (
                                <span className="bg-[#FFF1F2] text-[#E11D48] border border-[#FDA4AF] text-[11px] font-extrabold px-[9px] py-[5px] status-badge">
                                  ⚠️ 환불요청 접수
                                </span>
                              ) : (
                                <span className={`text-[11px] font-extrabold px-[9px] py-[5px] border ${
                                  (order.deliveryStatus as any) === 'preparing' || !order.deliveryStatus ? 'bg-gray-100 text-gray-600 border-gray-200 delivery-preparing' :
                                  (order.deliveryStatus as any) === 'pickup_requested' ? 'bg-sky-50 text-sky-700 border-sky-150 animate-pulse' :
                                  (order.deliveryStatus as any) === 'pickup_ready' ? 'bg-indigo-50 text-indigo-700 border-indigo-150 animate-pulse' :
                                  (order.deliveryStatus as any) === 'picked_up' ? 'bg-violet-50 text-violet-700 border-violet-150' :
                                  (order.deliveryStatus as any) === 'shipping' ? 'bg-[#FFFBEB] text-[#D97706] border-[#FCD34D] animate-pulse font-sans' :
                                  (order.deliveryStatus as any) === 'delivered' ? 'bg-teal-50 text-teal-700 border-teal-150' :
                                  'bg-slate-900 text-white border border-slate-900'
                                } status-badge`}>
                                  {(order.deliveryStatus as any) === 'preparing' || !order.deliveryStatus ? '📦 배송 준비중' :
                                   (order.deliveryStatus as any) === 'pickup_requested' ? '📩 수거신청 완료' :
                                   (order.deliveryStatus as any) === 'pickup_ready' ? '⏳ 수거대기' :
                                   (order.deliveryStatus as any) === 'picked_up' ? '🚚 수거완료' :
                                   (order.deliveryStatus as any) === 'shipping' ? '🚚 배송중' :
                                   (order.deliveryStatus as any) === 'delivered' ? '📬 수령완료' :
                                   '✅ 구매확정 완료'}
                                </span>
                              )}
                            </div>
                            
                            {order.refundStatus === 'requested' ? (
                              <div className="p-2.5 bg-[#FFF2F2] border border-[#FDA4AF] rounded-[12px] space-y-1 text-left text-[12px] text-[#B91C1C] leading-[1.45]">
                                <p className="font-extrabold text-[#B91C1C]">구매자가 환불을 요청했습니다.</p>
                                <p className="text-[11px] text-rose-700 font-semibold">• 사유: {order.refundReason || (order as any).refundReasonType}</p>
                                <p className="text-[11px] text-[#92400E]">• 상세: {order.refundDetail}</p>
                                <p className="text-[10px] text-gray-500 select-all font-mono">• 요청일: {(order as any).refundRequestedAt?.replace('T', ' ').substring(0, 16)}</p>
                              </div>
                            ) : isConfirmed ? (
                              <div className="p-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[12px] space-y-1 text-left text-[12px] text-[#475569]">
                                <p className="font-extrabold text-gray-900">구매확정이 완료되어 정산이 진행되었습니다.</p>
                                <div className="text-[11px] text-gray-500 mt-2 space-y-0.5">
                                  <p>• 정산상태: 정산 완료</p>
                                  <p>• 정산일: {order.buyerConfirmedAt ? new Date(order.buyerConfirmedAt).toLocaleDateString() : '정산완료'}</p>
                                </div>
                              </div>
                            ) : (
                              <div className="text-[12px] text-gray-500 space-y-1.5 pt-1 text-left">
                                {(order.deliveryStatus === 'preparing' || !order.deliveryStatus) && (
                                  <p className="text-[12px] text-gray-700 font-medium">방문수거 신청 전 배송 준비 상태입니다.</p>
                                )}
                                {(order.deliveryStatus as any) === 'pickup_requested' && (
                                  <div className="bg-sky-50/70 p-2.5 rounded-xl border border-sky-100 text-[11px] text-sky-800 space-y-1">
                                    <p className="font-extrabold text-sky-900">📩 계약 택배사 수거 대기 중입니다.</p>
                                    <p>• 수거희망일: {(order as any).pickupDate || '접수 중'} ({(order as any).pickupTimeSlot || '시간 미지정'})</p>
                                    <p>• 수거방식: {(order as any).pickupMethod || '문앞 수거'}</p>
                                    <p className="truncate">• 수거지: {(order as any).pickupAddress || '등록된 주소'}</p>
                                    {(order as any).shippingMemo && <p className="truncate">• 수거메모: {(order as any).shippingMemo}</p>}
                                    <div className="flex gap-4 mt-2.5 pt-2 border-t border-sky-100/50">
                                      { (order as any).packagePhoto && (
                                        <div className="flex flex-col items-center select-none text-center">
                                          <span className="text-[9px] text-sky-600 mb-1 font-semibold">📦 포장 완료</span>
                                          <img 
                                            src={(order as any).packagePhoto} 
                                            className="w-[56px] h-[56px] object-cover rounded-[10px] border border-sky-200 shadow-sm" 
                                            referrerPolicy="no-referrer" 
                                          />
                                        </div>
                                      )}
                                      { (order as any).pickupPlacePhoto && (
                                        <div className="flex flex-col items-center select-none text-center">
                                          <span className="text-[9px] text-sky-600 mb-1 font-semibold">🏠 수거 장소</span>
                                          <img 
                                            src={(order as any).pickupPlacePhoto} 
                                            className="w-[56px] h-[56px] object-cover rounded-[10px] border border-sky-200 shadow-sm" 
                                            referrerPolicy="no-referrer" 
                                          />
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                                {(order.deliveryStatus as any) === 'pickup_ready' && (
                                  <div className="bg-indigo-50/70 p-2.5 rounded-xl border border-indigo-100 text-[11px] text-indigo-800 space-y-0.5">
                                    <p className="font-extrabold text-indigo-900">⏳ 선택한 수거 장소에 상품을 준비해주세요.</p>
                                    <p>• 택배기사 방문 예정일: {(order as any).pickupDate} ({(order as any).pickupTimeSlot})</p>
                                    <p className="truncate">• 수거지: {(order as any).pickupAddress}</p>
                                  </div>
                                )}
                                {(order.deliveryStatus as any) === 'picked_up' && (
                                  <div className="bg-violet-50/70 p-2.5 rounded-xl border border-violet-100 text-[11px] text-violet-800 space-y-1">
                                    <p className="font-extrabold text-violet-900">🚚 택배사가 상품을 수거 완료했습니다.</p>
                                    <p>• 수거 일시: { (order as any).pickedUpAt ? new Date((order as any).pickedUpAt).toLocaleString() : '방금 전' }</p>
                                    <p>• 부여된 운송장: <span className="font-mono font-bold text-gray-900 select-all">{order.trackingNumber}</span> ({(order as any).carrier || '샥 계약택배'})</p>
                                  </div>
                                )}
                                {(order.deliveryStatus as any) === 'shipping' && (
                                  <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-100 text-[11px] text-amber-800">
                                    <p className="font-semibold text-amber-900">🚚 구매자에게 안전 결제 상품이 배송 중입니다.</p>
                                    <p>• 발송일시: {order.shippedAt ? new Date(order.shippedAt).toLocaleString() : '방금 전'}</p>
                                    <p>• 운송장번호: <span className="font-mono font-bold text-gray-900 select-all">{order.trackingNumber}</span> ({(order as any).courier || (order as any).carrier || '샥 계약택배'})</p>
                                  </div>
                                )}
                                {order.deliveryStatus === 'delivered' && (
                                  <p className="text-teal-700 font-medium">📬 구매자가 온오프라인 상품 수령을 최종 확인했습니다.</p>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex flex-col gap-2 w-full mt-auto">
                            {order.paymentStatus === 'paid' && order.escrowStatus === 'holding' && (!order.deliveryStatus || order.deliveryStatus === 'preparing') && !order.trackingNumber && (
                              <button
                                onClick={() => setShippingInputOrderId(order.id)}
                                className="cursor-pointer h-[36px] bg-[#111827] hover:bg-[#1f2937] border border-[#111827] text-white font-sans font-extrabold text-[13px] px-[14px] rounded-full inline-flex items-center justify-center gap-[6px] transition-all w-full animate-bounce"
                              >
                                📦 방문수거 신청
                              </button>
                            )}

                            {((order as any).deliveryStatus) === 'pickup_requested' && (
                              <div className="space-y-1 text-left bg-slate-50 border border-slate-150 p-2 rounded-xl">
                                <span className="block text-[9px] text-center text-slate-400 font-extrabold">※ MVP 시연용 샥 계약 기사 제어기</span>
                                <button
                                  onClick={() => {
                                    markAsPickedUp(order.id);
                                    loadLocalFinanceAndMeetups();
                                    alert('🚚 [Mock] 택배사 수거 완료 처리되었습니다.\n(실제 서비스에서는 기사님이 현장 방문해 포장 QR스캔하는 순간 자동으로 수거 완료로 즉시 전환됩니다)');
                                  }}
                                  className="cursor-pointer h-[32px] bg-violet-600 hover:bg-violet-700 text-white font-sans font-bold text-[12px] px-[12px] rounded-lg inline-flex items-center justify-center gap-1 w-full"
                                >
                                  🚚 택배사 수거 완료 처리 [Mock]
                                </button>
                              </div>
                            )}

                            {((order as any).deliveryStatus) === 'picked_up' && (
                              <div className="space-y-1 text-left bg-slate-50 border border-slate-150 p-2 rounded-xl">
                                <span className="block text-[9px] text-center text-slate-400 font-extrabold">※ MVP 시연용 샥 택배 허브 제어기</span>
                                <button
                                  onClick={() => {
                                    markAsShipping(order.id);
                                    loadLocalFinanceAndMeetups();
                                    alert('📦 [Mock] 허브 발송을 완료해 배송중 상태로 전환했습니다!');
                                  }}
                                  className="cursor-pointer h-[32px] bg-amber-500 hover:bg-amber-600 text-white font-sans font-bold text-[12px] px-[12px] rounded-lg inline-flex items-center justify-center gap-1 w-full"
                                >
                                  📦 배송중으로 전환 [Mock]
                                </button>
                              </div>
                            )}

                            {((order as any).deliveryStatus) === 'shipping' && !isConfirmed && (
                               <div className="flex flex-col gap-1 text-left w-full p-2.5 bg-[#F8FAFC] rounded-[12px] border border-[#E5E7EB]" style={{ fontFamily: 'Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif' }}>
                                 <p className="font-extrabold text-[#111827] text-[13px]">🚚 배송 정보</p>
                                 <p className="text-[13px] text-gray-900 font-bold" style={{ wordBreak: 'keep-all', overflowWrap: 'anywhere', lineHeight: '1.45', fontFamily: 'Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif' }}>
                                   {(order as any).courier || (order as any).carrier || '샥 계약택배'} : {order.trackingNumber}
                                 </p>
                                 {order.shippedAt && <p className="text-[11px] text-gray-500 font-normal">발송일시: {order.shippedAt?.replace('T', ' ').substring(0, 16)}</p>}
                               </div>
                            )}

                            {order.deliveryStatus === 'delivered' && !isConfirmed && order.refundStatus !== 'requested' && (
                              <div className="flex flex-col gap-1 text-left w-full p-[10px_12px] bg-[#FEF2F2] rounded-[12px] border border-[#FDA4AF] text-[12px] text-[#B91C1C]">
                                <p className="font-extrabold">수령완료 및 환불 가능 기간</p>
                                <p className="font-mono text-[11px]">수령일시: {(order as any).deliveredAt?.replace('T', ' ').substring(0, 16)}</p>
                                <p className="font-mono font-bold text-[11px]">환불 가능 기한: {(order as any).refundAvailableUntil?.replace('T', ' ').substring(0, 16)}까지</p>
                                <p className="text-[10px] text-rose-500 mt-0.5">환불 가능 기간 진행 중</p>
                              </div>
                            )}

                            {isConfirmed && (
                              <button
                                disabled
                                className="cursor-not-allowed h-[36px] bg-[#F1F5F9] border border-[#E2E8F0] text-[#94A3B8] font-sans font-extrabold text-[13px] px-[14px] rounded-full inline-flex items-center justify-center gap-[6px] opacity-100 w-full"
                              >
                                ✅ 판매 정산 완료
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: 낙찰/구매 내역 (My purchases) */}
          {activeTab === 'purchases' && (
            <div className="space-y-6">
              <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[19px] px-[21px] py-[19px] text-left text-[#334155]">
                <p className="text-[14px] font-sans leading-relaxed">
                  💡 <strong className="text-[14px]">안전 결제 및 에스크로 정책 안내:</strong><br />
                  <span className="text-[13px] text-[#475569] mt-1 block leading-[1.5]">
                    - <strong>수령완료 후 3일</strong> 이내에만 환불 요청이 가능합니다.<br />
                    - <strong>구매확정</strong>을 완료하시면 안전 보관 기금이 판매자에게 즉시 송금 정산되며, 이후 단순 변심 및 일반 환불 요청은 기술적으로 제한됩니다.
                  </span>
                </p>
              </div>

              {purchasedOrdersList.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 select-none space-y-1.5">
                  <p className="font-sans font-bold text-sm">낙찰 및 구매한 애장품 내역이 비어 있습니다.</p>
                  <p className="text-xs">원하는 품목의 실시간 입찰 레이스 혹은 즉시낙찰을 성사하면 여기에 표기됩니다!</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6 max-h-[480px] overflow-y-auto pr-1">
                  {purchasedOrdersList.map((ord) => {
                    const itemImg = ord.productImage || ord.image;
                    const itemName = ord.productTitle || ord.title;
                    const itemPriceVal = ord.itemPrice || ord.finalPrice || 0;
                    const serviceFeeVal = ord.serviceFee || Math.round(itemPriceVal * SERVICE_FEE_RATE);
                    const shippingFeeVal = ord.shippingFee ?? 3000;
                    const totalPaymentVal = ord.totalPaymentAmount || (itemPriceVal + serviceFeeVal + shippingFeeVal);
                    
                    const isDelivered = ord.deliveryStatus === 'delivered';
                    const isShipped = ord.deliveryStatus === 'shipping';
                    const isPreparing = ord.deliveryStatus === 'preparing';

                    // Check if within refund period
                    const nowTime = Date.now();
                    const refundValid = ord.refundAvailableUntil ? nowTime <= new Date(ord.refundAvailableUntil).getTime() : false;
                    const isConfirmed = !!ord.buyerConfirmedAt || ord.deliveryStatus === 'confirmed' || ord.orderStatus === 'completed' || ord.escrowStatus === 'released';

                    return (
                      <div id={`order-card-${ord.id}`} key={ord.id} className="bg-white border border-[#E5E7EB] rounded-[22px] p-[20px] md:p-[26px] shadow-[0_8px_24px_rgba(15,23,42,0.05)] text-left relative overflow-hidden order-card hover:border-gray-300 transition-all">
                        {/* 1단 Left Column: Product & Type Details */}
                        <div 
                          onClick={() => onNavigateToProductDetail?.(ord.productId)}
                          className="cursor-pointer hover:opacity-90 flex gap-4 items-start min-w-0"
                        >
                          <div className="w-[88px] h-[88px] shrink-0 overflow-hidden rounded-[16px] border border-gray-200 bg-[#F3F4F6] pointer-events-none">
                            <ProductImage src={itemImg} alt={itemName} className="h-full w-full object-cover" />
                          </div>
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-1.5">
                              {ord.orderType === 'instant_deal' ? (
                                <span className="bg-[#F8FAFC] text-gray-900 border border-gray-200 text-[11px] font-black px-2 py-0.5 rounded-md">
                                  ⚡ 즉시낙찰
                                </span>
                              ) : (
                                <span className="bg-[#F8FAFC] text-gray-650 border border-gray-150 text-[11px] font-black px-2 py-0.5 rounded-md">
                                  🏆 경매낙찰
                                </span>
                              )}
                              
                              <span className="text-[12px] font-mono font-bold text-slate-400">
                                No. {ord.id.split('-').pop() || ord.id}
                              </span>
                            </div>
                            
                            <h4 className="font-sans font-black text-[18px] text-[#111827] leading-[1.35] line-clamp-2">
                              {itemName}
                            </h4>
                            <div className="text-[13px] text-[#64748B] space-y-0.5 mt-1.5">
                              <p>
                                판매자: <strong className="text-gray-900 font-bold">{ord.sellerNickname}</strong>
                              </p>
                              <p>
                                주문일: {ord.createdAt ? ord.createdAt.substring(0, 16).replace('T', ' ') : 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* 2단 Center Column: Price Details */}
                        <div className="bg-[#F8FAFC] border border-[#E5E7EB] rounded-[18px] p-[16px_18px] w-[250px] min-w-[240px] shrink-0 order-payment-summary">
                          <p className="text-[14px] font-extrabold text-[#111827] uppercase tracking-wider mb-2 order-payment-summary-title">
                            결제 내역 상세
                          </p>
                          <div className="space-y-[7px]">
                            <div className="flex justify-between items-center text-[13px] order-payment-row">
                              <span className="text-[#64748B]">상품금액:</span>
                              <span className="font-mono text-[#111827] font-semibold">{itemPriceVal.toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between items-center text-[13px] order-payment-row">
                              <span className="text-[#64748B]">수수료 (3%):</span>
                              <span className="font-mono text-[#111827]">{serviceFeeVal.toLocaleString()}원</span>
                            </div>
                            <div className="flex justify-between items-center text-[13px] order-payment-row">
                              <span className="text-[#64748B]">배송비:</span>
                              <span className="font-mono text-[#111827]">{shippingFeeVal.toLocaleString()}원</span>
                            </div>
                            {ord.couponDiscount && ord.couponDiscount > 0 ? (
                              <div className="flex justify-between items-center text-[13px] text-rose-600 font-bold order-payment-row">
                                <span className="text-rose-500">쿠폰 할인:</span>
                                <span className="font-mono">-{ord.couponDiscount.toLocaleString()}원</span>
                              </div>
                            ) : null}
                            <div className="flex justify-between items-center text-[#111827] pt-2 border-t border-[#E5E7EB] mt-2 order-payment-total">
                              <span className="text-[14px] font-extrabold">최종 승인금액:</span>
                              <span className="font-mono text-[18px] font-black">{totalPaymentVal.toLocaleString()}원</span>
                            </div>
                            {ord.couponName && (
                              <p className="text-[10px] text-rose-600 font-bold text-right truncate max-w-full">
                                🏷️ {ord.couponName}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* 3단 Right Column: Status Icons & User Decisions */}
                        <div className="flex flex-col gap-4 w-full h-full justify-between order-status-actions">
                          <div>
                            {/* Badges Stack */}
                            <div className="flex flex-nowrap items-center gap-[6px] mb-3 whitespace-nowrap overflow-visible select-none status-badge-row">
                              {ord.paymentStatus === 'paid' && (
                                <span className="bg-emerald-50 text-emerald-700 border border-emerald-150 text-[11px] font-extrabold h-[26px] px-[9px] status-badge">
                                  💳 결제 완료
                                </span>
                              )}
                              
                              {ord.escrowStatus === 'holding' && !isConfirmed && (
                                <span className="bg-blue-50 text-blue-700 border border-blue-150 text-[11px] font-extrabold h-[26px] px-[9px] status-badge">
                                  🛡️ 에스크로 보관중
                                </span>
                              )}

                              {isConfirmed && (
                                <span className="bg-indigo-50 text-indigo-700 border border-[#C7D2FE] text-[11px] font-extrabold h-[26px] px-[9px] status-badge">
                                  ✅ 구매확정 완료
                                </span>
                              )}

                              {ord.refundStatus === 'requested' ? (
                                <span className="bg-[#FFF1F2] text-[#E11D48] border border-[#FDA4AF] text-[11px] font-extrabold h-[26px] px-[9px] animate-pulse status-badge">
                                  ⚠️ 환불 심사중
                                </span>
                              ) : ((ord as any).deliveryStatus) === 'pickup_requested' ? (
                                <span className="bg-sky-50 text-sky-700 border border-sky-150 text-[11px] font-extrabold h-[26px] px-[9px] animate-pulse status-badge">
                                  📩 수거신청 완료
                                </span>
                              ) : ((ord as any).deliveryStatus) === 'pickup_ready' ? (
                                <span className="bg-indigo-50 text-indigo-700 border border-[#C7D2FE] text-[11px] font-extrabold h-[26px] px-[9px] animate-pulse status-badge">
                                  ⏳ 수거 대기
                                </span>
                              ) : ((ord as any).deliveryStatus) === 'picked_up' ? (
                                <span className="bg-violet-50 text-violet-700 border border-[#DDD6FE] text-[11px] font-extrabold h-[26px] px-[9px] status-badge">
                                  🚚 수거 완료
                                </span>
                              ) : isDelivered && !isConfirmed ? (
                                <span className="bg-teal-50 text-teal-700 border border-[#99F6E4] text-[11px] font-extrabold h-[26px] px-[9px] status-badge">
                                  📬 수령완료
                                </span>
                              ) : isShipped && !isConfirmed ? (
                                <span className="bg-[#FFFBEB] text-[#D97706] border border-[#FCD34D] text-[11px] font-extrabold h-[26px] px-[9px] animate-pulse font-sans status-badge">
                                  🚚 배송중
                                </span>
                              ) : (!isConfirmed && (
                                <span className="bg-gray-100 text-gray-650 border border-gray-150 text-[11px] font-extrabold h-[26px] px-[9px] status-badge delivery-preparing">
                                  📦 배송 준비중
                                </span>
                              ))}
                            </div>

                            {/* Info text / deadlines / shipping info */}
                            <div className="space-y-1 text-left">
                              {isConfirmed ? (
                                <div className="p-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[12px] space-y-1 text-left text-[12px] text-[#475569]">
                                  <p className="font-extrabold text-gray-900">구매확정이 완료되었습니다.</p>
                                  <div className="text-[11px] text-gray-500 mt-2 space-y-0.5 font-medium">
                                    <p>• 에스크로 상태: 정산 완료</p>
                                    <p>• 구매확정일: {new Date(ord.buyerConfirmedAt!).toLocaleDateString()}</p>
                                  </div>
                                </div>
                              ) : ord.refundStatus === 'requested' ? (
                                <div className="p-2.5 bg-[#FFF2F2] border border-[#FDA4AF] rounded-[12px] space-y-1 text-left text-[12px] text-[#B91C1C] leading-[1.45]">
                                  <p className="font-extrabold text-[#B91C1C]">🚨 환불 사유: {ord.refundReason}</p>
                                  {ord.refundDetail && (
                                    <p className="text-[11px] text-rose-700 font-semibold">• 상세: {ord.refundDetail}</p>
                                  )}
                                  <p className="text-[10px] text-gray-500 leading-tight block mt-1">
                                    운영자 검수 및 판매자 교섭 진행으로 정산이 홀딩되었습니다.
                                  </p>
                                </div>
                              ) : ((ord as any).deliveryStatus) === 'pickup_requested' ? (
                                <div className="p-2.5 bg-sky-50 border border-sky-100 rounded-[12px] text-[11px] text-sky-800 space-y-1">
                                  <p className="font-bold text-sky-900">📩 판매자가 방문수거를 신청했습니다.</p>
                                  <p>• 수거방식: {(ord as any).pickupMethod || '샥 계약택배'}</p>
                                  <p>• 수거 수령 일정: {(ord as any).pickupDate || '배정중'}</p>
                                  <p className="leading-tight text-gray-500 mt-1 text-[10px]">택배기사가 수거지에 도착해 스캔하면 운송장 번호가 실시간 연동됩니다.</p>
                                </div>
                              ) : ((ord as any).deliveryStatus) === 'pickup_ready' ? (
                                <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-[12px] text-[11px] text-indigo-800 space-y-0.5">
                                   <p className="font-bold text-indigo-900">⏳ 방문수거 수거 대기 중</p>
                                   <p>• 예정 영업일: {(ord as any).pickupDate}</p>
                                </div>
                              ) : ((ord as any).deliveryStatus) === 'picked_up' ? (
                                <div className="p-2.5 bg-violet-50 border border-violet-100 rounded-[12px] text-[11px] text-violet-800 space-y-1">
                                   <p className="font-bold text-violet-900">🚚 택배사 수거 완료</p>
                                   <p>• 영업소 입고 분류 예정입니다.</p>
                                   <p>• 발행된 운송장: <span className="font-mono font-bold text-gray-900">{ord.trackingNumber}</span></p>
                                </div>
                              ) : isDelivered ? (
                                <div className="p-[10px_12px] bg-[#FFF2F2] border border-[#FDA4AF] rounded-[14px] text-[11px] leading-[1.45] text-[#B91C1C] mt-2.5 mb-2.5">
                                  <p className="font-extrabold">⏰ 환불 가능 기한:</p>
                                  <p className="font-mono text-[11px] font-bold text-rose-750">
                                    {ord.refundAvailableUntil ? new Date(ord.refundAvailableUntil).toLocaleString() : 'N/A'}까지
                                  </p>
                                  <p className="text-[10px] text-gray-500 leading-normal mt-1">
                                    구매확정 시 판매자에게 자금이 즉시 송금 정산되며 환불이 기각 처리됩니다.
                                  </p>
                                </div>
                              ) : isShipped ? (
                                <div className="p-2.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-[12px]" style={{ fontFamily: 'Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif' }}>
                                  <p className="font-extrabold text-[#111827] text-[13px] mb-1">🚚 배송 추적 정보</p>
                                  <p className="text-[13px] text-gray-905 font-bold" style={{ wordBreak: 'keep-all', overflowWrap: 'anywhere', lineHeight: '1.45', fontFamily: 'Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif' }}>
                                    {ord.courier || (ord as any).carrier || '샥 계약택배'} : {ord.trackingNumber}
                                  </p>
                                  <p className="text-[12px] text-[#64748B] leading-[1.45] mt-1" style={{ fontFamily: 'Pretendard, "Apple SD Gothic Neo", "Noto Sans KR", system-ui, sans-serif' }}>
                                    반드시 상품 수령 후 <strong>[상품 수령확인]</strong>을 눌러주세요.
                                  </p>
                                </div>
                              ) : ((ord as any).deliveryStatus) === 'preparing' ? (
                                <p className="text-[12px] text-gray-700 leading-relaxed pt-1 font-bold">
                                  판매자가 배송을 준비 중입니다.
                                </p>
                              ) : (
                                <p className="text-[12px] text-gray-500 leading-relaxed pt-1">
                                  판매자가 발송 후 수령확인을 완료하시면 환불 기한(3일) 시계가 작동합니다.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Order Action Buttons */}
                          <div className="flex flex-col gap-2 w-full mt-auto">
                            <div className="flex flex-wrap gap-2 w-full action-button-row">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedOrderId(ord.id);
                                  setIsOrderDetailOpen(true);
                                }}
                                className="cursor-pointer h-[34px] bg-white hover:bg-gray-50 text-[#475569] border border-[#D1D5DB] font-sans font-extrabold text-[12px] px-[13px] rounded-full inline-flex items-center justify-center gap-[4px] transition-all flex-1 whitespace-nowrap break-keep"
                              >
                                <Eye size={12} />
                                <span>상세보기</span>
                              </button>

                              {ord.paymentStatus === 'paid' && ord.deliveryStatus === 'preparing' && !ord.trackingNumber && (
                                <button
                                  type="button"
                                  onClick={() => handleStartEditAddress(ord)}
                                  className="cursor-pointer h-[34px] bg-white hover:bg-gray-50 text-[#475569] border border-[#D1D5DB] font-sans font-extrabold text-[12px] px-[13px] rounded-full inline-flex items-center justify-center transition-all flex-1 whitespace-nowrap break-keep"
                                >
                                  주소변경
                                </button>
                              )}

                              {(ord.deliveryStatus === 'shipping' || ord.deliveryStatus === 'delivered' || isConfirmed || !!ord.trackingNumber) && (
                                <button
                                  type="button"
                                  disabled
                                  className="cursor-not-allowed h-[34px] bg-[#F1F5F9] text-[#94A3B8] border border-[#E2E8F0] font-sans font-extrabold text-[11px] px-[13px] rounded-full inline-flex items-center justify-center flex-1 whitespace-nowrap break-keep"
                                  title="이미 배송이 시작되어 주소를 변경할 수 없습니다."
                                >
                                  주소변경 불가
                                </button>
                              )}
                            </div>

                            {ord.paymentStatus === 'paid' && ord.deliveryStatus === 'shipping' && !isDelivered && ord.trackingNumber && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedReceiveOrderId(ord.id);
                                  setIsReceiveConfirmOpen(true);
                                }}
                                className="cursor-pointer h-[36px] bg-[#111827] hover:bg-[#1f2937] border border-[#111827] text-white font-sans font-extrabold text-[13px] px-[14px] rounded-full inline-flex items-center justify-center gap-[6px] transition-all w-full whitespace-nowrap break-keep"
                              >
                                <span>📦 상품 수령확인</span>
                              </button>
                            )}

                            {ord.paymentStatus === 'paid' && isDelivered && ord.escrowStatus === 'holding' && (ord.refundStatus === 'none' || !ord.refundStatus) && !isConfirmed && (
                              <div className="flex flex-col gap-2 w-full">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedConfirmOrderId(ord.id);
                                    setIsConfirmPurchaseModalOpen(true);
                                  }}
                                  className="cursor-pointer h-[38px] bg-[#111827] hover:bg-[#1f2937] border border-[#111827] text-white font-sans font-extrabold text-[13px] px-[14px] rounded-full inline-flex items-center justify-center gap-[4px] transition-all w-full shadow-sm whitespace-nowrap break-keep"
                                >
                                  <Check size={12} className="stroke-[3]" />
                                  <span>구매확정</span>
                                </button>

                                {refundValid && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedRefundOrderId(ord.id);
                                      setRefundReasonType('상품 상태가 설명과 달라요');
                                      setRefundReasonDetail('');
                                      setRefundValidationError(null);
                                      setIsRefundModalOpen(true);
                                    }}
                                    className="cursor-pointer h-[36px] bg-[#FFF1F2] hover:bg-[#FFE4E6] border border-[#FECDD3] text-[#E11D48] font-sans font-extrabold text-[13px] px-[14px] rounded-full inline-flex items-center justify-center gap-[4px] transition-all w-full whitespace-nowrap break-keep"
                                  >
                                    <AlertCircle size={12} />
                                    <span>환불요청</span>
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Inline Edit Delivery Address form for buyer */}
                        {addressEditOrderId === ord.id && (
                          <div className="border-t border-gray-200 mt-4 pt-4 w-full h-full text-left">
                            <h4 className="text-xs font-bold font-sans mb-3 text-gray-900">배송지 정보 수정</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-[10px] text-gray-500 mb-1">수령인</label>
                                <input type="text" value={editReceiverName} onChange={e => setEditReceiverName(e.target.value)} className="w-full text-xs p-2 border border-gray-200 rounded-lg" />
                              </div>
                              <div>
                                <label className="block text-[10px] text-gray-500 mb-1">연락처</label>
                                <input type="text" value={editContactPhone} onChange={e => setEditContactPhone(e.target.value)} className="w-full text-xs p-2 border border-gray-200 rounded-lg" />
                              </div>
                              <div className="md:col-span-2 flex gap-2">
                                <div className="w-1/3">
                                  <label className="block text-[10px] text-gray-500 mb-1">우편번호</label>
                                  <input type="text" value={editPostalCode} onChange={e => setEditPostalCode(e.target.value)} className="w-full text-xs p-2 border border-gray-200 rounded-lg" />
                                </div>
                                <div className="w-2/3">
                                  <label className="block text-[10px] text-gray-500 mb-1">기본주소</label>
                                  <input type="text" value={editAddress1} onChange={e => setEditAddress1(e.target.value)} className="w-full text-xs p-2 border border-gray-200 rounded-lg" />
                                </div>
                              </div>
                              <div className="md:col-span-2 text-xs">
                                <label className="block text-[10px] text-gray-500 mb-1">상세주소</label>
                                <input type="text" value={editAddress2} onChange={e => setEditAddress2(e.target.value)} className="w-full text-xs p-2 border border-gray-200 rounded-lg" />
                              </div>
                              <div className="md:col-span-2 mt-2 flex justify-end gap-2">
                                <button type="button" onClick={() => setAddressEditOrderId(null)} className="cursor-pointer px-4 py-2 bg-gray-100 text-gray-600 font-bold text-xs rounded-xl hover:bg-gray-200">취소</button>
                                <button type="button" onClick={() => handleSaveAddress(ord.id)} className="cursor-pointer px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl shadow hover:bg-gray-900">저장</button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: 커뮤니티 활동 */}
          {activeTab === 'communityActivity' && (
            <div className="space-y-6">
              {/* SECTION: 내 소모임 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-sans font-black text-gray-900 text-base md:text-lg flex items-center gap-2 text-left">
                      <MessageSquare size={20} className="text-[#111827]" />
                      <span>내 소모임</span>
                    </h3>
                    <p className="text-[13px] text-gray-500 mt-1 text-left">내가 참여하거나 만든 소모임을 확인해요.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {joinedRooms.length === 0 ? (
                    <div className="bg-gray-50 rounded-2xl border border-gray-100 p-12 text-center text-slate-450 select-none space-y-2.5">
                      <div className="inline-flex h-12 w-12 bg-white text-gray-800 rounded-full items-center justify-center border border-gray-200">
                        <MessageSquare size={20} />
                      </div>
                      <div className="space-y-1">
                        <p className="font-sans font-bold text-gray-900 text-[14px]">아직 입장한 소모임이 없어요.</p>
                        <p className="text-[12px] text-slate-450 leading-relaxed mx-auto">
                          관심 있는 소모임에 참여해보세요.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          if (onNavigateToCommunityMeetups) {
                            onNavigateToCommunityMeetups();
                          } else {
                            onBackToMain();
                            setTimeout(() => {
                              const target = document.querySelector('#community-section');
                              if (target) {
                                target.scrollIntoView({ behavior: 'smooth' });
                              }
                            }, 150);
                          }
                        }}
                        className="cursor-pointer inline-flex items-center justify-center gap-1.5 text-xs font-bold text-white bg-[#111827] px-5 py-2 rounded-full hover:bg-black transition-all font-sans mt-2"
                      >
                        <span>소모임 둘러보기</span>
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {joinedRooms.map(({ room, lastVisitedAt, joinedAt, lastMessage }) => (
                        <div
                          key={room.id}
                          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex flex-col justify-between hover:border-gray-300 transition-all text-left"
                        >
                          <div>
                            {/* Header badge area */}
                            <div className="meetup-card-topline mb-3">
                              <div className="meetup-card-badges">
                                <span className="meetup-card-badge bg-gray-100 text-gray-700">
                                  {room.categoryGroup}
                                </span>
                                <span className="meetup-card-badge bg-gray-100 text-gray-700 border border-gray-100">
                                  {room.subCategory}
                                </span>
                              </div>
                              <span className="meetup-online-count text-gray-400">
                                멤버 {room.memberCount}명
                              </span>
                            </div>
                            
                            <h4 className="font-sans font-black text-gray-900 text-sm truncate">{room.title}</h4>
                            <p className="text-[12px] text-gray-500 mt-1 line-clamp-1 leading-relaxed">{room.description}</p>
                            
                            {/* Last message logs display */}
                            <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mt-3">
                              {lastMessage ? (
                                <div>
                                  <p className="text-[12px] text-gray-700 line-clamp-1">
                                    <span className="font-bold text-gray-900 mr-1">{lastMessage.author}:</span>
                                    {lastMessage.content}
                                  </p>
                                </div>
                              ) : (
                                <p className="text-[12px] text-gray-400">이전 대화가 기록되어 있지 않습니다.</p>
                              )}
                            </div>
                          </div>

                          {/* Re-enter redirect button */}
                          <div className="mt-4 flex flex-col gap-2">
                            <button
                              onClick={() => {
                                updateMeetupLastVisited(user.id, room.id);
                                onEnterMeetupRoom?.(room.id);
                              }}
                              className="w-full cursor-pointer bg-white hover:bg-gray-50 border border-gray-200 text-[#111827] font-sans font-bold text-xs py-2 rounded-xl flex items-center justify-center gap-1 transition-all"
                            >
                              <span>입장하기</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* SECTION: 내 커뮤니티 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-sans font-black text-gray-900 text-base md:text-lg flex items-center gap-2 text-left">
                      <Hash size={20} className="text-[#111827]" />
                      <span>내 커뮤니티</span>
                    </h3>
                    <p className="text-[13px] text-gray-500 mt-1 text-left">내가 작성한 글, 댓글, 커뮤니티 활동을 확인해요.</p>
                  </div>
                </div>

                <div className="space-y-6 font-sans">
                  {/* Inner Partition 1: Written posts */}
                  <div className="space-y-4">
                    <h3 className="font-sans font-bold text-[14px] text-gray-900 flex items-center gap-1">
                      내 게시글
                    </h3>
                    
                    {(() => {
                      const myPosts = getCommunityPosts().filter(p => p.author === user.nickname);
                      if (myPosts.length === 0) {
                        return (
                          <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                            <p className="text-[13px] text-gray-400 tracking-tight">
                              아직 커뮤니티에 작성한 게시글이 없습니다.
                            </p>
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-3">
                          {myPosts.map((post) => (
                            <div key={post.id} className="p-4 bg-white rounded-xl border border-gray-200 hover:border-gray-300 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3 text-left">
                              <div className="space-y-1 flex-1 pr-2">
                                <div className="flex items-center gap-2">
                                  <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                    {post.boardSubCategory || post.boardGroup}
                                  </span>
                                  <span className="text-[11px] text-gray-400 font-mono tracking-tighter">
                                    {post.createdAt}
                                  </span>
                                </div>
                                <h4 className="font-sans font-bold text-gray-900 text-[14px] line-clamp-1">{post.title}</h4>
                                <p className="text-[12px] text-gray-500 line-clamp-2 leading-relaxed">{post.content}</p>
                              </div>
                              
                              <div className="flex gap-1.5 self-end md:self-auto shrink-0">
                                <button
                                  onClick={() => setSelectedPostForView(post)}
                                  className="cursor-pointer px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-[11px] font-bold transition-colors"
                                >
                                  보기
                                </button>
                                <button
                                  onClick={() => {
                                    setEditPost(post);
                                    setIsEditPostModalOpen(true);
                                  }}
                                  className="cursor-pointer px-3 py-1.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-lg text-[11px] font-bold transition-colors"
                                >
                                  수정
                                </button>
                                <button
                                  onClick={() => {
                                    triggerConfirm(
                                      '게시글 완전 삭제',
                                      `[${post.title}] 게시글을 삭제하시겠습니까?`,
                                      () => {
                                        const all = getCommunityPosts();
                                        const updated = all.filter(p => p.id !== post.id);
                                        localStorage.setItem('shock_community_v3', JSON.stringify(updated));
                                        
                                        const commentsAll = getComments();
                                        const filteredComm = commentsAll.filter(c => c.postId !== post.id);
                                        localStorage.setItem('shock_comments_v3', JSON.stringify(filteredComm));

                                        alert('게시글이 삭제되었습니다.');
                                        onRefreshData?.();
                                      }
                                    );
                                  }}
                                  className="cursor-pointer px-3 py-1.5 bg-white hover:bg-red-50 text-red-600 border border-gray-200 rounded-lg text-[11px] font-bold transition-colors"
                                >
                                  삭제
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })()}
                  </div>

                  {/* Inner Partition 2: Left comments */}
                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <h3 className="font-sans font-bold text-[14px] text-gray-900 flex items-center gap-1">
                      내 댓글
                    </h3>
                    
                    {(() => {
                      const myComments = getComments().filter(c => c.author === user.nickname);
                      if (myComments.length === 0) {
                        return (
                          <div className="bg-gray-50 rounded-xl p-8 text-center border border-gray-100">
                            <p className="text-[13px] text-gray-400 tracking-tight">
                              아직 커뮤니티에 작성한 댓글이 없습니다.
                            </p>
                          </div>
                        );
                      }
                      return (
                        <div className="space-y-3">
                          {myComments.map((comment) => {
                            const isEditingThis = editingCommentId === comment.id;
                            return (
                              <div key={comment.id} className="p-4 bg-white rounded-xl border border-gray-200 text-left space-y-2 hover:border-gray-300 transition-colors">
                                <div className="flex items-center justify-between">
                                  <span className="text-[11px] text-gray-400 font-mono tracking-tighter">
                                    {comment.createdAt} {comment.updatedAt ? `(수정됨)` : ''}
                                  </span>
                                  
                                  {!isEditingThis && (
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          setEditingCommentId(comment.id);
                                          setEditingCommentText(comment.content);
                                        }}
                                        className="cursor-pointer text-[11px] font-bold text-gray-500 hover:text-gray-900"
                                      >
                                        수정
                                      </button>
                                      <button
                                        onClick={() => {
                                          triggerConfirm(
                                            '댓글 삭제',
                                            `이 댓글을 삭제하시겠습니까?`,
                                            () => {
                                              const commsAll = getComments();
                                              const updatedComms = commsAll.filter(c => c.id !== comment.id);
                                              localStorage.setItem('shock_comments_v3', JSON.stringify(updatedComms));

                                              const postsAll = getCommunityPosts();
                                              const updatedPosts = postsAll.map(p => p.id === comment.postId ? { ...p, comments: Math.max(0, p.comments - 1) } : p);
                                              localStorage.setItem('shock_community_v3', JSON.stringify(updatedPosts));

                                              alert('댓글이 삭제되었습니다.');
                                              onRefreshData?.();
                                            }
                                          );
                                        }}
                                        className="cursor-pointer text-[11px] font-bold text-red-500 hover:text-red-700"
                                      >
                                        삭제
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {isEditingThis ? (
                                  <div className="space-y-2 pt-1">
                                    <textarea
                                      className="w-full bg-white border border-gray-200 rounded-lg p-3 text-[13px] text-gray-900 font-sans focus:outline-none focus:border-gray-400 resize-none"
                                      value={editingCommentText}
                                      onChange={(e) => setEditingCommentText(e.target.value)}
                                      rows={2}
                                    />
                                    <div className="flex justify-end gap-1.5">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setEditingCommentId(null);
                                          setEditingCommentText('');
                                        }}
                                        className="cursor-pointer px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-[11px] font-bold"
                                      >
                                        취소
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          if (!editingCommentText.trim()) {
                                            alert('댓글 내용을 입력해주세요.');
                                            return;
                                          }
                                          const commsAll = getComments();
                                          const updatedComms = commsAll.map(c => c.id === comment.id ? { 
                                            ...c, 
                                            content: editingCommentText.trim(),
                                            updatedAt: new Date().toISOString().split('T')[0]
                                          } : c);
                                          localStorage.setItem('shock_comments_v3', JSON.stringify(updatedComms));
                                          
                                          setEditingCommentId(null);
                                          setEditingCommentText('');
                                          alert('댓글이 수정되었습니다.');
                                          onRefreshData?.();
                                        }}
                                        className="cursor-pointer px-3 py-1.5 bg-[#111827] hover:bg-black text-white rounded-md text-[11px] font-bold"
                                      >
                                        저장
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <p className="text-[13px] text-gray-800 font-sans leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: 배송·결제 관리 */}
          {activeTab === 'shippingPayment' && (
            <div className="space-y-6">
              {/* SECTION: 내 배송지 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-sans font-black text-gray-900 text-base md:text-lg flex items-center gap-2 text-left">
                      <MapPin size={20} className="text-[#111827]" />
                      <span>내 배송지</span>
                    </h3>
                    <p className="text-[13px] text-gray-500 mt-1 text-left">낙찰·구매 상품을 받을 배송지를 관리해요.</p>
                  </div>
                {!addressFormOpen && (
                  <button
                    onClick={() => {
                      setEditingAddress(null);
                      setAddressFormOpen(true);
                    }}
                    className="cursor-pointer text-xs font-black text-white bg-gray-900 hover:bg-gray-850 px-4 py-2.5 rounded-xl transition-all"
                  >
                    + 새 배송지 추가
                  </button>
                )}
              </div>

              {addressFormOpen ? (
                <div className="py-2">
                  <AddressForm
                    userId={user.id}
                    initialData={editingAddress}
                    onSuccess={() => {
                      setAddressFormOpen(false);
                      setEditingAddress(null);
                      setAddresses(getAddresses(user.id));
                    }}
                    onCancel={() => {
                      setAddressFormOpen(false);
                      setEditingAddress(null);
                    }}
                    addAddressFn={addAddress}
                    updateAddressFn={updateAddress}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 select-none">
                      <p className="font-sans font-bold text-sm">등록된 배송지 정보가 없습니다.</p>
                      <p className="text-xs mt-1">안전 거래용 기본 수령지를 등록하고 간편 충전을 완료하세요!</p>
                    </div>
                  ) : (
                    addresses.map((a) => (
                      <div key={a.id} className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-sm transition-all text-left ${
                        a.isDefault ? 'border-gray-300 ring-1 ring-gray-200 block' : 'border-gray-200'
                      }`}>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="font-sans font-black text-xs text-gray-800 bg-gray-100 px-2 py-0.5 rounded-md uppercase">
                              {a.label}
                            </span>
                            {a.isDefault && (
                              <span className="bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full select-none border border-emerald-100">
                                기본 배송지
                              </span>
                            )}
                          </div>
                          <div className="space-y-1 pt-1">
                            <h4 className="font-sans font-black text-gray-900 text-sm">
                              {a.receiverName} <span className="font-semibold text-xs text-gray-400">({a.phone})</span>
                            </h4>
                            <p className="text-xs text-gray-650 leading-relaxed pt-0.5">
                              [{a.postalCode}] {a.address1} {a.address2}
                            </p>
                            {a.deliveryMemo && (
                              <div className="text-[10px] bg-slate-50 text-slate-500 font-medium px-2 py-1 rounded-lg border border-slate-100 mt-1.5 flex items-center gap-1.5">
                                💬 {a.deliveryMemo}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 border-t border-gray-100 pt-3.5 mt-4">
                          {!a.isDefault && (
                            <button
                              onClick={() => {
                                setDefaultAddress(user.id, a.id);
                                setAddresses(getAddresses(user.id));
                              }}
                              className="cursor-pointer text-[10px] font-bold text-gray-500 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 bg-white border border-gray-200"
                            >
                              기본값 설정
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingAddress(a);
                              setAddressFormOpen(true);
                            }}
                            className="cursor-pointer text-[10px] font-bold text-gray-500 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 bg-white border border-gray-200"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => {
                              {/* Open confirm modal for deleting address */}
                              setDeleteType('address');
                              setDeleteTargetId(a.id);
                              setConfirmModalTitle('🏠 배송지 삭제 확인');
                              setConfirmModalMessage('해당 배송지 주소 정보를 삭제하시겠습니까?');
                              setIsConfirmModalOpen(true);
                            }}
                            className="cursor-pointer text-[10px] font-bold text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 bg-white border border-red-100"
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
              </div>

              {/* SECTION: 결제수단 관리 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-sans font-black text-gray-900 text-base md:text-lg flex items-center gap-2 text-left">
                      <CreditCard size={20} className="text-[#111827]" />
                      <span>결제수단 관리</span>
                    </h3>
                    <p className="text-[13px] text-gray-500 mt-1 text-left">입찰·즉시낙찰 결제에 사용할 결제수단을 관리해요.</p>
                  </div>
                {!paymentFormOpen && (
                  <button
                    onClick={() => setPaymentFormOpen(true)}
                    className="cursor-pointer text-xs font-black text-white bg-gray-900 hover:bg-gray-905 px-4 py-2.5 rounded-xl transition-all"
                  >
                    + 결제수단 추가
                  </button>
                )}
              </div>

              {paymentFormOpen ? (
                <div className="max-w-md mx-auto relative bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm text-left">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                    <span className="text-xs font-black text-gray-900">결제 연동 수단 등록</span>
                    <button
                      onClick={() => setPaymentFormOpen(false)}
                      className="cursor-pointer text-[10px] font-black text-slate-450 hover:text-gray-900"
                    >
                      취소
                    </button>
                  </div>
                  <PaymentMethodForm
                    userId={user.id}
                    onSuccess={() => {
                      setPaymentFormOpen(false);
                      loadLocalFinanceAndMeetups();
                    }}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localPaymentMethods.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 select-none">
                      <p className="font-sans font-bold text-sm">등록된 결제수단 정보가 없습니다.</p>
                      <p className="text-xs mt-1">간편 에스크로 카드 연결을 완료해 보세요!</p>
                    </div>
                  ) : (
                    localPaymentMethods.map((m) => (
                      <div key={m.id} className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-sm transition-all text-left ${
                        m.isDefault ? 'border-gray-300 ring-1 ring-gray-200' : 'border-gray-200'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="p-2.5 bg-gray-50 text-gray-600 rounded-xl border border-gray-100">
                              {m.type === 'card' ? <CreditCard size={16} /> : <Landmark size={16} />}
                            </span>
                            <div className="text-left">
                              <p className="text-xs font-black text-gray-900">{m.nickname}</p>
                              <p className="text-[11px] text-gray-500 mt-1 font-mono">{m.provider} • {m.maskedNumber}</p>
                              {m.isDefault && (
                                <span className="inline-block mt-1.5 bg-gray-150 text-gray-800 border border-gray-250 text-[10px] font-sans font-black px-1.5 py-0.2 rounded-md">
                                  기본 결제수단
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                deletePaymentMethod(user.id, m.id);
                                loadLocalFinanceAndMeetups();
                              }}
                              className="cursor-pointer p-1.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 transition-colors"
                              title="결제수단 연동 삭제"
                            >
                              <Trash2 size={13} className="stroke-[2.5]" />
                            </button>
                          </div>
                        </div>

                        {!m.isDefault && (
                          <div className="pt-4 border-t border-gray-100 mt-4 text-left">
                            <button
                              onClick={() => {
                                setDefaultPaymentMethod(user.id, m.id);
                                loadLocalFinanceAndMeetups();
                              }}
                              className="cursor-pointer text-[10px] text-gray-900 font-black bg-gray-100 px-2.5 py-1 rounded-md hover:bg-gray-200 transition-all font-sans"
                            >
                              기본 결제수단으로 지정
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
              </div>

              {/* SECTION: 판매자 정산계좌 */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <h3 className="font-sans font-black text-gray-900 text-base md:text-lg flex items-center gap-2 text-left">
                      <Landmark size={20} className="text-[#111827]" />
                      <span>판매자 정산계좌</span>
                    </h3>
                    <p className="text-[13px] text-gray-500 mt-1 text-left">판매 완료 후 정산받을 계좌를 관리해요.</p>
                  </div>
                {!accountFormOpen && (
                  <button
                    onClick={() => setAccountFormOpen(true)}
                    className="cursor-pointer text-xs font-black text-white bg-gray-900 hover:bg-gray-850 px-4 py-2.5 rounded-xl transition-all"
                  >
                    + 정산계좌 추가
                  </button>
                )}
              </div>

              {accountFormOpen ? (
                <div className="max-w-md mx-auto relative bg-gray-50 border border-gray-200 rounded-2xl p-5 shadow-sm text-left">
                  <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-100">
                    <span className="text-xs font-black text-gray-900 font-sans">정산 연동 계좌 등록</span>
                    <button
                      onClick={() => setAccountFormOpen(false)}
                      className="cursor-pointer text-[10px] font-black text-slate-450 hover:text-gray-900 font-sans"
                    >
                      취소
                    </button>
                  </div>
                  <PayoutAccountForm
                    userId={user.id}
                    onSuccess={() => {
                      setAccountFormOpen(false);
                      loadLocalFinanceAndMeetups();
                    }}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {localPayoutAccounts.length === 0 ? (
                    <div className="col-span-full bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 select-none">
                      <p className="font-sans font-bold text-sm">등록된 정산계좌 정보가 없습니다.</p>
                      <p className="text-xs mt-1">에스크로 거래 후 정금 수령을 위해 계좌를 연결해 주세요!</p>
                    </div>
                  ) : (
                    localPayoutAccounts.map((acc) => (
                      <div key={acc.id} className={`bg-white rounded-2xl border p-5 flex flex-col justify-between shadow-sm transition-all text-left ${
                        acc.isDefault ? 'border-gray-300 ring-1 ring-gray-200' : 'border-gray-200'
                      }`}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <span className="p-2.5 bg-gray-50 text-gray-600 rounded-xl border border-gray-100">
                              <Landmark size={16} />
                            </span>
                            <div className="text-left font-sans">
                              <p className="text-xs font-black text-gray-900">{acc.nickname || `${acc.bankName} 정산계좌`}</p>
                              <p className="text-[11px] text-gray-500 mt-1 font-mono">{acc.bankName} • {acc.accountNumber}</p>
                              <p className="text-[10px] text-gray-400 mt-0.5">예금주: {acc.accountHolder}</p>
                              {acc.isDefault && (
                                <span className="inline-block mt-1.5 bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-sans font-black px-1.5 py-0.2 rounded-md">
                                  기본 정산계좌
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => {
                                handleDeleteAccount(acc.id);
                              }}
                              className="cursor-pointer p-1.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 transition-colors"
                              title="정산계좌 삭제"
                            >
                              <Trash2 size={13} className="stroke-[2.5]" />
                            </button>
                          </div>
                        </div>

                        {!acc.isDefault && (
                          <div className="pt-4 border-t border-gray-100 mt-4 text-left">
                            <button
                              onClick={() => {
                                setDefaultPayoutAccount(user.id, acc.id);
                                loadLocalFinanceAndMeetups();
                              }}
                              className="cursor-pointer text-[10px] text-gray-900 font-black bg-gray-100 px-2.5 py-1 rounded-md hover:bg-gray-200 transition-all font-sans"
                            >
                              기본 정산계좌로 지정
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
          )}

          {/* 샥 방문수거 신청 모달 */}
          {shippingInputOrderId && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
              <div className="pickup-modal">
                <div className="pickup-modal-header flex items-center justify-between">
                  <div className="flex items-center gap-2 text-left">
                    <span className="p-1 px-2.5 bg-gray-900 text-white rounded-md text-[10px] uppercase font-black">Contract Delivery</span>
                    <h4 className="font-sans font-black text-gray-900 text-[16px]">📦 샥 계약택배 방문수거 신청</h4>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setShippingInputOrderId(null)}
                    className="cursor-pointer text-gray-400 hover:text-gray-650 font-bold text-xs"
                  >
                    ✕
                  </button>
                </div>

                <div className="pickup-modal-body">
                  <form id="shipping-form" onSubmit={handleSellerShippingSubmit} className="space-y-4 text-left">
                    {/* 수거 장소 */}
                  <div>
                    <label className="block text-[13px] font-bold text-gray-750 mb-1">수거지 상세 주소</label>
                    <input
                      type="text"
                      required
                      value={pickupAddress}
                      onChange={(e) => setPickupAddress(e.target.value)}
                      placeholder="수거기사님이 방문할 정확한 상세 주소"
                      className="w-full h-10 border border-gray-200 rounded-xl px-3 text-[14px] font-semibold focus:ring-1 focus:ring-gray-900"
                    />
                  </div>

                  {/* 수거방식 및 수거 일정 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-bold text-gray-750 mb-1">수거 방식</label>
                      <select
                        value={pickupMethod}
                        onChange={(e) => setPickupMethod(e.target.value)}
                        className="w-full h-10 border border-gray-200 rounded-xl px-2.5 text-[14px] font-semibold bg-white cursor-pointer"
                      >
                        <option value="문앞 수거">🚪 문앞 수거</option>
                        <option value="경비실 수거">👮 경비실 수거</option>
                        <option value="무인택배함 수거">🗳️ 무인택배함 수거</option>
                        <option value="아파트 공동현관 수거">🏢 아파트 공동현관 수거</option>
                        <option value="대면 수거">👤 대면 수거</option>
                        <option value="편의점 위탁 접수">🏪 편의점 위탁 접수</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-gray-750 mb-1">수거 희망 일정</label>
                      <input
                        type="date"
                        required
                        value={pickupDate}
                        onChange={(e) => setPickupDate(e.target.value)}
                        className="w-full h-10 border border-gray-200 rounded-xl px-3 text-[14px] font-bold font-mono"
                      />
                    </div>
                  </div>

                  {/* 수거 시간대 & 메모 */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[13px] font-bold text-gray-750 mb-1">방문희망 시간대</label>
                      <select
                        value={pickupTimeSlot}
                        onChange={(e) => setPickupTimeSlot(e.target.value)}
                        className="w-full h-10 border border-gray-200 rounded-xl px-2.5 text-[14px] font-semibold bg-white cursor-pointer"
                      >
                        <option value="오전 09:00~12:00">🌅 오전 09:00 ~ 12:00</option>
                        <option value="오후 13:00~16:00">☀️ 오후 13:00 ~ 16:00</option>
                        <option value="저녁 16:00~19:00">🌇 저녁 16:00 ~ 19:00</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[13px] font-bold text-gray-750 mb-1">기사님께 남길 메모</label>
                      <input
                        type="text"
                        placeholder="예: 벨 누르지 말고 문 앞에 놔주세요."
                        value={shippingMemo}
                        onChange={(e) => setShippingMemo(e.target.value)}
                        className="w-full h-10 border border-gray-200 rounded-xl px-3 text-[14px] font-bold"
                      />
                    </div>
                  </div>

                  {/* 편의점 위탁 접수 시 필드 표시 */}
                  {pickupMethod === '편의점 위탁 접수' && (
                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-2xl relative space-y-3">
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-yellow-105 text-yellow-800 text-[9px] font-black rounded">직접 위탁</span>
                      <p className="text-[11px] text-gray-650 font-semibold">🏪 편의점 위탁 점포에 맡기신 후 택배사와 운송장번호를 하단에 기입바랍니다.</p>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[12px] font-bold text-slate-450 mb-1">이용 편의점/택배사</label>
                          <select
                            value={shippingCarrier}
                            onChange={(e) => setShippingCarrier(e.target.value)}
                            className="w-full h-9 border border-gray-200 rounded-xl px-2.5 text-[14px] bg-white cursor-pointer"
                          >
                            <option value="GS25편의점택배">GS25편의점택배</option>
                            <option value="CU끼리택배">CU끼리택배</option>
                            <option value="CJ대한통운">CJ대한통운</option>
                            <option value="우체국택배">우체국택배</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[12px] font-bold text-slate-450 mb-1">받으신 운송장번호</label>
                          <input
                            type="text"
                            placeholder="숫자만 입력"
                            value={shippingTrackingNumber}
                            onChange={(e) => setShippingTrackingNumber(e.target.value.replace(/[^0-9]/g, ''))}
                            className="w-full h-9 border border-gray-200 rounded-xl px-3 text-[14px] font-bold font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                   {/* 사진 증빙 셀렉터 (분실 및 분쟁 방지용) */}
                  <div className="space-y-4">
                    <div>
                      <p className="block text-[14px] font-bold text-gray-800">📸 수거 증빙 사진 등록</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">분실 및 분쟁 방지를 위해 포장 완료 사진과 수거 장소 사진을 등록해 주세요.</p>
                    </div>

                    {/* Hidden Native File Inputs */}
                    <input 
                      type="file" 
                      ref={packageFileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handlePackagePhotoChange} 
                    />
                    <input 
                      type="file" 
                      ref={pickupPlaceFileInputRef} 
                      className="hidden" 
                      accept="image/*" 
                      onChange={handlePickupPlacePhotoChange} 
                    />
                    
                    <div className="pickup-photo-grid">
                      {/* 포장 완료물 사진 카드 */}
                      <div className="pickup-photo-card transition-colors">
                        <div className="pickup-photo-card-header">
                          <h4>① 포장 완료 사진 등록</h4>
                          <p>“상품을 포장한 상태가 보이도록 촬영해주세요.”</p>
                        </div>
                        
                        {/* Interactive Drag & Upload visual box */}
                        <div 
                          onClick={() => packageFileInputRef.current?.click()}
                          className="pickup-upload-box border border-dashed border-[#CBD5E1] rounded-[14px] cursor-pointer bg-[#F8FAFC] p-2 hover:bg-slate-100 transition-all select-none group relative overflow-hidden"
                        >
                          {packagePhotoPreview ? (
                            <div className="w-full h-full relative group flex items-center justify-center">
                              <img src={packagePhotoPreview} className="w-full h-full object-cover rounded-[11px]" referrerPolicy="no-referrer" />
                              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] py-1 text-center font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                클릭하여 파일 변경
                              </div>
                            </div>
                          ) : (
                            <div className="text-center space-y-1.5 p-4">
                              <span className="text-2xl block text-slate-400 group-hover:scale-110 transition-transform">📦</span>
                              <p className="text-[11.5px] font-bold text-gray-500">포장 사진 추가</p>
                              <p className="text-[10px] text-gray-400 font-normal">정면에서 박스가 보이게 촬영</p>
                            </div>
                          )}
                        </div>

                        {/* Control buttons */}
                        <div className="pickup-file-button flex gap-1.5 justify-center">
                          <button
                            type="button"
                            onClick={() => packageFileInputRef.current?.click()}
                            className="cursor-pointer bg-[#F1F5F9] hover:bg-[#E2E8F0] text-gray-750 text-[12px] font-extrabold h-[28px] px-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                          >
                            📷 파일 선택
                          </button>
                          {packagePhotoPreview && (
                            <button
                              type="button"
                              onClick={() => {
                                setPackagePhotoPreview('');
                                if (packageFileInputRef.current) packageFileInputRef.current.value = '';
                              }}
                              className="cursor-pointer bg-rose-50 hover:bg-rose-100 text-rose-700 text-[12px] font-extrabold h-[28px] px-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                            >
                              ❌ 삭제
                            </button>
                          )}
                        </div>

                        {/* One-click examples preset */}
                        <div className="pickup-example-area pt-1 border-t border-dotted border-gray-150">
                          <div className="pickup-example-title text-[11.5px] text-slate-450 font-extrabold">💡 원클릭 예시 적용:</div>
                          <div className="pickup-example-buttons">
                            <button
                              type="button"
                              onClick={() => setPackagePhotoPreview('https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80&w=300')}
                              className={`cursor-pointer w-full py-1 px-1 border rounded-lg text-[11px] font-extrabold bg-white hover:bg-gray-50 flex items-center justify-center min-h-[32px] transition-all ${packagePhotoPreview && packagePhotoPreview.includes('1589939705384') ? 'border-gray-900 ring-2 ring-gray-900/10 text-gray-900 font-black' : 'border-gray-200 text-gray-500'}`}
                            >
                              포장 완료 박스
                            </button>
                            <button
                              type="button"
                              onClick={() => setPackagePhotoPreview('https://images.unsplash.com/photo-1518932945647-7a1c969f8be2?auto=format&fit=crop&q=80&w=300')}
                              className={`cursor-pointer w-full py-1 px-1 border rounded-lg text-[11px] font-extrabold bg-white hover:bg-gray-50 flex items-center justify-center min-h-[32px] transition-all ${packagePhotoPreview && packagePhotoPreview.includes('1518932945647') ? 'border-gray-900 ring-2 ring-gray-900/10 text-gray-900 font-black' : 'border-gray-200 text-gray-500'}`}
                            >
                              완충재 포장
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* 수거 장소 사진 카드 */}
                      <div className="pickup-photo-card transition-colors">
                        <div className="pickup-photo-card-header">
                          <h4>② 수거 장소 사진 등록</h4>
                          <p>“문앞, 경비실, 무인택배함 등 실제 위치가 보이게 촬영해주세요.”</p>
                        </div>
                        
                        {/* Interactive Drag & Upload visual box */}
                        <div 
                          onClick={() => pickupPlaceFileInputRef.current?.click()}
                          className="pickup-upload-box border border-dashed border-[#CBD5E1] rounded-[14px] cursor-pointer bg-[#F8FAFC] p-2 hover:bg-slate-100 transition-all select-none group relative overflow-hidden"
                        >
                          {pickupPlacePhotoPreview ? (
                            <div className="w-full h-full relative group flex items-center justify-center">
                              <img src={pickupPlacePhotoPreview} className="w-full h-full object-cover rounded-[11px]" referrerPolicy="no-referrer" />
                              <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] py-1 text-center font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                클릭하여 파일 변경
                              </div>
                            </div>
                          ) : (
                            <div className="text-center space-y-1.5 p-4">
                              <span className="text-2xl block text-slate-400 group-hover:scale-110 transition-transform">🏠</span>
                              <p className="text-[11.5px] font-bold text-gray-500">수거 장소 추가</p>
                              <p className="text-[10px] text-gray-400 font-normal">배송될 실제 장소가 식별되게 촬영</p>
                            </div>
                          )}
                        </div>

                        {/* Control buttons */}
                        <div className="pickup-file-button flex gap-1.5 justify-center">
                          <button
                            type="button"
                            onClick={() => pickupPlaceFileInputRef.current?.click()}
                            className="cursor-pointer bg-[#F1F5F9] hover:bg-[#E2E8F0] text-gray-750 text-[12px] font-extrabold h-[28px] px-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                          >
                            📷 파일 선택
                          </button>
                          {pickupPlacePhotoPreview && (
                            <button
                              type="button"
                              onClick={() => {
                                setPickupPlacePhotoPreview('');
                                if (pickupPlaceFileInputRef.current) pickupPlaceFileInputRef.current.value = '';
                              }}
                              className="cursor-pointer bg-rose-50 hover:bg-rose-100 text-rose-700 text-[12px] font-extrabold h-[28px] px-2.5 rounded-lg flex items-center justify-center gap-1 transition-colors"
                            >
                              ❌ 삭제
                            </button>
                          )}
                        </div>

                        {/* One-click examples preset */}
                        <div className="pickup-example-area pt-1 border-t border-dotted border-gray-150">
                          <div className="pickup-example-title text-[11.5px] text-slate-450 font-extrabold">💡 원클릭 예시 적용:</div>
                          <div className="pickup-example-buttons">
                            <button
                              type="button"
                              onClick={() => setPickupPlacePhotoPreview('https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=300')}
                              className={`cursor-pointer w-full py-1 px-1 border rounded-lg text-[11px] font-extrabold bg-white hover:bg-gray-50 flex items-center justify-center min-h-[32px] transition-all ${pickupPlacePhotoPreview && pickupPlacePhotoPreview.includes('1513694203232') ? 'border-gray-900 ring-2 ring-gray-900/10 text-gray-900 font-black' : 'border-gray-200 text-gray-500'}`}
                            >
                              아파트 공동현관
                            </button>
                            <button
                              type="button"
                              onClick={() => setPickupPlacePhotoPreview('https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&q=80&w=300')}
                              className={`cursor-pointer w-full py-1 px-1 border rounded-lg text-[11px] font-extrabold bg-white hover:bg-gray-50 flex items-center justify-center min-h-[32px] transition-all ${pickupPlacePhotoPreview && pickupPlacePhotoPreview.includes('1506157786151') ? 'border-gray-900 ring-2 ring-gray-900/10 text-gray-900 font-black' : 'border-gray-200 text-gray-500'}`}
                            >
                              무인택배함/경비실
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 안내 수칙 / 경고 배너 */}
                  <div className="pickup-notice-box bg-indigo-50/75 text-indigo-805 border border-indigo-100">
                    🛡️ <strong>안전한 보상 배송 안내:</strong><br />
                    분실 및 분쟁 방지를 위해 포장 완료 사진과 수거 장소 사진을 등록해 주세요. 등록된 증빙 사진은 발생할 수 있는 피해 보상의 주요 근거로 활용됩니다.
                  </div>

                  {(pickupMethod === '문앞 수거' || pickupMethod === '대면 수거') && (
                    <div className="pickup-notice-box bg-amber-50/75 text-amber-805 border border-amber-100 mt-2">
                      💡 <strong>고가 및 귀중 등급 애장품 안내:</strong><br />
                      고가 애장품은 <u>대면 수거/경비실 수거/무인택배함</u>을 권장합니다.
                    </div>
                  )}
                  </form>
                </div>

                <div className="pickup-modal-footer">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShippingInputOrderId(null)}
                      className="cursor-pointer flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold text-center"
                    >
                      취소
                    </button>
                    <button
                      form="shipping-form"
                      type="submit"
                      className="cursor-pointer flex-1 py-2.5 bg-gray-900 text-white hover:bg-gray-800 rounded-xl text-xs font-black shadow-sm text-center"
                    >
                      방문수거 신청 완료하기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

              {/* Refund Request Modal */}
              {refundRequestOrderId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
                  <div className="bg-white rounded-2xl border border-rose-100 p-6 max-w-sm w-full space-y-4 text-left">
                    <h4 className="font-sans font-black text-rose-800 text-sm flex items-center gap-1.5">
                      <span>⚠️ 불일치/가품 안심 환불 신청</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      사전 고지 항목과의 현저한 가품 유도, 실물 파손, 혹은 미통지 훼손 하자가 검안된 경우 양식에 맞춰 신청해 주십시오. 구체적 사유를 근거로 보존 대금이 일시 동결됩니다.
                    </p>
                    <form onSubmit={handleSubmitRefundRequest} className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-450 mb-1">환불 신청 사유 입력 (필수)</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="예: 수령한 피규어 날개 부분에 상세 기술서에 없던 심각한 크랙이 존재하여 환불을 요구합니다."
                          value={refundReasonInput}
                          onChange={(e) => setRefundReasonInput(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl p-2.5 text-xs font-semibold focus:outline-none focus:border-rose-350"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setRefundRequestOrderId(null)}
                          className="cursor-pointer flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-semibold text-center"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="cursor-pointer flex-1 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-black shadow-sm text-center"
                        >
                          환불 접수신청
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

          {/* TAB 7: 알림 (Notifications) */}
          {activeTab === 'notifications' && (
            <div className="space-y-4">
              {notifications.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400 select-none space-y-1.5">
                  <p className="font-sans font-bold text-sm">접수된 알림이 없습니다.</p>
                  <p className="text-xs">새소식 혹은 입찰 경보가 수전되면 여기에 로그가 기록됩니다.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-2xl border border-gray-200/50">
                    <p className="text-xs text-slate-550 pl-1 font-medium">
                      읽지 않은 알림 <strong className="text-gray-900 font-mono font-extrabold">{notifications.filter(n => !n.isRead).length}</strong>개 대기 중
                    </p>
                    <button
                      onClick={onMarkAllNotificationsAsRead}
                      className="cursor-pointer text-[10px] font-sans font-black text-gray-900 hover:text-gray-900 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 transition-colors shadow-sm"
                    >
                      모든 알림 읽음 처리 ✓
                    </button>
                  </div>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                    {notifications.map((notif) => {
                      const badgeLabel = {
                        bid_success: { label: '경매성공', style: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                        outbid: { label: '상위입찰', style: 'bg-rose-50 text-rose-700 border-rose-200' },
                        due_soon: { label: '마감임박', style: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
                        win: { label: '낙찰성공', style: 'bg-purple-50 text-purple-700 border-purple-200' },
                        bid_interest: { label: '출품입찰', style: 'bg-gray-100 text-gray-900 border-gray-200' },
                        event_joined: { label: '참여완료', style: 'bg-gray-100 text-gray-700 border-gray-200' },
                      }[notif.type] || { label: '알림', style: 'bg-gray-50 text-gray-700 border-gray-200' };

                      return (
                        <div 
                          key={notif.id} 
                          onClick={() => onNotificationClick && onNotificationClick(notif)}
                          className={`cursor-pointer p-4 rounded-2xl bg-white border ${
                            notif.isRead ? 'border-gray-100 opacity-65' : 'border-gray-200 shadow-sm'
                          } text-xs flex gap-3 text-left transition-all hover:bg-gray-50/50 justify-between items-start`}
                        >
                          <div className="space-y-1.5 flex-1 pr-4 font-sans">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md border ${badgeLabel.style}`}>
                                {badgeLabel.label}
                              </span>
                              <span className="text-[10px] text-gray-400 font-mono">
                                {notif.createdAt ? notif.createdAt.replace('T', ' ').substring(0, 19) : ''}
                              </span>
                              {!notif.isRead && (
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-550" />
                              )}
                            </div>
                            
                            <p className="text-gray-700 font-medium leading-relaxed font-sans text-xs">
                              {notif.message}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* OVERLAY MODALS */}
      {selectedPostForView && (
        <PostModal
          post={selectedPostForView}
          onClose={() => setSelectedPostForView(null)}
          currentUserNickname={user.nickname}
          onUpdatePost={(updatedPost) => {
            // Keep synced
            const all = getCommunityPosts();
            const updated = all.map(p => p.id === updatedPost.id ? updatedPost : p);
            localStorage.setItem('shock_community_v3', JSON.stringify(updated));
            setSelectedPostForView(updatedPost);
            onRefreshData?.();
          }}
        />
      )}

      {isEditPostModalOpen && (
        <PostEditModal
          isOpen={isEditPostModalOpen}
          post={editPost}
          onClose={() => {
            setIsEditPostModalOpen(false);
            setEditPost(null);
          }}
          onSave={(updatedPost) => {
            const all = getCommunityPosts();
            const updated = all.map(p => p.id === updatedPost.id ? updatedPost : p);
            localStorage.setItem('shock_community_v3', JSON.stringify(updated));
            setIsEditPostModalOpen(false);
            setEditPost(null);
            alert('글이 수정 적용되었습니다.');
            onRefreshData?.();
          }}
        />
      )}

      {isEditProductModalOpen && (
        <ProductEditModal
          isOpen={isEditProductModalOpen}
          product={editProduct}
          onClose={() => {
            setIsEditProductModalOpen(false);
            setEditProduct(null);
          }}
          onSave={(updatedProduct) => {
            const all = getProducts();
            const updated = all.map(p => p.id === updatedProduct.id ? updatedProduct : p);
            localStorage.setItem('shock_products_v2', JSON.stringify(updated));
            setIsEditProductModalOpen(false);
            setEditProduct(null);
            alert('출품 등록 정보가 무사히 변경 적용되었습니다.');
            onRefreshData?.();
          }}
        />
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={() => {
          confirmAction();
          setIsConfirmOpen(false);
        }}
        onCancel={() => setIsConfirmOpen(false)}
      />

      {/* CONFIRM PURCHASE MODAL */}
      {isConfirmPurchaseModalOpen && selectedConfirmOrderId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs" onClick={(e) => e.stopPropagation()}>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-sm w-full space-y-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h4 className="font-sans font-black text-gray-900 text-lg tracking-tight">구매확정하시겠습니까?</h4>
            <p className="text-[13px] text-gray-600 font-medium leading-relaxed">
              구매확정 시 에스크로 금액이 판매자에게 정산되며, 이후 일반 환불 요청이 제한됩니다. 상품 상태와 구성품을 충분히 확인한 뒤 진행해주세요.
            </p>
            <div className="flex gap-2 pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsConfirmPurchaseModalOpen(false);
                  setSelectedConfirmOrderId(null);
                }}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-bold transition-colors cursor-pointer"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => handleConfirmPurchase(selectedConfirmOrderId)}
                className="flex-1 py-3 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                구매확정
              </button>
            </div>
          </div>
        </div>
      )}

      {/* REFUND MODAL */}
      {isRefundModalOpen && selectedRefundOrderId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-rose-100 p-6 max-w-sm w-full space-y-4 max-h-[90vh] overflow-y-auto text-left relative">
            {(() => {
              const ord = getOrders().find(o => o.id === selectedRefundOrderId);
              if (!ord) return <div>주문 정보를 찾을 수 없습니다.</div>;
              return (
                <form onSubmit={handleRefundSubmit}>
                  <div className="space-y-4 text-left">
                    <h4 className="font-sans font-black text-rose-800 text-sm flex items-center gap-2">
                      <AlertCircle size={16} /> 환불 요청
                    </h4>
                    
                    <div className="bg-rose-50/50 rounded-xl p-3 border border-rose-100 space-y-2">
                      <p className="text-[11px] text-gray-900 font-bold">{ord.productTitle || (ord as any).title || (ord as any).productName}</p>
                      <p className="text-[10px] text-gray-500 font-mono">주문번호: {ord.id}</p>
                      <p className="text-[10px] text-gray-500">결제금액: <strong className="text-gray-900 text-xs">{((ord as any).totalPaymentAmount || ord.finalPrice || 0).toLocaleString()}원</strong></p>
                      {ord.refundAvailableUntil && (
                        <p className="text-[10px] text-rose-600 font-bold mt-1">
                          환불 가능 기한: {ord.refundAvailableUntil.replace('T', ' ').substring(0, 16)}까지
                        </p>
                      )}
                    </div>

                    <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                      상품 수령 후 3일 이내에는 환불 요청이 가능합니다. 접수된 환불 요청은 판매자 확인 후 처리됩니다.
                    </p>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600">환불 사유 선택</label>
                      <select
                        value={refundReasonType}
                        onChange={(e) => setRefundReasonType(e.target.value)}
                        className="w-full text-xs py-2 px-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500"
                        required
                      >
                        <option value="">사유를 선택해주세요</option>
                        <option value="상품 상태가 설명과 달라요">상품 상태가 설명과 달라요</option>
                        <option value="배송 중 파손이 있어요">배송 중 파손이 있어요</option>
                        <option value="구성품이 누락되었어요">구성품이 누락되었어요</option>
                        <option value="단순 변심">단순 변심</option>
                        <option value="기타">기타</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-gray-600">상세 사유 입력</label>
                      <textarea
                        value={refundReasonDetail}
                        onChange={(e) => setRefundReasonDetail(e.target.value)}
                        placeholder="환불 요청 사유를 구체적으로 입력해주세요."
                        className="w-full text-xs p-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 resize-none h-24"
                        required
                      />
                    </div>

                    {refundValidationError && (
                      <p className="text-[10px] text-rose-600 font-bold text-center bg-rose-50 py-1.5 rounded-lg border border-rose-100">
                        {refundValidationError}
                      </p>
                    )}

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsRefundModalOpen(false);
                          setSelectedRefundOrderId(null);
                        }}
                        className="cursor-pointer flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-xs font-bold"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="cursor-pointer flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-200 transition-all"
                      >
                        환불 요청하기
                      </button>
                    </div>
                  </div>
                </form>
              );
            })()}
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {isOrderDetailOpen && selectedOrderId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-sm w-full space-y-4 max-h-[90vh] overflow-y-auto text-left">
            {(() => {
              const ord = getOrders().find(o => o.id === selectedOrderId);
              if (!ord) return <div>주문 정보를 찾을 수 없습니다.</div>;
              return (
                <>
                  <h4 className="font-sans font-black text-gray-900 text-sm border-b pb-2">주문 상세</h4>
                  <div className="space-y-2 text-xs">
                    <p><span className="text-gray-500 w-20 inline-block font-bold">주문번호:</span> <span className="font-mono">{ord.id}</span></p>
                    <p><span className="text-gray-500 w-20 inline-block font-bold">상품명:</span> <span className="font-bold">{ord.productTitle || (ord as any).title || (ord as any).productName}</span></p>
                    <p><span className="text-gray-500 w-20 inline-block font-bold">판매자:</span> <span>{ord.sellerNickname}</span></p>
                    <p><span className="text-gray-500 w-20 inline-block font-bold">상품금액:</span> <span>{((ord as any).itemPrice || ord.finalPrice || 0).toLocaleString()}원</span></p>
                    <p><span className="text-gray-500 w-20 inline-block font-bold">수수료:</span> <span>{((ord as any).serviceFee || 0).toLocaleString()}원</span></p>
                    <p><span className="text-gray-500 w-20 inline-block font-bold">배송비:</span> <span>{((ord as any).shippingFee || 3000).toLocaleString()}원</span></p>
                    <p><span className="text-gray-500 w-20 inline-block font-bold">총 결제금액:</span> <span className="font-bold text-rose-600">{((ord as any).totalPaymentAmount || ord.finalPrice || 0).toLocaleString()}원</span></p>
                    
                    <div className="h-px bg-gray-100 my-2" />
                    
                    <p><span className="text-gray-500 w-20 inline-block font-bold">결제상태:</span> <span>{ord.paymentStatus === 'paid' ? '결제완료' : ord.paymentStatus}</span></p>
                    <p><span className="text-gray-500 w-20 inline-block font-bold">에스크로:</span> <span>{ord.escrowStatus === 'holding' ? '보관중' : ord.escrowStatus === 'released' ? '정산완료' : ord.escrowStatus}</span></p>
                    <p><span className="text-gray-500 w-20 inline-block font-bold">배송상태:</span> <span>{
                      ord.deliveryStatus === 'preparing' ? '배송대기' :
                      ord.deliveryStatus === 'shipping' ? '배송중' :
                      ord.deliveryStatus === 'delivered' ? '수령완료' : ord.deliveryStatus
                    }</span></p>
                    
                    {ord.trackingNumber && (
                      <>
                        <p><span className="text-gray-500 w-20 inline-block font-bold">발송정보:</span> <span>{ord.courier || (ord as any).carrier} / {ord.trackingNumber}</span></p>
                        <p><span className="text-gray-500 w-20 inline-block font-bold">발송일:</span> <span>{ord.shippedAt?.substring(0, 10)}</span></p>
                      </>
                    )}
                    
                    {ord.shippingAddress && (
                      <div className="mt-2 text-[10px] bg-gray-50 p-2 rounded">
                        <p><span className="font-bold text-gray-500">배송지:</span> {ord.shippingAddress.receiverName} ({ord.shippingAddress.phone})</p>
                        <p>{ord.shippingAddress.address1} {ord.shippingAddress.address2}</p>
                      </div>
                    )}
                    
                    {ord.refundAvailableUntil && ord.orderStatus === 'delivered' && (
                      <p className="mt-2 text-[10px] text-red-500 font-bold bg-rose-50 p-1.5 rounded">
                        환불 가능 기한: {ord.refundAvailableUntil.replace('T', ' ').substring(0, 16)}까지
                      </p>
                    )}
                  </div>
                  
                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setIsOrderDetailOpen(false);
                        setSelectedOrderId(null);
                      }}
                      className="px-4 py-2 bg-gray-900 text-white rounded-xl text-xs font-bold"
                    >
                      닫기
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* RECEIVE CONFIRM MODAL */}
      {isReceiveConfirmOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 max-w-sm w-full space-y-4">
            <h4 className="font-sans font-black text-gray-900 text-sm">상품을 수령하셨나요?</h4>
            <p className="text-xs text-gray-600 font-medium leading-relaxed">수령확인을 하면 환불 가능 기간 3일이 시작됩니다. 상품 상태와 구성품을 확인한 뒤 진행해주세요.</p>
            <p className="text-[10px] text-gray-500 font-sans leading-relaxed">수령확인 후 3일 이내에는 환불 요청이 가능하며, 구매확정을 완료하면 판매자에게 정산됩니다.</p>
            
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  setIsReceiveConfirmOpen(false);
                  setSelectedReceiveOrderId(null);
                }}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-xs font-bold transition-colors"
              >
                취소
              </button>
              <button
                onClick={() => {
                  if (selectedReceiveOrderId) {
                    const orderId = selectedReceiveOrderId;
                    buyerConfirmDelivery(orderId);
                    
                    const updatedOrders = getOrders();
                    const idx = updatedOrders.findIndex(o => o.id === orderId);
                    if (idx > -1) {
                        updatedOrders[idx].deliveryStatus = "delivered";
                        updatedOrders[idx].orderStatus = "delivered";
                        (updatedOrders[idx] as any).deliveredAt = new Date().toISOString();
                        (updatedOrders[idx] as any).refundAvailableUntil = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
                        saveOrders(updatedOrders);
                        
                        const updatedProducts = getProducts();
                        const pIdx = updatedProducts.findIndex(p => String(p.id) === String(updatedOrders[idx].productId) || String(p.orderId) === String(updatedOrders[idx].id));
                        if(pIdx > -1) {
                          updatedProducts[pIdx].deliveryStatus = "delivered";
                          (updatedProducts[pIdx] as any).deliveredAt = (updatedOrders[idx] as any).deliveredAt;
                          updatedProducts[pIdx].orderId = updatedOrders[idx].id;
                          saveProducts(updatedProducts);
                        }
                    }
                    onConfirmReceived(orderId); // Trigger if legacy
                    
                    loadLocalFinanceAndMeetups();
                    if (onRefreshData) onRefreshData();
                    
                    setIsReceiveConfirmOpen(false);
                    setSelectedReceiveOrderId(null);
                    
                    alert('상품 수령확인이 완료되었습니다. 3일 이내에 환불을 요청할 수 있으며, 이의가 없을 시 구매확정을 눌러 거래를 종료해주세요.');
                  }
                }}
                className="flex-1 py-2.5 bg-gray-900 hover:bg-gray-900 text-white rounded-xl text-xs font-bold transition-colors"
              >
                수령확인
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setDeleteType(null);
          setDeleteTargetId(null);
        }}
        onConfirm={() => {
          if (deleteTargetId && deleteType) {
            if (deleteType === 'payment') {
              deletePaymentMethod(user.id, deleteTargetId);
            } else if (deleteType === 'payout') {
              deletePayoutAccount(user.id, deleteTargetId);
            } else if (deleteType === 'address') {
              deleteAddress(user.id, deleteTargetId);
            }
            loadLocalFinanceAndMeetups();
          }
          setIsConfirmModalOpen(false);
          setDeleteType(null);
          setDeleteTargetId(null);
        }}
        title={confirmModalTitle}
        description={confirmModalMessage}
      />

    </div>
  );
}
