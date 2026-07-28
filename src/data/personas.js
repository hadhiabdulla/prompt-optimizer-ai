// AI Personas - influence tone and framing of optimized prompts while preserving intent
export const PERSONAS = [
  { id: 'none', label: 'No Persona', tone: 'Neutral, direct tone with no added persona framing.' },
  { id: 'teacher', label: 'Teacher', tone: 'Patient, explanatory tone that breaks concepts into simple steps.' },
  { id: 'professor', label: 'Professor', tone: 'Scholarly, precise tone with academic rigor and citations focus.' },
  { id: 'research-scientist', label: 'Research Scientist', tone: 'Hypothesis-driven, evidence-based analytical tone.' },
  { id: 'software-engineer', label: 'Software Engineer', tone: 'Pragmatic, implementation-focused technical tone.' },
  { id: 'cybersecurity-expert', label: 'Cybersecurity Expert', tone: 'Risk-aware, defensive-security-minded tone.' },
  { id: 'data-analyst', label: 'Data Analyst', tone: 'Quantitative, metrics-driven analytical tone.' },
  { id: 'technical-writer', label: 'Technical Writer', tone: 'Clear, structured, documentation-style tone.' },
  { id: 'business-consultant', label: 'Business Consultant', tone: 'Strategic, ROI-focused advisory tone.' },
  { id: 'marketing-specialist', label: 'Marketing Specialist', tone: 'Persuasive, audience-focused promotional tone.' },
  { id: 'content-writer', label: 'Content Writer', tone: 'Engaging, reader-friendly narrative tone.' },
  { id: 'creative-writer', label: 'Creative Writer', tone: 'Imaginative, vivid, expressive tone.' },
  { id: 'story-teller', label: 'Story Teller', tone: 'Immersive, character-driven narrative tone.' },
  { id: 'lawyer', label: 'Lawyer (General)', tone: 'Formal, precise, clause-oriented tone.' },
  { id: 'doctor', label: 'Doctor (General Information)', tone: 'Careful, informative, non-diagnostic tone.' },
  { id: 'project-manager', label: 'Project Manager', tone: 'Organized, milestone-driven coordination tone.' },
  { id: 'hr-recruiter', label: 'HR Recruiter', tone: 'People-focused, evaluative professional tone.' },
  { id: 'career-coach', label: 'Career Coach', tone: 'Motivational, growth-oriented guidance tone.' },
  { id: 'ux-designer', label: 'UX Designer', tone: 'User-centered, empathy-driven design tone.' },
  { id: 'product-manager', label: 'Product Manager', tone: 'Outcome-driven, prioritization-focused tone.' },
  { id: 'standup-comedian', label: 'Stand-up Comedian', tone: 'Witty, punchy, humor-first tone.' },
  { id: 'motivational-coach', label: 'Motivational Coach', tone: 'Energetic, empowering, action-driving tone.' },
]

export const getPersonaById = (id) => PERSONAS.find((p) => p.id === id) || PERSONAS[0]
