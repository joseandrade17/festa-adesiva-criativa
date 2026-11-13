import { createFileRoute } from "@tanstack/react-router";
import { editSticker } from "@/lib/image-gateway.server";

export const Route = createFileRoute("/api/sticker-from-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const form = await request.formData();
        const image = form.get("image");
        if (!(image instanceof File) || image.size === 0) return new Response("Envie uma imagem", { status: 400 });
        if (image.size > 15 * 1024 * 1024) return new Response("Imagem muito grande (máx. 15 MB)", { status: 400 });
        const upstream = await editSticker(apiKey, form);
        return new Response(upstream.body, {
          status: upstream.status,
          headers: {
            "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
