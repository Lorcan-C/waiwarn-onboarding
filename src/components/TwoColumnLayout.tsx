import { HelpCircle, ChevronRight, ChevronLeft } from "lucide-react";
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
    toggleRightPanel, 
    setActiveView, 
    handleItemClick 
  } = useLayoutStore();

  const onLeftItemClick = (itemId: string, itemType: string, projectStage?: ProjectStage) => {
    handleItemClick("left", itemId, itemType, projectStage);
  };

  const onRightItemClick = (itemId: string, itemType: string, projectStage?: ProjectStage) => {
    handleItemClick("right", itemId, itemType, projectStage);
  };

  const renderLeftView = () => {
    switch (left.activeView) {
      case "calendar":
        return <CalendarView column="left" onItemClick={onLeftItemClick} />;
      case "tasks":
        return <TasksView column="left" onItemClick={onLeftItemClick} />;
      case "goals":
        return <GoalsView column="left" onItemClick={onLeftItemClick} />;
      case "povs":
        return (
          <POVsView 
            column="left" 
            onItemClick={onLeftItemClick}
            currentProjectStage={left.currentProjectStage}
          />
        );
      case "detail":
        return (
          <ProjectDetailView
            column="left"
            onItemClick={onLeftItemClick}
            selectedItemId={left.selectedItemId}
            selectedItemType={left.selectedItemType}
          />
        );
      default:
        return <p className="text-gray-500">View not found</p>;
    }
  };

  const renderRightView = () => {
    switch (right.activeView) {
      case "calendar":
        return <CalendarView column="right" onItemClick={onRightItemClick} />;
      case "tasks":
        return <TasksView column="right" onItemClick={onRightItemClick} />;
      case "goals":
        return <GoalsView column="right" onItemClick={onRightItemClick} />;
      case "povs":
        return (
          <POVsView 
            column="right" 
            onItemClick={onRightItemClick}
            currentProjectStage={right.currentProjectStage}
          />
        );
      case "detail":
        return (
          <ProjectDetailView
            column="right"
            onItemClick={onRightItemClick}
            selectedItemId={right.selectedItemId}
            selectedItemType={right.selectedItemType}
          />
        );
      default:
        return <p className="text-gray-500">View not found</p>;
    }
  };

  return (
    <div className="flex flex-1 min-h-0">
      {/* Left Panel */}
      <div 
        className={`flex flex-col transition-all duration-300 ease-in-out ${
          rightPanelOpen ? "w-1/2" : "w-full"
        }`}
      >
        {/* Left Header */}
        <div className="flex border-b border-gray-200 px-4 justify-between items-center">
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
          
          {/* Right side controls */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
              onClick={onStuckClick}
            >
              <HelpCircle className="w-4 h-4 mr-1" />
              I'm stuck
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:bg-gray-100"
              onClick={toggleRightPanel}
            >
              {rightPanelOpen ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Left Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {renderLeftView()}
        </div>
      </div>

      {/* Right Panel - Expandable */}
      <div 
        className={`flex flex-col border-l border-gray-200 transition-all duration-300 ease-in-out overflow-hidden ${
          rightPanelOpen ? "w-1/2" : "w-0"
        }`}
      >
        {/* Right Header */}
        <div className="flex border-b border-gray-200 px-4 min-w-max">
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

        {/* Right Content */}
        <div className="flex-1 overflow-y-auto p-6 min-w-max">
          {renderRightView()}
        </div>
      </div>
    </div>
  );
};

export default TwoColumnLayout;
