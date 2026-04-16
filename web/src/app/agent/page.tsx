"use client"

import { AgentChat, createAgentChat } from "@21st-sdk/nextjs"
import { useChat } from "@ai-sdk/react"
import theme from "../theme.json"

const chat = createAgentChat({
  agent: "my-agent",
  tokenUrl: "/api/an-token",
})

type AnyChat = any // 21st-sdk targets ai-sdk v2; bridge the type mismatch

export default function Page() {
  const helpers = useChat({ chat } as AnyChat) as AnyChat
  const { messages, status, stop, error } = helpers
  const handleSubmit = helpers.handleSubmit ?? helpers.submit ?? (() => {})

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
