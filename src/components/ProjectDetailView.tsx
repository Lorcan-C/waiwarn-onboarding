import { useState, useEffect } from "react";
import { FileText, MessageSquare, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import StageIndicator from "@/components/StageIndicator";

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
  workplan?: string;
  attendees?: string[];
  dateTime?: string;
}

// Task data for lookup with full details
const taskData: Record<string, ItemDetail> = {
  "1": {
    title: "Review Q2 proposal draft",
    currentStage: 'draft',
    stages: {
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
    workplan: "1. Review executive summary\n2. Check budget breakdown\n3. Validate timeline with stakeholders",
  },
  "2": {
    title: "Prepare meeting notes",
    currentStage: 'update',
    stages: {
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
    workplan: "1. Gather all meeting recordings\n2. Extract key discussion points\n3. Compile action items list",
  },
  "3": {
    title: "Update stakeholder map",
    currentStage: 'plan',
    stages: {
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
    workplan: "1. Research org structure\n2. Identify key decision makers\n3. Map relationships and influence",
  },
  "4": {
    title: "Read onboarding docs",
    currentStage: 'plan',
    stages: {
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
    workplan: "1. Read company handbook\n2. Complete IT setup\n3. Review team structure docs",
  },
  "5": {
    title: "Schedule 1:1 with mentor",
    currentStage: 'deliver',
    stages: {
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
    workplan: "1. Review mentor's calendar\n2. Propose meeting times\n3. Prepare discussion topics",
  },
};

// Meeting data for lookup with full details
const meetingData: Record<string, ItemDetail> = {
  "1": {
    title: "Team Standup",
    currentStage: 'deliver',
    stages: {
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
  const [workplanReviewOpen, setWorkplanReviewOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
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

  // Initialize editable values when item changes
  useEffect(() => {
    if (itemData) {
      setTitleValue(itemData.title);
      const combinedDesc = `${itemData.description}${itemData.notes ? '\n\n' + itemData.notes : ''}`;
      setDescriptionValue(combinedDesc);
      setIsEditingTitle(false);
      setIsEditingDescription(false);
      setWorkplanReviewOpen(false);
    }
  }, [selectedItemId, itemData?.title, itemData?.description, itemData?.notes]);

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
      {/* Header with Inline Editable Title, Description, and Action Buttons */}
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            {/* Editable Title */}
            {isEditingTitle ? (
              <input
                type="text"
                value={titleValue}
                onChange={(e) => setTitleValue(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                autoFocus
                className="text-xl font-semibold text-gray-900 w-full bg-white border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <h2 
                onClick={() => setIsEditingTitle(true)}
                className="text-xl font-semibold text-gray-900 cursor-text hover:bg-gray-100 rounded px-2 py-1 -mx-2 transition-colors"
              >
                {titleValue}
              </h2>
            )}
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
        
        {/* Editable Description/Notes - Full Width */}
        {isEditingDescription ? (
          <textarea
            value={descriptionValue}
            onChange={(e) => setDescriptionValue(e.target.value)}
            onBlur={() => setIsEditingDescription(false)}
            autoFocus
            rows={3}
            className="w-full text-sm text-gray-600 bg-white border border-blue-500 rounded px-2 py-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        ) : (
          <p 
            onClick={() => setIsEditingDescription(true)}
            className="text-sm text-gray-600 cursor-text hover:bg-gray-100 rounded px-2 py-1 -mx-2 transition-colors whitespace-pre-line"
          >
            {descriptionValue || 'Add description...'}
          </p>
        )}
      </div>

      {/* Stage Indicator - Only show for tasks */}
      {!isMeeting && (
        <StageIndicator 
          stages={itemData.stages} 
          currentStage={itemData.currentStage} 
        />
      )}

      {/* Workplan - Only show for tasks */}
      {!isMeeting && (
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">Workplan</label>
            <button 
              onClick={() => setWorkplanReviewOpen(!workplanReviewOpen)}
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Get feedback
              <Lightbulb className="w-4 h-4" />
            </button>
          </div>
          <textarea
            className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            placeholder="Outline your approach and next steps..."
            defaultValue={itemData.workplan}
            key={`workplan-${selectedItemId}`}
          />
          
          {/* AI Feedback Popup */}
          {workplanReviewOpen && (
            <div className="mt-2 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm font-medium text-blue-800">AI Workplan Feedback</p>
                  <p className="text-sm text-blue-700">
                    Your workplan looks structured. Consider adding specific deadlines 
                    and breaking down larger steps into smaller, actionable items.
                  </p>
                  <Button
                    variant="link"
                    size="sm"
                    className="p-0 h-auto text-blue-600 hover:text-blue-800"
                    onClick={() => setWorkplanReviewOpen(false)}
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}


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
