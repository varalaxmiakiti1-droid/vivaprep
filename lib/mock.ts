import type {
  EvaluateRequest,
  Evaluation,
  GenerateRequest,
  VivaQuestion,
} from './types'

const TEMPLATES: Array<(topic: string, subject: string) => [string, string]> = [
  (t, s) => [
    `What is ${t}?`,
    `${t} is a core concept in ${s} that defines a specific structure or technique used to solve a class of problems efficiently.`,
  ],
  (t) => [
    `Why is ${t} important?`,
    `It simplifies problem solving, improves efficiency, and provides a standard approach that is widely used in real systems.`,
  ],
  (t) => [
    `What are the main advantages of ${t}?`,
    `Better performance, clear organisation, reusability, and easier maintenance compared to naive approaches.`,
  ],
  (t) => [
    `What are the limitations of ${t}?`,
    `It can add overhead, may need extra memory, and does not suit every problem size or input pattern.`,
  ],
  (t) => [
    `Give a real-world application of ${t}.`,
    `It is used in databases, operating systems, search engines, and networking software where speed and structure matter.`,
  ],
  (t, s) => [
    `How does ${t} differ from related concepts in ${s}?`,
    `It differs in how data is organised and accessed, which changes its time and space complexity.`,
  ],
  (t) => [
    `What is the time complexity of common operations in ${t}?`,
    `Typical operations run in O(log n) or O(n) depending on the input and implementation.`,
  ],
  (t) => [
    `Explain the working of ${t} step by step.`,
    `It takes an input, processes it according to defined rules, updates its internal state, and returns the result.`,
  ],
  (t) => [
    `What are the key terms associated with ${t}?`,
    `Important terms include input, output, state, operations, and complexity, each describing part of its behaviour.`,
  ],
  (t) => [
    `Can you name any variants of ${t}?`,
    `Yes, there are optimised and specialised variants designed for specific constraints like memory or speed.`,
  ],
  (t) => [
    `What happens in the worst case for ${t}?`,
    `In the worst case, performance degrades, usually to linear time, when input is unbalanced or poorly distributed.`,
  ],
  (t) => [
    `How would you implement ${t} in code?`,
    `Define the required data structures, write functions for each operation, and handle edge cases carefully.`,
  ],
  (t) => [
    `What are common mistakes students make with ${t}?`,
    `Ignoring edge cases, confusing it with similar concepts, and forgetting its complexity trade-offs.`,
  ],
  (t) => [
    `How do you test whether ${t} works correctly?`,
    `Use normal, boundary, and edge-case inputs and compare the outputs with expected results.`,
  ],
  (t, s) => [
    `Where does ${t} fit in the overall ${s} syllabus?`,
    `It builds on fundamentals and acts as a foundation for advanced topics later in the course.`,
  ],
]

export function mockQuestions({
  subject,
  topic,
  difficulty,
  count,
}: GenerateRequest): VivaQuestion[] {
  return TEMPLATES.slice(0, count).map((build) => {
    const [question, answer] = build(topic, subject)
    return { question, answer, difficulty }
  })
}

function keywords(text: string) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter((word) => word.length > 3),
  )
}

export function mockEvaluation({
  referenceAnswer,
  studentAnswer,
}: EvaluateRequest): Evaluation {
  const expected = keywords(referenceAnswer)
  const given = keywords(studentAnswer)
  const matched = [...expected].filter((word) => given.has(word)).length
  const ratio = expected.size ? matched / expected.size : 0
  const score = Math.min(10, Math.round(ratio * 10 + (given.size > 4 ? 2 : 0)))

  if (score >= 8) {
    return {
      result: 'Correct',
      score,
      feedback: 'Your answer covers the key points clearly.',
      improvement: 'Add a quick example to make your answer even stronger.',
    }
  }
  if (score >= 4) {
    return {
      result: 'Partially Correct',
      score,
      feedback: 'You touched on some of the important ideas.',
      improvement: `Try to include: ${referenceAnswer}`,
    }
  }
  return {
    result: 'Incorrect',
    score,
    feedback: 'Good attempt, but the core idea is missing.',
    improvement: `A good answer would be: ${referenceAnswer}`,
  }
}
