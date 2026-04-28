import { NextResponse } from "next/server";
import { cloudSlicerFetch, getCloudSlicerConfig } from "@/lib/cloudslicer";

type UploadIdResponse = {
  upload_id?: string;
};

export async function GET() {
  try {
    // El upload_id se genera en backend para no exponer el token en el navegador.
    const config = getCloudSlicerConfig();
    const data = await cloudSlicerFetch<UploadIdResponse>(
      "/file/upload-id",
      config,
      { method: "GET" }
    );

    if (!data?.upload_id) {
      return NextResponse.json(
        { ok: false, error: "CloudSlicer no devolvió upload_id." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, uploadId: data.upload_id });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "No se pudo generar upload_id.";

    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
