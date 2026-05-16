"use client"

import { ReactNode } from "react"
import { CornerHandle } from "./corner-handle"

interface RightPanelProps {
  className?: string
  children?: ReactNode
}

export function RightPanel({ className = "", children }: RightPanelProps) {
  return (
    <div className={`relative w-[220px] ${className}`}>
      <div className="relative h-full border border-[#333] bg-[rgba(17,17,17,0.8)]">
        <CornerHandle className="absolute top-[-5px] left-[-5px]" />
        <CornerHandle className="absolute top-[-5px] right-[-5px]" />
        <CornerHandle className="absolute bottom-[-5px] left-[-5px]" />
        <CornerHandle className="absolute right-[-5px] bottom-[-5px]" />

        <div className="flex h-full flex-col p-1">{children}</div>
      </div>
    </div>
  )
}
