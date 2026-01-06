import { useState, useEffect } from "react";
import { FileText, MessageSquare, Plus, GripVertical, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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

interface PlanItem {
  id: string;
  text: string;
}

interface OutputDocument {
  id: string;
  name: string;
  selected: boolean;
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

// Helper to parse workplan string into plan items
const parseWorkplanToItems = (workplan?: string): PlanItem[] => {
  if (!workplan) return [];
  return workplan.split('\n').filter(line => line.trim()).map((line, index) => ({
    id: `plan-${index}`,
    text: line.replace(/^\d+\.\s*/, ''), // Remove leading numbers
  }));
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
  const [planFeedbackOpen, setPlanFeedbackOpen] = useState(false);
  const [isAddingTasks, setIsAddingTasks] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [titleValue, setTitleValue] = useState("");
  const [descriptionValue, setDescriptionValue] = useState("");
  const [planItems, setPlanItems] = useState<PlanItem[]>([]);
  const [outputDocs, setOutputDocs] = useState<OutputDocument[]>([]);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
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
      setPlanItems(parseWorkplanToItems(itemData.workplan));
      setOutputDocs([]);
      setIsEditingTitle(false);
      setIsEditingDescription(false);
      setEditingPlanId(null);
    }
  }, [selectedItemId, itemData?.title, itemData?.description, itemData?.notes, itemData?.workplan]);

  if (!selectedItemId || !itemData) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <div className="text-muted-foreground mb-3">
          <FileText className="w-12 h-12 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-1">No task selected</h3>
        <p className="text-sm text-muted-foreground">
          Select a task from the left panel to view details
        </p>
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

  // Plan item handlers
  const handleAddPlanItem = () => {
    const newItem: PlanItem = {
      id: `plan-${Date.now()}`,
      text: "",
    };
    setPlanItems([...planItems, newItem]);
    setEditingPlanId(newItem.id);
  };

  const handleUpdatePlanItem = (id: string, text: string) => {
    setPlanItems(planItems.map(item => item.id === id ? { ...item, text } : item));
  };

  const handleDeletePlanItem = (id: string) => {
    setPlanItems(planItems.filter(item => item.id !== id));
  };

  // Output document handlers
  const handleAddDocument = () => {
    const newDoc: OutputDocument = {
      id: `doc-${Date.now()}`,
      name: "New Document.docx",
      selected: false,
    };
    setOutputDocs([...outputDocs, newDoc]);
  };

  const handleToggleDocSelection = (id: string) => {
    setOutputDocs(outputDocs.map(doc => 
      doc.id === id ? { ...doc, selected: !doc.selected } : doc
    ));
  };

  const handleDeleteDocument = (id: string) => {
    setOutputDocs(outputDocs.filter(doc => doc.id !== id));
  };

  const selectedDocsCount = outputDocs.filter(doc => doc.selected).length;

  return (
    <div className="space-y-6">
      {/* 1. Header - Title Only */}
      <div>
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

      {/* 2. Description */}
      <div>
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

      {/* 3. Key Stakeholders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700">Key stakeholders</p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setBrainstormOpen(true)}
            className="text-xs"
          >
            <Users className="w-3 h-3 mr-1" />
            Start virtual call with stakeholders
          </Button>
        </div>
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

      {/* 4. Plan Section - Only show for tasks */}
      {!isMeeting && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">Plan</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPlanFeedbackOpen(true)}
              className="text-xs"
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Get virtual feedback on plan
            </Button>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-100">
              {planItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 p-3 bg-white hover:bg-gray-50 group"
                >
                  <GripVertical className="w-4 h-4 text-gray-300 cursor-grab flex-shrink-0" />
                  <span className="text-sm text-gray-500 w-6">{index + 1}.</span>
                  {editingPlanId === item.id ? (
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => handleUpdatePlanItem(item.id, e.target.value)}
                      onBlur={() => setEditingPlanId(null)}
                      onKeyDown={(e) => e.key === 'Enter' && setEditingPlanId(null)}
                      autoFocus
                      className="flex-1 text-sm text-gray-700 bg-white border border-blue-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <span 
                      onClick={() => setEditingPlanId(item.id)}
                      className="flex-1 text-sm text-gray-700 cursor-text hover:bg-gray-100 rounded px-1"
                    >
                      {item.text || 'Click to edit...'}
                    </span>
                  )}
                  <button
                    onClick={() => handleDeletePlanItem(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddPlanItem}
              className="w-full flex items-center gap-2 p-3 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors border-t border-gray-100"
            >
              <Plus className="w-4 h-4" />
              Add item
            </button>
          </div>
        </div>
      )}

      {/* 5. Outputs Section - Only show for tasks */}
      {!isMeeting && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-medium text-gray-700">Outputs</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setReviewDocOpen(true)}
              disabled={selectedDocsCount === 0}
              className="text-xs"
            >
              <FileText className="w-3 h-3 mr-1" />
              Get virtual stakeholders to review document
            </Button>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="divide-y divide-gray-100">
              {outputDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-3 p-3 bg-white hover:bg-gray-50 group"
                >
                  <input
                    type="checkbox"
                    checked={doc.selected}
                    onChange={() => handleToggleDocSelection(doc.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="flex-1 text-sm text-gray-700">{doc.name}</span>
                  <button
                    onClick={() => handleDeleteDocument(doc.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={handleAddDocument}
              className="w-full flex items-center gap-2 p-3 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors border-t border-gray-100"
            >
              <Plus className="w-4 h-4" />
              Add document
            </button>
          </div>
        </div>
      )}

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
              Get virtual stakeholders to review document
            </DialogTitle>
            <DialogDescription>
              Get multiple views on your work via in-document comment threads.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              This feature allows virtual stakeholders to provide feedback directly within your document, 
              creating threaded conversations around specific sections for clearer, more contextual reviews.
            </p>
          </div>
          <div className="flex justify-end">
            <Button asChild>
              <a href="https://app.wavepitch.ai/app/review" target="_blank" rel="noopener noreferrer">
                Start Review
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Virtual Call Modal */}
      <Dialog open={brainstormOpen} onOpenChange={setBrainstormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Start virtual call with stakeholders
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
                Start Call
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Virtual Plan Feedback Modal */}
      <Dialog open={planFeedbackOpen} onOpenChange={setPlanFeedbackOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Get virtual feedback on plan
            </DialogTitle>
            <DialogDescription>
              Receiving feedback from multiple perspectives on your plan.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              This feature provides comments and proposed edits to your plan based on your 
              company knowledge base, key stakeholders perspectives, and recent meeting notes. 
              This helps identify gaps, risks, and opportunities before moving forward with execution.
            </p>
          </div>
          <div className="flex justify-end">
            <Button asChild>
              <a href="https://app.wavepitch.ai/app/tasks" target="_blank" rel="noopener noreferrer">
                Get Feedback
              </a>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetailView;
