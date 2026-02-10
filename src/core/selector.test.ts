import { describe, it, expect } from "vitest";
import { Selector } from "./selector";

describe("Selector.buildSelector", () => {
  it("should build a simple selector with only metric name", () => {
    const result = Selector.buildSelector("up", {});
    expect(result).toBe('{"__name__"="up"}');
  });

  it("should include allowed labels", () => {
    const result = Selector.buildSelector("up", {
      container_name: "my-app",
      namespace_name: "prod",
    });
    expect(result).toContain('"__name__"="up"');
    expect(result).toContain('"container_name"="my-app"');
    expect(result).toContain('"namespace_name"="prod"');
  });

  it("should ignore disallowed labels", () => {
    const result = Selector.buildSelector("up", {
      unknown_label: "value",
    } as any);
    expect(result).not.toContain("unknown_label");
  });

  it("should handle null or undefined values", () => {
    const result = Selector.buildSelector("up", {
      container_name: null,
      namespace_name: undefined,
    } as any);
    expect(result).toBe('{"__name__"="up"}');
  });
});