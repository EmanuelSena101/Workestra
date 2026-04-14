// ─── Workestra Workflow Schema ───
// BPMN-aligned workflow definitions for use with Camunda 8

export interface WorkflowDefinition {
  id: string;
  key: string;
  name: string;
  description?: string;
  version: number;
  category?: string;
  bpmnXml: string;
  formDefinitions: WorkflowFormBinding[];
  variables: WorkflowVariable[];
  slaConfig?: SlaConfig;
  notificationConfig?: NotificationConfig;
  deployed: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowFormBinding {
  taskDefinitionId: string;
  formDefinitionId: string;
  readOnlyFields?: string[];
}

export interface WorkflowVariable {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'json';
  label: string;
  required: boolean;
  defaultValue?: unknown;
  scope: 'process' | 'local';
}

export interface SlaConfig {
  defaultDuration: string; // ISO 8601 duration
  warningThreshold: number; // percentage (e.g., 80 = 80%)
  escalationRules: EscalationRule[];
}

export interface EscalationRule {
  id: string;
  name: string;
  triggerAt: number; // percentage of SLA consumed
  actions: EscalationAction[];
}

export type EscalationActionType = 'notify' | 'reassign' | 'escalate';

export interface EscalationAction {
  type: EscalationActionType;
  target: string; // userId, groupId, or email
  message?: string;
}

export interface NotificationConfig {
  onTaskAssigned: boolean;
  onTaskCompleted: boolean;
  onProcessCompleted: boolean;
  onSlaWarning: boolean;
  onSlaOverdue: boolean;
  channels: ('internal' | 'email')[];
}

// Timeline representation for the portal
export interface WorkflowTimeline {
  processInstanceId: string;
  processName: string;
  startedAt: string;
  completedAt?: string;
  status: 'active' | 'completed' | 'cancelled' | 'incident';
  steps: TimelineStep[];
}

export interface TimelineStep {
  id: string;
  name: string;
  type: 'start' | 'user_task' | 'service_task' | 'gateway' | 'end' | 'timer' | 'message';
  status: 'pending' | 'active' | 'completed' | 'skipped' | 'error';
  assignee?: string;
  assigneeName?: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number; // ms
  variables?: Record<string, unknown>;
}

// Deployment
export interface DeploymentRequest {
  name: string;
  bpmnXml: string;
  formBindings?: WorkflowFormBinding[];
  variables?: WorkflowVariable[];
}

export interface DeploymentResult {
  processDefinitionKey: string;
  version: number;
  deployedAt: string;
}
