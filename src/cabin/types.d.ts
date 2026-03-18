/**
 * Cabin module types (v1).
 *
 * Cabin is an experimental/internal module — not part of the public
 * SemVer-covered API surface. See docs/API_SURFACE_POLICY.md.
 */

export type CabinMode = 'question_driven' | 'graph_relief_driven';

export interface EvidenceRef {
  doc_refs: string[];
  code_refs: string[];
  graph_refs: string[];
}

export interface GraphReliefProbe {
  signal_type: 'edge_present' | 'edge_absent' | 'node_isolated' | 'node_without_edge_type';
  params: Record<string, string>;
}

export interface CabinInput {
  world_ref: string;
  mode: CabinMode;
  question_id?: string;
  probe?: GraphReliefProbe;
}

export interface CabinDiagnosis {
  mode: CabinMode;
  issue_type: string;
  severity: string;
  claim: string;
  evidence_refs: EvidenceRef;
  source_question_id?: string;
  detected_artifacts?: string[];
}

export interface MatchField {
  field: string;
  expected: unknown;
  actual: unknown;
  pass: boolean;
}

export interface MatchResult {
  case_id: string;
  pass: boolean;
  fields: MatchField[];
}

export interface WorldSnapshot {
  nodes: Array<{ id: string; type: string; [k: string]: unknown }>;
  edges: Array<{ source: string; target: string; type: string; layer?: string; [k: string]: unknown }>;
}

export declare function cabinDiagnose(
  input: CabinInput,
  world: WorldSnapshot,
  questions: Array<Record<string, unknown>>,
): CabinDiagnosis[];

export declare function cabinDiagnoseModelBacked(
  input: CabinInput,
  world: WorldSnapshot,
  questions: Array<Record<string, unknown>>,
  adapter: import('./adapters/types').ModelAdapter,
  options?: { trace?: boolean; maxNodes?: number; maxEdges?: number },
): Promise<CabinDiagnosis[]>;

export declare function matchDiagnosis(
  diagnosis: CabinDiagnosis,
  expected: Record<string, unknown>,
): MatchResult;
