"use client"

import { useState, useRef } from "react"
import { appConfig } from "../../data"
import { CornerHandle } from "./corner-handle"

interface MainAreaProps {
  className?: string
}

export function MainArea({ className = "" }: MainAreaProps) {
  const [isSharing, setIsSharing] = useState(false)
  const [shareBtnText, setShareBtnText] = useState("共享屏幕")
  const videoRef = useRef<HTMLVideoElement>(null)
  let mediaStream: MediaStream | null = null

  const shareScreen = async () => {
    if (isSharing) {
      stopShare()
      return
    }
    try {
      mediaStream = await navigator.mediaDevices.getDisplayMedia({
        video: appConfig.screenShare.video,
        audio: appConfig.screenShare.audio,
      })
      if (videoRef.current) videoRef.current.srcObject = mediaStream
      setIsSharing(true)
      setShareBtnText("停止共享")
      mediaStream.getVideoTracks()[0].addEventListener("ended", stopShare)
    } catch (error) {
      console.error("屏幕共享失败:", error)
      alert("屏幕共享失败: " + (error as Error).message)
    }
  }

  const stopShare = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop())
      mediaStream = null
    }
    setIsSharing(false)
    setShareBtnText("共享屏幕")
  }

  return (
    <div className={`relative flex-1 ${className}`}>
      <div className="relative h-full w-full border border-[#333] bg-[rgba(17,17,17,0.8)]">
        <CornerHandle className="absolute top-[-5px] left-[-5px]" />
        <CornerHandle className="absolute top-[-5px] right-[-5px]" />
        <CornerHandle className="absolute bottom-[-5px] left-[-5px]" />
        <CornerHandle className="absolute right-[-5px] bottom-[-5px]" />

        {!isSharing && (
          <div className="flex h-full flex-col items-center justify-center bg-[rgba(17,17,17,0.8)] text-center">
            <p className="text-3xl text-[#666]">屏幕投影区域</p>
            <p className="mt-2.5 text-sm text-[#888]">
              用于投放游戏、PPT或其他内容
            </p>
            <button
              onClick={shareScreen}
              className="mt-5 cursor-pointer rounded border border-[#555] bg-[#333] px-6 py-3 text-base text-white transition-all hover:border-[#777] hover:bg-[#444]"
            >
              {shareBtnText}
            </button>
          </div>
        )}
        {isSharing && (
          <video
            ref={videoRef}
            className="h-full w-full object-contain"
            autoPlay
            playsInline
          />
        )}
      </div>
    </div>
  )
}
