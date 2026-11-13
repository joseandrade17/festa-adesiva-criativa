import { createFileRoute } from "@tanstack/react-router";
import { generateSticker } from "@/lib/image-gateway.server";

export const Route = createFileRoute("/api/generate-sticker")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { prompt, size = "1024x1024", stream = true } = await request.json();
        if (typeof prompt !== "string" || !prompt.trim()) return new Response("Prompt vazio", { status: 400 });
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const upstream = await generateSticker(apiKey, prompt.slice(0, 3000), String(size), stream);
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
