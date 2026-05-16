"use client"

interface TechScannerProps {
  className?: string
  text?: string
  status?: "online" | "offline"
  onClick?: () => void
}

const statusStyles = {
  online: {
    borderColor: "border-cyan-500/30",
    dotColor: "bg-cyan-400",
    textColor: "text-cyan-400/70",
    scanColor: "rgba(0,240,255,0.5)",
    glowColor: "#00f0ff",
    bgColor: "bg-black/30",
  },
  offline: {
    borderColor: "border-red-500/30",
    dotColor: "bg-red-400",
    textColor: "text-red-400/70",
    scanColor: "rgba(240,0,55,0.5)",
    glowColor: "#f00037",
    bgColor: "bg-black/30",
  },
}

export function TechScanner({ className = "", text = "SYSTEM ONLINE", status = "online", onClick }: TechScannerProps) {
  const styles = statusStyles[status]
  
  return (
    <div
      onClick={onClick}
      className={`relative h-8 overflow-hidden rounded ${styles.borderColor} ${styles.bgColor} ${className} ${onClick ? "cursor-pointer hover:opacity-80" : ""}`}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex items-center gap-1">
          <div className={`h-1 w-1 ${status === "online" ? "animate-pulse" : ""} rounded-full ${styles.dotColor}`} />
          <span className={`font-mono text-[10px] tracking-wider ${styles.textColor}`}>
            {text}
          </span>
          <div className={`h-1 w-1 ${status === "online" ? "animate-pulse" : ""} rounded-full ${styles.dotColor}`} />
        </div>
      </div>

      {status === "online" && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background:
              `linear-gradient(90deg, transparent, ${styles.scanColor}, transparent)`,
            animation: "scan 2s linear infinite",
          }}
        />
      )}

      <div
        className="absolute right-0 bottom-0 left-0 h-[1px]"
        style={{
          background:
            `linear-gradient(90deg, transparent, ${styles.glowColor}, transparent)`,
          animation: "glow 1.5s ease-in-out infinite",
        }}
      />

      <style>{`
        @keyframes scan {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes glow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}