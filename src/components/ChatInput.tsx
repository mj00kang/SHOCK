import React, { useState, useRef } from 'react';
import { Send, Image, X } from 'lucide-react';

interface ChatInputProps {
  onSend: (content: string, image?: { name: string; type: string; dataUrl: string }) => void;
  placeholder?: string;
  onAttachProductClick?: () => void;
}

export default function ChatInput({ 
  onSend, 
  placeholder = '메시지를 입력하세요...',
  onAttachProductClick 
}: ChatInputProps) {
  const [text, setText] = useState('');
  const [selectedImage, setSelectedImage] = useState<{ id: number; name: string; type: string; dataUrl: string } | null>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("이미지 파일만 업로드할 수 있습니다.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
          setSelectedImage({
            id: Date.now(),
            name: file.name,
            type: 'image/jpeg',
            dataUrl: dataUrl
          });
        }
      };
      img.src = String(reader.result);
    };
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!text.trim() && !selectedImage) return;
    
    if (selectedImage) {
      onSend(text.trim(), selectedImage);
      setSelectedImage(null);
    } else {
      onSend(text.trim());
    }
    
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {selectedImage && (
        <div className="relative inline-flex items-center gap-2 p-2 bg-gray-50 border border-gray-200 rounded-xl w-max max-w-full">
          <img src={selectedImage.dataUrl} alt={selectedImage.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
          <span className="text-xs text-gray-700 truncate max-w-[150px]">{selectedImage.name}</span>
          <button 
            onClick={() => setSelectedImage(null)}
            className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors cursor-pointer shrink-0"
            title="이미지 제거"
          >
            <X size={14} />
          </button>
        </div>
      )}
      <form 
        onSubmit={handleSubmit}
        className="flex items-center gap-2.5 bg-white border border-gray-200/80 p-3 rounded-2xl shadow-sm"
      >
        <label
          className="p-2 text-gray-400 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-all duration-150 cursor-pointer shrink-0"
          title="사진 파일 첨부"
        >
          <Image size={18} />
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageSelect}
            onClick={(e) => { e.currentTarget.value = "" }} // Allow re-selecting the same file
          />
        </label>

      {/* Product Attachment Option */}
      {onAttachProductClick && (
        <button
          type="button"
          onClick={onAttachProductClick}
          className="p-2 text-gray-500 hover:text-gray-950 hover:bg-gray-100 rounded-xl transition-all duration-150 cursor-pointer shrink-0 flex items-center gap-1 text-[13px] font-bold border border-dotted border-gray-200"
          title="내 출품 상품 멘션/첨부"
          id="chat-attach-product-btn"
        >
          <span>📦</span>
          <span className="hidden sm:inline">내 상품</span>
        </button>
      )}

      {/* Primary chat text input */}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 text-xs md:text-sm text-gray-900 focus:outline-none placeholder:text-gray-400 font-sans"
      />

      {/* Outgoing click release trigger button */}
      <button
        type="submit"
        disabled={!text.trim() && !selectedImage}
        className={`p-2.5 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
          text.trim() || selectedImage
            ? 'bg-gray-900 text-white hover:bg-gray-900 shadow-sm' 
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        <Send size={16} />
      </button>
    </form>
    </div>
  );
}
