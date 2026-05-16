"use client"

export function CornerHandle({ className }: { className?: string }) {
  return (
    <div
      className={`absolute h-[10px] w-[10px] border border-white bg-zinc-600 ${className}`}
    />
  )
}
