import type { LucideIcon } from "lucide-react";

/**
 * セクション見出し（カラム上部 / アイコン + タイトル + 任意アクション）。
 *
 * - 一次ソース: docs/stich/aistudio/src/components/{DashboardView,OrganizationView}.tsx
 * - 「Active Threads」「Schedule」「Upcoming Events」など共通の見出し帯。
 */
export function SectionHeading({
  icon: Icon,
  title,
  action,
}: {
  icon?: LucideIcon;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="border-outline-variant mb-stack-sm flex items-center justify-between border-b pb-2">
      <h2 className="text-headline-md text-primary flex items-center gap-3 font-semibold">
        {Icon ? <Icon size={20} /> : null}
        <span>{title}</span>
      </h2>
      {action}
    </div>
  );
}
