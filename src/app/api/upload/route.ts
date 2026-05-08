import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadResumePdf } from "@/lib/storage/r2";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["application/pdf"];

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const resumeId = (formData.get("resumeId") as string) ?? randomUUID();

    if (!file) {
      return NextResponse.json(
        { error: "Tidak ada file yang diunggah" },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Hanya file PDF yang diizinkan" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Ukuran file maksimal 5MB" },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { key, url } = await uploadResumePdf(
      session.user.id,
      resumeId,
      buffer,
      file.type,
    );

    return NextResponse.json(
      { success: true, key, url, resumeId },
      { status: 200 },
    );
  } catch (error) {
    console.error("[API] upload error:", error);
    return NextResponse.json(
      { error: "Gagal mengunggah file" },
      { status: 500 },
    );
  }
}
