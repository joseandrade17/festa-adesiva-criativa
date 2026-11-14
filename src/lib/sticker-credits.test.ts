import { describe, expect, it } from "vitest";
import { findCreditPackage, nextStickerFunding } from "./sticker-credits";

describe("sticker credit rules", () => {
  it("offers 20 stickers for R$ 19,90", () => {
    expect(findCreditPackage("stickers-20")).toEqual({
      id: "stickers-20", credits: 20, amountCents: 1990, currency: "BRL",
    });
  });
  it("offers 40 stickers for R$ 29,90", () => {
    expect(findCreditPackage("stickers-40")).toEqual({
      id: "stickers-40", credits: 40, amountCents: 2990, currency: "BRL",
    });
  });
  it("allows the first sticker free without purchased credits", () => {
    expect(nextStickerFunding(0, 0)).toBe("free");
  });
  it("blocks further stickers without purchased credits", () => {
    expect(nextStickerFunding(1, 0)).toBe("blocked");
  });
  it("requires a purchased credit after the free sticker", () => {
    expect(nextStickerFunding(1, 20)).toBe("credit");
  });
  it("rejects unknown packages", () => {
    expect(findCreditPackage("stickers-100")).toBeUndefined();
  });
  it("rejects invalid account counters", () => {
    expect(nextStickerFunding(-1, 20)).toBe("blocked");
    expect(nextStickerFunding(1, -1)).toBe("blocked");
    expect(nextStickerFunding(0, Number.NaN)).toBe("blocked");
  });
});