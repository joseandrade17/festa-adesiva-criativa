export const imageSettings = {
  baseURL: "https://ai.gateway.lovable.dev",
  model: "openai/gpt-image-2.5-sunburst",
};

export function generateSticker(apiKey: string, prompt: string, size: string, stream = true) {
  return fetch(`${imageSettings.baseURL}/v1/images/generations`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: imageSettings.model,
      prompt,
      size,
      background: "transparent",
      output_format: "png",
      quality: "medium",
      ...(stream ? { stream: true, partial_images: 1 } : {}),
    }),
  });
}

export function editSticker(apiKey: string, form: FormData) {
  const streaming = form.get("stream") !== "false";
  form.set("model", imageSettings.model);
  form.set("background", "transparent");
  form.set("output_format", "png");
  form.set("quality", "medium");
  if (streaming) {
    form.set("stream", "true");
    form.set("partial_images", "1");
  } else {
    form.delete("stream");
    form.delete("partial_images");
  }
  return fetch(`${imageSettings.baseURL}/v1/images/edits`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: form,
  });
}
