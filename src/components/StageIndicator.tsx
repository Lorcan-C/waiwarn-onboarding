import { Check, Lightbulb } from "lucide-react";
import { 
  ProjectStage, 
  StageInfo, 
  STAGES, 
  STAGE_LABELS, 
  AI_ASSISTED_STAGES 
} from "@/types/project";

interface StageIndicatorProps {
  stages: Record<ProjectStage, StageInfo>;
  currentStage: ProjectStage;
}

const StageIndicator = ({ stages, currentStage }: StageIndicatorProps) => {
  const currentStageIndex = STAGES.indexOf(currentStage);

  const getStageStatus = (stage: ProjectStage, index: number) => {
    if (stages[stage].completed) return 'completed';
    if (index === currentStageIndex) return 'current';
    return 'future';
  };

  const getStageStyles = (status: 'completed' | 'current' | 'future') => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'current':
        return 'bg-blue-600 text-white border-blue-600';
      case 'future':
        return 'bg-gray-100 text-gray-500 border-gray-200';
    }
  };

  const isAIAssisted = (stage: ProjectStage) => AI_ASSISTED_STAGES.includes(stage);

  return (
    <div className="flex flex-wrap gap-2">
      {STAGES.map((stage, index) => {
        const status = getStageStatus(stage, index);
        const styles = getStageStyles(status);
        const showLightbulb = isAIAssisted(stage);

        return (
          <div
            key={stage}
            className={`relative flex flex-col items-center px-4 py-2 rounded-lg border ${styles} min-w-[80px]`}
          >
            {/* Lightbulb icon for AI-assisted stages */}
            {showLightbulb && (
              <Lightbulb 
                className={`absolute -top-1 -right-1 w-4 h-4 ${
                  status === 'current' ? 'text-blue-300' : 'text-blue-500'
                }`} 
              />
            )}
            
            {/* Stage label */}
            <span className="text-xs font-medium">{STAGE_LABELS[stage]}</span>
            
            {/* Status indicator */}
            <div className="mt-1">
              {status === 'completed' ? (
                <Check className="w-4 h-4" />
              ) : status === 'current' ? (
                <div className="w-2 h-2 rounded-full bg-current" />
              ) : (
                <div className="w-2 h-2 rounded-full border border-current" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default StageIndicator;
