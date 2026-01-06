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
import StageIndicator from "@/components/StageIndicator";
import AIAssistanceCard from "@/components/AIAssistanceCard";
import MeetingNotesDropzone from "@/components/MeetingNotesDropzone";
import ExtractedTasksReview from "@/components/ExtractedTasksReview";
import { ProjectStage, StageInfo, Stakeholder, ExtractedTask } from "@/types/project";
import { useLayoutStore } from "@/store/layoutStore";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ItemDetail {
  title: string;
  currentStage: ProjectStage;
  stages: Record<ProjectStage, StageInfo>;
  description: string;
  stakeholders: Stakeholder[];
  notes: string;
  attendees?: string[];
  dateTime?: string;
}

// Task data for lookup with full details
const taskData: Record<string, ItemDetail> = {
  "1": {
    title: "Review Q2 proposal draft",
    currentStage: 'draft',
    stages: {
      frame: { completed: true, completedAt: '2024-01-10' },
      plan: { completed: true, completedAt: '2024-01-12', aiAssisted: true },
      draft: { completed: false, aiAssisted: true },
      update: { completed: false },
      deliver: { completed: false }
    },
    description: "Review and finalize the Q2 proposal draft. Key deliverables include executive summary, budget breakdown, and timeline.",
    stakeholders: [
      { id: "1", name: "Sarah Chen", role: "Product Manager", initials: "SC" },
      { id: "2", name: "Mike Johnson", role: "Engineering Lead", initials: "MJ" },
    ],
    notes: "Awaiting feedback from finance team on budget section.",
  },
  "2": {
    title: "Prepare meeting notes",
    currentStage: 'update',
    stages: {
      frame: { completed: true, completedAt: '2024-01-08' },
      plan: { completed: true, completedAt: '2024-01-09', aiAssisted: true },
      draft: { completed: true, completedAt: '2024-01-11', aiAssisted: true },
      update: { completed: false },
      deliver: { completed: false }
    },
    description: "Compile and format notes from last week's strategy meetings. Include action items and deadlines.",
    stakeholders: [
      { id: "3", name: "Lisa Park", role: "Design Lead", initials: "LP" },
    ],
    notes: "Check recording for exact quotes from stakeholders.",
  },
  "3": {
    title: "Update stakeholder map",
    currentStage: 'frame',
    stages: {
      frame: { completed: false },
      plan: { completed: false, aiAssisted: true },
      draft: { completed: false, aiAssisted: true },
      update: { completed: false },
      deliver: { completed: false }
    },
    description: "Map out key stakeholders for the new product initiative. Identify decision-makers and influencers.",
    stakeholders: [
      { id: "1", name: "Sarah Chen", role: "Product Manager", initials: "SC" },
      { id: "4", name: "Tom Wilson", role: "VP of Sales", initials: "TW" },
      { id: "5", name: "Amy Roberts", role: "Customer Success", initials: "AR" },
    ],
    notes: "",
  },
  "4": {
    title: "Read onboarding docs",
    currentStage: 'plan',
    stages: {
      frame: { completed: true, completedAt: '2024-01-05' },
      plan: { completed: false, aiAssisted: true },
      draft: { completed: false, aiAssisted: true },
      update: { completed: false },
      deliver: { completed: false }
    },
    description: "Go through company onboarding documentation including policies, tools setup, and team introductions.",
    stakeholders: [
      { id: "6", name: "HR Team", role: "Human Resources", initials: "HR" },
    ],
    notes: "Complete by end of first week. Reach out to IT if any access issues.",
  },
  "5": {
    title: "Schedule 1:1 with mentor",
    currentStage: 'deliver',
    stages: {
      frame: { completed: true, completedAt: '2024-01-02' },
      plan: { completed: true, completedAt: '2024-01-03', aiAssisted: true },
      draft: { completed: true, completedAt: '2024-01-04', aiAssisted: true },
      update: { completed: true, completedAt: '2024-01-05' },
      deliver: { completed: false }
    },
    description: "Set up recurring 1:1 meeting with assigned mentor. Discuss goals and expectations for mentorship.",
    stakeholders: [
      { id: "7", name: "David Lee", role: "Senior Engineer", initials: "DL" },
    ],
    notes: "Check mentor's calendar availability for weekly slots.",
  },
};

// Meeting data for lookup with full details
const meetingData: Record<string, ItemDetail> = {
  "1": {
    title: "Team Standup",
    currentStage: 'deliver',
    stages: {
      frame: { completed: true, completedAt: '2024-01-01' },
      plan: { completed: true, completedAt: '2024-01-01', aiAssisted: true },
      draft: { completed: true, completedAt: '2024-01-01', aiAssisted: true },
      update: { completed: true, completedAt: '2024-01-01' },
      deliver: { completed: false }
    },
    description: "Daily team sync to share progress, blockers, and plans for the day. Keep updates brief and focused.",
    stakeholders: [
      { id: "8", name: "Engineering Team", role: "Development", initials: "ET" },
    ],
    notes: "Prepare yesterday's accomplishments and today's focus areas.",
    attendees: ["Alice", "Bob", "Charlie", "David"],
    dateTime: "2024-01-15T09:00:00Z",
  },
  "2": {
    title: "Client Call",
    currentStage: 'draft',
    stages: {
      frame: { completed: true, completedAt: '2024-01-10' },
      plan: { completed: true, completedAt: '2024-01-12', aiAssisted: true },
      draft: { completed: false, aiAssisted: true },
      update: { completed: false },
      deliver: { completed: false }
    },
    description: "Quarterly review call with Acme Corp. Discuss project progress, upcoming milestones, and any concerns.",
    stakeholders: [
      { id: "9", name: "John Smith", role: "Account Manager", initials: "JS" },
      { id: "10", name: "Emily Brown", role: "Client Lead (Acme)", initials: "EB" },
    ],
    notes: "Review latest metrics before call. Prepare demo of new features.",
    attendees: ["John Smith", "Emily Brown", "Sarah Chen"],
    dateTime: "2024-01-15T14:00:00Z",
  },
  "3": {
    title: "1:1 with Manager",
    currentStage: 'plan',
    stages: {
      frame: { completed: true, completedAt: '2024-01-14' },
      plan: { completed: false, aiAssisted: true },
      draft: { completed: false, aiAssisted: true },
      update: { completed: false },
      deliver: { completed: false }
    },
    description: "Weekly sync to discuss progress, blockers, and career development. Open forum for feedback and questions.",
    stakeholders: [
      { id: "11", name: "Your Manager", role: "Direct Manager", initials: "YM" },
    ],
    notes: "Bring list of accomplishments this week. Prepare questions about upcoming project.",
    attendees: ["You", "Your Manager"],
    dateTime: "2024-01-15T16:00:00Z",
  },
};

interface ProjectDetailViewProps {
  column: "left" | "right";
  onItemClick: (itemId: string, itemType: string) => void;
  selectedItemId?: string;
  selectedItemType?: string;
}

const ProjectDetailView = ({ column, onItemClick, selectedItemId, selectedItemType }: ProjectDetailViewProps) => {
  const [reviewDocOpen, setReviewDocOpen] = useState(false);
  const [brainstormOpen, setBrainstormOpen] = useState(false);
  const [isAddingTasks, setIsAddingTasks] = useState(false);
  const { toast } = useToast();
  
  const { 
    meetingNotes, 
    setMeetingNotes, 
    setExtractedTasks, 
    setIsExtracting, 
    setExtractionError,
    updateExtractedTaskSelection,
    addTasksFromMeeting,
  } = useLayoutStore();

  // Get item data based on type
  const getItemData = (): ItemDetail | null => {
    if (!selectedItemId) return null;
    if (selectedItemType === "task") {
      return taskData[selectedItemId] || null;
    }
    if (selectedItemType === "meeting") {
      return meetingData[selectedItemId] || null;
    }
    return null;
  };

  const itemData = getItemData();
  const isMeeting = selectedItemType === "meeting";
  const existingNotes = selectedItemId ? meetingNotes.notesByMeetingId[selectedItemId] : undefined;
  const extractedTasks = selectedItemId ? meetingNotes.extractedTasksByMeetingId[selectedItemId] || [] : [];

  if (!selectedItemId || !itemData) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-gray-500">Select an item to view details</p>
      </div>
    );
  }

  const handleNotesReceived = (content: string) => {
    if (selectedItemId) {
      setMeetingNotes(selectedItemId, content);
    }
  };

  const handleExtractTasks = async () => {
    if (!selectedItemId || !existingNotes) return;

    setIsExtracting(true);
    setExtractionError(null);

    try {
      const { data, error } = await supabase.functions.invoke('extract-tasks', {
        body: {
          meetingId: selectedItemId,
          meetingTitle: itemData.title,
          meetingDate: itemData.dateTime,
          attendees: itemData.attendees || [],
          notesContent: existingNotes,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setExtractedTasks(selectedItemId, data.extractedTasks || []);
      
      if (data.extractedTasks?.length > 0) {
        toast({
          title: "Tasks Extracted",
          description: `Found ${data.extractedTasks.length} action item${data.extractedTasks.length !== 1 ? 's' : ''} in the meeting notes.`,
        });
      } else {
        toast({
          title: "No Tasks Found",
          description: "No clear action items were found in the meeting notes.",
          variant: "default",
        });
      }
    } catch (error) {
      console.error('Error extracting tasks:', error);
      const message = error instanceof Error ? error.message : 'Failed to extract tasks';
      setExtractionError(message);
      toast({
        title: "Extraction Failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSelectionChange = (taskId: string, selected: boolean) => {
    if (selectedItemId) {
      updateExtractedTaskSelection(selectedItemId, taskId, selected);
    }
  };

  const handleAddTasks = async (tasks: ExtractedTask[]) => {
    if (!selectedItemId) return;
    
    setIsAddingTasks(true);
    try {
      addTasksFromMeeting(selectedItemId, itemData.title, tasks);
      toast({
        title: "Tasks Added",
        description: `Added ${tasks.length} task${tasks.length !== 1 ? 's' : ''} to your task list.`,
      });
    } finally {
      setIsAddingTasks(false);
    }
  };

  const handleOpenDocReview = () => {
    window.open("https://app.wavepitch.ai/app/review", "_blank");
  };

  const handleGetAIFeedback = () => {
    window.open("https://app.wavepitch.ai/app/review", "_blank");
  };

  return (
    <div className="space-y-6">
      {/* Header with Title and Action Buttons */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{itemData.title}</h2>
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
        <StageIndicator 
          stages={itemData.stages} 
          currentStage={itemData.currentStage} 
        />
      </div>

      {/* AI Assistance Card */}
      <AIAssistanceCard 
        currentStage={itemData.currentStage}
        onGetAIFeedback={handleGetAIFeedback}
        onOpenDocReview={handleOpenDocReview}
      />

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Description
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Add project description..."
          defaultValue={itemData.description}
          key={`desc-${selectedItemId}`}
        />
      </div>

      {/* Stakeholders */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Stakeholders</p>
        <div className="space-y-2">
          {itemData.stakeholders.length > 0 ? (
            itemData.stakeholders.map((stakeholder) => (
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
            ))
          ) : (
            <p className="text-sm text-gray-400">No stakeholders assigned</p>
          )}
        </div>
      </div>

      {/* Meeting Notes Dropzone - Only show for meetings */}
      {isMeeting && (
        <div className="space-y-4">
          <MeetingNotesDropzone
            meetingId={selectedItemId}
            meetingTitle={itemData.title}
            existingNotes={existingNotes}
            onNotesReceived={handleNotesReceived}
            onExtractTasks={handleExtractTasks}
            isProcessing={meetingNotes.isExtracting}
            extractedCount={extractedTasks.filter(t => t.selected).length}
          />

          {/* Extracted Tasks Review */}
          {extractedTasks.length > 0 && (
            <ExtractedTasksReview
              tasks={extractedTasks}
              onSelectionChange={handleSelectionChange}
              onAddTasks={handleAddTasks}
              isAdding={isAddingTasks}
              meetingTitle={itemData.title}
            />
          )}
        </div>
      )}

      {/* Notes - Only show for non-meetings */}
      {!isMeeting && (
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-2">
            Notes
          </label>
          <textarea
            className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            placeholder="Add notes..."
            defaultValue={itemData.notes}
            key={`notes-${selectedItemId}`}
          />
        </div>
      )}

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
            <Button asChild>
              <a href="https://app.wavepitch.ai/app/review" target="_blank" rel="noopener noreferrer">
                Open Review
              </a>
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
            <Button asChild>
              <a href="https://app.wavepitch.ai/app/create" target="_blank" rel="noopener noreferrer">
                Start Brainstorm
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetailView;
