import CalendarView from "@/components/CalendarView";
import TasksView from "@/components/TasksView";
import ProjectDetailView from "@/components/ProjectDetailView";
import GoalsView from "@/components/GoalsView";
import POVsView from "@/components/POVsView";
import { useLayoutStore, ViewType } from "@/store/layoutStore";
import { ProjectStage } from "@/types/project";

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
}

const Column = ({ column, tabs }: ColumnProps) => {
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
      <div className="flex border-b border-gray-200 px-4">
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

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {renderView()}
      </div>
    </div>
  );
};

const leftTabs: { id: ViewType; label: string }[] = [
  { id: "calendar", label: "Calendar" },
  { id: "tasks", label: "Tasks" },
  { id: "goals", label: "Goals" },
];

const rightTabs: { id: ViewType; label: string }[] = [
  { id: "detail", label: "Detail" },
  { id: "povs", label: "Key Perspectives" },
];

const TwoColumnLayout = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-0">
      <Column column="left" tabs={leftTabs} />
      <Column column="right" tabs={rightTabs} />
    </div>
  );
};

export default TwoColumnLayout;
