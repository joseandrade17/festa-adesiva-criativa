import { describe, expect, it } from "vitest";
import { buildStickerPrompt, imageSizeFor } from "./sticker-prompt";

describe("sticker prompt", () => {
  it("includes name and age exactly", () => {
    const p = buildStickerPrompt({ theme: "Mulher Maravilha", shape: "redondo", name: "Ana", age: "5", extra: "" });
    expect(p).toContain('"Ana"');
    expect(p).toContain('"5"');
    expect(p).toContain("Mulher Maravilha");
  });
  it("uses the uploaded image as reference when given", () => {
    const p = buildStickerPrompt({ theme: "", shape: "redondo", name: "Bia", age: "", extra: "", fromImage: true });
    expect(p).toContain("attached image");
    expect(p).toContain('"Bia"');
  });
  it("uses wide image for wide rectangle", () => {
    expect(imageSizeFor("retangular", 9, 4)).toBe("1536x1024");
    expect(imageSizeFor("redondo", 9, 4)).toBe("1024x1024");
  });
});
