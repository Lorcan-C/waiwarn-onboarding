import { useState, useRef } from "react";
import { Mic, MicOff, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuestionAnswer {
  text?: string;
  voiceTranscript?: string;
  documents?: string[];
}

interface OnboardingData {
  role: string;
  why: QuestionAnswer;
  how: QuestionAnswer;
  what: QuestionAnswer;
}

interface QuestionCardProps {
  label: string;
  question: string;
  answer: QuestionAnswer;
  onUpdate: (answer: QuestionAnswer) => void;
}

const QuestionCard = ({ label, question, answer, onUpdate }: QuestionCardProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleVoiceToggle = () => {
    if (isRecording) {
      // Stop recording - mock transcript
      setIsRecording(false);
      onUpdate({
        ...answer,
        voiceTranscript: "This is a sample voice transcript. In production, this would be the actual speech-to-text result.",
      });
    } else {
      setIsRecording(true);
    }
  };

  const handleTextChange = (text: string) => {
    onUpdate({ ...answer, text });
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newDocs = [...(answer.documents || [])];
      for (let i = 0; i < files.length; i++) {
        newDocs.push(files[i].name);
      }
      onUpdate({ ...answer, documents: newDocs });
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeDocument = (index: number) => {
    const newDocs = [...(answer.documents || [])];
    newDocs.splice(index, 1);
    onUpdate({ ...answer, documents: newDocs });
  };

  const labelColors: Record<string, string> = {
    PURPOSE: "bg-purple-100 text-purple-700",
    PROCESS: "bg-emerald-100 text-emerald-700",
    PRODUCT: "bg-amber-100 text-amber-700",
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm p-6 mb-6">
      {/* Label */}
      <span
        className={`inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-3 ${
          labelColors[label] || "bg-gray-100 text-gray-700"
        }`}
      >
        {label}
      </span>

      {/* Question */}
      <p className="text-lg font-medium text-gray-900 mb-6">{question}</p>

      {/* Input Section */}
      <div className="space-y-4">
        {/* Voice Input */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleVoiceToggle}
            className={`rounded-full p-4 transition-all ${
              isRecording
                ? "bg-red-100 hover:bg-red-200 animate-pulse"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            {isRecording ? (
              <MicOff className="w-5 h-5 text-red-600" />
            ) : (
              <Mic className="w-5 h-5 text-gray-600" />
            )}
          </button>
          <span className="text-sm text-gray-500">
            {isRecording ? "Recording... Click to stop" : "Record your answer"}
          </span>
        </div>

        {/* Voice Transcript */}
        {answer.voiceTranscript && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Voice Transcript:</p>
            <p className="text-sm text-gray-700">{answer.voiceTranscript}</p>
          </div>
        )}

        {/* Text Input */}
        <div>
          <textarea
            value={answer.text || ""}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full rounded-lg border border-gray-200 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder="Type your answer..."
          />
        </div>

        {/* Document Upload */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            <Paperclip className="w-4 h-4" />
            Attach documents
          </button>

          {/* Document Pills */}
          {answer.documents && answer.documents.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {answer.documents.map((doc, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1.5 bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm"
                >
                  {doc}
                  <button
                    onClick={() => removeDocument(index)}
                    className="hover:bg-blue-200 rounded-full p-0.5 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

interface OnboardingSetupViewProps {
  column: "left" | "right";
  onItemClick: (itemId: string, itemType: string) => void;
}

const OnboardingSetupView = ({ column, onItemClick }: OnboardingSetupViewProps) => {
  const [data, setData] = useState<OnboardingData>({
    role: "",
    why: {},
    how: {},
    what: {},
  });

  const updateAnswer = (key: "why" | "how" | "what", answer: QuestionAnswer) => {
    setData((prev) => ({ ...prev, [key]: answer }));
  };

  const isAnswered = (answer: QuestionAnswer): boolean => {
    return !!(
      answer.text?.trim() ||
      answer.voiceTranscript ||
      (answer.documents && answer.documents.length > 0)
    );
  };

  const answeredCount = [
    isAnswered(data.why),
    isAnswered(data.how),
    isAnswered(data.what),
  ].filter(Boolean).length;

  const canSave = isAnswered(data.why);

  const handleSave = () => {
    console.log("Saving onboarding data:", data);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl font-semibold text-gray-900">Set up onboarding for</span>
          <input
            type="text"
            value={data.role}
            onChange={(e) => setData((prev) => ({ ...prev, role: e.target.value }))}
            className="text-xl font-semibold text-blue-600 bg-transparent border-b-2 border-blue-200 focus:border-blue-500 focus:outline-none px-1 min-w-[120px]"
            placeholder="[Role]"
          />
        </div>
        <p className="text-gray-500">Answer three questions to help your new hire succeed</p>
      </div>

      {/* Question Cards */}
      <QuestionCard
        label="PURPOSE"
        question="Why does this role exist? What's the mission and who are the key stakeholders?"
        answer={data.why}
        onUpdate={(answer) => updateAnswer("why", answer)}
      />

      <QuestionCard
        label="PROCESS"
        question="How should they approach the work? What are the key processes, methods, and ways of working?"
        answer={data.how}
        onUpdate={(answer) => updateAnswer("how", answer)}
      />

      <QuestionCard
        label="PRODUCT"
        question="What does good output look like? Describe successful deliverables and how you evaluate quality."
        answer={data.what}
        onUpdate={(answer) => updateAnswer("what", answer)}
      />

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-700">{answeredCount} of 3</span> answered
        </p>
        <Button
          onClick={handleSave}
          disabled={!canSave}
          className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save & Continue
        </Button>
      </div>
    </div>
  );
};

export default OnboardingSetupView;
