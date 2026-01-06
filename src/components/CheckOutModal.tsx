import { useState } from "react";
import { Moon, ArrowRight, ArrowLeft, CheckCircle2, Calendar, ListTodo, Target, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface CheckOutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Task {
  id: string;
  title: string;
  status: "done" | "moved" | "blocked" | "pending";
}

const todaysTasks: Task[] = [
  { id: "1", title: "Review Q2 proposal draft", status: "pending" },
  { id: "2", title: "Send stakeholder update", status: "pending" },
  { id: "3", title: "Prepare meeting notes", status: "pending" },
];

const tomorrowMeetings = [
  { id: "1", title: "Team standup", time: "9:00 AM", duration: "30m" },
  { id: "2", title: "Client check-in", time: "2:00 PM", duration: "1h" },
];

const CheckOutModal = ({ isOpen, onClose }: CheckOutModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [looseEnds, setLooseEnds] = useState("");
  const [tasks, setTasks] = useState<Task[]>(todaysTasks);
  const [tomorrowFocus, setTomorrowFocus] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const totalSteps = 4;

  const handleClose = () => {
    setCurrentStep(1);
    setLooseEnds("");
    setTasks(todaysTasks);
    setTomorrowFocus("");
    setIsComplete(false);
    onClose();
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updateTaskStatus = (taskId: string, status: Task["status"]) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status } : task
    ));
  };

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "done": return "bg-green-100 text-green-700 border-green-300";
      case "moved": return "bg-blue-100 text-blue-700 border-blue-300";
      case "blocked": return "bg-red-100 text-red-700 border-red-300";
      default: return "bg-gray-100 text-gray-600 border-gray-300";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        {!isComplete ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5 text-indigo-600" />
                Evening Check-Out
              </DialogTitle>
              <DialogDescription>
                Step {currentStep} of {totalSteps} — Close out your day with intention
              </DialogDescription>
            </DialogHeader>

            {/* Progress Bar */}
            <div className="flex gap-1 mb-4">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1 flex-1 rounded-full transition-colors ${
                    i < currentStep ? "bg-indigo-600" : "bg-gray-200"
                  }`}
                />
              ))}
            </div>

            {/* Step 1: Capture Loose Ends */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <ListTodo className="w-5 h-5" />
                  <h3 className="font-medium">Capture Loose Ends</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Anything from today that needs to go somewhere? Get it out of your head.
                </p>
                <Textarea
                  value={looseEnds}
                  onChange={(e) => setLooseEnds(e.target.value)}
                  placeholder="Notes, follow-ups, ideas to capture..."
                  className="resize-none"
                  rows={4}
                />
                <p className="text-xs text-gray-400">
                  These will be added to your inbox for processing tomorrow.
                </p>
              </div>
            )}

            {/* Step 2: Review Tomorrow */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-5 h-5" />
                  <h3 className="font-medium">Tomorrow's Calendar</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Here's what's scheduled for tomorrow. Any prep needed?
                </p>
                <div className="space-y-2">
                  {tomorrowMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="bg-gray-50 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{meeting.title}</p>
                        <p className="text-xs text-gray-500">{meeting.time} • {meeting.duration}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {tomorrowMeetings.length === 0 && (
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-green-700">No meetings tomorrow! 🎉</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Confirm Task Status */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="w-5 h-5" />
                  <h3 className="font-medium">Today's Tasks</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Quick update on what happened with today's tasks.
                </p>
                <div className="space-y-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white border border-gray-200 rounded-lg p-3"
                    >
                      <p className="font-medium text-gray-900 text-sm mb-2">{task.title}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateTaskStatus(task.id, "done")}
                          className={`text-xs px-2 py-1 rounded border transition-colors ${
                            task.status === "done" ? getStatusColor("done") : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          Done
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task.id, "moved")}
                          className={`text-xs px-2 py-1 rounded border transition-colors ${
                            task.status === "moved" ? getStatusColor("moved") : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          Moved
                        </button>
                        <button
                          onClick={() => updateTaskStatus(task.id, "blocked")}
                          className={`text-xs px-2 py-1 rounded border transition-colors ${
                            task.status === "blocked" ? getStatusColor("blocked") : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          Blocked
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Set Tomorrow's Focus */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <Target className="w-5 h-5" />
                  <h3 className="font-medium">Tomorrow's Focus</h3>
                </div>
                <p className="text-sm text-gray-500">
                  What's your #1 priority tomorrow? Just one thing.
                </p>
                <Input
                  value={tomorrowFocus}
                  onChange={(e) => setTomorrowFocus(e.target.value)}
                  placeholder="My main focus tomorrow is..."
                  className="text-base"
                />
                <p className="text-xs text-gray-400">
                  This will be front and center when you check in tomorrow.
                </p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-6">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button onClick={handleNext}>
                {currentStep === totalSteps ? "Complete" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </>
        ) : (
          /* Completion State */
          <div className="text-center py-8">
            <div className="relative mx-auto w-24 h-24 mb-6">
              {/* Animated moon */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full animate-pulse" />
              <div className="absolute inset-2 bg-gradient-to-br from-indigo-500 to-purple-700 rounded-full flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Shutdown Complete
            </h2>
            <p className="text-gray-600 mb-2">
              You've closed out your day with intention.
            </p>
            {tomorrowFocus && (
              <p className="text-sm text-indigo-600 font-medium mb-6">
                Tomorrow's focus: {tomorrowFocus}
              </p>
            )}
            <p className="text-sm text-gray-500 mb-6">
              Rest well. See you tomorrow.
            </p>
            
            <Button onClick={handleClose} variant="outline">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckOutModal;
