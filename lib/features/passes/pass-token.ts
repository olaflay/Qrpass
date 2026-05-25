import crypto from "node:crypto"

export function createPassToken() {
  return crypto.randomBytes(32).toString("base64url")
}

export function hashPassToken(token: string) {
  return crypto.createHash("sha256").update(token).digest("hex")
}

export function buildVerifyUrl(appUrl: string, token: string) {
  const url = new URL("/verify", appUrl)
  url.searchParams.set("token", token)
  return url.toString()
}
