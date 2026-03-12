import { z } from "zod"

const AXIOM_LOG_LEVELS = ["debug", "info", "warn", "error", "off"] as const

function clean(value: unknown): unknown {
  if (typeof value !== "string") return value
  return value.replace(/^['"]|['"]$/g, "").replace(/\r/g, "").trim()
}

const optionalString = z.preprocess(
  (value) => {
    const normalized = clean(value)
    if (typeof normalized !== "string" || normalized === "") return undefined
    return normalized
  },
  z.string().optional()
)

const publicEnvSchema = z
  .object({
    NEXT_PUBLIC_SUPABASE_URL: z.preprocess(
      clean,
      z.string().url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
    ),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.preprocess(
      clean,
      z.string().min(1, "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY is required")
    ),
    NEXT_PUBLIC_AXIOM_TOKEN: optionalString,
    NEXT_PUBLIC_AXIOM_DATASET: optionalString,
    NEXT_PUBLIC_AXIOM_LOG_LEVEL: z.preprocess(
      (value) => {
        const normalized = clean(value)
        if (typeof normalized !== "string" || normalized === "") return undefined
        return normalized
      },
      z.enum(AXIOM_LOG_LEVELS).optional()
    ),
  })
  .superRefine((value, ctx) => {
    const hasToken = Boolean(value.NEXT_PUBLIC_AXIOM_TOKEN)
    const hasDataset = Boolean(value.NEXT_PUBLIC_AXIOM_DATASET)

    if (hasToken !== hasDataset) {
      ctx.addIssue({
        code: "custom",
        path: hasToken ? ["NEXT_PUBLIC_AXIOM_DATASET"] : ["NEXT_PUBLIC_AXIOM_TOKEN"],
        message: "Set both NEXT_PUBLIC_AXIOM_TOKEN and NEXT_PUBLIC_AXIOM_DATASET, or leave both unset",
      })
    }
  })

const serverEnvSchema = z.object({
  SUPABASE_SECRET_KEY: z.preprocess(
    clean,
    z.string().min(1, "SUPABASE_SECRET_KEY is required")
  ),
})

type PublicEnv = z.infer<typeof publicEnvSchema>
type ServerEnv = z.infer<typeof serverEnvSchema>

let publicEnvCache: PublicEnv | null = null
let serverEnvCache: ServerEnv | null = null

function formatEnvError(scope: string, error: z.ZodError) {
  const details = error.issues
    .map((issue) => {
      const key = issue.path.join(".") || "env"
      return `- ${key}: ${issue.message}`
    })
    .join("\n")

  return `Invalid ${scope} environment variables:\n${details}`
}

export function getPublicEnv(): PublicEnv {
  if (publicEnvCache) return publicEnvCache

  const parsed = publicEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    NEXT_PUBLIC_AXIOM_TOKEN: process.env.NEXT_PUBLIC_AXIOM_TOKEN,
    NEXT_PUBLIC_AXIOM_DATASET: process.env.NEXT_PUBLIC_AXIOM_DATASET,
    NEXT_PUBLIC_AXIOM_LOG_LEVEL: process.env.NEXT_PUBLIC_AXIOM_LOG_LEVEL,
  })

  if (!parsed.success) {
    throw new Error(formatEnvError("public", parsed.error))
  }

  publicEnvCache = parsed.data
  return publicEnvCache
}

export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("getServerEnv() can only be called on the server")
  }
  if (serverEnvCache) return serverEnvCache

  const parsed = serverEnvSchema.safeParse({
    SUPABASE_SECRET_KEY: process.env.SUPABASE_SECRET_KEY,
  })

  if (!parsed.success) {
    throw new Error(formatEnvError("server", parsed.error))
  }

  serverEnvCache = parsed.data
  return serverEnvCache
}
