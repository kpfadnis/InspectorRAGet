/**
 *
 * Copyright 2023-2025 InspectorRAGet Team
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 **/

export interface Notification {
  title: string;
  subtitle: string;
  kind:
    | 'error'
    | 'info'
    | 'info-square'
    | 'success'
    | 'warning'
    | 'warning-alt';
  caption?: string;
}

export interface StringMatchObject {
  readonly start: number;
  readonly end: number;
  readonly text: string;
  readonly matchesInTarget: { start: number; end: number }[];
  readonly count: number;
}

export interface ComponentCommonLink {
  content: string;
  href: string;
  openInNewTab: boolean;
}

export interface ComponentHomeCard {
  title: string;
  text: string | null;
  href: string | null;
  actionText: string | null;
  tag: string | null;
  icon: 'CHART_MULTITYPE' | 'MICROSCOPE' | 'NOODLE_BOWL' | 'BOOK';
  openInNewTab: boolean;
  disabled?: boolean;
}

export interface HomePageAttributes {
  title: string;
  subtitle: string;
  greeting: string;
  subtitleLink: ComponentCommonLink | null;
  cards: ComponentHomeCard[];
}

// ===================================================================================
//                                  MODEL
// ===================================================================================
export interface Model {
  modelId: string;
  name: string;
  owner: string;
  description?: string;
  baseModel?: string;
  baseModelId?: string;
  releaseDate?: string;
  trainingDetails?: any;
}

// ===================================================================================
//                                  METRIC
// ===================================================================================
export interface MetricValue {
  value: string | number;
  numericValue?: number;
  displayValue?: string;
}

export function isMetricValue(
  val: string | number | MetricValue | undefined,
): boolean {
  return (
    typeof val !== 'undefined' &&
    typeof val !== 'string' &&
    typeof val !== 'number' &&
    val.value !== undefined
  );
}

export interface Metric {
  readonly name: string;
  readonly displayName?: string;
  readonly description?: string;
  readonly author: 'human' | 'algorithm';
  readonly type: 'numerical' | 'categorical' | 'text';
  readonly aggregator?: string;
  values?: MetricValue[];
  range?: number[];
  order?: 'ascending' | 'descending';
  minValue?: number | MetricValue;
  maxValue?: number | MetricValue;
}

export enum AggregationConfidenceLevels {
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
}
export interface AggregationStatistics {
  value: string | number;
  readonly std: number;
  readonly confidence:
    | AggregationConfidenceLevels.HIGH
    | AggregationConfidenceLevels.MEDIUM
    | AggregationConfidenceLevels.LOW;
  readonly variance?: number;
}
export interface Aggregator {
  readonly name: string;
  readonly displayName?: string;
  readonly description?: string;
  readonly apply: Function;
}

// ===================================================================================
//                                RAG TASK REQUIREMENTS
// ===================================================================================
export interface RetrievedDocumentAnnotation {
  text: string;
  authors: string[];
  color?: string;
}

export interface RetrievedDocument {
  documentId: string;
  text: string;
  formattedText?: string;
  url?: string;
  title?: string;
  score?: number;
  query?: {};
  annotations?: RetrievedDocumentAnnotation[];
}

// ===================================================================================
//                                CHAT TASK REQUIREMENTS
// ===================================================================================
interface FunctionTool {
  name: string;
  arguments: object | any[];
}

export interface ToolCall {
  id: string;
  type: 'function';
  function: FunctionTool;
  parents?: string[];
  children?: string[];
}

export interface MessageStep {
  id: string;
  input: any;
  output: any;
  parents?: string[];
  children?: string[];
}

export interface Message {
  role: 'system' | 'developer' | 'user' | 'tool' | 'assistant';
  utterance_id?: string;
  content?: any;
  name?: string;
  timestamp?: number;
}

interface SystemMessage extends Message {
  role: 'system';
}

interface DeveloperMessage extends Message {
  role: 'developer';
}

interface UserMessage extends Message {
  role: 'user';
}

export interface ToolMessageDocument {
  text: string;
  url?: string;
  title?: string;
  score?: number;
}
export interface ToolMessage extends Message {
  role: 'tool';
  tool_call_id: string;
  type?: 'text' | 'documents' | 'json';
  content: string | object | ToolMessageDocument[];
}

export interface AssistantMessage extends Message {
  role: 'assistant';
  refusal?: string;
  tool_calls?: ToolCall[];
  steps?: MessageStep[];
}

// ===================================================================================
//                                        TASK
// ===================================================================================
export interface TaskCommentProvenance {
  component: string;
  text?: string;
  offsets?: number[];
}
export interface TaskComment {
  comment: string;
  author: string;
  created: number;
  updated: number;
  provenance?: TaskCommentProvenance;
}

export interface Task {
  readonly taskId: string;
  readonly taskType: 'rag' | 'text_generation' | 'json_generation' | 'chat';
  readonly contexts?: { readonly documentId: string }[];
  readonly input:
    | { text: string; speaker: string }[]
    | string
    | (
        | SystemMessage
        | DeveloperMessage
        | UserMessage
        | ToolMessage
        | AssistantMessage
      )[];
  readonly targets?: {
    readonly text?: string;
  }[];
  flagged?: boolean;
  comments?: TaskComment[];
  readonly annotations?: {
    [key: string]: { [key: string]: any };
  };
  [key: string]: any;
}

// ===================================================================================
//                                  TASK EVALUATIONS
// ===================================================================================
export interface Annotation {
  readonly value: string | number;
  readonly timestamp?: number;
  readonly duration?: number;
}

export interface TaskEvaluation {
  readonly taskId: string;
  readonly modelId: string;
  readonly modelResponse: string;
  readonly annotations: {
    [key: string]: { [key: string]: Annotation };
  };
  readonly contexts?: RetrievedDocument[];
  readonly steps?: MessageStep[];
  [key: string]: any;
}

// ===================================================================================
//                                  INPUT FILE
// ===================================================================================
export interface RawData {
  readonly name?: string;
  readonly models: Model[];
  readonly metrics: Metric[];
  readonly filters?: string[];
  readonly documents?: RetrievedDocument[];
  readonly tasks: Task[];
  readonly evaluations: TaskEvaluation[];
}

export interface DisqualificationReason {
  kind: string;
  data: any;
}

export interface DisqualifiedTasks {
  [Key: string]: {
    reasons: DisqualificationReason[];
    evaluations: TaskEvaluation[];
  };
}

// ===================================================================================
//                                  DATA TILE
// ===================================================================================
export interface TileData {
  readonly name: string;
  readonly exampleId: string;
  readonly models: Model[];
  readonly metrics: Metric[];
  readonly annotators: string[];
  readonly numTasks: number;
  readonly startTimestamp?: number;
  readonly endTimestamp?: number;
}

// ===================================================================================
//                                  PROCESSED DATA
// ===================================================================================
export interface Data extends TileData {
  readonly documents?: RetrievedDocument[];
  readonly filters?: string[];
  tasks: Task[];
  readonly evaluations: TaskEvaluation[];
}

// ===================================================================================
//                          FILTERATION WORKER
// ===================================================================================
export interface FilterationRequest {
  evaluationsPerMetric: { [key: string]: TaskEvaluation[] };
  filters: { [key: string]: string[] };
  models: Model[];
  expression?: object;
  agreementLevels?: { [key: string]: number | string }[];
  metric?: Metric;
  allowedValues?: string[];
  annotator?: string;
}

export interface FilterationResponse {
  records: {
    taskId: string;
    modelName: string;
    [key: string]: string | number;
  }[];
  evaluations: TaskEvaluation[];
}
