import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Sparkles, Trash2 } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { optimizePrompt, analyzePrompt } from '../utils/optimizer'
import { scanPromptSecurity } from '../utils/security'
import './AIChat.css'

const QUICK_PROMPTS = [
  'How do I write a better prompt for coding tasks?',
  'Analyze this prompt: Write a story',
  'What is a jailbreak attempt in prompts?',
  'Give me tips to reduce prompt ambiguity',
]

// Local rule-based assistant: answers prompt-engineering questions and can
// optimize/analyze prompts directly inside the chat, with no external API.
function generateReply(message) {
  const text = message.trim()
  const lower = text.toLowerCase()

  if (lower.startsWith('analyze:') || lower.startsWith('analyze this prompt:')) {
    const target = text.split(':').slice(1).join(':').trim()
    if (!target) return "Please provide a prompt after 'Analyze:' so I can evaluate it."
    const a = analyzePrompt(target)
    return `Analysis for "${target}":\n- Clarity: ${a.clarity}/100\n- Context: ${a.context}/100\n- Specificity: ${a.specificity}/100\n- Creativity: ${a.creativity}/100\n- Overall: ${a.overall}/100\n\nStrengths: ${a.strengths.join(', ')}\nSuggestions: ${a.suggestions.join(', ')}`
  }

  if (lower.startsWith('optimize:')) {
    const target = text.split(':').slice(1).join(':').trim()
    if (!target) return "Please provide a prompt after 'Optimize:' so I can rewrite it."
    const res = optimizePrompt(target)
    return `Here is an optimized version:\n\n${res.optimized}\n\n${res.summary}`
  }

  if (lower.includes('jailbreak') || lower.includes('injection')) {
    return 'A jailbreak/injection attempt tries to override a model\'s safety instructions, often via role-play framing, hidden instructions, or claims of special authorization. Always validate and sanitize untrusted input, and never let embedded content override system-level rules. Use the Analyzer tab to scan prompts for these patterns automatically.'
  }

  if (lower.includes('coding') || lower.includes('code')) {
    return 'For coding prompts: 1) State the language and framework explicitly. 2) Include the exact function signature or context. 3) Specify constraints (performance, style, error handling). 4) Ask for comments and test cases. Try the Programming mode in the Optimizer for an auto-generated system role.'
  }

  if (lower.includes('ambigu') || lower.includes('unclear') || lower.includes('better prompt')) {
    return 'To reduce ambiguity: be specific about the desired format, length, and audience. Avoid vague words like "thing" or "stuff". Add examples of the ideal output when possible. The Optimizer\'s Specificity score reflects exactly this.'
  }

  if (lower.includes('persona')) {
    return 'Personas let you frame the assistant\'s voice and expertise (e.g. Senior Engineer, Academic Researcher). Combine a persona with a Mode in the Optimizer for highly targeted results.'
  }

  if (lower.includes('hello') || lower.includes('hi') || lower === '') {
    return "Hi! I'm your prompt engineering assistant. Ask me about optimizing prompts, detecting security risks, or type 'Optimize: <your prompt>' / 'Analyze: <your prompt>' to try it live."
  }

  return "I can help with prompt engineering questions, or directly process a prompt if you type 'Optimize: <prompt>' or 'Analyze: <prompt>'. Try one of the quick prompts below to get started."
}

export default function AIChat() {
  const { chatHistory, addChatMessage, clearChat } = useApp()
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistory])

  const handleSend = (text) => {
    const message = (text ?? input).trim()
    if (!message) return
    addChatMessage({ role: 'user', content: message })
    setInput('')
    setTimeout(() => {
      const reply = generateReply(message)
      addChatMessage({ role: 'assistant', content: reply })
    }, 300)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="chat-page">
      <div className="page-header">
        <div>
          <h2>AI Assistant</h2>
          <p>Ask about prompt engineering, or type "Optimize:" / "Analyze:" followed by a prompt.</p>
        </div>
        <button className="btn-secondary" onClick={clearChat}>
          <Trash2 size={16} /> Clear Chat
        </button>
      </div>

      <div className="chat-window card">
        <div className="chat-messages">
          {chatHistory.length === 0 && (
            <div className="chat-empty">
              <Bot size={32} />
              <p>Start a conversation about prompt engineering.</p>
              <div className="quick-prompts">
                {QUICK_PROMPTS.map((q) => (
                  <button key={q} className="chip" onClick={() => handleSend(q)}>{q}</button>
                ))}
              </div>
            </div>
          )}
          {chatHistory.map((m) => (
            <div key={m.id} className={`chat-bubble-row ${m.role}`}>
              <div className="chat-avatar">{m.role === 'user' ? <User size={16} /> : <Sparkles size={16} />}</div>
              <div className="chat-bubble">{m.content}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
        <div className="chat-input-row">
          <textarea
            rows={2}
            placeholder="Type a message... (Shift+Enter for newline)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className="btn-primary" onClick={() => handleSend()}>
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
