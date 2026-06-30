import { describe, it, expect } from "vitest";
import { cn } from "./utils";

describe("cn", () => {
  it("returns a single class unchanged", () => {
    expect(cn("text-red-500")).toBe("text-red-500");
  });

  it("merges multiple class strings", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("omits falsy values", () => {
    expect(cn("px-2", undefined, false, "py-4")).toBe("px-2 py-4");
  });

  it("resolves Tailwind conflicts — last value wins", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });

  it("includes only truthy keys from a conditional object", () => {
    const result = cn({ "text-red-500": true, "text-blue-500": false });
    expect(result).toContain("text-red-500");
    expect(result).not.toContain("text-blue-500");
  });
});
