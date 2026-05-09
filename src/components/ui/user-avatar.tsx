"use client";

import Image from "next/image";
import { User } from "lucide-react";
import { useState } from "react";

type UserAvatarProps = {
  /** Google OAuth などのプロフィール画像 URL。未設定・読み込み失敗時はデフォアイコン */
  src?: string | null;
  alt: string;
  /** 一辺のピクセル数（width / height） */
  size?: number;
  className?: string;
};

/**
 * ユーザー顔写真。`src` は通常 `session.user.image`（Google は `*.googleusercontent.com`）。
 * 未ログイン・画像なし・404 は Lucide の User アイコン。
 */
export function UserAvatar({
  src,
  alt,
  size = 32,
  className = "",
}: UserAvatarProps) {
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(src?.trim()) && !failed;

  const box = `${className} border-outline-variant shrink-0 overflow-hidden rounded-full border bg-surface-container`;
  const dim = { width: size, height: size };

  if (!showPhoto) {
    return (
      <div
        className={`${box} inline-flex items-center justify-center`}
        style={dim}
        role="img"
        aria-label={alt}
      >
        <User
          className="text-on-surface-variant"
          size={Math.max(12, Math.round(size * 0.5))}
          aria-hidden
        />
      </div>
    );
  }

  return (
    <div className={`${box} relative`} style={dim}>
      <Image
        src={src!.trim()}
        alt={alt}
        fill
        sizes={`${size}px`}
        className="object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
