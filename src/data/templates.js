// Prompt template library - searchable, categorized starter prompts
export const TEMPLATE_CATEGORIES = [
  'Programming', 'Cybersecurity', 'Research', 'Education', 'Business', 'Marketing',
  'Resume', 'Interview', 'Image Generation', 'Writing', 'Storytelling', 'Social Media',
  'Email', 'SQL', 'Data Analysis', 'Travel', 'Healthcare', 'Legal', 'Productivity',
]

export const TEMPLATES = [
  { id: 't1', category: 'Programming', title: 'Debug a Function', body: 'Review the following function, identify bugs, and explain the root cause: [PASTE CODE]. Suggest a corrected version with comments.' },
  { id: 't2', category: 'Programming', title: 'Code Review Checklist', body: 'Act as a senior engineer reviewing this pull request for readability, performance, and security issues: [PASTE CODE].' },
  { id: 't3', category: 'Cybersecurity', title: 'Threat Model Draft', body: 'Create a STRIDE-based threat model for a web application with the following architecture: [DESCRIBE ARCHITECTURE].' },
  { id: 't4', category: 'Cybersecurity', title: 'Incident Response Plan', body: 'Draft an incident response plan outline for a suspected data breach affecting [SYSTEM/DATA TYPE].' },
  { id: 't5', category: 'Research', title: 'Literature Review Outline', body: 'Create a structured literature review outline on the topic of [TOPIC], including key themes and gaps.' },
  { id: 't6', category: 'Education', title: 'Lesson Plan Generator', body: 'Design a 45-minute lesson plan for teaching [TOPIC] to [GRADE LEVEL] students, including objectives and activities.' },
  { id: 't7', category: 'Business', title: 'SWOT Analysis', body: 'Perform a SWOT analysis for a business in the [INDUSTRY] planning to [GOAL].' },
  { id: 't8', category: 'Marketing', title: 'Campaign Brief', body: 'Write a marketing campaign brief for launching [PRODUCT] targeting [AUDIENCE] with a budget of [BUDGET].' },
  { id: 't9', category: 'Resume', title: 'Achievement Bullet Points', body: 'Rewrite these job responsibilities into achievement-oriented resume bullet points with metrics: [PASTE RESPONSIBILITIES].' },
  { id: 't10', category: 'Interview', title: 'Behavioral Question Prep', body: 'Generate 5 behavioral interview questions for a [ROLE] position and sample STAR-method answers.' },
  { id: 't11', category: 'Image Generation', title: 'Cinematic Portrait', body: 'A cinematic portrait of [SUBJECT], dramatic lighting, shallow depth of field, 85mm lens, golden hour, ultra-detailed.' },
  { id: 't12', category: 'Writing', title: 'Persuasive Essay Outline', body: 'Create an outline for a persuasive essay arguing that [CLAIM], with three supporting arguments and counterpoints.' },
  { id: 't13', category: 'Storytelling', title: 'Short Story Seed', body: 'Write the opening paragraph of a short story set in [SETTING] featuring a protagonist who [TRAIT/GOAL].' },
  { id: 't14', category: 'Social Media', title: 'Viral Hook Ideas', body: 'Generate 5 scroll-stopping hooks for a short-form video about [TOPIC] targeting [AUDIENCE].' },
  { id: 't15', category: 'Email', title: 'Follow-up Email', body: 'Write a polite follow-up email after not hearing back about [SUBJECT], sent [TIMEFRAME] ago.' },
  { id: 't16', category: 'SQL', title: 'Report Query', body: 'Write a SQL query to find [METRIC] grouped by [DIMENSION] from a table named [TABLE] with columns [COLUMNS].' },
  { id: 't17', category: 'Data Analysis', title: 'Insight Summary', body: 'Analyze this dataset summary and provide 3 key insights and 1 recommendation: [PASTE DATA SUMMARY].' },
  { id: 't18', category: 'Travel', title: 'Itinerary Planner', body: 'Plan a [N]-day itinerary for [DESTINATION] with a focus on [INTEREST] and a budget of [BUDGET].' },
  { id: 't19', category: 'Healthcare', title: 'Wellness Explainer', body: 'Explain, in simple terms, general information about [CONDITION/TOPIC] and lifestyle considerations (not medical advice).' },
  { id: 't20', category: 'Legal', title: 'NDA Outline', body: 'Draft a general outline for a mutual non-disclosure agreement between two parties for [PURPOSE] (not legal advice).' },
  { id: 't21', category: 'Productivity', title: 'Weekly Planning Prompt', body: 'Help me plan my week given these priorities: [LIST PRIORITIES], and suggest a time-blocked schedule.' },
]

export const getTemplatesByCategory = (category) =>
  category === 'All' ? TEMPLATES : TEMPLATES.filter((t) => t.category === category)
