import { Lightbulb, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectStage } from "@/types/project";

interface AIAssistanceCardProps {
  currentStage: ProjectStage;
  onGetAIFeedback?: () => void;
  onOpenDocReview?: () => void;
}

const AIAssistanceCard = ({ 
  currentStage, 
  onGetAIFeedback,
  onOpenDocReview 
}: AIAssistanceCardProps) => {
  if (currentStage !== 'plan' && currentStage !== 'draft') {
    return null;
  }

  if (currentStage === 'plan') {
    return (
      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <p className="text-sm text-blue-800">
            AI can review your plan or draft output. Click to get feedback.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={onGetAIFeedback}
          className="border-blue-300 text-blue-700 hover:bg-blue-100"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Get AI Feedback
        </Button>
      </div>
    );
  }

  if (currentStage === 'draft') {
    return (
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-3">
          <ExternalLink className="w-5 h-5 text-green-600" />
          <p className="text-sm text-green-800">
            Ready for document review? Get AI feedback on your draft.
          </p>
        </div>
        <Button 
          size="sm"
          onClick={onOpenDocReview}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          Open Doc Review
        </Button>
      </div>
    );
  }

  return null;
};

export default AIAssistanceCard;
