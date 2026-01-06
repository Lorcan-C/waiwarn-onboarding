import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const yesterdaysMeetings = [
  { id: "1", title: "Team Standup", time: "9:00 AM", checked: false },
  { id: "2", title: "Product Review", time: "11:00 AM", checked: false },
  { id: "3", title: "1:1 with Manager", time: "2:00 PM", checked: false },
];

const tasksToUpdate = [
  { id: "1", title: "Review Q2 proposal draft", status: "In Progress" },
  { id: "2", title: "Prepare meeting notes", status: "Not Started" },
  { id: "3", title: "Update stakeholder map", status: "In Progress" },
];

const todaysMeetings = [
  { id: "1", title: "Team Standup", time: "9:00 AM" },
  { id: "2", title: "Client Call", time: "11:00 AM" },
  { id: "3", title: "1:1 with Manager", time: "2:00 PM" },
];

const CheckInModal = ({ isOpen, onClose }: CheckInModalProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [meetingChecks, setMeetingChecks] = useState<Record<string, boolean>>({});
  const [actionItems, setActionItems] = useState("");
  const [todaysPriority, setTodaysPriority] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const totalSteps = 4;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
    if (currentStep === totalSteps - 1) {
      setIsComplete(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleClose = () => {
    setCurrentStep(1);
    setIsComplete(false);
    setMeetingChecks({});
    setActionItems("");
    setTodaysPriority("");
    onClose();
  };

  const toggleMeetingCheck = (id: string) => {
    setMeetingChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-8 mx-4 animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Daily Check-In</h2>
            <p className="text-sm text-gray-500 mt-1">Step {currentStep} of {totalSteps}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`flex-1 h-1.5 rounded-full transition-colors ${
                index < currentStep ? "bg-blue-600" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[280px]">
          {/* Step 1: Review Yesterday's Meetings */}
          {currentStep === 1 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-medium text-gray-900">Review Yesterday's Meetings</h3>
              <div className="space-y-2">
                {yesterdaysMeetings.map((meeting) => (
                  <label
                    key={meeting.id}
                    className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <div
                      onClick={() => toggleMeetingCheck(meeting.id)}
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                        meetingChecks[meeting.id]
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300"
                      }`}
                    >
                      {meetingChecks[meeting.id] && (
                        <Check className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{meeting.title}</p>
                      <p className="text-xs text-gray-500">{meeting.time}</p>
                    </div>
                  </label>
                ))}
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  Any action items to capture?
                </label>
                <textarea
                  value={actionItems}
                  onChange={(e) => setActionItems(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter any follow-ups or action items..."
                />
              </div>
            </div>
          )}

          {/* Step 2: Update Tasks */}
          {currentStep === 2 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-medium text-gray-900">Update Tasks</h3>
              <p className="text-sm text-gray-500">These tasks might need updating:</p>
              <div className="space-y-2">
                {tasksToUpdate.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <p className="text-xs text-gray-500">{task.status}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        Done
                      </button>
                      <button className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        Update
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Today's Focus */}
          {currentStep === 3 && (
            <div className="space-y-4 animate-fade-in">
              <h3 className="font-medium text-gray-900">Today's Focus</h3>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-2">
                  What's your #1 priority today?
                </label>
                <input
                  type="text"
                  value={todaysPriority}
                  onChange={(e) => setTodaysPriority(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your main focus for today..."
                />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Today's Calendar</p>
                <div className="space-y-2">
                  {todaysMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                    >
                      <div className="w-1 h-8 bg-blue-500 rounded-full" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{meeting.title}</p>
                        <p className="text-xs text-gray-500">{meeting.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Complete */}
          {currentStep === 4 && (
            <div className="flex flex-col items-center justify-center h-full py-8 animate-fade-in">
              <div
                className={`w-20 h-20 rounded-2xl bg-blue-600 flex items-center justify-center mb-6 transition-all duration-500 ${
                  isComplete ? "animate-[flip_0.6s_ease-in-out]" : ""
                }`}
                style={{
                  animation: isComplete ? "flip 0.6s ease-in-out" : undefined,
                }}
              >
                <Check className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Check-in complete!</h3>
              <p className="text-gray-500 text-center">Let's go. You've got this.</p>
              {todaysPriority && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg w-full">
                  <p className="text-xs text-blue-600 font-medium uppercase tracking-wide">Today's Focus</p>
                  <p className="text-sm font-medium text-gray-900 mt-1">{todaysPriority}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
          {currentStep > 1 && currentStep < 4 ? (
            <Button
              variant="outline"
              onClick={handleBack}
              className="text-gray-600"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          ) : (
            <div />
          )}
          
          {currentStep < 4 ? (
            <Button
              onClick={handleNext}
              className="bg-blue-600 hover:bg-blue-700 text-white ml-auto"
            >
              {currentStep === 3 ? "Complete" : "Next"}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={handleClose}
              className="bg-blue-600 hover:bg-blue-700 text-white ml-auto"
            >
              Let's Go
            </Button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes flip {
          0% {
            transform: perspective(400px) rotateY(0);
          }
          50% {
            transform: perspective(400px) rotateY(180deg) scale(1.1);
          }
          100% {
            transform: perspective(400px) rotateY(360deg) scale(1);
          }
        }
      `}</style>
    </div>
  );
};

export default CheckInModal;
