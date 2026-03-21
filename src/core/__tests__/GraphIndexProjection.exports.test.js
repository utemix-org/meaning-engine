/**
 * Export surface for GraphIndexProjection + deprecated GraphRAGProjection alias.
 */
import { describe, it, expect } from "vitest";
import {
  GraphIndexProjection,
  GraphRAGProjection,
} from "../../index.js";
import {
  GraphIndexProjection as GraphIndexFromCore,
  GraphRAGProjection as GraphRAGFromCore,
} from "../index.js";

describe("GraphIndexProjection exports", () => {
  it("exports the canonical class from package and core entrypoints", () => {
    expect(GraphIndexProjection).toBe(GraphIndexFromCore);
    expect(typeof GraphIndexProjection).toBe("function");
  });

  it("keeps deprecated GraphRAGProjection as the same class identity", () => {
    expect(GraphRAGProjection).toBe(GraphIndexProjection);
    expect(GraphRAGProjection).toBe(GraphRAGFromCore);
  });
});
