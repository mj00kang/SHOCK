import React, { useState } from 'react';
import { ArrowLeft, Check, AlertCircle, Sparkles, Mail, User, Lock, Heart } from 'lucide-react';
import { registerUser } from '../utils/authUtils';

interface SignupPageProps {
  onBackToMain: () => void;
  onNavigateToLogin: () => void;
  onSignupSuccess: (user: any) => void;
}

export default function SignupPage({
  onBackToMain,
  onNavigateToLogin,
  onSignupSuccess
}: SignupPageProps) {
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [favoriteCategories, setFavoriteCategories] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCategoryToggle = (category: string) => {
    if (favoriteCategories.includes(category)) {
      setFavoriteCategories(favoriteCategories.filter(c => c !== category));
    } else {
      setFavoriteCategories([...favoriteCategories, category]);
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Verifications before execution
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('올바른 이메일 주소를 입력해주세요.');
      return;
    }
    if (!nickname.trim()) {
      setErrorMsg('용맹스러운 닉네임을 입력해 주세요.');
      return;
    }
    if (!password) {
      setErrorMsg('비밀번호를 입력해 주세요.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('비밀번호는 최소 6자 이상이어야 합니다.');
      return;
    }
    if (password !== passwordConfirm) {
      setErrorMsg('비밀번호와 비밀번호 확인이 일치하지 않습니다.');
      return;
    }
    if (favoriteCategories.length === 0) {
      setErrorMsg('관심 카테고리를 최소 1개 이상 선택해 주세요.');
      return;
    }

    const result = registerUser(email, nickname, password, favoriteCategories);
    if (result.success && result.user) {
      onSignupSuccess(result.user);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 relative">
        {/* Floating Back button in same style as community */}
        <button
          onClick={onBackToMain}
          className="page-back-link group absolute left-6 top-6 !mb-0"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span>메인으로 돌아가기</span>
        </button>

        {/* Mascot / Header */}
        <div className="text-center mt-4 mb-7">
          <div className="inline-flex justify-center items-center h-12 w-12 bg-gray-100 rounded-2xl text-gray-800 mb-3 shadow-sm">
            <svg viewBox="0 0 100 100" className="w-8 h-8 drop-shadow-sm">
              <ellipse cx="50" cy="55" rx="34" ry="28" fill="#6B7280" />
              <path d="M 50 28 Q 58 12 68 16 Q 64 30 54 30 Z" fill="#6B7280" />
              <ellipse cx="50" cy="64" rx="23" ry="17" fill="#ffffff" />
              <circle cx="60" cy="48" r="4.5" fill="#0f172a" />
              <circle cx="61" cy="46" r="1.5" fill="#ffffff" />
              <circle cx="44" cy="48" r="4.5" fill="#0f172a" />
              <circle cx="45" cy="46" r="1.5" fill="#ffffff" />
              {/* Cute heart spark */}
              <circle cx="67" cy="54" r="3.5" fill="#9CA3AF" opacity="0.8" />
            </svg>
          </div>
          <h2 className="font-sans font-black text-2xl text-gray-900 tracking-tight">회원가입</h2>
          <p className="text-xs text-gray-500 mt-2 font-medium">
            “샥에서 나만의 애장품 경매를 시작해보세요.”
          </p>
        </div>

        {/* Form fields */}
        <form onSubmit={handleSignup} className="space-y-4 text-left">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2 animate-shocke">
              <AlertCircle size={15} className="shrink-0 text-rose-550" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Email input */}
          <div>
            <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
              이메일 주소 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Mail size={15} />
              </span>
              <input
                type="email"
                placeholder="example@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200/80 rounded-xl pl-10 pr-4 text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white focus:ring-4 focus:ring-gray-200/40 transition-all font-sans"
              />
            </div>
          </div>

          {/* Nickname input */}
          <div>
            <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
              수집가 닉네임 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <User size={15} />
              </span>
              <input
                type="text"
                placeholder="희귀수집광"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200/80 rounded-xl pl-10 pr-4 text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white focus:ring-4 focus:ring-gray-200/40 transition-all font-sans"
              />
            </div>
          </div>

          {/* Password inputs */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
                비밀번호 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={15} />
                </span>
                <input
                  type="password"
                  placeholder="6자 이상"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-11 bg-gray-50 border border-gray-200/80 rounded-xl pl-10 pr-4 text-xs font-bold text-slate-850 focus:outline-none focus:border-gray-300 focus:bg-white transition-all font-sans"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
                비밀번호 확인 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock size={15} />
                </span>
                <input
                  type="password"
                  placeholder="일치 확인"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className="w-full h-11 bg-gray-50 border border-gray-200/80 rounded-xl pl-10 pr-4 text-xs font-bold text-slate-850 focus:outline-none focus:border-gray-300 focus:bg-white transition-all font-sans"
                />
              </div>
            </div>
          </div>

          {/* Category choices */}
          <div>
            <label className="block text-[11px] font-black text-gray-500 mb-2 uppercase font-sans">
              관심 수집 분야 선택 <span className="text-xs text-gray-500">(최소 1개)</span>
            </label>
            <div className="flex gap-2 font-sans">
              {['POP Culture', 'SPORTS', 'ANALOG'].map((cat) => {
                const selected = favoriteCategories.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryToggle(cat)}
                    className={`cursor-pointer px-3.5 py-3 rounded-2xl flex-1 text-[11px] font-black text-center flex items-center justify-center gap-1 border transition-all ${
                      selected
                        ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                        : 'bg-white border-gray-200 text-slate-650 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {selected && <Check size={11} className="stroke-[3.5]" />}
                    <span>{cat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="cursor-pointer w-full bg-gray-900 hover:bg-gray-900 text-white font-sans font-black text-xs py-4 rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1 mt-6"
          >
            <Sparkles size={14} className="fill-white/10" />
            <span>회원가입하기</span>
          </button>
        </form>

        {/* Footer */}
        <div className="mt-7 pt-4 border-t border-gray-100 text-center text-xs text-slate-450 font-sans">
          <span>이미 계정이 있으신가요? </span>
          <button
            onClick={onNavigateToLogin}
            className="text-gray-800 hover:text-gray-900 font-bold underline outline-none cursor-pointer"
          >
            로그인하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}
