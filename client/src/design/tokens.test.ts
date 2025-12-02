import { describe, expect, it } from "vitest";
import { brandPalette, typography } from "./tokens";

describe("design tokens", () => {
  it("exposes the expected brand palette", () => {
    expect(brandPalette).toMatchObject({
      deepBlue: "#0E1226",
      clinicalBlue: "#3EC6FF",
      techPurple: "#6B40FF",
      magenta: "#FF2CA6",
      dataYellow: "#FFB84D",
    });
  });

  it("keeps typography scale aligned with guidelines", () => {
    expect(typography.scale).toMatchObject({
      hero: "30px",
      title: "24px",
      body: "14px",
      label: "12px",
    });
    expect(typography.lineHeight).toBe(1.6);
  });
});
