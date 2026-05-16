"use client"

import { useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { appConfig } from "../../data"
import { CornerHandle } from "./corner-handle"

export function ScreenShare() {
  const [isSharing, setIsSharing] = useState(false)
  const [btnText, setBtnText] = useState("共享屏幕")
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)

  const stopShare = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop())
      mediaStreamRef.current = null
    }
    setIsSharing(false)
    setBtnText("共享屏幕")
  }, [])

  const shareScreen = useCallback(async () => {
    if (isSharing) {
      stopShare()
      return
    }

    try {
      const screenConfig = appConfig.screenShare
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: screenConfig.video,
        audio: screenConfig.audio,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      mediaStreamRef.current = stream
      setIsSharing(true)
      setBtnText("停止共享")

      stream.getVideoTracks()[0].addEventListener("ended", stopShare)
    } catch (error) {
      console.error("屏幕共享失败:", error)
      alert("屏幕共享失败: " + (error as Error).message)
    }
  }, [isSharing, stopShare])

  return (
    <div className="relative flex flex-1 items-center justify-center border border-zinc-700 bg-black/80">
      <CornerHandle className="top-[-5px] left-[-5px]" />
      <CornerHandle className="top-[-5px] right-[-5px]" />
      <CornerHandle className="bottom-[-5px] left-[-5px]" />
      <CornerHandle className="right-[-5px] bottom-[-5px]" />

      {!isSharing ? (
        <div className="text-center text-zinc-500">
          <p className="text-2xl">屏幕投影区域</p>
          <p className="mt-2 text-sm text-zinc-600">
            用于投放游戏、PPT或其他内容
          </p>
          <Button onClick={shareScreen} variant="outline" className="mt-5">
            {btnText}
          </Button>
        </div>
      ) : (
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-contain"
          autoPlay
          playsInline
        />
      )}
    </div>
  )
}
