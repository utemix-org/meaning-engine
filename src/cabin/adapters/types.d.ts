/**
 * Model adapter types for cabin LLM boundary.
 *
 * Provider-agnostic — any LLM can implement ModelAdapter.
 * @experimental
 */

export interface CabinContext {
  mode: 'question_driven' | 'graph_relief_driven';
  world_summary: WorldSummary;
  question?: QuestionContext;
  probe?: ProbeContext;
  system_prompt: string;
  output_schema: Record<string, unknown>;
}

export interface WorldSummary {
  world_ref: string;
  node_count: number;
  edge_count: number;
  nodes: Array<{ id: string; type: string; title: string }>;
  edges: Array<{ source: string; target: string; type: string; layer?: string }>;
}

export interface QuestionContext {
  id: string;
  prompt: string;
  issue_type: string;
  severity: string;
  evidence_refs: {
    doc_refs: string[];
    code_refs: string[];
    graph_refs: string[];
  };
  structural_signal?: string;
}

export interface ProbeContext {
  signal_type: string;
  params: Record<string, string>;
}

export interface ModelRequest {
  context: CabinContext;
  model_config?: {
    temperature?: number;
    max_tokens?: number;
  };
}

export interface ModelResponse {
  raw: string;
  parsed?: DiagnosisEnvelope | null;
  error?: string;
  usage?: {
    prompt_tokens?: number;
    completion_tokens?: number;
  };
}

export interface DiagnosisEnvelope {
  diagnoses: Array<{
    issue_type: string;
    severity: string;
    claim: string;
    evidence_refs: {
      doc_refs?: string[];
      code_refs?: string[];
      graph_refs?: string[];
    };
    reasoning?: string;
  }>;
}

export interface ModelAdapter {
  name: string;
  invoke(request: ModelRequest): Promise<ModelResponse>;
}
