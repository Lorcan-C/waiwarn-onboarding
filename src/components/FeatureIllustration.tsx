import { Check, Edit3, AlertTriangle, Plus, MessageCircle } from "lucide-react";

interface FeatureIllustrationProps {
  type: 'document-review' | 'virtual-call' | 'plan-feedback';
}

const DocumentReviewIllustration = () => (
  <div className="bg-muted/50 rounded-lg p-4 mb-4">
    <div className="flex gap-3">
      {/* Document */}
      <div className="flex-1 bg-background rounded border border-border shadow-sm p-3 space-y-2">
        <div className="h-2 bg-muted rounded w-3/4" />
        <div className="h-2 bg-muted rounded w-full" />
        <div className="h-2 bg-muted rounded w-5/6" />
        <div className="h-2 bg-muted rounded w-2/3 mt-3" />
        <div className="h-2 bg-muted rounded w-full" />
        <div className="h-2 bg-muted rounded w-4/5" />
      </div>
      
      {/* Comments */}
      <div className="w-32 space-y-2">
        <div className="bg-blue-50 border-l-2 border-blue-400 rounded-r p-2">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-4 h-4 rounded-full bg-blue-400 flex items-center justify-center">
              <span className="text-[8px] text-white font-medium">DC</span>
            </div>
            <span className="text-[9px] text-blue-700 font-medium">David C.</span>
          </div>
          <div className="space-y-0.5">
            <div className="h-1.5 bg-blue-200 rounded w-full" />
            <div className="h-1.5 bg-blue-200 rounded w-3/4" />
          </div>
        </div>
        
        <div className="bg-purple-50 border-l-2 border-purple-400 rounded-r p-2">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-4 h-4 rounded-full bg-purple-400 flex items-center justify-center">
              <span className="text-[8px] text-white font-medium">RK</span>
            </div>
            <span className="text-[9px] text-purple-700 font-medium">Rachel K.</span>
          </div>
          <div className="space-y-0.5">
            <div className="h-1.5 bg-purple-200 rounded w-full" />
            <div className="h-1.5 bg-purple-200 rounded w-2/3" />
          </div>
        </div>
        
        <div className="bg-green-50 border-l-2 border-green-400 rounded-r p-2">
          <div className="flex items-center gap-1 mb-1">
            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
              <MessageCircle className="w-2 h-2 text-white" />
            </div>
            <span className="text-[9px] text-green-700 font-medium">Reply</span>
          </div>
          <div className="h-1.5 bg-green-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  </div>
);

const VirtualCallIllustration = () => (
  <div className="bg-muted/50 rounded-lg p-4 mb-4">
    <div className="bg-gray-900 rounded-lg p-3">
      {/* Video grid */}
      <div className="grid grid-cols-2 gap-2 mb-2">
        {[
          { initials: "VP", label: "VP Sales", color: "bg-blue-500" },
          { initials: "CF", label: "CFO", color: "bg-purple-500" },
          { initials: "EL", label: "Eng Lead", color: "bg-green-500" },
          { initials: "MD", label: "Mkt Dir", color: "bg-orange-500" },
        ].map((participant) => (
          <div key={participant.initials} className="bg-gray-800 rounded-lg aspect-video flex flex-col items-center justify-center relative">
            <div className={`w-8 h-8 rounded-full ${participant.color} flex items-center justify-center mb-1`}>
              <span className="text-xs text-white font-medium">{participant.initials}</span>
            </div>
            <span className="text-[9px] text-gray-400">{participant.label}</span>
            {/* Speaking indicator */}
            {participant.initials === "VP" && (
              <div className="absolute bottom-1 right-1 flex gap-0.5">
                <div className="w-1 h-2 bg-green-400 rounded-full animate-pulse" />
                <div className="w-1 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "0.1s" }} />
                <div className="w-1 h-1.5 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Call controls */}
      <div className="flex justify-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gray-400" />
        </div>
        <div className="w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
          <div className="w-2 h-0.5 bg-white rounded" />
        </div>
        <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
          <div className="w-2 h-2 rounded-sm bg-gray-400" />
        </div>
      </div>
    </div>
  </div>
);

const PlanFeedbackIllustration = () => (
  <div className="bg-muted/50 rounded-lg p-4 mb-4">
    <div className="bg-background rounded-lg border border-border shadow-sm overflow-hidden">
      {/* Task with edit suggestion */}
      <div className="p-2.5 border-b border-border">
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-xs text-foreground">Research competitors</span>
            <div className="flex items-center gap-1 mt-1 bg-amber-50 text-amber-700 rounded px-1.5 py-0.5 text-[10px]">
              <Edit3 className="w-2.5 h-2.5" />
              <span>Add timeline: <span className="font-medium">2 days</span></span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Task with warning */}
      <div className="p-2.5 border-b border-border">
        <div className="flex items-start gap-2">
          <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-xs text-foreground">Draft proposal</span>
            <div className="flex items-center gap-1 mt-1 bg-orange-50 text-orange-700 rounded px-1.5 py-0.5 text-[10px]">
              <AlertTriangle className="w-2.5 h-2.5" />
              <span>Risk: Missing budget section</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* New suggested task */}
      <div className="p-2.5 bg-green-50/50 border-l-2 border-green-400">
        <div className="flex items-start gap-2">
          <Plus className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <span className="text-xs text-green-700 font-medium">NEW: Schedule review meeting</span>
            <div className="text-[10px] text-green-600 mt-0.5">Suggested by CFO perspective</div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FeatureIllustration = ({ type }: FeatureIllustrationProps) => {
  switch (type) {
    case 'document-review':
      return <DocumentReviewIllustration />;
    case 'virtual-call':
      return <VirtualCallIllustration />;
    case 'plan-feedback':
      return <PlanFeedbackIllustration />;
    default:
      return null;
  }
};

export default FeatureIllustration;
