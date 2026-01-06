import { useState } from "react";
import { CheckCircle2, User, Calendar, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ExtractedTask } from "@/types/project";

interface ExtractedTasksReviewProps {
  tasks: ExtractedTask[];
  onSelectionChange: (taskId: string, selected: boolean) => void;
  onAddTasks: (selectedTasks: ExtractedTask[]) => void;
  isAdding: boolean;
  meetingTitle: string;
}

const ExtractedTasksReview = ({
  tasks,
  onSelectionChange,
  onAddTasks,
  isAdding,
  meetingTitle,
}: ExtractedTasksReviewProps) => {
  const selectedTasks = tasks.filter((t) => t.selected);
  const selectedCount = selectedTasks.length;

  const handleSelectAll = () => {
    const allSelected = tasks.every((t) => t.selected);
    tasks.forEach((task) => onSelectionChange(task.id, !allSelected));
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.85) return "text-green-600";
    if (confidence >= 0.7) return "text-yellow-600";
    return "text-gray-500";
  };

  const getConfidenceLabel = (confidence: number) => {
    if (confidence >= 0.85) return "High";
    if (confidence >= 0.7) return "Medium";
    return "Low";
  };

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <h3 className="text-sm font-medium text-gray-900">
            Extracted Tasks ({tasks.length} found)
          </h3>
        </div>
        <Button variant="ghost" size="sm" onClick={handleSelectAll} className="text-xs h-7">
          {tasks.every((t) => t.selected) ? "Deselect All" : "Select All"}
        </Button>
      </div>

      <div className="space-y-2">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`rounded-lg border p-3 transition-all duration-200 ${
              task.selected
                ? "border-blue-200 bg-blue-50"
                : "border-gray-200 bg-white hover:border-gray-300"
            }`}
          >
            <div className="flex items-start gap-3">
              <Checkbox
                id={task.id}
                checked={task.selected}
                onCheckedChange={(checked) => onSelectionChange(task.id, checked as boolean)}
                className="mt-0.5"
              />
              <div className="flex-1 min-w-0">
                <label
                  htmlFor={task.id}
                  className="text-sm font-medium text-gray-900 cursor-pointer"
                >
                  {task.title}
                </label>
                {task.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
                )}
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  {task.suggestedAssignee && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <User className="w-3 h-3" />
                      {task.suggestedAssignee}
                    </div>
                  )}
                  {task.suggestedDueDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Calendar className="w-3 h-3" />
                      {task.suggestedDueDate}
                    </div>
                  )}
                  <div className={`flex items-center gap-1 text-xs ${getConfidenceColor(task.confidence)}`}>
                    <TrendingUp className="w-3 h-3" />
                    {Math.round(task.confidence * 100)}% {getConfidenceLabel(task.confidence)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-2">
        <Button
          onClick={() => onAddTasks(selectedTasks)}
          disabled={selectedCount === 0 || isAdding}
          className="gap-2"
        >
          {isAdding ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Adding tasks...
            </>
          ) : (
            <>
              Add {selectedCount} Task{selectedCount !== 1 ? "s" : ""} to List
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-gray-500 text-center">
        Tasks will be linked to: {meetingTitle}
      </p>
    </div>
  );
};

export default ExtractedTasksReview;
