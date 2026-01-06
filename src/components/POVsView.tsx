import { User, MessageSquare, Lightbulb } from "lucide-react";
import { ProjectStage, POVType, POV_TYPE_STYLES, STAGE_TO_POV_TYPE } from "@/types/project";

interface POV {
  id: string;
  stakeholder: string;
  initials: string;
  prompt: string;
  project: string;
  povType: POVType;
  applicableStages: ProjectStage[];
  color: string;
}

const samplePOVs: POV[] = [
  // PURPOSE POVs (Frame stage)
  {
    id: "1",
    stakeholder: "Key Stakeholder",
    initials: "KS",
    prompt: "Who are the key stakeholders for this work? Have you identified all decision-makers?",
    project: "Q2 Strategy Proposal",
    povType: "purpose",
    applicableStages: ["frame"],
    color: "bg-purple-500",
  },
  {
    id: "2",
    stakeholder: "Client Lead",
    initials: "CL",
    prompt: "What outcome does the client stakeholder need? What would success look like from their perspective?",
    project: "Q2 Strategy Proposal",
    povType: "purpose",
    applicableStages: ["frame"],
    color: "bg-purple-500",
  },
  // PROCESS POVs (Plan stage)
  {
    id: "3",
    stakeholder: "Managing Partner",
    initials: "MP",
    prompt: "Your manager says: draft a one-pager before the full document. Have you outlined the key points?",
    project: "Q2 Strategy Proposal",
    povType: "process",
    applicableStages: ["plan"],
    color: "bg-blue-500",
  },
  {
    id: "4",
    stakeholder: "Communications Lead",
    initials: "CL",
    prompt: "Have you clarified the single key message? What's the one thing readers should remember?",
    project: "AI Services Investigation",
    povType: "process",
    applicableStages: ["plan"],
    color: "bg-blue-500",
  },
  // PRODUCT POVs (Draft stage)
  {
    id: "5",
    stakeholder: "Quality Reviewer",
    initials: "QR",
    prompt: "What does 'good' look like for this deliverable? Do you have clear acceptance criteria?",
    project: "Q2 Strategy Proposal",
    povType: "product",
    applicableStages: ["draft"],
    color: "bg-green-500",
  },
  {
    id: "6",
    stakeholder: "Executive Sponsor",
    initials: "ES",
    prompt: "Is your recommendation clear in the first paragraph? Executives skim - lead with the ask.",
    project: "Client Contract Amendment",
    povType: "product",
    applicableStages: ["draft"],
    color: "bg-green-500",
  },
  // ITERATION POVs (Update stage)
  {
    id: "7",
    stakeholder: "Feedback Synthesizer",
    initials: "FS",
    prompt: "What feedback did you receive? What's changing based on stakeholder input?",
    project: "Q2 Strategy Proposal",
    povType: "iteration",
    applicableStages: ["update"],
    color: "bg-orange-500",
  },
  {
    id: "8",
    stakeholder: "Devil's Advocate",
    initials: "DA",
    prompt: "Review as the skeptical stakeholder - what would they push back on? Address objections proactively.",
    project: "AI Services Investigation",
    povType: "iteration",
    applicableStages: ["update"],
    color: "bg-orange-500",
  },
];

const povTypeLabels: Record<POVType, string> = {
  purpose: "Purpose",
  process: "Process",
  product: "Product",
  iteration: "Iteration",
};

interface POVsViewProps {
  column: "left" | "right";
  onItemClick: (itemId: string, itemType: string) => void;
  currentProjectStage?: ProjectStage;
}

const POVsView = ({ column, onItemClick, currentProjectStage }: POVsViewProps) => {
  // Filter POVs based on current project stage
  const filteredPOVs = currentProjectStage
    ? samplePOVs.filter(pov => pov.applicableStages.includes(currentProjectStage))
    : samplePOVs;

  // Get the expected POV type for the current stage
  const expectedPovType = currentProjectStage ? STAGE_TO_POV_TYPE[currentProjectStage] : null;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-gray-800">Perspective Prompts</h2>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {currentProjectStage 
          ? `Showing ${expectedPovType ? povTypeLabels[expectedPovType] : ''} prompts for the ${currentProjectStage} stage.`
          : 'These prompts help you consider stakeholder perspectives as you work through your tasks.'}
      </p>

      {/* POV Cards */}
      <div className="space-y-3">
        {filteredPOVs.map((pov) => {
          const styles = POV_TYPE_STYLES[pov.povType];
          
          return (
            <div
              key={pov.id}
              onClick={() => onItemClick(pov.id, "pov")}
              className={`rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 ${styles.border} ${styles.bg}`}
            >
              {/* Header Row */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full ${pov.color} flex items-center justify-center text-white font-semibold text-sm`}
                  >
                    {pov.initials}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{pov.stakeholder}</h3>
                    <p className="text-xs text-gray-500">{pov.project}</p>
                  </div>
                </div>
                {/* POV Type Badge */}
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${styles.text} bg-white/60`}
                >
                  {povTypeLabels[pov.povType]}
                </span>
              </div>

              {/* Prompt */}
              <div className="flex gap-2">
                <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">{pov.prompt}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty state hint */}
      {filteredPOVs.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            {currentProjectStage 
              ? `No perspective prompts for the ${currentProjectStage} stage.`
              : 'No perspective prompts yet. Your manager will configure these for your projects.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default POVsView;
