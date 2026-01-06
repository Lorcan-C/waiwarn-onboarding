interface ProjectDetailViewProps {
  taskId: string;
  taskTitle: string;
}

const stages = ["Ready", "Frame", "Draft", "Review", "Deliver"];

const sampleStakeholders = [
  { id: "1", name: "Sarah Chen", role: "Product Manager", initials: "SC" },
  { id: "2", name: "Mike Johnson", role: "Engineering Lead", initials: "MJ" },
  { id: "3", name: "Lisa Park", role: "Design Lead", initials: "LP" },
];

const ProjectDetailView = ({ taskId, taskTitle }: ProjectDetailViewProps) => {
  const currentStageIndex = 1; // Frame stage for demo

  return (
    <div className="space-y-6">
      {/* Project Title */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">{taskTitle}</h2>
        <p className="text-sm text-gray-500 mt-1">Task ID: {taskId}</p>
      </div>

      {/* Stage Indicator */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Progress Stage</p>
        <div className="flex items-center gap-1">
          {stages.map((stage, index) => (
            <div key={stage} className="flex items-center">
              <div
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  index === currentStageIndex
                    ? "bg-blue-600 text-white"
                    : index < currentStageIndex
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-500"
                }`}
              >
                {stage}
              </div>
              {index < stages.length - 1 && (
                <div
                  className={`w-4 h-0.5 ${
                    index < currentStageIndex ? "bg-blue-300" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Description
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
          placeholder="Add project description..."
          defaultValue="This task involves reviewing and finalizing the Q2 proposal draft. Key deliverables include executive summary, budget breakdown, and timeline."
        />
      </div>

      {/* Stakeholders */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-3">Stakeholders</p>
        <div className="space-y-2">
          {sampleStakeholders.map((stakeholder) => (
            <div
              key={stakeholder.id}
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                {stakeholder.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {stakeholder.name}
                </p>
                <p className="text-xs text-gray-500">{stakeholder.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Notes
        </label>
        <textarea
          className="w-full rounded-lg border border-gray-200 p-3 text-sm text-gray-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Add notes..."
          defaultValue="Awaiting feedback from finance team on budget section."
        />
      </div>
    </div>
  );
};

export default ProjectDetailView;
