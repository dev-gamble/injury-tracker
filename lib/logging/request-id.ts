import { NextRequest, NextResponse } from "next/server"

export const REQUEST_ID_HEADER = "x-request-id"

export function getOrCreateRequestId(request: Pick<NextRequest, "headers">): string {
  return request.headers.get(REQUEST_ID_HEADER) ?? crypto.randomUUID()
}

export function attachRequestIdHeader(response: NextResponse, requestId: string): NextResponse {
  response.headers.set(REQUEST_ID_HEADER, requestId)
  return response
}
