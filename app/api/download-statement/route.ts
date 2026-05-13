import { NextResponse } from "next/server";
import { getStatementById } from "@/lib/data";

/**
 * Intentionally vulnerable lab endpoint: authorization is NOT enforced.
 * Any valid statement `id` returns that record as a downloadable JSON payload.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const statement = getStatementById(id);
  if (!statement) {
    return NextResponse.json({ error: "Statement not found" }, { status: 404 });
  }

  const body = JSON.stringify(statement, null, 2);
  const filename = `statement-${id}.json`;

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
