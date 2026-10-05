import { generateText, Output } from 'ai'
import { hasAiCredentials, isGatewayAccessError, VIVA_MODEL } from '@/lib/ai'
import { mockQuestions } from '@/lib/mock'
import {
  generateRequestSchema,
  questionsSchema,
  type GenerateResponse,
} from '@/lib/types'

export const maxDuration = 60

export async function POST(req: Request) {
  const parsed = generateRequestSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }
  const input = parsed.data

  if (!hasAiCredentials()) {
    return Response.json({ questions: mockQuestions(input), demo: true } satisfies GenerateResponse)
  }

  try {
    const { output } = await generateText({
      model: VIVA_MODEL,
      output: Output.object({ schema: questionsSchema }),
      system:
        'You are an experienced university professor conducting a viva voce (oral exam). ' +
        'Generate technically accurate viva questions with short, memorable answers a student can speak aloud in 1-3 sentences. ' +
        'Questions must be distinct and mix definition, concept, application, and basic technical questions.',
      prompt:
        `Subject: ${input.subject}\n` +
        `Topic / Experiment: ${input.topic}\n` +
        `Difficulty: ${input.difficulty}\n` +
        `Generate exactly ${input.count} viva questions strictly about this topic within this subject. ` +
        `Set every question's difficulty to "${input.difficulty}".`,
    })

    return Response.json({
      questions: output.questions.slice(0, input.count),
    } satisfies GenerateResponse)
  } catch (error) {
    if (isGatewayAccessError(error)) {
      return Response.json({ questions: mockQuestions(input), demo: true } satisfies GenerateResponse)
    }
    console.error('[generate] AI request failed:', error)
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
