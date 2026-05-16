"use client"

import { Button } from "@/components/ui/button"

interface ControlBarProps {
  isPaused: boolean
  terminalVisible: boolean
  onToggleCarousel: () => void
  onToggleTerminal: () => void
}

export function ControlBar({
  isPaused,
  terminalVisible,
  onToggleCarousel,
  onToggleTerminal,
}: ControlBarProps) {
  return (
    <div className="flex items-center justify-end gap-2 border-t border-[rgba(0,240,255,0.3)] pt-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleCarousel}
        className="h-7 px-2 text-xs text-[#00f0ff] hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.1)] border border-[#00f0ff]"
      >
        {isPaused ? "[播放跑马灯]" : "[固定跑马灯]"}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={onToggleTerminal}
        className="h-7 px-2 text-xs text-[#00f0ff] hover:text-[#00f0ff] hover:bg-[rgba(0,240,255,0.1)] border border-[#00f0ff]"
      >
        {terminalVisible ? "[隐藏终端]" : "[显示终端]"}
      </Button>
    </div>
  )
}
