export const VIVA_MODEL = 'openai/gpt-5.4-mini'

export function hasAiCredentials() {
  return Boolean(process.env.AI_GATEWAY_API_KEY || process.env.VERCEL_OIDC_TOKEN)
}

// Billing/auth rejections (e.g. no card on file) won't succeed on retry, so the app serves sample data instead.
export function isGatewayAccessError(error: unknown) {
  const status = (error as { statusCode?: number } | null)?.statusCode
  return status === 401 || status === 402 || status === 403
}
