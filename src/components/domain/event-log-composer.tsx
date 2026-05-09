import { Image as ImageIcon, LayoutGrid, MapPin, Send } from "lucide-react";

/**
 * イベントログ書込コンポーザ（sticky bottom）。
 *
 * - 一次ソース: docs/stich/aistudio/src/components/EventLogView.tsx 末尾
 * - phase ごとの挙動:
 *   - draft  : 運営のみ（実装は別 PR）。MVP では `disabled` の可視化のみ。
 *   - live   : 通常通り操作可能（参加トークン保有者の根拠は別ロジック）。
 *   - archived: 全ロール書込拒否（FR-07）。compose 全体を disabled。
 */
export function EventLogComposer({
  disabled = false,
  disabledReason = "このイベントはアーカイブ済みです（書込不可・閲覧のみ）。",
}: {
  disabled?: boolean;
  disabledReason?: string;
}) {
  return (
    <div className="bg-surface/90 border-outline-variant absolute right-0 bottom-0 left-0 z-30 border-t p-4 pt-4 pb-8 backdrop-blur-md">
      {disabled ? (
        <div className="bg-error-container/30 border-error/30 text-on-error-container mx-auto mb-3 max-w-3xl rounded-lg border px-4 py-2 text-xs">
          {disabledReason}
        </div>
      ) : null}
      <div className="mx-auto flex max-w-3xl items-end gap-3 px-margin-page md:pl-[120px]">
        <div
          className={`bg-background border-outline-variant flex-1 overflow-hidden rounded-2xl border transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary ${
            disabled ? "opacity-60" : ""
          }`}
        >
          <textarea
            disabled={disabled}
            placeholder={
              disabled
                ? "アーカイブ済みのため記録できません"
                : "Log an update..."
            }
            className="text-body-md min-h-[60px] w-full resize-none bg-transparent p-3 outline-none disabled:cursor-not-allowed"
          />
          <div className="bg-surface-container-low border-outline-variant flex items-center justify-between border-t px-4 py-2">
            <div className="flex gap-3">
              <button
                type="button"
                disabled={disabled}
                aria-label="Attach image"
                className="text-text-dim hover:text-primary transition-colors disabled:cursor-not-allowed"
              >
                <ImageIcon size={18} />
              </button>
              <button
                type="button"
                disabled={disabled}
                aria-label="Attach location"
                className="text-text-dim hover:text-primary transition-colors disabled:cursor-not-allowed"
              >
                <MapPin size={18} />
              </button>
              <button
                type="button"
                disabled={disabled}
                aria-label="Attach tag"
                className="text-text-dim hover:text-primary transition-colors disabled:cursor-not-allowed"
              >
                <LayoutGrid size={18} />
              </button>
            </div>
            <span className="font-label-sm text-text-dim text-[10px]">
              Markdown supported
            </span>
          </div>
        </div>
        <button
          type="submit"
          disabled={disabled}
          aria-label="Send"
          className="bg-primary text-on-primary hover:bg-surface-tint flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-colors disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send size={20} fill="white" />
        </button>
      </div>
    </div>
  );
}
