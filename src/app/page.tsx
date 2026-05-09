import { redirect } from "next/navigation";

/**
 * ルート `/` は当面ダッシュボードへリダイレクト。
 *
 * - 認可・LP（UI-01）が入る段階で、未ログインを LP / ログイン済みをダッシュボードに振り分けるロジックに変更する（FR-08）。
 * - 開発スキャフォールド（DB ヘルス・組織作成フォーム・サインイン試用）は `/dev` に退避済み。
 */
export default function RootRedirectPage(): never {
  redirect("/dashboard");
}
