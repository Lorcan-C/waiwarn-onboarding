import { useState } from "react";
import { HelpCircle, ArrowRight, MessageCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface UnstuckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type Layer = "rubber-duck" | "diagnosis" | "queue" | "resolved";

interface DiagnosisOption {
  id: string;
  confidence: number;
  title: string;
  description: string;
  color: string;
}

const diagnosisOptions: DiagnosisOption[] = [
  {
    id: "unclear-done",
    confidence: 73,
    title: "You're unclear on what 'done' looks like",
    description: "Try writing a single sentence describing the ideal outcome. What would your manager say makes this complete?",
    color: "bg-red-500",
  },
  {
    id: "scope-too-big",
    confidence: 18,
    title: "Scope is too big for time available",
    description: "What's the minimum viable version? What can you cut while still delivering value?",
    color: "bg-amber-500",
  },
  {
    id: "blocked-info",
    confidence: 9,
    title: "Blocked on information or access",
    description: "Who has what you need? Have you asked them directly? Sometimes a quick message unblocks hours of waiting.",
    color: "bg-green-500",
  },
];

const UnstuckModal = ({ isOpen, onClose }: UnstuckModalProps) => {
  const [layer, setLayer] = useState<Layer>("rubber-duck");
  const [tryingTo, setTryingTo] = useState("");
  const [but, setBut] = useState("");
  const [because, setBecause] = useState("");
  const [selectedDiagnosis, setSelectedDiagnosis] = useState<string | null>(null);
  const [queueQuestion, setQueueQuestion] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    // Reset state on close
    setLayer("rubber-duck");
    setTryingTo("");
    setBut("");
    setBecause("");
    setSelectedDiagnosis(null);
    setQueueQuestion("");
    setSubmitted(false);
    onClose();
  };

  const handleRubberDuckSubmit = () => {
    if (tryingTo.trim() && but.trim()) {
      setLayer("diagnosis");
    }
  };

  const handleDiagnosisSelect = (id: string) => {
    setSelectedDiagnosis(id);
    setLayer("resolved");
  };

  const handleNoneOfThese = () => {
    setLayer("queue");
  };

  const handleQueueSubmit = () => {
    if (queueQuestion.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }
  };

  const canSubmitRubberDuck = tryingTo.trim().length > 0 && but.trim().length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-blue-600" />
            {layer === "rubber-duck" && "Let's figure this out"}
            {layer === "diagnosis" && "What might be happening"}
            {layer === "queue" && "Ask for help"}
            {layer === "resolved" && "Great progress!"}
          </DialogTitle>
          <DialogDescription>
            {layer === "rubber-duck" && "Sometimes articulating the problem reveals the solution."}
            {layer === "diagnosis" && "Based on what you've described, here are likely causes."}
            {layer === "queue" && "Your question will be answered within 24 hours."}
            {layer === "resolved" && "You've identified the blocker. Now you can move forward."}
          </DialogDescription>
        </DialogHeader>

        {/* Layer 1: Rubber Duck */}
        {layer === "rubber-duck" && (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                I'm trying to...
              </label>
              <Textarea
                value={tryingTo}
                onChange={(e) => setTryingTo(e.target.value)}
                placeholder="Describe what you're attempting to accomplish"
                className="resize-none"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                But...
              </label>
              <Textarea
                value={but}
                onChange={(e) => setBut(e.target.value)}
                placeholder="What's stopping you?"
                className="resize-none"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Because... <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <Textarea
                value={because}
                onChange={(e) => setBecause(e.target.value)}
                placeholder="Why do you think this is happening?"
                className="resize-none"
                rows={2}
              />
            </div>
            <Button
              onClick={handleRubberDuckSubmit}
              disabled={!canSubmitRubberDuck}
              className="w-full"
            >
              Help me think through this
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Layer 2: Predictive Diagnosis */}
        {layer === "diagnosis" && (
          <div className="space-y-3 mt-4">
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">You said:</span> I'm trying to {tryingTo.toLowerCase()}, but {but.toLowerCase()}
                {because && `, because ${because.toLowerCase()}`}.
              </p>
            </div>

            {diagnosisOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleDiagnosisSelect(option.id)}
                className="w-full text-left bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-2 h-2 rounded-full mt-2 ${option.color}`}
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900 text-sm">
                        {option.title}
                      </span>
                      <span className="text-xs text-gray-400">
                        {option.confidence}% likely
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
              </button>
            ))}

            <Button
              variant="outline"
              onClick={handleNoneOfThese}
              className="w-full mt-2"
            >
              <XCircle className="w-4 h-4 mr-2" />
              None of these - I need more help
            </Button>
          </div>
        )}

        {/* Layer 3: Question Queue */}
        {layer === "queue" && !submitted && (
          <div className="space-y-4 mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">
                    Your manager will respond within 24 hours
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    Questions submitted here go to your manager's queue. They'll see your context and provide guidance.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                What do you need help with?
              </label>
              <Textarea
                value={queueQuestion}
                onChange={(e) => setQueueQuestion(e.target.value)}
                placeholder="Be specific about what would unblock you..."
                className="resize-none"
                rows={4}
              />
            </div>

            <Button
              onClick={handleQueueSubmit}
              disabled={!queueQuestion.trim()}
              className="w-full"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Submit question
            </Button>
          </div>
        )}

        {/* Queue Submitted Confirmation */}
        {layer === "queue" && submitted && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Question submitted!
            </h3>
            <p className="text-sm text-gray-600">
              Your manager will respond within 24 hours.
            </p>
          </div>
        )}

        {/* Resolved State */}
        {layer === "resolved" && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              You've got this!
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Now that you've identified the issue, take a moment to write down your next step.
            </p>
            <Button onClick={handleClose}>
              Back to work
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default UnstuckModal;
