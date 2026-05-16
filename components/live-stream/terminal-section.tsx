"use client"

import { TerminalPanel } from "./terminal-panel"

interface TerminalSectionProps {
  className?: string
}

export function TerminalSection({ className = "" }: TerminalSectionProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="relative flex h-5 items-center justify-end px-2">
        <div
          className="absolute top-1/2 right-12 left-2 h-px -translate-y-1/2"
          style={{
            background:
              "linear-gradient(90deg, transparent, #00f0ff, transparent)",
          }}
        />
      </div>
      <div className="h-auto min-h-0 flex-1">
        <TerminalPanel className="min-h-[180px]" />
      </div>
    </div>
  )
}
