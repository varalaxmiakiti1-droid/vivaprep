import { z } from 'zod'

export const DIFFICULTIES = ['Easy', 'Medium', 'Hard'] as const
export type Difficulty = (typeof DIFFICULTIES)[number]

export const QUESTION_COUNTS = [5, 10, 15] as const

export const questionSchema = z.object({
  question: z.string(),
  answer: z.string(),
  difficulty: z.enum(DIFFICULTIES),
})

export const questionsSchema = z.object({
  questions: z.array(questionSchema),
})

export type VivaQuestion = z.infer<typeof questionSchema>

export const RESULTS = ['Correct', 'Partially Correct', 'Incorrect'] as const
export type EvaluationResult = (typeof RESULTS)[number]

export const evaluationSchema = z.object({
  result: z.enum(RESULTS),
  score: z.number().int().min(0).max(10),
  feedback: z.string(),
  improvement: z.string(),
})

export type Evaluation = z.infer<typeof evaluationSchema>

export const generateRequestSchema = z.object({
  subject: z.string().trim().min(1).max(100),
  topic: z.string().trim().min(1).max(150),
  difficulty: z.enum(DIFFICULTIES),
  count: z.union([z.literal(5), z.literal(10), z.literal(15)]),
})

export type GenerateRequest = z.infer<typeof generateRequestSchema>

export const evaluateRequestSchema = z.object({
  subject: z.string().trim().max(100),
  topic: z.string().trim().max(150),
  question: z.string().trim().min(1).max(500),
  referenceAnswer: z.string().trim().max(1500),
  studentAnswer: z.string().trim().min(1).max(3000),
})

export type EvaluateRequest = z.infer<typeof evaluateRequestSchema>

export type GenerateResponse = { questions: VivaQuestion[]; demo?: boolean }
export type EvaluateResponse = Evaluation & { demo?: boolean }
