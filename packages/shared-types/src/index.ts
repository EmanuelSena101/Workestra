// ─── Workestra Shared Types ───

// ── Auth & Users ──
export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatar?: string;
  groups: string[];
  roles: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  members: string[];
  createdAt: string;
}

// ── Tasks ──
export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface Task {
  id: string;
  processInstanceId: string;
  processDefinitionKey: string;
  processName: string;
  taskDefinitionId: string;
  name: string;
  description?: string;
  assignee?: string;
  candidateGroups: string[];
  candidateUsers: string[];
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string;
  followUpDate?: string;
  createdAt: string;
  completedAt?: string;
  formKey?: string;
  variables: Record<string, unknown>;
}

export interface TaskFilter {
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assignee?: string;
  processDefinitionKey?: string;
  dueBefore?: string;
  dueAfter?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// ── Requests / Solicitações ──
export type RequestStatus = 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled';

export interface Request {
  id: string;
  processInstanceId: string;
  processDefinitionKey: string;
  processName: string;
  requestNumber: string;
  title: string;
  description?: string;
  requester: string;
  requesterName: string;
  status: RequestStatus;
  currentStep?: string;
  formData: Record<string, unknown>;
  attachments: Attachment[];
  comments: Comment[];
  history: HistoryEntry[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

// ── Documents ──
export interface Document {
  id: string;
  name: string;
  description?: string;
  folderId?: string;
  mimeType: string;
  size: number;
  version: number;
  versions: DocumentVersion[];
  metadata: Record<string, string>;
  tags: string[];
  permissions: Permission[];
  createdBy: string;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  storageKey: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  version: number;
  size: number;
  storageKey: string;
  comment?: string;
  createdBy: string;
  createdAt: string;
}

export interface Folder {
  id: string;
  name: string;
  parentId?: string;
  description?: string;
  permissions: Permission[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  storageKey: string;
  createdBy: string;
  createdAt: string;
}

// ── Forms ──
export type FieldType =
  | 'text'
  | 'number'
  | 'date'
  | 'datetime'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'textarea'
  | 'upload'
  | 'signature'
  | 'lookup'
  | 'group';

export interface FormField {
  id: string;
  type: FieldType;
  name: string;
  label: string;
  placeholder?: string;
  required: boolean;
  readOnly: boolean;
  defaultValue?: unknown;
  options?: SelectOption[];
  validation?: FieldValidation;
  conditionalRules?: ConditionalRule[];
  children?: FormField[]; // for group/pai-filho
  datasetId?: string; // for lookup
  lookupField?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FieldValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
}

export interface ConditionalRule {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'gt' | 'lt' | 'in';
  value: unknown;
  action: 'show' | 'hide' | 'require' | 'disable';
}

export interface FormDefinition {
  id: string;
  name: string;
  processDefinitionKey?: string;
  version: number;
  fields: FormField[];
  layout?: FormLayout;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormLayout {
  columns: number;
  sections: FormSection[];
}

export interface FormSection {
  id: string;
  title: string;
  collapsible: boolean;
  fields: string[]; // field IDs
}

// ── Workflows ──
export interface ProcessDefinition {
  id: string;
  key: string;
  name: string;
  description?: string;
  version: number;
  category?: string;
  formKey?: string;
  bpmnXml?: string;
  deployed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProcessInstance {
  id: string;
  processDefinitionKey: string;
  processName: string;
  businessKey?: string;
  status: 'active' | 'completed' | 'cancelled' | 'incident';
  startedBy: string;
  startedByName: string;
  variables: Record<string, unknown>;
  startedAt: string;
  completedAt?: string;
}

// ── Datasets ──
export type DatasetSourceType = 'internal' | 'rest' | 'soap' | 'sql' | 'erp';

export interface DatasetDefinition {
  id: string;
  name: string;
  description?: string;
  sourceType: DatasetSourceType;
  config: DatasetConfig;
  fields: DatasetField[];
  cacheTtl?: number; // seconds
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DatasetConfig {
  // REST
  url?: string;
  method?: string;
  headers?: Record<string, string>;
  // SQL
  connectionString?: string;
  query?: string;
  // Internal
  tableName?: string;
  // Mapping
  responseMapping?: string;
}

export interface DatasetField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'date' | 'object';
  label: string;
}

export interface DatasetQuery {
  datasetId: string;
  filters?: Record<string, unknown>;
  fields?: string[];
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DatasetResult {
  data: Record<string, unknown>[];
  total: number;
  page: number;
  pageSize: number;
}

// ── Notifications ──
export type NotificationType = 'task_assigned' | 'task_completed' | 'request_updated' | 'document_shared' | 'sla_warning' | 'sla_overdue' | 'system' | 'comment';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  userId: string;
  createdAt: string;
  readAt?: string;
}

// ── Search ──
export type SearchEntityType = 'document' | 'task' | 'request' | 'process' | 'user';

export interface SearchResult {
  id: string;
  entityType: SearchEntityType;
  title: string;
  description?: string;
  highlight?: string;
  metadata: Record<string, string>;
  score: number;
  createdAt: string;
}

export interface SearchQuery {
  query: string;
  entityTypes?: SearchEntityType[];
  page?: number;
  pageSize?: number;
  filters?: Record<string, unknown>;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  pageSize: number;
  took: number; // ms
}

// ── Permissions ──
export type PermissionAction = 'read' | 'write' | 'delete' | 'admin' | 'publish';

export interface Permission {
  id: string;
  entityType: string;
  entityId: string;
  subjectType: 'user' | 'group' | 'role';
  subjectId: string;
  actions: PermissionAction[];
}

// ── Audit ──
export interface AuditEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  userName: string;
  details: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
}

// ── Comments & History ──
export interface Comment {
  id: string;
  entityType: string;
  entityId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  updatedAt?: string;
}

export interface HistoryEntry {
  id: string;
  entityType: string;
  entityId: string;
  action: string;
  fromStatus?: string;
  toStatus?: string;
  userId: string;
  userName: string;
  details?: Record<string, unknown>;
  timestamp: string;
}

// ── API Responses ──
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  error?: string;
  details?: Record<string, unknown>;
}
