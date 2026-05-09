import { MessageSquare, Plus, X } from "lucide-react";
import { TopBar } from "@/components/layout/top-bar";
import { PhaseBadge } from "@/components/domain/phase-badge";

/**
 * UI Components & Parts リファレンス。
 *
 * - 一次ソース UI: docs/stich/aistudio/src/components/ComponentsView.tsx
 * - ページ仕様: docs/pages/system-components.md
 * - 実装の単一参照になるよう、AI Studio mock より一段拡張（phase バッジ全種を載せる）
 */
export const metadata = {
  title: "System / Components",
};

export default function ComponentsPage() {
  return (
    <>
      <TopBar breadcrumb="System / Components" />
      <main className="bg-background scroll-smooth flex-1 overflow-y-auto">
        <div className="p-margin-page max-w-[1400px] mx-auto space-y-12">
          <header>
            <h1 className="text-headline-xl text-primary mb-2 font-bold">
              UI Components & Parts
            </h1>
            <p className="text-body-lg text-on-surface-variant max-w-2xl">
              Visual reference for Threadhall design system elements. ソースは{" "}
              <code>src/components/{`{ui,domain,layout}`}</code> と{" "}
              <code>docs/stich/aistudio/src/components/</code>。
            </p>
          </header>

          <div className="xl:grid-cols-2 grid grid-cols-1 gap-8">
            <div className="bg-surface border-outline-variant space-y-8 rounded-2xl border p-8">
              <section>
                <h3 className="font-label-sm text-on-surface-variant mb-4 text-xs uppercase tracking-widest">
                  Buttons
                </h3>
                <div className="flex flex-wrap gap-4">
                  <button className="bg-primary text-on-primary rounded-lg px-6 py-2 text-sm font-bold">
                    Primary Action
                  </button>
                  <button className="border-outline-variant text-primary hover:bg-surface-container rounded-lg border px-6 py-2 text-sm font-bold">
                    Secondary
                  </button>
                  <button className="bg-surface-container text-primary rounded-lg px-6 py-2 text-sm font-bold">
                    Ghost Button
                  </button>
                </div>
              </section>

              <section>
                <h3 className="font-label-sm text-on-surface-variant mb-4 text-xs uppercase tracking-widest">
                  Phase Badges (Event)
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  <PhaseBadge variant="draft" />
                  <PhaseBadge variant="live" />
                  <PhaseBadge variant="archived" />
                </div>
                <p className="text-text-dim mt-3 text-xs">
                  draft / live / archived の 3 状態。書込許可の根拠は{" "}
                  <code>docs/system/capabilities-by-role.md</code>。
                </p>
              </section>

              <section>
                <h3 className="font-label-sm text-on-surface-variant mb-4 text-xs uppercase tracking-widest">
                  Thread State Badges
                </h3>
                <div className="flex flex-wrap items-center gap-4">
                  <PhaseBadge variant="pinned" />
                  <PhaseBadge variant="resolved" />
                </div>
              </section>
            </div>

            <div className="bg-surface border-outline-variant rounded-2xl border p-8">
              <h3 className="font-label-sm text-on-surface-variant mb-6 text-xs uppercase tracking-widest">
                Action Menus & Selection
              </h3>
              <div className="bg-surface-container-low border-border-low flex justify-center rounded-xl border p-6">
                <div className="bg-surface border-outline-variant w-48 overflow-hidden rounded-xl border py-2 shadow-xl">
                  <button className="hover:bg-surface-container flex w-full items-center gap-2 px-4 py-2 text-left text-sm">
                    <Plus size={16} /> New Thread
                  </button>
                  <button className="hover:bg-surface-container text-secondary flex w-full items-center gap-2 px-4 py-2 text-left text-sm">
                    <MessageSquare size={16} /> New Event
                  </button>
                  <div className="bg-outline-variant my-2 h-px"></div>
                  <button className="hover:bg-error-container text-error flex w-full items-center gap-2 px-4 py-2 text-left text-sm">
                    Delete
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-surface border-outline-variant xl:col-span-2 space-y-8 rounded-2xl border p-8">
              <section>
                <h3 className="font-label-sm text-on-surface-variant mb-4 text-xs uppercase tracking-widest">
                  Input States
                </h3>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                  <div className="space-y-2">
                    <label
                      htmlFor="ref-search"
                      className="font-label-sm text-text-dim text-xs"
                    >
                      Standard Search
                    </label>
                    <div className="relative">
                      <X
                        className="text-text-dim absolute top-1/2 left-3 -translate-y-1/2"
                        size={16}
                      />
                      <input
                        id="ref-search"
                        className="bg-background border-outline-variant focus:border-primary w-full rounded-lg border py-2 pr-4 pl-10 text-sm outline-none"
                        placeholder="Search entries..."
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label
                      htmlFor="ref-focus"
                      className="font-label-sm text-text-dim text-xs"
                    >
                      Focus State
                    </label>
                    <div className="relative">
                      <X
                        className="text-primary absolute top-1/2 left-3 -translate-y-1/2"
                        size={16}
                      />
                      <input
                        id="ref-focus"
                        className="border-primary w-full rounded-lg border-2 bg-white py-2 pr-4 pl-10 text-sm shadow-sm outline-none"
                        defaultValue="Focused Input"
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
