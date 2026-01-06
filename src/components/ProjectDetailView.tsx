import { useState } from "react";
import { FileText, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

// Task data for lookup
const taskData: Record<string, { title: string }> = {
  "1": { title: "Review Q2 proposal draft" },
  "2": { title: "Prepare meeting notes" },
  "3": { title: "Update stakeholder map" },
  "4": { title: "Read onboarding docs" },
  "5": { title: "Schedule 1:1 with mentor" },
};

// Meeting data for lookup
const meetingData: Record<string, { title: string }> = {
  "1": { title: "Team Standup" },
  "2": { title: "Client Call" },
  "3": { title: "1:1 with Manager" },
};

interface ProjectDetailViewProps {
  column: "left" | "right";
  onItemClick: (itemId: string, itemType: string) => void;
  selectedItemId?: string;
  selectedItemType?: string;
}

const stages = ["Ready", "Frame", "Draft", "Review", "Deliver"];

const sampleStakeholders = [
  { id: "1", name: "Sarah Chen", role: "Product Manager", initials: "SC" },
  { id: "2", name: "Mike Johnson", role: "Engineering Lead", initials: "MJ" },
  { id: "3", name: "Lisa Park", role: "Design Lead", initials: "LP" },
];

const ProjectDetailView = ({ column, onItemClick, selectedItemId, selectedItemType }: ProjectDetailViewProps) => {
  const [reviewDocOpen, setReviewDocOpen] = useState(false);
  const [brainstormOpen, setBrainstormOpen] = useState(false);
  const currentStageIndex = 1; // Frame stage for demo

  // Get title based on item type
  const getTitle = () => {
    if (!selectedItemId) return "Select an item";
    if (selectedItemType === "task") {
      return taskData[selectedItemId]?.title || "Unknown Task";
    }
    if (selectedItemType === "meeting") {
      return meetingData[selectedItemId]?.title || "Unknown Meeting";
    }
    return "Unknown Item";
  };

  if (!selectedItemId) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select an item to view details</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Title and Action Buttons */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
          <p className="text-sm text-gray-500 mt-1">
            {selectedItemType === "task" ? "Task" : "Meeting"} ID: {selectedItemId}
          </p>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setReviewDocOpen(true)}
            className="text-xs"
          >
            <FileText className="w-3 h-3 mr-1" />
            Review Doc
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBrainstormOpen(true)}
            className="text-xs"
          >
            <MessageSquare className="w-3 h-3 mr-1" />
            Start Brainstorm
          </Button>
        </div>
      </div>

      {/* Stage Indicator */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Progress Stage</p>
        <div className="flex items-center gap-1">
          {stages.map((stage, index) => (
            <div key={stage} className="flex items-center">
              <div
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  index === currentStageIndex
                    ? "bg-blue-600 text-white"
                    : index < currentStageIndex
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {stage}
              </div>
              {index < stages.length - 1 && (
                <div
                  className={`w-4 h-0.5 ${
                    index < currentStageIndex ? "bg-blue-300" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Description
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Add project description..."
          defaultValue="This task involves reviewing and finalizing the Q2 proposal draft. Key deliverables include executive summary, budget breakdown, and timeline."
        />
      </div>

      {/* Stakeholders */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Stakeholders</p>
        <div className="space-y-2">
          {sampleStakeholders.map((stakeholder) => (
            <div
              key={stakeholder.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                {stakeholder.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {stakeholder.name}
                </p>
                <p className="text-xs text-gray-500">{stakeholder.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Notes
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Add notes..."
          defaultValue="Awaiting feedback from finance team on budget section."
        />
      </div>

      {/* Review Doc Modal */}
      <Dialog open={reviewDocOpen} onOpenChange={setReviewDocOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Review Doc
            </DialogTitle>
            <DialogDescription>
              Get multiple views on your work via in-document comment threads.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              This feature allows stakeholders to provide feedback directly within your document, 
              creating threaded conversations around specific sections for clearer, more contextual reviews.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setReviewDocOpen(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Brainstorm Modal */}
      <Dialog open={brainstormOpen} onOpenChange={setBrainstormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-600" />
              Start Brainstorm
            </DialogTitle>
            <DialogDescription>
              Speaking with multiple perspectives on a brainstorming call.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              This feature simulates a brainstorming session where you can hear different 
              stakeholder perspectives, helping you explore ideas from multiple angles before committing to a direction.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setBrainstormOpen(false)}>
              Got it
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetailView;
