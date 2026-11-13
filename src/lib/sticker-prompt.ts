export type Shape = "redondo" | "quadrado" | "retangular" | "coracao" | "estrela" | "livre";

export const SHAPES: { id: Shape; label: string }[] = [
  { id: "redondo", label: "Redondo" },
  { id: "quadrado", label: "Quadrado" },
  { id: "retangular", label: "Retangular" },
  { id: "coracao", label: "Coração" },
  { id: "estrela", label: "Estrela" },
  { id: "livre", label: "Recorte livre" },
];

const SHAPE_TEXT: Record<Shape, string> = {
  redondo: "a perfectly circular round sticker badge",
  quadrado: "a square sticker with softly rounded corners",
  retangular: "a horizontal rectangular label sticker with rounded corners",
  coracao: "a heart-shaped sticker",
  estrela: "a five-pointed star-shaped sticker",
  livre: "a die-cut sticker that follows the outline of the illustration",
};

/** Image size sent to the model: matches the sticker's proportion. */
export function imageSizeFor(shape: Shape, widthCm: number, heightCm: number): string {
  if (shape === "redondo" || shape === "quadrado" || shape === "coracao" || shape === "estrela") return "1024x1024";
  const r = widthCm / heightCm;
  if (r > 1.2) return "1536x1024";
  if (r < 0.83) return "1024x1536";
  return "1024x1024";
}

export function buildStickerPrompt(o: {
  theme: string;
  shape: Shape;
  name: string;
  age: string;
  extra: string;
}): string {
  const texts: string[] = [];
  if (o.name.trim()) texts.push(`the child's name "${o.name.trim()}" in big, bold, playful, perfectly spelled letters`);
  if (o.age.trim()) texts.push(`the age "${o.age.trim()}" shown as a large decorative number`);
  return [
    `Design ${SHAPE_TEXT[o.shape]} for a children's birthday party.`,
    `Theme: ${o.theme.trim()}. Create original characters and decorations inspired by this theme (no copyrighted logos), vibrant colors, cute cartoon style, high detail, print quality.`,
    texts.length ? `Include ${texts.join(" and ")}. Spell every word exactly as written.` : "No text.",
    o.extra.trim() ? `Extra details: ${o.extra.trim()}.` : "",
    "Thick white border around the sticker edge, centered, fully visible, transparent background outside the sticker.",
  ].filter(Boolean).join(" ");
}
