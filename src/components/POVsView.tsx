import { User, MessageSquare, Lightbulb } from "lucide-react";

interface POV {
  id: string;
  stakeholder: string;
  initials: string;
  prompt: string;
  project: string;
  stage: "frame" | "draft" | "ready" | "review";
  color: string;
}

const samplePOVs: POV[] = [
  {
    id: "1",
    stakeholder: "Managing Partner",
    initials: "MP",
    prompt: "Before drafting, consider: What does the Managing Partner already believe about this topic? How can you build on their existing mental model?",
    project: "Q2 Strategy Proposal",
    stage: "frame",
    color: "bg-blue-500",
  },
  {
    id: "2",
    stakeholder: "Client Stakeholder",
    initials: "CS",
    prompt: "The client will read this thinking about ROI first. Lead with quantifiable impact before methodology details.",
    project: "Q2 Strategy Proposal",
    stage: "draft",
    color: "bg-emerald-500",
  },
  {
    id: "3",
    stakeholder: "Delivery Team",
    initials: "DT",
    prompt: "The team will assess feasibility immediately. Acknowledge resource constraints and timeline realism early.",
    project: "AI Services Investigation",
    stage: "ready",
    color: "bg-amber-500",
  },
  {
    id: "4",
    stakeholder: "Legal Review",
    initials: "LR",
    prompt: "Flag any compliance considerations upfront. Legal appreciates when risks are identified proactively.",
    project: "Client Contract Amendment",
    stage: "review",
    color: "bg-purple-500",
  },
];

const stageLabels: Record<POV["stage"], string> = {
  frame: "Framing",
  draft: "Drafting",
  ready: "Ready",
  review: "Review",
};

const stageColors: Record<POV["stage"], string> = {
  frame: "bg-blue-100 text-blue-700",
  draft: "bg-amber-100 text-amber-700",
  ready: "bg-green-100 text-green-700",
  review: "bg-purple-100 text-purple-700",
};

interface POVsViewProps {
  column: "left" | "right";
  onItemClick: (itemId: string, itemType: string) => void;
}

const POVsView = ({ column, onItemClick }: POVsViewProps) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <Lightbulb className="w-5 h-5 text-amber-500" />
        <h2 className="text-lg font-semibold text-gray-800">Perspective Prompts</h2>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        These prompts help you consider stakeholder perspectives as you work through your tasks.
      </p>

      {/* POV Cards */}
      <div className="space-y-3">
        {samplePOVs.map((pov) => (
          <div
            key={pov.id}
            onClick={() => onItemClick(pov.id, "pov")}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
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
              {/* Stage Badge */}
              <span
                className={`text-xs px-2 py-1 rounded-full font-medium ${stageColors[pov.stage]}`}
              >
                {stageLabels[pov.stage]}
              </span>
            </div>

            {/* Prompt */}
            <div className="flex gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700 leading-relaxed">{pov.prompt}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state hint */}
      {samplePOVs.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">
            No perspective prompts yet. Your manager will configure these for your projects.
          </p>
        </div>
      )}
    </div>
  );
};

export default POVsView;
