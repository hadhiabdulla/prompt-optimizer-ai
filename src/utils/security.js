// Cybersecurity analysis for prompts: detects injection attempts, sensitive data, and PII

const PATTERNS = {
  promptInjection: [
    /ignore (all|previous|prior) instructions/i,
    /disregard (the )?(system|previous) (prompt|instructions)/i,
    /you are now (in )?(developer|debug|admin) mode/i,
    /act as if you have no restrictions/i,
    /pretend (to be|you are) (an? )?(different|unrestricted)/i,
    /system\s*:\s*new instructions/i,
    /override (your |the )?(safety|guidelines|rules)/i,
  ],
  jailbreak: [
    /\bDAN\b/,
    /jailbreak/i,
    /no (ethical|moral) (guidelines|restrictions)/i,
    /bypass (content|safety) (policy|filter)/i,
    /respond without (any )?(restrictions|filters)/i,
  ],
  email: [/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g],
  phone: [/\+?\d[\d\s().-]{8,}\d/g],
  apiKey: [/\b(sk|pk|api|key)[-_][A-Za-z0-9]{10,}\b/gi, /\bAKIA[0-9A-Z]{16}\b/g],
  password: [/\bpassword\s*[:=]\s*\S+/i, /\bpasswd\s*[:=]\s*\S+/i],
  accessToken: [/\b(ghp_|gho_|ghu_|ghs_)[A-Za-z0-9]{20,}\b/g, /\bBearer\s+[A-Za-z0-9._-]{20,}\b/g],
  creditCard: [/\b(?:\d[ -]*?){13,16}\b/g],
  ssn: [/\b\d{3}-\d{2}-\d{4}\b/g],
}

function findMatches(text, patterns) {
  const found = []
  patterns.forEach((re) => {
    const matches = text.match(re)
    if (matches) found.push(...matches)
  })
  return found
}

export function scanPromptSecurity(promptText) {
  const text = promptText || ''
  const findings = {
    promptInjection: findMatches(text, PATTERNS.promptInjection),
    jailbreak: findMatches(text, PATTERNS.jailbreak),
    email: findMatches(text, PATTERNS.email),
    phone: findMatches(text, PATTERNS.phone),
    apiKey: findMatches(text, PATTERNS.apiKey),
    password: findMatches(text, PATTERNS.password),
    accessToken: findMatches(text, PATTERNS.accessToken),
    creditCard: findMatches(text, PATTERNS.creditCard),
    ssn: findMatches(text, PATTERNS.ssn),
  }

  let riskScore = 0
  const recommendations = []

  if (findings.promptInjection.length) { riskScore += 35; recommendations.push('Potential prompt injection detected. Remove instructions attempting to override system behavior.') }
  if (findings.jailbreak.length) { riskScore += 35; recommendations.push('Potential jailbreak attempt detected. Avoid language designed to bypass safety guidelines.') }
  if (findings.apiKey.length) { riskScore += 20; recommendations.push('Possible API key detected. Remove credentials before sharing this prompt.') }
  if (findings.accessToken.length) { riskScore += 20; recommendations.push('Possible access token detected. Remove tokens before sharing this prompt.') }
  if (findings.password.length) { riskScore += 15; recommendations.push('Possible password detected. Never include plaintext passwords in prompts.') }
  if (findings.creditCard.length) { riskScore += 15; recommendations.push('Possible credit card number detected. Remove financial information.') }
  if (findings.ssn.length) { riskScore += 15; recommendations.push('Possible SSN or government ID detected. Remove sensitive identifiers.') }
  if (findings.email.length) { riskScore += 5; recommendations.push('Email address detected. Confirm this is intentional before sharing.') }
  if (findings.phone.length) { riskScore += 5; recommendations.push('Phone number detected. Confirm this is intentional before sharing.') }

  riskScore = Math.min(100, riskScore)

  let riskLevel = 'Low'
  if (riskScore >= 60) riskLevel = 'Critical'
  else if (riskScore >= 35) riskLevel = 'High'
  else if (riskScore >= 15) riskLevel = 'Medium'

  const totalIssues = Object.values(findings).reduce((sum, arr) => sum + arr.length, 0)

  return {
    riskScore,
    riskLevel,
    totalIssues,
    findings,
    recommendations: recommendations.length ? recommendations : ['No significant security risks detected.'],
  }
}
