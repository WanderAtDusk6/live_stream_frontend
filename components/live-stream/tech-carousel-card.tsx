"use client"

import type { CarouselItem, ContentType } from "./content-context"

type CarouselItemType = CarouselItem
type TaskContentType = ContentType & { type: "task" }

function TaskItem({
  task,
  theme,
  level = 0,
}: {
  task: TaskContentType
  theme: CarouselItemType["theme"]
  level?: number
}) {
  const headerClasses = {
    "tech-blue": "text-[#00f0ff]",
    "tech-purple": "text-[#c864ff]",
    "tech-green": "text-[#00ff88]",
    "tech-red": "text-[#ff6464]",
  }
  const textClasses = {
    "tech-blue": "text-[#b0e5ff]",
    "tech-purple": "text-[#e0c8ff]",
    "tech-green": "text-[#c8ffe0]",
    "tech-red": "text-[#ffc8c8]",
  }

  return (
    <div className={`${level > 0 ? "ml-4" : ""}`}>
      <p
        className={`my-1 flex items-center text-xs ${textClasses[theme]} bg-transparent`}
        style={{ textShadow: "0 0 2px currentColor" }}
      >
        <span
          className={`mr-2 inline-flex h-3 w-3 shrink-0 items-center justify-center rounded border border-[#00ff88] text-[8px] transition-all ${task.checked ? "bg-[#00ff88]" : ""}`}
        >
          {task.checked && <span className="font-bold text-[#0a1f25]">✓</span>}
        </span>
        <span>{task.text}</span>
      </p>
      {task.children &&
        task.children.map(
          (child, idx) =>
            child.type === "task" && (
              <TaskItem
                key={idx}
                task={child}
                theme={theme}
                level={level + 1}
              />
            )
        )}
    </div>
  )
}

export function TechCarouselCard({ item }: { item: CarouselItemType }) {
  const themeClasses = {
    "tech-blue":
      "bg-gradient-to-br from-[rgba(10,31,37,0.85)] to-[rgba(0,0,0,0.6)] border-[rgba(0,240,255,0.3)]",
    "tech-purple":
      "bg-gradient-to-br from-[rgba(37,10,37,0.85)] to-[rgba(0,0,0,0.6)] border-[rgba(200,100,255,0.3)]",
    "tech-green":
      "bg-gradient-to-br from-[rgba(10,37,10,0.85)] to-[rgba(0,0,0,0.6)] border-[rgba(0,255,136,0.3)]",
    "tech-red":
      "bg-gradient-to-br from-[rgba(37,10,10,0.85)] to-[rgba(0,0,0,0.6)] border-[rgba(255,100,100,0.3)]",
  }

  const headerClasses = {
    "tech-blue": "text-[#00f0ff]",
    "tech-purple": "text-[#c864ff]",
    "tech-green": "text-[#00ff88]",
    "tech-red": "text-[#ff6464]",
  }

  const textClasses = {
    "tech-blue": "text-[#b0e5ff]",
    "tech-purple": "text-[#e0c8ff]",
    "tech-green": "text-[#c8ffe0]",
    "tech-red": "text-[#ffc8c8]",
  }

  const hasImage = !!item.image
  const hasTasks = item.content.some((c) => c.type === "task")
  const hasStatus = item.content.some((c) => c.type === "status")

  const statusContent = item.content.filter((c) => c.type === "status")
  const taskContent = item.content.filter((c) => c.type === "task")
  const textContent = item.content.filter(
    (c) => c.type === "text" || c.type === "divider"
  )

  return (
    <div
      className={`h-full w-full border ${themeClasses[item.theme as keyof typeof themeClasses]}`}
      style={{ height: "276px" }}
    >
      <div className="flex h-full flex-col p-4">
        <div className="mb-2 flex items-center justify-center border-b border-current/10 pb-2">
          <h2
            className={`text-sm font-semibold ${headerClasses[item.theme as keyof typeof headerClasses]}`}
            style={{ textShadow: "0 0 5px currentColor" }}
          >
            {item.title}
          </h2>
        </div>

        <div className="flex flex-1 flex-col justify-center overflow-hidden">
          {hasImage ? (
            <div className="flex flex-1 flex-col items-center justify-center p-2">
              <div className="flex flex-1 items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  className="max-h-[140px] max-w-full rounded border border-[rgba(255,100,100,0.3)] object-contain shadow-[0_0_15px_rgba(255,100,100,0.3)]"
                />
              </div>
              <div className="mt-2 text-center text-xs">
                {textContent.map((c, idx) => (
                  <p
                    key={idx}
                    className={`${textClasses[item.theme as keyof typeof textClasses]}`}
                    style={{ textShadow: "0 0 2px currentColor" }}
                  >
                    {c.type === "text" &&
                      (c.italic ? <em>{c.content}</em> : c.content)}
                  </p>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col px-3">
              <div
                className="my-2 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${headerClasses[item.theme as keyof typeof headerClasses]}, transparent)`,
                }}
              />

              {hasStatus && (
                <div className="mb-2 text-center">
                  {statusContent.map((c, idx) => (
                    <p
                      key={idx}
                      className={`text-xs font-bold ${textClasses[item.theme as keyof typeof textClasses]} bg-transparent`}
                      style={{ textShadow: "0 0 2px currentColor" }}
                    >
                      {c.content}
                    </p>
                  ))}
                </div>
              )}

              {hasStatus && (hasTasks || textContent.length > 0) && (
                <div
                  className="my-2 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${headerClasses[item.theme as keyof typeof headerClasses]}, transparent)`,
                  }}
                />
              )}

              {hasTasks && (
                <div className="mb-2">
                  {taskContent.map(
                    (c, idx) =>
                      c.type === "task" && (
                        <TaskItem key={idx} task={c} theme={item.theme} />
                      )
                  )}
                </div>
              )}

              {(hasTasks || hasStatus) && textContent.length > 0 && (
                <div
                  className="my-2 h-px"
                  style={{
                    background: `linear-gradient(90deg, transparent, ${headerClasses[item.theme as keyof typeof headerClasses]}, transparent)`,
                  }}
                />
              )}

              {textContent.length > 0 && (
                <div className="flex-1 overflow-hidden text-xs">
                  {textContent.map((c, idx) => (
                    <p
                      key={idx}
                      className={`my-0.5 leading-[1.3] ${textClasses[item.theme as keyof typeof textClasses]} bg-transparent`}
                      style={{ textShadow: "0 0 2px currentColor" }}
                    >
                      {c.type === "text" &&
                        (c.italic ? <em>{c.content}</em> : c.content)}
                      {c.type === "divider" && (
                        <span className="opacity-50">{c.content}</span>
                      )}
                    </p>
                  ))}
                </div>
              )}

              <div
                className="my-2 h-px"
                style={{
                  background: `linear-gradient(90deg, transparent, ${headerClasses[item.theme as keyof typeof headerClasses]}, transparent)`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
