import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Priority = "high" | "medium" | "low";

interface Task {
  id: string;
  title: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
}

const sampleTasks: Task[] = [
  { id: "1", title: "Review Q2 proposal draft", dueDate: "Due today", priority: "high", completed: false },
  { id: "2", title: "Prepare meeting notes", dueDate: "Due today", priority: "medium", completed: false },
  { id: "3", title: "Update stakeholder map", dueDate: "Due tomorrow", priority: "high", completed: false },
  { id: "4", title: "Read onboarding docs", dueDate: "Due this week", priority: "low", completed: false },
  { id: "5", title: "Schedule 1:1 with mentor", dueDate: "Due this week", priority: "medium", completed: false },
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
  const [filter, setFilter] = useState<"all" | Priority>("all");
  const [tasks, setTasks] = useState(sampleTasks);

  const filteredTasks = filter === "all" 
    ? tasks 
    : tasks.filter((task) => task.priority === filter);

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

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">Today's Tasks</h2>
        
        {/* Filter Dropdown */}
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as "all" | Priority)}
            className="appearance-none bg-white border border-gray-200 rounded-lg px-3 py-1.5 pr-8 text-sm text-gray-600 cursor-pointer hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.map((task) => (
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
                
                {/* Due Date Badge */}
                <span className="inline-block mt-1.5 text-xs bg-gray-100 text-gray-600 rounded px-2 py-1">
                  {task.dueDate}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TasksView;
