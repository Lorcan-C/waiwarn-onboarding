import { useState } from "react";
import CalendarView from "@/components/CalendarView";
import TasksView from "@/components/TasksView";
import ProjectDetailView from "@/components/ProjectDetailView";

// Task data for lookup
const taskData: Record<string, { title: string }> = {
  "1": { title: "Review Q2 proposal draft" },
  "2": { title: "Prepare meeting notes" },
  "3": { title: "Update stakeholder map" },
  "4": { title: "Read onboarding docs" },
  "5": { title: "Schedule 1:1 with mentor" },
};

const Index = () => {
  const [leftTab, setLeftTab] = useState<"calendar" | "tasks" | "goals">("calendar");
  const [rightTab, setRightTab] = useState<"tasks" | "povs" | "detail">("tasks");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setRightTab("detail");
  };

  const TabButton = ({
    active,
    onClick,
    children,
  }: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
  }) => (
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

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 overflow-auto relative">
      {/* Background Layer */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300"
        style={{ opacity: 0.5 }}
      />

      {/* Content Layer */}
      <div className="relative z-10 flex flex-col items-center min-h-screen py-8 px-6">
        {/* Logo Placeholder */}
        <div className="h-10 flex items-center justify-center mb-8">
          <div className="text-2xl font-bold tracking-tight text-slate-800">
            WAIWARN
          </div>
        </div>

        {/* Glass Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-2xl w-full max-w-[1120px] flex-1 overflow-hidden flex flex-col">
          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 flex-1 min-h-0">
            {/* Left Column */}
            <div className="flex flex-col border-r border-gray-200">
              {/* Left Tab Bar */}
              <div className="flex border-b border-gray-200 px-4">
                <TabButton
                  active={leftTab === "calendar"}
                  onClick={() => setLeftTab("calendar")}
                >
                  Calendar
                </TabButton>
                <TabButton
                  active={leftTab === "tasks"}
                  onClick={() => setLeftTab("tasks")}
                >
                  Tasks
                </TabButton>
                <TabButton
                  active={leftTab === "goals"}
                  onClick={() => setLeftTab("goals")}
                >
                  Goals
                </TabButton>
              </div>

              {/* Left Content Area */}
              <div className="flex-1 overflow-y-auto p-6">
                {leftTab === "calendar" && <CalendarView />}
                {leftTab === "tasks" && <TasksView onTaskClick={handleTaskClick} />}
                {leftTab === "goals" && (
                  <p className="text-gray-500">Goals View</p>
                )}
              </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col">
              {/* Right Tab Bar */}
              <div className="flex border-b border-gray-200 px-4">
                <TabButton
                  active={rightTab === "tasks"}
                  onClick={() => setRightTab("tasks")}
                >
                  Tasks
                </TabButton>
                <TabButton
                  active={rightTab === "povs"}
                  onClick={() => setRightTab("povs")}
                >
                  POVs
                </TabButton>
                <TabButton
                  active={rightTab === "detail"}
                  onClick={() => setRightTab("detail")}
                >
                  Detail
                </TabButton>
              </div>

              {/* Right Content Area */}
              <div className="flex-1 overflow-y-auto p-6">
                {rightTab === "tasks" && (
                  <p className="text-gray-500">Tasks View</p>
                )}
                {rightTab === "povs" && (
                  <p className="text-gray-500">POVs View</p>
                )}
                {rightTab === "detail" && (
                  selectedTaskId ? (
                    <ProjectDetailView
                      taskId={selectedTaskId}
                      taskTitle={taskData[selectedTaskId]?.title || "Unknown Task"}
                    />
                  ) : (
                    <p className="text-gray-500">Select a task to view details</p>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
