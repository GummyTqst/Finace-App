"use client"

import { ReactNode, useState } from "react";

type Tab = {
    id: string;
    label: string;
    content: ReactNode
}

type SettingsTabsProps = {
    tabs: Tab[]
}

export default function SettingsTab({ tabs }: SettingsTabsProps) {
    const [activeTab, setActiveTab] = useState(tabs[0]?.id ?? "")

    const activeContent = tabs.find((tab) => tab.id === activeTab)?.content

    return (
        <section className="rounded-2xl bg-white p-3 sm:p-5">
            <div
                role="tablist"
                aria-label="Settings Sections"
                className="grid grid-cols-2 gap-1 rounded-xl bg-grey-100 p-1 sm:grid-cols-4"
            >   
                {tabs.map((tab) => {
                    const isActive = activeTab === tab.id

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            role="tab"
                            aria-selected={isActive}
                            aria-controls={`settings-panel-${tab.id}`}
                            onClick={() => setActiveTab(tab.id)}
                            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "bg-white text-grey-900 shadow-sm" : "text-grey-500 hover:bg-grey-900"}`}
                        >
                            {tab.label}
                        </button>
                    )
                })}
            </div>

            <div
                id={`settings-panel-${activeTab}`}
                role="tabpanel"
                className="mt-4"
            >
                {activeContent}
            </div>
        </section>
    )
}