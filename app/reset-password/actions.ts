'use server'

import { cookies } from "next/headers"

export async function clearRecoveryMarker() {
  const cookieStore = await cookies()
  cookieStore.delete("endex_pw_recovery")
}
