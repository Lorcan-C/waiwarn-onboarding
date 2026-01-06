import { create } from "zustand";
import { ProjectStage } from "@/types/project";

export type ViewType = "calendar" | "tasks" | "goals" | "povs" | "detail";

interface ColumnState {
  activeView: ViewType;
  selectedItemId?: string;
  selectedItemType?: string;
  currentProjectStage?: ProjectStage;
}

interface LayoutState {
  left: ColumnState;
  right: ColumnState;
  setActiveView: (column: "left" | "right", view: ViewType) => void;
  handleItemClick: (
    fromColumn: "left" | "right",
    itemId: string,
    itemType: string,
    projectStage?: ProjectStage
  ) => void;
}

export const useLayoutStore = create<LayoutState>((set) => ({
  left: {
    activeView: "calendar",
  },
  right: {
    activeView: "tasks",
  },
  setActiveView: (column, view) =>
    set((state) => ({
      [column]: { ...state[column], activeView: view },
    })),
  handleItemClick: (fromColumn, itemId, itemType, projectStage) =>
    set((state) => {
      const targetColumn = fromColumn === "left" ? "right" : "left";
      
      // Determine which view to show based on item type
      let targetView: ViewType = "detail";
      if (itemType === "meeting") {
        targetView = "detail";
      } else if (itemType === "task") {
        targetView = "detail";
      } else if (itemType === "goal") {
        targetView = "detail";
      }

      return {
        [targetColumn]: {
          ...state[targetColumn],
          activeView: targetView,
          selectedItemId: itemId,
          selectedItemType: itemType,
          currentProjectStage: projectStage,
        },
      };
    }),
}));
