import CalendarView from "@/components/CalendarView";
import TasksView from "@/components/TasksView";
import ProjectDetailView from "@/components/ProjectDetailView";
import GoalsView from "@/components/GoalsView";
import { useLayoutStore, ViewType } from "@/store/layoutStore";

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

  const onItemClick = (itemId: string, itemType: string) => {
    handleItemClick(column, itemId, itemType);
  };

  const renderView = () => {
    const props = {
      column,
      onItemClick,
      selectedItemId: columnState.selectedItemId,
      selectedItemType: columnState.selectedItemType,
    };

    switch (columnState.activeView) {
      case "calendar":
        return <CalendarView column={column} onItemClick={onItemClick} />;
      case "tasks":
        return <TasksView column={column} onItemClick={onItemClick} />;
      case "goals":
        return <GoalsView column={column} onItemClick={onItemClick} />;
      case "povs":
        return (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <p className="text-gray-500 text-sm">
              POV prompts will appear here based on your current project.
            </p>
          </div>
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
  { id: "tasks", label: "Tasks" },
  { id: "povs", label: "POVs" },
  { id: "detail", label: "Detail" },
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
