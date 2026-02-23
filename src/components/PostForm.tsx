// src/components/PostForm.tsx
"use client";

import { useRef, useState } from "react";

// ========================================
// 投稿フォームコンポーネント（UIのみ）
// ========================================
// 投稿機能は Day2 で実装します

type PostFormProps = {
  userInitial?: string;
  value: string;
  onChange: (value: string) => void; // 入力したものが変化した時の処理
  onSubmit: (e: React.FormEvent, imageFile: File | null) => void; // フォームのボタンが押されたかどうかの処理
  // → 画像ファイルも一緒に渡す
  disabled?: boolean; // 送信ボタンの状態
};

export default function PostForm({
  userInitial = "U",
  value,
  onChange,
  onSubmit,
  disabled = false,
}: PostFormProps) {
  // 画像投稿用の State
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ========================================
  // 画像選択処理
  // ========================================

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // イベントが発生した場所のファイルの0番目（構文）
    const file = e.target.files?.[0];
    if (!file) return;

    // ファイルサイズチェック（5MB以下）
    if (file.size > 5 * 1024 * 1024) {
      alert("画像サイズは5MB以下にしてください");
      return;
    }

    // 画像ファイルかチェック
    if (!file.type.startsWith("image/")) {
      alert("画像ファイルを選択してください");
      return;
    }

    setSelectedImage(file);

    // プレビュー用の URL を生成
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // ========================================
  // 画像をクリア
  // ========================================

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ========================================
  // フォーム送信
  // ========================================

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(e, selectedImage);
    // 送信後にクリア
    clearImage();
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 mb-6 border border-white/10 card-hover">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
            {userInitial}
          </div>
          <div className="flex-1">
            <textarea
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="いまなにしてる？"
              className="w-full bg-transparent text-white placeholder-white/50 resize-none outline-none text-lg"
              rows={3}
            />

            {/* 画像プレビュー */}
            {imagePreview && (
              <div className="relative mt-3">
                <img
                  src={imagePreview}
                  alt="プレビュー"
                  className="w-full max-h-64 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={clearImage}
                  className="absolute top-2 right-2 bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-black/70 transition"
                >
                  ✕
                </button>
              </div>
            )}

            {/* --- Day3 追加 ここから --- */}
            {/* 画像選択ボタン */}
            <div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 rounded-full hover:bg-white/10 transition text-white/70 hover:text-white"
              >
                🖼️
              </button>
            </div>
            {/* --- Day3 追加 ここまで --- */}

            <div className="flex items-center justify-end mt-3 pt-3 border-t border-white/10">
              <button
                type="submit"
                disabled={!value.trim() || disabled}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-2 rounded-full transition-all"
              >
                投稿する
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
