import { describe, it, expect } from "vitest";
import { combineDateAndTime_ } from "./main";

describe("combineDateAndTime_", () => {
  it("should combine date and time correctly", () => {
    const datePart = new Date(2026, 1, 10); // Feb 10
    const timePart = new Date(1970, 0, 1, 15, 30, 45); // 15:30:45
    
    const result = combineDateAndTime_(datePart, timePart);
    
    expect(result?.getFullYear()).toBe(2026);
    expect(result?.getMonth()).toBe(1);
    expect(result?.getDate()).toBe(10);
    expect(result?.getHours()).toBe(15);
    expect(result?.getMinutes()).toBe(30);
    expect(result?.getSeconds()).toBe(45);
  });

  it("should return null for invalid inputs", () => {
    expect(combineDateAndTime_(null, new Date())).toBeNull();
    expect(combineDateAndTime_(new Date(), "invalid" as any)).toBeNull();
  });
});
