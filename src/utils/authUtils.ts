// User data structures and authentication utilities

export interface User {
  id: string;
  email: string;
  nickname: string;
  password?: string;
  favoriteCategories: string[];
  createdAt: string;
  joinedMeetupRoomIds?: string[]; // list of joined room IDs
  role?: 'user' | 'admin';
}

export interface CurrentUser {
  id: string;
  email: string;
  nickname: string;
  favoriteCategories: string[];
  role?: 'user' | 'admin';
}

const USERS_KEY = 'shock_users';
const CURRENT_USER_KEY = 'shock_current_user';
const JOINED_MEETUPS_KEY = 'shock_joined_meetup_rooms';

export function normalizeUser(user: any): User {
  if (!user) return user;
  const isAdminEmail = user.email?.toLowerCase() === 'admin@shock.co.kr' || user.email?.toLowerCase() === 'admin@shock.com';
  return {
    ...user,
    role: isAdminEmail ? 'admin' : 'user'
  };
}

export function normalizeCurrentUser(user: any): CurrentUser | null {
  if (!user) return null;
  const isAdminEmail = user.email?.toLowerCase() === 'admin@shock.co.kr' || user.email?.toLowerCase() === 'admin@shock.com';
  return {
    ...user,
    role: isAdminEmail ? 'admin' : 'user'
  };
}

// Get all registered users
export function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    const users = raw ? JSON.parse(raw) : [];
    
    // Seed admin if it doesn't exist
    const hasAdmin = users.some((u: any) => u.email?.toLowerCase() === 'admin@shock.co.kr');
    if (!hasAdmin) {
      const adminUser: User = {
        id: 'usr-admin',
        email: 'admin@shock.co.kr',
        nickname: '최고관리자',
        password: 'admin',
        favoriteCategories: ['피규어'],
        createdAt: new Date().toISOString(),
        role: 'admin'
      };
      users.push(adminUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
    
    return users.map(normalizeUser);
  } catch (e) {
    console.error('Failed to parse users:', e);
    return [];
  }
}

// Save all registered users
export function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

// Get currently logged-in user
export function getCurrentUser(): CurrentUser | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    const user = JSON.parse(raw);
    return normalizeCurrentUser(user);
  } catch {
    return null;
  }
}

// Check if a user is logged in
export function isLoggedIn(): boolean {
  return getCurrentUser() !== null;
}

// Register a new user
export function registerUser(
  email: string,
  nickname: string,
  password: string,
  favoriteCategories: string[]
): { success: boolean; message: string; user?: CurrentUser } {
  const users = getUsers();

  // Basic validations
  if (!email || !email.includes('@')) {
    return { success: false, message: '올바른 이메일 형식을 입력해주세요.' };
  }
  if (!nickname.trim()) {
    return { success: false, message: '닉네임을 입력해주세요.' };
  }
  if (!password || password.length < 6) {
    return { success: false, message: '비밀번호는 최소 6자 이상이어야 합니다.' };
  }
  if (!favoriteCategories || favoriteCategories.length === 0) {
    return { success: false, message: '비밀 취향 카테고리를 최소 1개 이상 선택해 주세요.' };
  }

  // Duplicate checks
  if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { success: false, message: '이미 등록된 이메일 계정입니다.' };
  }
  if (users.some(u => u.nickname.toLowerCase() === nickname.trim().toLowerCase())) {
    return { success: false, message: '이미 사용 중인 닉네임입니다.' };
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    email,
    nickname: nickname.trim(),
    password,
    favoriteCategories,
    createdAt: new Date().toISOString(),
    joinedMeetupRoomIds: [],
    role: 'user'
  };

  users.push(newUser);
  saveUsers(users);

  // Auto-login
  const sessionUser: CurrentUser = {
    id: newUser.id,
    email: newUser.email,
    nickname: newUser.nickname,
    favoriteCategories: newUser.favoriteCategories,
    role: 'user'
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));

  // Bridge session state with legacy user key shock_user_v2 so existing sections function correctly
  const legacyUser = {
    id: newUser.id,
    nickname: newUser.nickname,
    email: newUser.email,
    role: 'user',
    coins: 5000000,
    likes: [],
    joinedLuckyEvents: []
  };
  localStorage.setItem('shock_user_v2', JSON.stringify(legacyUser));

  return { success: true, message: '회원가입이 완료되었습니다.', user: sessionUser };
}

// Login a user
export function loginUser(email: string, password: string): { success: boolean; message: string; user?: CurrentUser } {
  if (!email) {
    return { success: false, message: '이메일을 입력해 주세요.' };
  }
  if (!password) {
    return { success: false, message: '비밀번호를 입력해 주세요.' };
  }

  const users = getUsers();
  const found = users.find(u => u.email.toLowerCase() === email.toLowerCase());

  if (!found || found.password !== password) {
    return { success: false, message: '이메일 또는 비밀번호가 일치하지 않습니다.' };
  }

  const normalizedFound = normalizeUser(found);

  const sessionUser: CurrentUser = {
    id: normalizedFound.id,
    email: normalizedFound.email,
    nickname: normalizedFound.nickname,
    favoriteCategories: normalizedFound.favoriteCategories,
    role: normalizedFound.role
  };

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(sessionUser));

  // Sync back to shock_user_v2 for existing pages functionality, preserving existing likes/coins if any or starting fresh
  let legacyUser: any = null;
  try {
    const cached = localStorage.getItem('shock_user_v2');
    if (cached) {
      legacyUser = JSON.parse(cached);
    }
  } catch {}

  if (!legacyUser || legacyUser.id !== found.id) {
    legacyUser = {
      id: found.id,
      nickname: found.nickname,
      email: found.email,
      role: normalizedFound.role,
      coins: legacyUser ? legacyUser.coins : 5000000,
      likes: legacyUser ? legacyUser.likes : [],
      joinedLuckyEvents: legacyUser ? legacyUser.joinedLuckyEvents : []
    };
    localStorage.setItem('shock_user_v2', JSON.stringify(legacyUser));
  } else {
    legacyUser.role = normalizedFound.role;
    localStorage.setItem('shock_user_v2', JSON.stringify(legacyUser));
  }

  return { success: true, message: '로그인되었습니다.', user: sessionUser };
}

// Logout a user
export function logoutUser() {
  localStorage.removeItem(CURRENT_USER_KEY);
  // Optional: keep shock_user_v2 but we can clear or keep it
}

// Joined meetup storage structures
export interface JoinedMeetupRoom {
  userId: string;
  roomId: string;
  joinedAt: string;
  lastVisitedAt: string;
}

export function getJoinedMeetupRooms(userId: string): JoinedMeetupRoom[] {
  try {
    const raw = localStorage.getItem(JOINED_MEETUPS_KEY);
    const rooms: JoinedMeetupRoom[] = raw ? JSON.parse(raw) : [];
    return rooms.filter(r => r.userId === userId);
  } catch {
    return [];
  }
}

export function joinMeetupRoom(userId: string, roomId: string): boolean {
  try {
    const raw = localStorage.getItem(JOINED_MEETUPS_KEY);
    const rooms: JoinedMeetupRoom[] = raw ? JSON.parse(raw) : [];
    
    const exists = rooms.some(r => r.userId === userId && r.roomId === roomId);
    if (exists) return false;

    const newJoined: JoinedMeetupRoom = {
      userId,
      roomId,
      joinedAt: new Date().toISOString(),
      lastVisitedAt: new Date().toISOString()
    };

    rooms.push(newJoined);
    localStorage.setItem(JOINED_MEETUPS_KEY, JSON.stringify(rooms));

    // Also sync back to User data model
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    if (userIndex > -1) {
      if (!users[userIndex].joinedMeetupRoomIds) {
        users[userIndex].joinedMeetupRoomIds = [];
      }
      if (!users[userIndex].joinedMeetupRoomIds?.includes(roomId)) {
        users[userIndex].joinedMeetupRoomIds?.push(roomId);
        saveUsers(users);
      }
    }

    return true;
  } catch (e) {
    console.error('Failed to join meetup room:', e);
    return false;
  }
}

export function updateMeetupLastVisited(userId: string, roomId: string) {
  try {
    const raw = localStorage.getItem(JOINED_MEETUPS_KEY);
    const rooms: JoinedMeetupRoom[] = raw ? JSON.parse(raw) : [];
    
    const foundIndex = rooms.findIndex(r => r.userId === userId && r.roomId === roomId);
    if (foundIndex > -1) {
      rooms[foundIndex].lastVisitedAt = new Date().toISOString();
      localStorage.setItem(JOINED_MEETUPS_KEY, JSON.stringify(rooms));
    }
  } catch (e) {
    console.error('Failed to update last visited time:', e);
  }
}

export function updateNicknameAndSync(userId: string, newNickname: string): { success: boolean; message: string } {
  if (!newNickname.trim()) {
    return { success: false, message: '닉네임은 공백일 수 없습니다.' };
  }
  if (newNickname.trim().length < 2) {
    return { success: false, message: '닉네임은 최소 2글자 이상이어야 합니다.' };
  }

  // 1. Check duplicate nickname in the user database
  const users = getUsers();
  const duplicate = users.some(u => u.id !== userId && u.nickname.toLowerCase() === newNickname.trim().toLowerCase());
  if (duplicate) {
    return { success: false, message: '이미 사용 중인 닉네임입니다.' };
  }

  // 2. Update in user database (shock_users)
  const userIndex = users.findIndex(u => u.id === userId);
  if (userIndex !== -1) {
    users[userIndex].nickname = newNickname.trim();
    saveUsers(users);
  }

  // 3. Update in current user session (shock_current_user)
  const rawCur = localStorage.getItem(CURRENT_USER_KEY);
  if (rawCur) {
    try {
      const curObj = JSON.parse(rawCur);
      if (curObj && curObj.id === userId) {
        curObj.nickname = newNickname.trim();
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(curObj));
      }
    } catch (e) {
      console.error(e);
    }
  }

  // 4. Update in legacy user (shock_user_v2)
  const rawLegacy = localStorage.getItem('shock_user_v2');
  if (rawLegacy) {
    try {
      const legacyObj = JSON.parse(rawLegacy);
      if (legacyObj && legacyObj.id === userId) {
        legacyObj.nickname = newNickname.trim();
        localStorage.setItem('shock_user_v2', JSON.stringify(legacyObj));
      }
    } catch (e) {
      console.error(e);
    }
  }

  return { success: true, message: '닉네임이 성공적으로 변경되었습니다.' };
}
