import { create } from "zustand";
import { ProjectStage, ExtractedTask, Task } from "@/types/project";

export type ViewType = "calendar" | "tasks" | "goals" | "povs" | "detail";

interface ColumnState {
  activeView: ViewType;
  selectedItemId?: string;
  selectedItemType?: string;
  currentProjectStage?: ProjectStage;
}

interface MeetingNotesState {
  notesByMeetingId: Record<string, string>;
  extractedTasksByMeetingId: Record<string, ExtractedTask[]>;
  isExtracting: boolean;
  error: string | null;
}

interface LayoutState {
  left: ColumnState;
  right: ColumnState;
  rightPanelOpen: boolean;
  meetingNotes: MeetingNotesState;
  meetingTasks: Task[];
  setActiveView: (column: "left" | "right", view: ViewType) => void;
  toggleRightPanel: () => void;
  setRightPanelOpen: (open: boolean) => void;
  handleItemClick: (
    fromColumn: "left" | "right",
    itemId: string,
    itemType: string,
    projectStage?: ProjectStage
  ) => void;
  setMeetingNotes: (meetingId: string, content: string) => void;
  setExtractedTasks: (meetingId: string, tasks: ExtractedTask[]) => void;
  setIsExtracting: (isExtracting: boolean) => void;
  setExtractionError: (error: string | null) => void;
  updateExtractedTaskSelection: (meetingId: string, taskId: string, selected: boolean) => void;
  addTasksFromMeeting: (meetingId: string, meetingTitle: string, tasks: ExtractedTask[]) => void;
  clearExtraction: (meetingId: string) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  left: {
    activeView: "calendar",
  },
  right: {
    activeView: "detail",
  },
  rightPanelOpen: false,
  meetingNotes: {
    notesByMeetingId: {},
    extractedTasksByMeetingId: {},
    isExtracting: false,
    error: null,
  },
  meetingTasks: [],
  setActiveView: (column, view) =>
    set((state) => ({
      [column]: { ...state[column], activeView: view },
    })),
  toggleRightPanel: () =>
    set((state) => ({ rightPanelOpen: !state.rightPanelOpen })),
  setRightPanelOpen: (open) =>
    set({ rightPanelOpen: open }),
  handleItemClick: (fromColumn, itemId, itemType, projectStage) =>
    set((state) => {
      const targetColumn = fromColumn === "left" ? "right" : "left";
      
      let targetView: ViewType = "detail";
      if (itemType === "meeting") {
        targetView = "detail";
      } else if (itemType === "task") {
        targetView = "detail";
      } else if (itemType === "goal") {
        targetView = "detail";
      }

      return {
        rightPanelOpen: true,
        [targetColumn]: {
          ...state[targetColumn],
          activeView: targetView,
          selectedItemId: itemId,
          selectedItemType: itemType,
          currentProjectStage: projectStage,
        },
      };
    }),
  setMeetingNotes: (meetingId, content) =>
    set((state) => ({
      meetingNotes: {
        ...state.meetingNotes,
        notesByMeetingId: {
          ...state.meetingNotes.notesByMeetingId,
          [meetingId]: content,
        },
      },
    })),
  setExtractedTasks: (meetingId, tasks) =>
    set((state) => ({
      meetingNotes: {
        ...state.meetingNotes,
        extractedTasksByMeetingId: {
          ...state.meetingNotes.extractedTasksByMeetingId,
          [meetingId]: tasks.map((t) => ({ ...t, selected: true })),
        },
      },
    })),
  setIsExtracting: (isExtracting) =>
    set((state) => ({
      meetingNotes: {
        ...state.meetingNotes,
        isExtracting,
      },
    })),
  setExtractionError: (error) =>
    set((state) => ({
      meetingNotes: {
        ...state.meetingNotes,
        error,
      },
    })),
  updateExtractedTaskSelection: (meetingId, taskId, selected) =>
    set((state) => ({
      meetingNotes: {
        ...state.meetingNotes,
        extractedTasksByMeetingId: {
          ...state.meetingNotes.extractedTasksByMeetingId,
          [meetingId]: (state.meetingNotes.extractedTasksByMeetingId[meetingId] || []).map((task) =>
            task.id === taskId ? { ...task, selected } : task
          ),
        },
      },
    })),
  addTasksFromMeeting: (meetingId, meetingTitle, tasks) =>
    set((state) => {
      const newTasks: Task[] = tasks.map((task) => ({
        id: task.id,
        title: task.title,
        dueDate: task.suggestedDueDate || "No due date",
        priority: task.confidence >= 0.85 ? "high" : task.confidence >= 0.7 ? "medium" : "low",
        completed: false,
        source: "meeting" as const,
        meetingId,
        meetingTitle,
        assignee: task.suggestedAssignee,
      }));

      // Clear extracted tasks for this meeting after adding
      const updatedExtracted = { ...state.meetingNotes.extractedTasksByMeetingId };
      delete updatedExtracted[meetingId];

      return {
        meetingTasks: [...state.meetingTasks, ...newTasks],
        meetingNotes: {
          ...state.meetingNotes,
          extractedTasksByMeetingId: updatedExtracted,
        },
      };
    }),
  clearExtraction: (meetingId) =>
    set((state) => {
      const updatedExtracted = { ...state.meetingNotes.extractedTasksByMeetingId };
      delete updatedExtracted[meetingId];
      return {
        meetingNotes: {
          ...state.meetingNotes,
          extractedTasksByMeetingId: updatedExtracted,
          error: null,
        },
      };
    }),
}));
