import {
  Bold,
  Code as CodeIcon,
  FileText,
  Italic,
  Link as LinkIcon,
  Paperclip,
  Send,
} from "lucide-react";
import { UserAvatar } from "@/components/ui/user-avatar";
import { MOCK_CURRENT_USER_IMAGE } from "@/lib/mock-data";

/**
 * スレッド返信コンポーザ（sticky bottom）。
 *
 * - 一次ソース: docs/stich/aistudio/src/components/ThreadView.tsx 末尾
 * - `disabled` を渡すと textarea + 送信を無効化し、archived バナーを上に出す。
 *   これは FR-07（archived 後の書込拒否）を UI で明示するための仕様。
 */
export function ThreadComposer({
  disabled = false,
  disabledReason = "このスレッドはアーカイブ済みです（読み取りのみ）。",
  userImageUrl = MOCK_CURRENT_USER_IMAGE,
}: {
  disabled?: boolean;
  disabledReason?: string;
  userImageUrl?: string | null;
}) {
  return (
    <div className="bg-surface border-outline-variant absolute bottom-0 left-0 z-20 w-full border-t p-4 shadow-[0_-10px_30px_rgba(0,0,0,0.03)]">
      {disabled ? (
        <div className="bg-error-container/30 border-error/30 text-on-error-container mx-auto mb-3 max-w-2xl rounded-lg border px-4 py-2 text-xs">
          {disabledReason}
        </div>
      ) : null}
      <div className="mx-auto flex max-w-2xl gap-4">
        <div className="hidden shrink-0 sm:block">
          <UserAvatar src={userImageUrl} alt="あなた" size={40} />
        </div>
        <div
          className={`bg-background border-outline-variant flex flex-1 flex-col rounded-xl border transition-all focus-within:border-primary focus-within:ring-1 focus-within:ring-primary ${
            disabled ? "opacity-60" : ""
          }`}
        >
          <div className="bg-surface-container-low border-outline-variant flex items-center gap-1 rounded-t-xl border-b p-2">
            <button
              type="button"
              disabled={disabled}
              className="text-on-surface-variant hover:bg-surface-variant rounded p-1.5 transition-colors disabled:cursor-not-allowed"
              aria-label="Bold"
            >
              <Bold size={16} />
            </button>
            <button
              type="button"
              disabled={disabled}
              className="text-on-surface-variant hover:bg-surface-variant rounded p-1.5 transition-colors disabled:cursor-not-allowed"
              aria-label="Italic"
            >
              <Italic size={16} />
            </button>
            <button
              type="button"
              disabled={disabled}
              className="text-on-surface-variant hover:bg-surface-variant rounded p-1.5 transition-colors disabled:cursor-not-allowed"
              aria-label="Link"
            >
              <LinkIcon size={16} />
            </button>
            <div className="bg-outline-variant mx-1 h-4 w-px"></div>
            <button
              type="button"
              disabled={disabled}
              className="text-on-surface-variant hover:bg-surface-variant rounded p-1.5 transition-colors disabled:cursor-not-allowed"
              aria-label="Code"
            >
              <CodeIcon size={16} />
            </button>
            <button
              type="button"
              disabled={disabled}
              className="text-on-surface-variant hover:bg-surface-variant rounded p-1.5 transition-colors disabled:cursor-not-allowed"
              aria-label="Attach"
            >
              <Paperclip size={16} />
            </button>
          </div>
          <textarea
            disabled={disabled}
            placeholder={
              disabled ? "アーカイブ済みのため返信できません" : "Contribute to the thread..."
            }
            className="text-body-md text-on-surface placeholder:text-text-dim min-h-[80px] w-full resize-none bg-transparent p-3 outline-none disabled:cursor-not-allowed"
          />
          <div className="bg-surface-container-low border-outline-variant flex items-center justify-between rounded-b-xl border-t p-2">
            <span className="font-label-sm text-text-dim flex items-center gap-1 text-[10px]">
              <FileText size={12} /> Markdown supported
            </span>
            <button
              type="submit"
              disabled={disabled}
              className="bg-primary text-on-primary font-label-sm hover:bg-surface-tint flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Post Reply <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
