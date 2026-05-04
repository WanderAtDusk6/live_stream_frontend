import { NextResponse } from "next/server"

export async function GET() {
  // 这是一个假的示例接口，返回 Bilibili 直播间弹幕数据结构示例
  const sampleDanmaku = [
    {
      id: "1",
      user: "观众A",
      message: "666",
      time: "2026-05-04T12:00:00.000Z"
    },
    {
      id: "2",
      user: "观众B",
      message: "主播加油~",
      time: "2026-05-04T12:00:05.000Z"
    }
  ]

  return NextResponse.json({
    roomId: "123456",
    roomTitle: "示例 Bilibili 直播间",
    danmaku: sampleDanmaku
  })
}
