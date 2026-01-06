import { useState } from "react";
import { HelpCircle, CheckCircle2, Sun } from "lucide-react";
import CalendarView from "@/components/CalendarView";
import TasksView from "@/components/TasksView";
import ProjectDetailView from "@/components/ProjectDetailView";
import CheckInModal from "@/components/CheckInModal";
import OnboardingSetupView from "@/components/OnboardingSetupView";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

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
  const [stuckModalOpen, setStuckModalOpen] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [checkInModalOpen, setCheckInModalOpen] = useState(false);

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
        {/* Header with Logo and Check-in Button */}
        <div className="h-10 flex items-center justify-between w-full max-w-[1120px] mb-8">
          <div className="text-2xl font-bold tracking-tight text-slate-800">
            What Am I Working on Right Now <span className="text-blue-600">(WAIWARN)</span>
          </div>
          <Button
            onClick={() => setCheckInModalOpen(true)}
            className="bg-amber-500 hover:bg-amber-600 text-white"
          >
            <Sun className="w-4 h-4 mr-2" />
            Check In
          </Button>
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
                {rightTab === "povs" && <OnboardingSetupView />}
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

          {/* Footer Bar */}
          <div className="border-t border-gray-200 p-4 flex justify-between">
            <Button
              variant="outline"
              className="text-gray-600 border-gray-300 hover:bg-gray-50"
              onClick={() => setStuckModalOpen(true)}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              I'm stuck
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => setCheckoutModalOpen(true)}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Check out for today
            </Button>
          </div>
        </div>
      </div>

      {/* Stuck Modal */}
      <Dialog open={stuckModalOpen} onOpenChange={setStuckModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Need help?</DialogTitle>
            <DialogDescription>
              Tell us what you're stuck on and we'll help you get back on track.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <textarea
              className="w-full rounded-lg border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Describe what you're having trouble with..."
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setStuckModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Get Help
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Checkout Modal */}
      <Dialog open={checkoutModalOpen} onOpenChange={setCheckoutModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Check out for today</DialogTitle>
            <DialogDescription>
              Ready to wrap up? Let's review what you accomplished today.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <div className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700">Today's Summary</p>
              <p className="text-sm text-gray-500 mt-1">3 tasks completed • 2 meetings attended</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Any notes for tomorrow?
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Optional notes..."
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setCheckoutModalOpen(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              Check Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Check-In Modal */}
      <CheckInModal
        isOpen={checkInModalOpen}
        onClose={() => setCheckInModalOpen(false)}
      />
    </div>
  );
};

export default Index;
