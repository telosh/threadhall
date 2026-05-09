import type { EventPhase } from "@/types/db/primary";

/**
 * イベントフェーズ（draft/live/archived）+ 解決済みスレッド等の状態バッジ。
 *
 * - 一次ソース: docs/stich/aistudio/src/components/ComponentsView.tsx
 * - 整合性: docs/system/capabilities-by-role.md「イベントフェーズ別の一文まとめ」
 *
 * draft  : 運営のみ書込（UI ではグレー）
 * live   : event-active（オレンジ）
 * archived: 書込全拒否（赤系・破線等）
 */

type Variant = EventPhase | "resolved" | "pinned";

const VARIANTS: Record<
  Variant,
  { className: string; label: string }
> = {
  draft: {
    className:
      "bg-surface-variant text-on-surface-variant border-outline-variant border",
    label: "Draft",
  },
  live: {
    className: "bg-event-active text-on-primary",
    label: "Live",
  },
  archived: {
    className:
      "bg-error-container text-on-error-container border-outline-variant border-dashed border",
    label: "Archived",
  },
  resolved: {
    className:
      "bg-surface-container-highest border-outline-variant text-on-surface-variant border",
    label: "Resolved",
  },
  pinned: {
    className: "bg-secondary-container text-on-secondary-container",
    label: "Pinned",
  },
};

export function PhaseBadge({
  variant,
  label,
}: {
  variant: Variant;
  /** 既定文言を上書きしたい場合（例: "Happening Tomorrow"） */
  label?: string;
}) {
  const v = VARIANTS[variant];
  return (
    <span
      className={`text-label-sm font-bold uppercase rounded-full px-3 py-1 text-[10px] tracking-wider ${v.className}`}
    >
      {label ?? v.label}
    </span>
  );
}
