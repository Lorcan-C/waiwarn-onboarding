import { HelpCircle } from "lucide-react";
import CalendarView from "@/components/CalendarView";
import TasksView from "@/components/TasksView";
import ProjectDetailView from "@/components/ProjectDetailView";
import GoalsView from "@/components/GoalsView";
import POVsView from "@/components/POVsView";
import { useLayoutStore, ViewType } from "@/store/layoutStore";
import { ProjectStage } from "@/types/project";
import { Button } from "@/components/ui/button";

interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const TabButton = ({ active, onClick, children }: TabButtonProps) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 font-medium text-sm border-b-2 -mb-px transition-colors ${
      active
        ? "text-blue-600 border-blue-600"
        : "text-gray-500 border-transparent hover:text-gray-700"
    }`}
  >
    {children}
  </button>
);

interface ColumnProps {
  column: "left" | "right";
  tabs: { id: ViewType; label: string }[];
  onStuckClick?: () => void;
}

const Column = ({ column, tabs, onStuckClick }: ColumnProps) => {
  const { left, right, setActiveView, handleItemClick } = useLayoutStore();
  const columnState = column === "left" ? left : right;

  const onItemClick = (itemId: string, itemType: string, projectStage?: ProjectStage) => {
    handleItemClick(column, itemId, itemType, projectStage);
  };

  const renderView = () => {
    switch (columnState.activeView) {
      case "calendar":
        return <CalendarView column={column} onItemClick={onItemClick} />;
      case "tasks":
        return <TasksView column={column} onItemClick={onItemClick} />;
      case "goals":
        return <GoalsView column={column} onItemClick={onItemClick} />;
      case "povs":
        return (
          <POVsView 
            column={column} 
            onItemClick={onItemClick}
            currentProjectStage={columnState.currentProjectStage}
          />
        );
      case "detail":
        return (
          <ProjectDetailView
            column={column}
            onItemClick={onItemClick}
            selectedItemId={columnState.selectedItemId}
            selectedItemType={columnState.selectedItemType}
          />
        );
      default:
        return <p className="text-gray-500">View not found</p>;
    }
  };

  return (
    <div className={`flex flex-col ${column === "left" ? "border-r border-gray-200" : ""}`}>
      {/* Tab Bar */}
      <div className="flex border-b border-gray-200 px-4 justify-between">
        <div className="flex">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={columnState.activeView === tab.id}
              onClick={() => setActiveView(column, tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </div>
        {column === "right" && onStuckClick && (
          <Button
            variant="outline"
            size="sm"
            className="my-auto text-gray-600 border-gray-300 hover:bg-gray-50"
            onClick={onStuckClick}
          >
            <HelpCircle className="w-4 h-4 mr-1" />
            I'm stuck
          </Button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderView()}
      </div>
    </div>
  );
};

const leftTabs: { id: ViewType; label: string }[] = [
  { id: "tasks", label: "Onboarding tasks" },
  { id: "calendar", label: "Onboarding calendar" },
  { id: "goals", label: "Onboarding goals" },
];

const rightTabs: { id: ViewType; label: string }[] = [
  { id: "detail", label: "Task details" },
  { id: "povs", label: "Key perspectives" },
];

interface TwoColumnLayoutProps {
  onStuckClick: () => void;
}

const TwoColumnLayout = ({ onStuckClick }: TwoColumnLayoutProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-0">
      <Column column="left" tabs={leftTabs} />
      <Column column="right" tabs={rightTabs} onStuckClick={onStuckClick} />
    </div>
  );
};

export default TwoColumnLayout;
