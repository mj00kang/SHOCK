import React, { useState, useEffect } from 'react';
import { 
  Users, MessageSquare, Plus, Search, 
  Sparkles, Filter, X, ShieldCheck 
} from 'lucide-react';
import { 
  getMeetupRooms, 
  saveMeetupRooms, 
  getJoinedMeetupRooms,
  MeetupRoom 
} from '../utils/meetupGenerator';
import MeetupCard from './MeetupCard';

interface MeetupSectionProps {
  onEnterRoom: (roomId: string) => void;
}

export default function MeetupSection({ onEnterRoom }: MeetupSectionProps) {
  const [rooms, setRooms] = useState<MeetupRoom[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState<'all' | 'POP' | 'SPORTS' | 'ANALOG'>('all');
  const [joinedRoomIds, setJoinedRoomIds] = useState<string[]>([]);
  
  // Custom Modal Creation state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [newRoomGroup, setNewRoomGroup] = useState<'POP' | 'SPORTS' | 'ANALOG'>('POP');
  const [newRoomSub, setNewRoomSub] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [newRoomMax, setNewRoomMax] = useState(50);
  const [validationError, setValidationError] = useState('');

  // Initial load
  const loadRooms = () => {
    setRooms(getMeetupRooms());
    
    // Load joined rooms for current logged in user
    try {
      const cachedUser = localStorage.getItem('shock_current_user');
      if (cachedUser) {
        const u = JSON.parse(cachedUser);
        const joined = getJoinedMeetupRooms();
        const userJoinedIds = joined
          .filter((r: any) => r.userId === u.id)
          .map((r: any) => r.roomId);
        setJoinedRoomIds(userJoinedIds);
      }
    } catch (e) {
      console.error('Error loading joined meetups in MeetupSection', e);
    }
  };

  useEffect(() => {
    loadRooms();
  }, []);

  // Filter logic
  const filteredRooms = rooms.filter(room => {
    // Group filter
    if (filterGroup !== 'all' && room.categoryGroup !== filterGroup) {
      return false;
    }
    // Search query matches title or desc or subcategory
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = room.title.toLowerCase().includes(q);
      const matchDesc = room.description.toLowerCase().includes(q);
      const matchSub = room.subCategory.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchSub) return false;
    }
    return true;
  });

  // Handle Form Submission for Create Meetup
  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Field Verifications
    if (!newRoomTitle.trim()) {
      setValidationError('소모임 이름을 입력해 주세요.');
      return;
    }
    if (!newRoomGroup) {
      setValidationError('대분류를 지정해 주세요.');
      return;
    }
    if (!newRoomSub.trim()) {
      setValidationError('소분류 카테고리를 입력해 주세요.');
      return;
    }
    if (!newRoomDesc.trim()) {
      setValidationError('설명을 입력해 주세요.');
      return;
    }

    // Generate unique ID based on title slug or string
    const id = `room-${Date.now()}`;
    const newRoom: MeetupRoom = {
      id,
      title: newRoomTitle.trim(),
      categoryGroup: newRoomGroup,
      subCategory: newRoomSub.trim(),
      description: newRoomDesc.trim(),
      memberCount: 1, // Maker is member 1
      onlineCount: 1,
      lastMessageAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    const currentRooms = getMeetupRooms();
    const updatedRooms = [newRoom, ...currentRooms];
    saveMeetupRooms(updatedRooms);
    
    // Refresh UI & Close Form reset
    setRooms(updatedRooms);
    setIsCreateOpen(false);
    setNewRoomTitle('');
    setNewRoomSub('');
    setNewRoomDesc('');
    setNewRoomMax(50);
  };

  // Provide suggested subcategories based on selection
  const getSubcategoryPlaceholders = () => {
    switch (newRoomGroup) {
      case 'POP': return '예: 피규어, 트레이딩카드, 아이돌 포카';
      case 'SPORTS': return '예: 스포츠카드, 한정판 운동화, 빈티지 유니폼';
      case 'ANALOG': return '예: 희귀 LP, 빈티지 카메라, 레트로 기기';
      default: return '예: 포카교환';
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Search Header and Action Buttons */}
      <div className="bg-white border border-gray-200 p-4 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search bar inputs */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="소모임 검색 (예: 카드, 운동화, LP)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs text-gray-900 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:bg-white rounded-xl py-2.5 pl-9 pr-4 outline-none transition-all font-sans"
          />
          <Search size={14} className="absolute left-3.5 top-3.5 text-gray-400" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-[9px] bg-gray-200 hover:bg-gray-300 text-gray-600 px-1.5 py-0.5 rounded font-bold cursor-pointer"
            >
              지우기
            </button>
          )}
        </div>

        {/* Action button - Create Meetup */}
        <button
          onClick={() => setIsCreateOpen(true)}
          className="cursor-pointer bg-gray-800 hover:bg-gray-900 text-white font-sans font-bold text-xs px-4.5 py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-sm transition-all"
        >
          <Plus size={14} className="stroke-[3]" />
          <span>소모임 만들기</span>
        </button>
      </div>

      {/* Grid Filter Bar and results indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: '전체 소모임' },
            { id: 'POP', label: '🧸 POP Culture' },
            { id: 'SPORTS', label: '🏀 SPORTS' },
            { id: 'ANALOG', label: '📻 ANALOG' }
          ].map(grp => (
            <button
              key={grp.id}
              onClick={() => setFilterGroup(grp.id as any)}
              className={`cursor-pointer px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                filterGroup === grp.id
                  ? 'bg-gray-900 text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {grp.label}
            </button>
          ))}
        </div>

        <p className="text-[11px] text-gray-500 font-bold">
          검색된 소모임: <strong className="text-gray-900 font-extrabold font-mono">{filteredRooms.length}개</strong>
        </p>
      </div>

      {/* Meetups Cards Reactive Grid */}
      {filteredRooms.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRooms.map(room => (
            <MeetupCard
              key={room.id}
              room={room}
              onEnter={onEnterRoom}
              isJoined={joinedRoomIds.includes(room.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border border-dashed border-slate-205 rounded-2xl shadow-sm">
          <span className="block text-4xl mb-2 select-none">💬</span>
          <h3 className="font-sans font-black text-gray-700 text-sm">일치하는 소모임이 없습니다</h3>
          <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
            원하는 테마의 수집가 모임이 없다면 우측 상단의 "소모임 만들기"를 사용해 직접 수집가들의 둥지를 틀어보세요!
          </p>
        </div>
      )}

      {/* Creation Overlay Modal Form */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in text-left">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 w-full max-w-md shadow-lg space-y-5 animate-scale-up">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-gray-100 rounded-lg text-gray-800">
                  <Sparkles size={16} />
                </span>
                <h3 className="font-sans font-black text-gray-900 text-lg">
                  새로운 소모임 개설하기
                </h3>
              </div>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="cursor-pointer text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-50"
              >
                <X size={18} />
              </button>
            </div>

            {/* Verification Alert banner */}
            {validationError && (
              <div className="bg-rose-50 border border-rose-100 text-rose-700 p-3 rounded-xl text-xs font-bold leading-relaxed">
                ⚠️ {validationError}
              </div>
            )}

            {/* Modal fields Form */}
            <form onSubmit={handleCreateRoom} className="space-y-4">
              
              {/* 소모임 이름 */}
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-700 flex items-center gap-1">
                  소모임 이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="예: 레전드 포켓몬 카드 양도방"
                  value={newRoomTitle}
                  onChange={(e) => setNewRoomTitle(e.target.value)}
                  className="w-full text-xs text-gray-900 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:bg-white rounded-xl p-3 outline-none transition-all font-sans"
                />
              </div>

              {/* Group selection 대분류 & 소분류 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-700">
                    대분류 <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newRoomGroup}
                    onChange={(e) => setNewRoomGroup(e.target.value as any)}
                    className="w-full text-xs text-gray-900 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:bg-white rounded-xl p-3 outline-none transition-all font-sans cursor-pointer"
                  >
                    <option value="POP">🧸 POP Culture</option>
                    <option value="SPORTS">🏀 SPORTS</option>
                    <option value="ANALOG">📻 ANALOG</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-gray-700">
                    소분류 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder={getSubcategoryPlaceholders()}
                    value={newRoomSub}
                    onChange={(e) => setNewRoomSub(e.target.value)}
                    className="w-full text-xs text-gray-900 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:bg-white rounded-xl p-3 outline-none transition-all font-sans"
                  />
                </div>
              </div>

              {/* 소모임 설명 */}
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-700">
                  설명 <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  placeholder="모임의 목적이나 교류 팁, 가품 제재 수칙 등을 적어주세요."
                  value={newRoomDesc}
                  onChange={(e) => setNewRoomDesc(e.target.value)}
                  className="w-full text-xs text-gray-900 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:bg-white rounded-xl p-3 outline-none transition-all font-sans resize-none"
                />
              </div>

              {/* 최대 인원 */}
              <div className="space-y-1">
                <label className="text-xs font-black text-gray-700">
                  최대 참여 정원 (명)
                </label>
                <input
                  type="number"
                  min={10}
                  max={200}
                  value={newRoomMax}
                  onChange={(e) => setNewRoomMax(Number(e.target.value))}
                  className="w-full text-xs text-gray-900 bg-gray-50 border border-gray-200 focus:border-gray-300 focus:bg-white rounded-xl p-3 outline-none transition-all font-sans"
                />
                <span className="text-[10px] text-gray-400">최소 10명, 최대 200명까지 지정이 가능합니다.</span>
              </div>

              {/* Active info badge */}
              <div className="bg-gray-50 border border-gray-100 p-3 rounded-xl flex items-center gap-2 text-[10px] text-gray-500">
                <ShieldCheck size={14} className="text-emerald-500 shrink-0" />
                <span>개설 시 본인이 첫 번째 정식 멤버로 즉시 등록되어 대화할 수 있습니다.</span>
              </div>

              {/* Back controls buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="cursor-pointer flex-1 bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs font-bold py-3.5 rounded-xl transition-all text-center"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="cursor-pointer flex-1 bg-gray-900 text-white hover:bg-gray-900 text-xs font-bold py-3.5 rounded-xl transition-all text-center"
                >
                  개설하기
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
