"use client"

import { useState, useEffect, useRef } from "react"

interface TerminalPanelProps {
  className?: string
}

export function TerminalPanel({ className = "" }: TerminalPanelProps) {
  const [logs, setLogs] = useState<string[]>([])
  const [cpu, setCpu] = useState(12)
  const [mem, setMem] = useState(402)
  const logRef = useRef<HTMLDivElement>(null)

  const messages = [
    "> Accessing Black Box...",
    "> 初始化 XinLing 虚拟形象...",
    "> Compiling logic modules...",
    "> 连接到 tsubasa studio 服务器...",
    "> Warning: Caffeine levels critical.",
    "> 调试会话已启动 [主线程]",
    "> git pull origin master ... success",
    "> 分析观众数据模式...",
    "> Error 404: Motivation not found (Retrying)",
    "> 优化渲染管道...",
    "> Connection established with Host",
    "> 执行: coffee.exe --force",
    "> Scanning for bugs... 0 detected (Sus)",
    "> 将意识上传到云端...",
    "> Build finished in 0.4s",
    "> 等待用户输入...",
    "> XinLing avatar status: Online",
    "> tsubasa studio 系统: 运行中",
    "> Loading virtual environment...",
    "> 同步直播数据...",
    "> Warning: Memory usage approaching limit",
    "> 优化虚拟形象性能...",
    "> Connection to audience established",
    "> 准备就绪，开始直播",
    "> XinLing: Hello everyone!",
    "> tsubasa studio: System online",
    "> 分析聊天情绪...",
    "> Generating response...",
    "> 所有系统正常运行",
    "> 欢迎来到 XinLing 的直播间！",
    "> Thank you for your support!",
    "> 今天我们要聊点什么呢？",
    "> Virtual avatar system: Normal",
    "> 直播数据传输稳定",
  ]

  useEffect(() => {
    let msgIndex = 0
    const logsArray: string[] = [
      "> System initialized...",
      "> Connecting to Bunker...",
    ]
    setLogs(logsArray)

    const addLog = () => {
      const msg = messages[msgIndex % messages.length]
      logsArray.push(msg)

      if (logsArray.length > 6) {
        logsArray.shift()
      }

      setLogs([...logsArray])
      msgIndex++

      const nextTime = 1000 + Math.random() * 2000
      setTimeout(addLog, nextTime)
    }

    const timer = setTimeout(addLog, 1000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCpu(Math.floor(Math.random() * 30) + 5)
      setMem(Math.floor(Math.random() * 200) + 300)
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className={`relative h-full w-full font-mono ${className}`}
      style={{ fontFamily: '"Share Tech Mono", monospace' }}
    >
      <div
        className="relative flex h-full w-full flex-col justify-between overflow-hidden p-2"
        style={{
          background:
            "linear-gradient(135deg, rgba(10, 31, 37, 0.85) 0%, rgba(0, 0, 0, 0.6) 100%)",
          borderLeft: "2px solid #00e5ff",
          borderBottom: "2px solid #00e5ff",
          clipPath: "polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)",
          boxShadow: "0 0 15px rgba(0, 229, 255, 0.2)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            background:
              "linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.2))",
            backgroundSize: "100% 4px",
          }}
        />

        <div
          className="pointer-events-none absolute -top-1.5 -right-1.5 h-[30px] w-[30px]"
          style={{
            border: "1px dashed rgba(0, 229, 255, 0.4)",
            borderRadius: "50%",
            animation: "spin 10s linear infinite",
          }}
        />

        <div className="mb-1.5 flex items-center justify-between border-b border-[rgba(0,229,255,0.3)] pb-1 text-[12px] tracking-wider">
          <span
            className="text-[#e0f7fa]"
            style={{ textShadow: "0 0 5px #00e5ff" }}
          >
            Id.<span className="text-[#00e5ff]">XinLing</span>
          </span>
          <span
            className="animate-pulse text-[#00e5ff]"
            style={{ textShadow: "0 0 5px #00e5ff" }}
          >
            ● LIVE
          </span>
        </div>

        <div
          ref={logRef}
          className="flex flex-1 flex-col justify-end overflow-hidden text-[10px] leading-[1.3] opacity-90"
          style={{ textShadow: "0 0 2px #00e5ff" }}
        >
          {logs.map((log, idx) => (
            <div
              key={idx}
              className={`my-0.5 ${log.includes("Warning") || log.includes("Error") ? "text-[#ff3333]" : "text-[#e0f7fa]"}`}
            >
              {log}
            </div>
          ))}
          <span className="inline-block h-[12px] w-[6px] animate-pulse bg-[#00e5ff] align-middle" />
        </div>

        <div className="mt-1 flex items-end justify-between text-[8px] text-[#00e5ff]">
          <div>
            <div>
              CPU: <span className="font-bold">{cpu}</span>%
            </div>
            <div>
              MEM: <span className="font-bold">{mem}</span>MB
            </div>
          </div>
          <div className="flex h-[15px] items-end gap-[1px]">
            {[0.6, 0.8, 0.5, 0.7, 0.9, 0.4].map((duration, idx) => (
              <div
                key={idx}
                className="w-[2px] bg-[#00e5ff] opacity-70"
                style={{
                  animation: `wave 1.5s ease-in-out infinite`,
                  animationDuration: `${duration}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          100% { transform: rotate(360deg); }
        }
        @keyframes wave {
          0%, 100% { height: 20%; }
          50% { height: 100%; }
        }
      `}</style>
    </div>
  )
}
