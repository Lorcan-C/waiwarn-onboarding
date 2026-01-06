export type ProjectStage = 'frame' | 'plan' | 'draft' | 'update' | 'deliver';

export type POVType = 'purpose' | 'process' | 'product' | 'iteration';

export type TaskSource = 'manual' | 'meeting';

export interface StageInfo {
  completed: boolean;
  completedAt?: string;
  aiAssisted?: boolean;
}

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export interface Project {
  id: string;
  title: string;
  currentStage: ProjectStage;
  stages: Record<ProjectStage, StageInfo>;
  description: string;
  stakeholders: Stakeholder[];
  notes: string;
}

export interface MeetingNotes {
  content: string;
  uploadedAt: string;
  fileName?: string;
}

export interface ExtractedTask {
  id: string;
  title: string;
  description?: string;
  suggestedAssignee?: string;
  suggestedDueDate?: string;
  confidence: number;
  selected: boolean;
}

export interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  source: TaskSource;
  meetingId?: string;
  meetingTitle?: string;
  assignee?: string;
}

export const STAGES: ProjectStage[] = ['frame', 'plan', 'draft', 'update', 'deliver'];

export const AI_ASSISTED_STAGES: ProjectStage[] = ['plan', 'draft'];

export const STAGE_LABELS: Record<ProjectStage, string> = {
  frame: 'Frame',
  plan: 'Plan',
  draft: 'Draft',
  update: 'Update',
  deliver: 'Deliver'
};

export const STAGE_DEFINITIONS: Record<ProjectStage, string> = {
  frame: 'Information gathering - map stakeholders, clarify outcomes, understand context',
  plan: 'Draft the one-pager/message map with AI feedback',
  draft: 'Write the actual document with AI review',
  update: 'Incorporate feedback and iterate',
  deliver: 'Finalize and send to stakeholders'
};

export const STAGE_TO_POV_TYPE: Record<ProjectStage, POVType | null> = {
  frame: 'purpose',
  plan: 'process',
  draft: 'product',
  update: 'iteration',
  deliver: null
};

export const POV_TYPE_STYLES: Record<POVType, { border: string; bg: string; text: string }> = {
  purpose: { border: 'border-l-purple-500', bg: 'bg-purple-50', text: 'text-purple-700' },
  process: { border: 'border-l-blue-500', bg: 'bg-blue-50', text: 'text-blue-700' },
  product: { border: 'border-l-green-500', bg: 'bg-green-50', text: 'text-green-700' },
  iteration: { border: 'border-l-orange-500', bg: 'bg-orange-50', text: 'text-orange-700' }
};
