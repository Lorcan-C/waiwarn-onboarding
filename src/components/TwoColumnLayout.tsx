import { HelpCircle } from "lucide-react";
import CalendarView from "@/components/CalendarView";
import TasksView from "@/components/TasksView";
import ProjectDetailView from "@/components/ProjectDetailView";
import GoalsView from "@/components/GoalsView";
import POVsView from "@/components/POVsView";
import { useLayoutStore, ViewType } from "@/store/layoutStore";
import { ProjectStage } from "@/types/project";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet";

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

const leftTabs: { id: ViewType; label: string }[] = [
  { id: "calendar", label: "Calendar" },
  { id: "tasks", label: "Tasks" },
  { id: "goals", label: "Goals" },
];

const rightTabs: { id: ViewType; label: string }[] = [
  { id: "detail", label: "Detail" },
  { id: "povs", label: "Key Perspectives" },
];

interface TwoColumnLayoutProps {
  onStuckClick: () => void;
}

const TwoColumnLayout = ({ onStuckClick }: TwoColumnLayoutProps) => {
  const { 
    left, 
    right, 
    rightPanelOpen, 
    setActiveView, 
    setRightPanelOpen, 
    handleItemClick 
  } = useLayoutStore();

  const onItemClick = (itemId: string, itemType: string, projectStage?: ProjectStage) => {
    handleItemClick("left", itemId, itemType, projectStage);
  };

  const renderLeftView = () => {
    switch (left.activeView) {
      case "calendar":
        return <CalendarView column="left" onItemClick={onItemClick} />;
      case "tasks":
        return <TasksView column="left" onItemClick={onItemClick} />;
      case "goals":
        return <GoalsView column="left" onItemClick={onItemClick} />;
      default:
        return <p className="text-gray-500">View not found</p>;
    }
  };

  const renderRightView = () => {
    switch (right.activeView) {
      case "povs":
        return (
          <POVsView 
            column="right" 
            onItemClick={onItemClick}
            currentProjectStage={right.currentProjectStage}
          />
        );
      case "detail":
      default:
        return (
          <ProjectDetailView
            column="right"
            onItemClick={onItemClick}
            selectedItemId={right.selectedItemId}
            selectedItemType={right.selectedItemType}
          />
        );
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-0">
      {/* Tab Bar - Full Width */}
      <div className="flex border-b border-gray-200 px-4 justify-between">
        <div className="flex">
          {leftTabs.map((tab) => (
            <TabButton
              key={tab.id}
              active={left.activeView === tab.id}
              onClick={() => setActiveView("left", tab.id)}
            >
              {tab.label}
            </TabButton>
          ))}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="my-auto text-gray-600 border-gray-300 hover:bg-gray-50"
          onClick={onStuckClick}
        >
          <HelpCircle className="w-4 h-4 mr-1" />
          I'm stuck
        </Button>
      </div>

      {/* Centered Main Content */}
      <div className="flex-1 overflow-y-auto p-6 flex justify-center">
        <div className="w-full max-w-3xl">
          {renderLeftView()}
        </div>
      </div>

      {/* Slide-out Right Panel */}
      <Sheet open={rightPanelOpen} onOpenChange={setRightPanelOpen}>
        <SheetContent side="right" className="w-[500px] sm:max-w-[500px] p-0">
          <SheetHeader className="p-0">
            <div className="flex border-b border-gray-200 px-4">
              {rightTabs.map((tab) => (
                <TabButton
                  key={tab.id}
                  active={right.activeView === tab.id}
                  onClick={() => setActiveView("right", tab.id)}
                >
                  {tab.label}
                </TabButton>
              ))}
            </div>
          </SheetHeader>
          <div className="flex-1 overflow-y-auto p-6">
            {renderRightView()}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default TwoColumnLayout;
