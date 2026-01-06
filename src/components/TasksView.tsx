import { useState } from "react";
import { ChevronDown, Link2 } from "lucide-react";
import { useLayoutStore } from "@/store/layoutStore";
import { Task as TaskType, TaskSource } from "@/types/project";

type Priority = "high" | "medium" | "low";
type SourceFilter = "all" | "manual" | "meeting";

interface LocalTask {
  id: string;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  source: TaskSource;
  meetingId?: string;
  meetingTitle?: string;
  assignee?: string;
}

const sampleTasks: LocalTask[] = [
  { id: "1", title: "Review Q2 proposal draft", dueDate: "Due today", priority: "high", completed: false, source: "manual" },
  { id: "2", title: "Prepare meeting notes", dueDate: "Due today", priority: "medium", completed: false, source: "manual" },
  { id: "3", title: "Update stakeholder map", dueDate: "Due tomorrow", priority: "high", completed: false, source: "manual" },
  { id: "4", title: "Read onboarding docs", dueDate: "Due this week", priority: "low", completed: false, source: "manual" },
  { id: "5", title: "Schedule 1:1 with mentor", dueDate: "Due this week", priority: "medium", completed: false, source: "manual" },
];

const priorityColors: Record<Priority, string> = {
  high: "bg-red-500",
  medium: "bg-yellow-500",
  low: "bg-gray-400",
};

interface TasksViewProps {
  column: "left" | "right";
  onItemClick: (itemId: string, itemType: string) => void;
}

const TasksView = ({ column, onItemClick }: TasksViewProps) => {
  const headerText = column === "right" ? "Today's onboarding tasks" : "Today's Tasks";
  const [priorityFilter, setPriorityFilter] = useState<"all" | Priority>("all");
  const [sourceFilter, setSourceFilter] = useState<SourceFilter>("all");
  const [tasks, setTasks] = useState<LocalTask[]>(sampleTasks);
  
  const { meetingTasks } = useLayoutStore();

  // Combine local tasks with meeting-extracted tasks
  const allTasks: LocalTask[] = [
    ...tasks,
    ...meetingTasks.map((t) => ({
      id: t.id,
      title: t.title,
      dueDate: t.dueDate,
      priority: t.priority,
      completed: t.completed,
      source: t.source,
      meetingId: t.meetingId,
      meetingTitle: t.meetingTitle,
      assignee: t.assignee,
    })),
  ];

  const filteredTasks = allTasks
    .filter((task) => priorityFilter === "all" || task.priority === priorityFilter)
    .filter((task) => sourceFilter === "all" || task.source === sourceFilter);

  const handleCheckboxChange = (taskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const handleTaskClick = (taskId: string) => {
    onItemClick(taskId, "task");
  };

  const meetingTaskCount = allTasks.filter((t) => t.source === "meeting").length;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">{headerText}</h2>
        
        {/* Filters */}
        <div className="flex gap-2">
          {/* Source Filter */}
          {meetingTaskCount > 0 && (
            <div className="relative">
              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as SourceFilter)}
                className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm text-gray-600 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Sources</option>
                <option value="manual">Manual</option>
                <option value="meeting">From Meetings</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )}

          {/* Priority Filter */}
          <div className="relative">
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value as "all" | Priority)}
              className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm text-gray-600 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">No tasks found</p>
        ) : (
          filteredTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => handleTaskClick(task.id)}
              className="w-full text-left rounded-lg border border-gray-200 bg-white shadow-sm p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start gap-3">
                {/* Checkbox */}
                <div
                  onClick={(e) => handleCheckboxChange(task.id, e)}
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 cursor-pointer transition-colors ${
                    task.completed
                      ? "bg-blue-600 border-blue-600"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {task.completed && (
                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium text-gray-900 ${
                        task.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    {/* Priority Indicator */}
                    <span
                      className={`w-2 h-2 rounded-full shrink-0 ${priorityColors[task.priority]}`}
                    />
                  </div>
                  
                  {/* Due Date and Source Badges */}
                  <div className="flex flex-wrap items-center gap-2 mt-1.5">
                    <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-1">
                      {task.dueDate}
                    </span>
                    
                    {/* Meeting Source Badge */}
                    {task.source === "meeting" && task.meetingTitle && (
                      <span className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 rounded px-2 py-1">
                        <Link2 className="w-3 h-3" />
                        From: {task.meetingTitle}
                      </span>
                    )}

                    {/* Assignee Badge */}
                    {task.assignee && (
                      <span className="text-xs bg-purple-50 text-purple-700 rounded px-2 py-1">
                        {task.assignee}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default TasksView;
