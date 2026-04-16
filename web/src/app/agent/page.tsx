"use client"

import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { useChat } from "@ai-sdk/react"
import theme from "../theme.json"

const chat = createAgentChat({
  agent: "my-agent",
  tokenUrl: "/api/an-token",
})

export default function Page() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const chatHelpers = useChat({ chat } as any) as any
  const { messages, status, stop, error } = chatHelpers
  const handleSubmit = chatHelpers.handleSubmit ?? chatHelpers.submit ?? (() => {})

  return (
    <AgentChat
      messages={messages}
      onSend={() => handleSubmit()}
      status={status}
      onStop={stop}
      error={error ?? undefined}
      theme={theme}
    />
  )
}
