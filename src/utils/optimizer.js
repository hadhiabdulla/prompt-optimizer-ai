// Core prompt optimization engine.
// This is a rule-based, local optimizer (no external API required) that rewrites
// prompts using mode/persona-specific strategies and computes quality metrics.
import { getModeById } from '../data/modes'
import { getPersonaById } from '../data/personas'

const STRATEGY_PREFIX = {
  general: 'You are a knowledgeable, helpful assistant.',
  education: 'You are an expert educator. Explain concepts step-by-step with examples suited to the learner\'s level.',
  'academic-research': 'You are a rigorous academic researcher. Ground claims in evidence and cite methodology where relevant.',
  programming: 'You are an expert software engineer. Provide correct, efficient, well-commented code.',
  'software-development': 'You are a senior software architect. Consider scalability, maintainability, and best practices.',
  cybersecurity: 'You are a cybersecurity expert focused on defensive, ethical, and legal security practices.',
  'creative-writing': 'You are an award-winning creative writer with a vivid, original voice.',
  'content-writing': 'You are a professional content writer optimizing for clarity, structure, and engagement.',
  blogging: 'You are an experienced blogger who writes engaging, SEO-aware long-form content.',
  copywriting: 'You are a world-class copywriter focused on persuasion and conversion.',
  marketing: 'You are a strategic marketing expert focused on measurable outcomes.',
  'social-media': 'You are a social media strategist who writes scroll-stopping, platform-native content.',
  business: 'You are a seasoned business strategist and consultant.',
  'professional-communication': 'You write clear, polished, professional workplace communication.',
  'resume-builder': 'You are a professional resume writer focused on quantifiable achievements.',
  'cover-letter': 'You are a career coach who writes compelling, personalized cover letters.',
  'interview-prep': 'You are an interview coach who prepares candidates with structured practice.',
  'email-writing': 'You write clear, concise, professional emails.',
  'customer-support': 'You are an empathetic, solution-oriented customer support specialist.',
  'sql-query': 'You are a database expert who writes precise, efficient SQL.',
  'data-analysis': 'You are a data analyst who surfaces clear, actionable insights.',
  'image-generation': 'You are an expert prompt engineer for image generation models, focused on visual detail.',
  'video-generation': 'You are an expert prompt engineer for video generation models, focused on motion and scene detail.',
  'story-writing': 'You are a skilled novelist focused on narrative structure and character depth.',
  storytelling: 'You are a captivating storyteller with a strong narrative voice.',
  roleplay: 'You maintain consistent character voice and context throughout roleplay.',
  translation: 'You are an expert translator who preserves tone, meaning, and cultural nuance.',
  summarization: 'You produce concise, accurate summaries that preserve key information.',
  brainstorming: 'You generate diverse, creative, non-obvious ideas.',
  funny: 'You are a witty comedy writer who maximizes humor.',
  'meme-generator': 'You understand internet culture and generate relevant, funny meme concepts.',
  debate: 'You present balanced, well-reasoned arguments from multiple perspectives.',
  presentation: 'You structure information into clear, compelling presentation slides.',
  'project-documentation': 'You write clear, structured, professional technical documentation.',
  healthcare: 'You provide general, well-sourced wellness information and always recommend consulting a professional.',
  'legal-drafting': 'You provide general legal document structure and always recommend consulting a licensed attorney.',
  productivity: 'You are a productivity expert who provides actionable, structured plans.',
  'travel-planning': 'You are an expert travel planner who creates practical, exciting itineraries.',
  'career-guidance': 'You are a career advisor providing personalized, actionable guidance.',
  custom: 'You follow the user\'s custom instructions precisely.',
}

const clean = (s) => (s || '').trim().replace(/\s+/g, ' ')

function wordCount(s) {
  return clean(s).split(' ').filter(Boolean).length
}

function estimateTokens(s) {
  return Math.ceil(clean(s).length / 4)
}

function hasContext(s) {
  return /(for|about|context|because|given|using|in order to|target|audience)/i.test(s)
}

function hasSpecifics(s) {
  return /(\d|specific|exactly|format|length|words|steps|example|e\.g\.|include|must|should)/i.test(s)
}

function hasConstraints(s) {
  return /(word count|tone|format|style|length|avoid|do not|don't|must not)/i.test(s)
}

// Compute quality scores (0-100) for a given prompt
export function analyzePrompt(promptText) {
  const text = clean(promptText)
  const words = wordCount(text)
  const tokens = estimateTokens(text)

  let clarity = 50
  if (words > 5) clarity += 15
  if (/[.?!]$/.test(text)) clarity += 10
  if (!/\b(thing|stuff|something|whatever)\b/i.test(text)) clarity += 15
  if (words > 60) clarity -= 10
  clarity = Math.max(5, Math.min(100, clarity))

  let context = 30
  if (hasContext(text)) context += 30
  if (words > 15) context += 20
  if (words > 40) context += 10
  context = Math.max(5, Math.min(100, context))

  let specificity = 30
  if (hasSpecifics(text)) specificity += 35
  if (hasConstraints(text)) specificity += 20
  if (words > 25) specificity += 10
  specificity = Math.max(5, Math.min(100, specificity))

  let creativity = 40
  if (/\b(imagine|creative|unique|story|design|invent|novel)\b/i.test(text)) creativity += 30
  if (words > 20) creativity += 15
  creativity = Math.max(5, Math.min(100, creativity))

  const overall = Math.round((clarity + context + specificity + creativity) / 4)
  const effectiveness = Math.round(overall * 0.9 + Math.min(10, words / 5))

  const strengths = []
  const weaknesses = []
  const suggestions = []

  if (clarity >= 70) strengths.push('Clear and unambiguous phrasing')
  else { weaknesses.push('Phrasing could be clearer'); suggestions.push('State the exact task in one direct sentence') }

  if (context >= 70) strengths.push('Good background context provided')
  else { weaknesses.push('Missing background context'); suggestions.push('Add relevant background, audience, or purpose') }

  if (specificity >= 70) strengths.push('Specific and well-constrained')
  else { weaknesses.push('Lacks specific constraints'); suggestions.push('Specify format, length, or examples desired') }

// deliberately left blank to keep file separator clean

  if (creativity >= 65) strengths.push('Engaging and imaginative framing')

  if (words < 6) { weaknesses.push('Prompt is too short'); suggestions.push('Expand with more detail about the desired outcome') }
  if (words > 120) { weaknesses.push('Prompt may be too long / unfocused'); suggestions.push('Trim to the essential instructions') }

  return {
    words, tokens, clarity, context, specificity, creativity, overall,
    effectiveness: Math.max(0, Math.min(100, effectiveness)),
    strengths: strengths.length ? strengths : ['Prompt has a clear base intent'],
    weaknesses: weaknesses.length ? weaknesses : ['No major issues detected'],
    suggestions: suggestions.length ? suggestions : ['Consider adding an example of the ideal output'],
  }
}

// Build an optimized version of the prompt for the given mode + persona
export function optimizePrompt(promptText, modeId = 'general', personaId = 'none') {
  const text = clean(promptText)
  const mode = getModeById(modeId)
  const persona = getPersonaById(personaId)
  const before = analyzePrompt(text)

  const roleLine = STRATEGY_PREFIX[mode.id] || STRATEGY_PREFIX.general
  const personaLine = persona.id !== 'none' ? ` Adopt the persona of a ${persona.label}: ${persona.tone}` : ''

  const needsContext = !hasContext(text)
  const needsSpecifics = !hasSpecifics(text)
  const needsConstraints = !hasConstraints(text)

  const enrichments = []
  if (needsContext) enrichments.push('Consider the relevant context, audience, and purpose before responding.')
  if (needsSpecifics) enrichments.push('Be specific: include concrete details, examples, or data where useful.')
  if (needsConstraints) enrichments.push('Follow a clear structure and specify format/length constraints in the answer.')

  const taskLine = text.endsWith('.') || text.endsWith('?') || text.endsWith('!') ? text : `${text}.`

  const optimized = [
    `${roleLine}${personaLine}`,
    '',
    `Task: ${taskLine}`,
    enrichments.length ? `\nGuidelines:\n- ${enrichments.join('\n- ')}` : '',
    '\nProvide a well-structured, high-quality response that directly fulfills the task above.',
  ].filter(Boolean).join('\n')

  const after = analyzePrompt(optimized)
  const improvement = Math.max(0, Math.round(((after.overall - before.overall) / Math.max(1, before.overall)) * 100))

  return {
    original: text,
    optimized,
    mode: mode.label,
    persona: persona.label,
    before,
    after,
    improvement,
    summary: `Optimized for ${mode.label}${persona.id !== 'none' ? ` with a ${persona.label} persona` : ''}. Overall quality improved from ${before.overall} to ${after.overall} (+${improvement}%).`,
  }
}
