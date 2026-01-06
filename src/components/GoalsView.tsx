interface GoalsViewProps {
  column: "left" | "right";
  onItemClick: (itemId: string, itemType: string) => void;
}

const sampleGoals = [
  { id: "1", title: "Complete onboarding training", progress: 75, dueDate: "End of Week 1" },
  { id: "2", title: "Meet all team members", progress: 50, dueDate: "End of Week 2" },
  { id: "3", title: "Deliver first project milestone", progress: 25, dueDate: "End of Month 1" },
];

const GoalsView = ({ column, onItemClick }: GoalsViewProps) => {
  const handleGoalClick = (goalId: string) => {
    onItemClick(goalId, "goal");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-900">Goals</h2>
      
      <div className="space-y-3">
        {sampleGoals.map((goal) => (
          <button
            key={goal.id}
            onClick={() => handleGoalClick(goal.id)}
            className="w-full text-left rounded-lg border border-gray-200 bg-white shadow-sm p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900">{goal.title}</span>
              <span className="text-xs bg-gray-100 text-gray-600 rounded px-2 py-1">
                {goal.dueDate}
              </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${goal.progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">{goal.progress}% complete</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default GoalsView;
