export interface Address {
  id: string;
  userId: string;
  label: string; // 예: 집, 회사, 학교
  receiverName: string;
  phone: string;
  postalCode: string;
  address1: string;
  address2: string;
  deliveryMemo?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

const ADDRESS_KEY = 'shock_addresses';

export function getAddresses(userId: string): Address[] {
  try {
    const raw = localStorage.getItem(ADDRESS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed.filter((addr: Address) => addr.userId === userId);
    }
    return [];
  } catch (e) {
    console.error('getAddresses failed', e);
    return [];
  }
}

export function saveAddressesToStorage(userId: string, userAddresses: Address[]) {
  try {
    const raw = localStorage.getItem(ADDRESS_KEY);
    let allAddresses: Address[] = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(allAddresses)) allAddresses = [];
    
    // Filter out existing addresses of this user, then append
    allAddresses = allAddresses.filter(addr => addr.userId !== userId).concat(userAddresses);
    localStorage.setItem(ADDRESS_KEY, JSON.stringify(allAddresses));
  } catch (e) {
    console.error('saveAddresses failed', e);
  }
}

export function addAddress(userId: string, addressData: Omit<Address, 'id' | 'userId' | 'isDefault' | 'createdAt' | 'updatedAt'>, makeDefault = false): Address {
  const userAddresses = getAddresses(userId);
  
  // If this is the first address, it should be default
  const isDefault = makeDefault || userAddresses.length === 0;
  
  const newAddress: Address = {
    ...addressData,
    id: `addr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    userId,
    isDefault,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  if (isDefault) {
    // Turn off default status for other addresses
    userAddresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  userAddresses.push(newAddress);
  saveAddressesToStorage(userId, userAddresses);
  return newAddress;
}

export function updateAddress(userId: string, addressId: string, updatedFields: Partial<Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Address | null {
  const userAddresses = getAddresses(userId);
  const idx = userAddresses.findIndex(addr => addr.id === addressId);
  if (idx === -1) return null;
  
  const isNowDefault = updatedFields.isDefault;
  if (isNowDefault) {
    userAddresses.forEach(addr => {
      addr.isDefault = false;
    });
  }
  
  userAddresses[idx] = {
    ...userAddresses[idx],
    ...updatedFields,
    updatedAt: new Date().toISOString()
  };
  
  // Fallback check: if there is only 1 address left, it must be default
  if (userAddresses.length === 1) {
    userAddresses[0].isDefault = true;
  }
  
  saveAddressesToStorage(userId, userAddresses);
  return userAddresses[idx];
}

export function deleteAddress(userId: string, addressId: string): Address[] {
  let userAddresses = getAddresses(userId);
  const target = userAddresses.find(addr => addr.id === addressId);
  const wasDefault = target?.isDefault;
  
  userAddresses = userAddresses.filter(addr => addr.id !== addressId);
  
  if (wasDefault && userAddresses.length > 0) {
    // Automatically set the first remaining address as default
    userAddresses[0].isDefault = true;
    userAddresses[0].updatedAt = new Date().toISOString();
  }
  
  saveAddressesToStorage(userId, userAddresses);
  return userAddresses;
}

export function setDefaultAddress(userId: string, addressId: string): Address[] {
  const userAddresses = getAddresses(userId);
  userAddresses.forEach(addr => {
    addr.isDefault = addr.id === addressId;
    addr.updatedAt = new Date().toISOString();
  });
  saveAddressesToStorage(userId, userAddresses);
  return userAddresses;
}
