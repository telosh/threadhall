import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

/**
 * Next.js 16 リクエストインターセプト（旧 middleware の後継）。
 * 認可・リダイレクト・ヘッダ付与・A/B などはここに集約する。
 * 現時点はパススルーの土台のみ。
 */
export function proxy(request: NextRequest) {
  return NextResponse.next({
    request: {
      headers: request.headers,
    },
  });
}

export const proxyConfig = {
  matcher: [
    /*
     * 静的アセット・画像最適化は除外（公式 matcher 例に準拠）
     * https://nextjs.org/docs/app/api-reference/file-conventions/proxy
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
