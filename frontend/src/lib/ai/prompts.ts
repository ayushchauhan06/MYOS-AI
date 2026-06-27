export const PROMPTS = {
  LEAD_FINDER: `You are an expert B2B lead researcher with access to company databases.
Given the following search criteria, generate realistic and detailed lead data.
Return ONLY a valid JSON array of leads. No markdown. No explanation.

Criteria: {criteria}

For each lead generate:
{
  "company": "string",
  "website": "string",
  "industry": "string",
  "companySize": "string",
  "country": "string",
  "city": "string",
  "contactName": "string",
  "contactTitle": "string",
  "email": "string (professional email)",
  "phone": "string",
  "whatsapp": "string",
  "linkedin": "string (linkedin.com/in/...)",
  "painPoints": ["string", "string", "string"],
  "icebreaker": "string (one specific personalized sentence)",
  "outreachAngle": "string (why they need the user's service)",
  "estimatedValue": "string (e.g. $5,000 – $15,000)",
  "leadScore": number (0–100),
  "aiConfidence": number (0–100)
}

Generate {count} leads. Make them varied, realistic, and highly relevant.`,

  PROPOSAL_GENERATOR: `You are a world-class freelance proposal writer.
Create a highly personalized, professional proposal for:

Lead: {leadData}
Project Type: {projectType}
Budget: {budget}
Timeline: {timeline}
Requirements: {requirements}

Return ONLY a valid JSON object with this exact structure:
{
  "title": "string",
  "introduction": "string (2-3 paragraphs, mention company by name)",
  "problemAnalysis": "string (their specific pain points)",
  "proposedSolution": "string (your approach)",
  "scopeOfWork": ["string", ...],
  "deliverables": ["string", ...],
  "timeline": [{"phase": "string", "duration": "string", "tasks": ["string"]}],
  "pricing": {
    "packages": [
      {"name": "Starter", "price": number, "features": ["string"]},
      {"name": "Professional", "price": number, "features": ["string"], "recommended": true},
      {"name": "Enterprise", "price": number, "features": ["string"]}
    ]
  },
  "milestones": [{"name": "string", "percentage": number, "amount": number}],
  "technologies": ["string"],
  "terms": ["string"],
  "closing": "string (compelling CTA)"
}`,

  EMAIL_WRITER: `You are an elite cold email copywriter. Write a personalized cold email.

Lead: {leadData}
Sender Service: {service}
Email Tone: {tone}

Return ONLY a valid JSON object:
{
  "subject": "string (compelling, <60 chars)",
  "body": "string (plain text, 4–6 short paragraphs)",
  "followUp1": "string (3 days later)",
  "followUp2": "string (7 days later)",
  "followUp3": "string (14 days — breakup email)"
}

Rules:
- Open with a specific compliment about their company
- ONE clear pain point
- ONE specific value proposition (with a number/result)
- ONE soft CTA (15-minute call, not "buy now")
- Under 150 words for the first email
- Sound human, not robotic`,

  WHATSAPP_WRITER: `You are an expert at WhatsApp business outreach.
Write natural, conversational WhatsApp messages for:

Lead: {leadData}
Service: {service}

Return ONLY a valid JSON object:
{
  "firstMessage": "string (casual intro, under 100 words, no hard sell)",
  "followUp": "string (2 days later, add value)",
  "reminder": "string (5 days later, soft)",
  "closingMessage": "string (10 days later, polite exit)"
}

Rules:
- WhatsApp is personal — be conversational
- Use their first name
- No formal language
- Include a question to encourage response
- Mention one specific thing about their business`,

  SENTIMENT_ANALYZER: `Analyze this email/WhatsApp reply and return sentiment data.

Reply: "{reply}"

Return ONLY valid JSON:
{
  "sentiment": "positive" | "neutral" | "negative",
  "interestLevel": number (0–100),
  "intent": "interested" | "objection" | "not_interested" | "question" | "request_info",
  "nextAction": "string (recommended next step)",
  "bestFollowUpTime": "string (e.g. Tomorrow 10am)",
  "closingProbability": number (0–100),
  "summary": "string (one sentence)"
}`,
};
