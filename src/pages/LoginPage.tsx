import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { loginUser } from '../utils/authUtils';

interface LoginPageProps {
  onBackToMain: () => void;
  onNavigateToSignup: () => void;
  onLoginSuccess: (user: any) => void;
  onSuccessRedirect?: () => void; // Optional redirect to the action they were trying to perform
}

export default function LoginPage({
  onBackToMain,
  onNavigateToSignup,
  onLoginSuccess,
  onSuccessRedirect
}: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!email.trim()) {
      setErrorMsg('이메일을 입력해 주세요.');
      return;
    }
    if (!password) {
      setErrorMsg('비밀번호를 입력해 주세요.');
      return;
    }

    const result = loginUser(email, password);
    if (result.success && result.user) {
      setSuccessMsg('로그인에 성공하였습니다! 잠시 후 이동합니다.');
      setTimeout(() => {
        onLoginSuccess(result.user);
        if (onSuccessRedirect) {
          onSuccessRedirect();
        } else {
          onBackToMain();
        }
      }, 1000);
    } else {
      setErrorMsg(result.message);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 relative">
        {/* Floating Back button in same style as community */}
        <button
          onClick={onBackToMain}
          className="page-back-link group absolute left-6 top-6 !mb-0"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-0.5" />
          <span>메인으로 돌아가기</span>
        </button>

        {/* Mascot / Logo Header */}
        <div className="text-center mt-4 mb-8">
          <div className="inline-flex justify-center items-center h-12 w-12 bg-gray-100 rounded-2xl text-gray-800 mb-3 shadow-sm">
            {/* Cute mini shark icon */}
            <svg viewBox="0 0 100 100" className="w-8 h-8 drop-shadow-sm">
              <ellipse cx="50" cy="55" rx="34" ry="28" fill="#6B7280" />
              <path d="M 50 28 Q 58 12 68 16 Q 64 30 54 30 Z" fill="#6B7280" />
              <ellipse cx="50" cy="64" rx="23" ry="17" fill="#ffffff" />
              <circle cx="60" cy="48" r="4.5" fill="#0f172a" />
              <circle cx="61" cy="46" r="1.5" fill="#ffffff" />
              <circle cx="44" cy="48" r="4.5" fill="#0f172a" />
              <circle cx="45" cy="46" r="1.5" fill="#ffffff" />
              <circle cx="67" cy="54" r="3.5" fill="#f43f5e" opacity="0.6" />
              <circle cx="37" cy="54" r="3.5" fill="#f43f5e" opacity="0.6" />
              <path d="M 48 57 Q 51 60 54 57" stroke="#0f172a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
            </svg>
          </div>
          <h2 className="font-sans font-black text-2xl text-gray-900 tracking-tight">로그인</h2>
          <p className="text-xs text-gray-500 mt-2 font-medium max-w-xs mx-auto">
            “샥에 로그인하고 입찰, 출품, 커뮤니티를 이용해보세요.”
          </p>
        </div>

        {/* Form elements */}
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2 animate-shocke">
              <AlertCircle size={15} className="shrink-0 text-red-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-semibold px-4 py-3 rounded-xl flex items-center gap-2">
              <CheckCircle size={15} className="shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Email input */}
          <div>
            <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
              이메일 주소
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
                className="w-full h-11 bg-gray-50 border border-gray-200/80 rounded-xl pl-10 pr-4 text-xs font-bold text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:bg-white focus:ring-4 focus:ring-gray-200/40 transition-all"
              />
            </div>
          </div>

          {/* Password input */}
          <div>
            <label className="block text-[11px] font-black text-gray-500 mb-1.5 uppercase font-sans">
              비밀번호
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                <Lock size={15} />
              </span>
              <input
                type="password"
                placeholder="●●●●●●"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 bg-gray-50 border border-gray-200/80 rounded-xl pl-10 pr-4 text-xs font-bold text-gray-900 focus:outline-none focus:border-gray-300 focus:bg-white focus:ring-4 focus:ring-gray-200/40 transition-all"
              />
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="cursor-pointer w-full bg-[#111827] hover:bg-black text-white font-sans font-extrabold text-xs py-3.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 mt-2"
          >
            <Sparkles size={14} className="fill-white/20 text-white" />
            <span>로그인하기</span>
          </button>
        </form>

        {/* Footer info: Go to signup */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-slate-450 font-sans">
          <span>아직 샥 계정이 없으신가요? </span>
          <button
            onClick={onNavigateToSignup}
            className="text-gray-800 hover:text-gray-900 font-bold underline outline-none cursor-pointer"
          >
            회원가입하러 가기
          </button>
        </div>
      </div>
    </div>
  );
}
