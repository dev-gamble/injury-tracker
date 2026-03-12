import { Logger } from "next-axiom"

const app = process.env.npm_package_name || "app-template"
const env = process.env.NODE_ENV || "development"

const baseConfig = {
  source: "app",
  args: {
    app,
    env,
  },
}

/**
 * Default logger instance.
 *
 * Dev  (no NEXT_PUBLIC_AXIOM_TOKEN/NEXT_PUBLIC_AXIOM_DATASET): logs to console
 * Prod (Axiom env vars set): sends to Axiom
 *
 * Usage:
 *   import { log } from "@/lib/logging"
 *   log.info("message", { key: "value" })
 *   await log.flush() // required in server components / route handlers
 *
 * Scoped logger:
 *   const log = logger("my-feature")
 *   log.info("event", { ... })
 */
export const log = new Logger(baseConfig)

/** Create a logger with a fixed `source` field on every entry. */
export function logger(source: string) {
  return new Logger({
    ...baseConfig,
    source,
  })
}

/** Normalize unknown errors so logs are always structured. */
export function errorToFields(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    }
  }
  return { message: String(error) }
}

/** Flush logs without failing the request path if transport errors happen. */
export async function safeFlush(loggerInstance: Logger) {
  try {
    await loggerInstance.flush()
  } catch {}
}

export { Logger }
