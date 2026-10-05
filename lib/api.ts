import type {
  EvaluateRequest,
  EvaluateResponse,
  GenerateRequest,
  GenerateResponse,
} from './types'

async function post<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Something went wrong. Please try again.')
  return res.json()
}

export const generateQuestions = (input: GenerateRequest) =>
  post<GenerateResponse>('/api/generate', input)

export const evaluateAnswer = (input: EvaluateRequest) =>
  post<EvaluateResponse>('/api/evaluate', input)
