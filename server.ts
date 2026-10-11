import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Initialize Google GenAI if key is present
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;
if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (err) {
    console.warn('Failed to initialize Google GenAI:', err);
  }
}

// Rule-based fallback analyzer when Gemini is not configured or in offline mode
function fallbackReviewAnalysis(reviewText: string, brandName: string, productTitle: string) {
  const text = reviewText.toLowerCase();
  const brand = (brandName || '').toLowerCase();
  const product = (productTitle || '').toLowerCase();

  const brandMentioned = brand ? text.includes(brand) : true;
  const productMentioned = product ? text.includes(product) : true;

  // Positive sentiment keywords
  const positiveKeywords = [
    'love', 'loved', 'great', 'amazing', 'excellent', 'fantastic', 'effective', 
    'recommended', 'smooth', 'quality', 'genuine', 'favorite', 'best', 'worthy', 
    'affordable', 'pigmented', 'natural', 'fresh', 'delicious', 'authentic', 'hydrating',
    'value for money', 'paisa vasool', 'must try', 'honest review', 'impressed'
  ];

  // Negative sentiment keywords
  const negativeKeywords = [
    'terrible', 'worst', 'waste of money', 'fake', 'allergic', 'bad', 'breakout', 
    'broken', 'horrible', 'cheap quality', 'disappointed', 'fraud', 'scam', 'useless',
    'smelled bad', 'not working', 'ruined'
  ];

  let positiveHits = 0;
  for (const kw of positiveKeywords) {
    if (text.includes(kw)) positiveHits++;
  }

  let negativeHits = 0;
  for (const kw of negativeKeywords) {
    if (text.includes(kw)) negativeHits++;
  }

  // Word count check (minimum substantive depth)
  const wordCount = reviewText.trim().split(/\s+/).length;
  const hasSubstance = wordCount >= 30;

  // Has disclosure / call to action
  const hasDisclosureOrCTA = text.includes('#ad') || text.includes('#collab') || text.includes('link') || text.includes('code') || text.includes('discount') || text.includes('available at');

  let baseScore = 68;
  if (brandMentioned) baseScore += 8;
  if (productMentioned) baseScore += 6;
  if (hasSubstance) baseScore += 8;
  baseScore += Math.min(12, positiveHits * 3);
  baseScore -= negativeHits * 15;
  if (hasDisclosureOrCTA) baseScore += 4;

  const qualityScore = Math.max(20, Math.min(98, baseScore));
  const sentimentScore = Math.max(15, Math.min(99, Math.round(50 + (positiveHits * 10) - (negativeHits * 20))));

  const isApproved = qualityScore >= 75;
  const negativeCommentRisk: 'low' | 'moderate' | 'high' = 
    negativeHits === 0 && positiveHits >= 2 ? 'low' : negativeHits === 1 ? 'moderate' : 'high';

  const verdict = isApproved ? 'APPROVED' : qualityScore >= 55 ? 'REVISION_NEEDED' : 'REJECTED';
  const payoutStatus = isApproved ? 'RELEASE_PAYOUT' : qualityScore >= 55 ? 'REQUEST_REVISION' : 'REJECT';

  const strengths: string[] = [];
  if (brandMentioned) strengths.push(`Explicitly mentioned brand name '${brandName}'`);
  if (positiveHits > 0) strengths.push(`Strong organic positive tonality detected (${positiveHits} positive descriptors)`);
  if (hasSubstance) strengths.push(`Good review depth with detailed creator experience (${wordCount} words)`);
  if (hasDisclosureOrCTA) strengths.push('Included transparent collaboration disclosure and clear follower call-to-action');
  if (strengths.length === 0) strengths.push('Clear creator voice and personal presentation');

  const improvementPoints: string[] = [];
  if (!brandMentioned && brandName) improvementPoints.push(`Make sure to clearly tag and mention ${brandName}`);
  if (!hasSubstance) improvementPoints.push('Elaborate on specific product benefits (texture, duration, results) for audience depth');
  if (negativeHits > 0) improvementPoints.push('Address negative friction points with constructive context rather than abrupt criticism');
  if (!hasDisclosureOrCTA) improvementPoints.push('Add collaboration disclosure (#Collab/#Partner) and coupon/link for tracking');
  if (improvementPoints.length === 0) improvementPoints.push('Maintain community engagement by replying to follower comments within 24 hours');

  return {
    isApproved,
    qualityScore,
    sentimentScore,
    negativeCommentRisk,
    verdict,
    payoutStatus,
    verdictSummary: isApproved
      ? `High-quality authentic review. Sentiment score is ${sentimentScore}% with low negative reaction risk. Meets brand criteria.`
      : `Review requires refinement before escrow release. Quality score is ${qualityScore}/100. Creator can update and resubmit.`,
    strengths,
    improvementPoints,
    engine: 'Crenova Heuristic & Sentiment Analyzer'
  };
}

// POST endpoint for AI Review Quality Analysis & Escrow Payout Determination
app.post('/api/ai/analyze-review', async (req, res) => {
  try {
    const {
      reviewText,
      brandName = 'Partner Brand',
      productTitle = 'Featured Product',
      campaignRequirements = 'Honest authentic review highlighting key product USPs with clear call to action and low negative audience risk.',
      creatorHandle = '@creator'
    } = req.body;

    if (!reviewText || typeof reviewText !== 'string' || reviewText.trim().length === 0) {
      return res.status(400).json({ error: 'Review text is required for quality verification.' });
    }

    // Try Gemini API if client is available
    if (aiClient) {
      try {
        const prompt = `You are CRENOVA's AI Review Quality & Escrow Auditor for Indian brand collaborations.
Evaluate this micro-creator's submitted product review against the brand's campaign requirements.
Determine whether this review qualifies for instant escrow payout release or requires revision.

Brand Name: ${brandName}
Product / Offer: ${productTitle}
Campaign Requirements: ${campaignRequirements}
Creator Handle: ${creatorHandle}

Creator Submitted Review:
"""
${reviewText}
"""

Evaluate carefully:
1. Sentiment & Tone: Is it positive, genuine, and authentic? Or cynical, forced, or toxic?
2. Brand & Product Presentation: Did they feature the brand appropriately and convey genuine value?
3. Negative Comment & Backlash Risk: Is there high likelihood of angry/negative audience comments or troll backlash? (low, moderate, high)
4. Guideline Adherence: Did they provide substantive insight, proper hashtags/disclosure, or a call-to-action?
5. Final Quality Score: 0 to 100.
6. Approval: Is it approved for instant payout release? (qualityScore >= 75)
7. Verdict: 'APPROVED', 'REVISION_NEEDED', or 'REJECTED'.

Respond STRICTLY with valid JSON only in this format:
{
  "isApproved": boolean,
  "qualityScore": number,
  "sentimentScore": number,
  "negativeCommentRisk": "low" | "moderate" | "high",
  "verdict": "APPROVED" | "REVISION_NEEDED" | "REJECTED",
  "payoutStatus": "RELEASE_PAYOUT" | "REQUEST_REVISION" | "REJECT",
  "verdictSummary": "Clear 2-sentence summary of why this review passed or needs work",
  "strengths": ["string", "string"],
  "improvementPoints": ["string", "string"],
  "engine": "Gemini 3.8 Flash (Creova Escrow AI)"
}`;

        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Gemini API timeout')), 4500)
        );

        const apiPromise = aiClient.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json'
          }
        });

        const response = await Promise.race([apiPromise, timeoutPromise]);

        const outputText = response.text;
        if (outputText) {
          const parsed = JSON.parse(outputText);
          return res.json(parsed);
        }
      } catch (geminiError) {
        console.warn('Gemini evaluation failed, falling back to heuristic engine:', geminiError);
      }
    }

    // Fallback if no Gemini client or on failure
    const fallbackResult = fallbackReviewAnalysis(reviewText, brandName, productTitle);
    return res.json(fallbackResult);
  } catch (err: any) {
    console.error('Error in review analysis:', err);
    return res.status(500).json({ error: err.message || 'Internal error evaluating review.' });
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Crenova Engine', time: new Date().toISOString() });
});

// Dev / Production serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CRENOVA Platform running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
