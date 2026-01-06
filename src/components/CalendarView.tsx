import { format } from "date-fns";

interface Meeting {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  attendees?: string[];
}

const sampleMeetings: Meeting[] = [
  { id: "1", title: "Team Standup", startTime: "9:00", endTime: "9:30" },
  { id: "2", title: "Client Call", startTime: "11:00", endTime: "12:00", attendees: ["John", "Sarah"] },
  { id: "3", title: "1:1 with Manager", startTime: "14:00", endTime: "14:30" },
];

const timeSlots = [
  "9:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"
];

const parseTime = (time: string): number => {
  const [hours] = time.split(":").map(Number);
  return hours;
};

const formatTimeDisplay = (time: string): string => {
  const hour = parseTime(time);
  if (hour === 0) return "12am";
  if (hour === 12) return "12pm";
  return hour > 12 ? `${hour - 12}pm` : `${hour}am`;
};

interface CalendarViewProps {
  column: "left" | "right";
  onItemClick: (itemId: string, itemType: string) => void;
}

const CalendarView = ({ column, onItemClick }: CalendarViewProps) => {
  const today = new Date();

  const handleMeetingClick = (meeting: Meeting) => {
    onItemClick(meeting.id, "meeting");
  };

  const getMeetingAtSlot = (slot: string): Meeting | undefined => {
    const slotHour = parseTime(slot);
    return sampleMeetings.find((meeting) => {
      const meetingHour = parseTime(meeting.startTime);
      return meetingHour === slotHour;
    });
  };

  return (
    <div className="space-y-6">
      {/* Date Header - Flip Card Style */}
      <div className="bg-gray-900 rounded-lg p-4 text-center">
        <p className="text-gray-400 text-sm uppercase tracking-wide">
          {format(today, "EEEE")}
        </p>
        <p className="text-white text-5xl font-bold my-2">
          {format(today, "d")}
        </p>
        <p className="text-gray-400 text-sm">
          {format(today, "MMMM yyyy")}
        </p>
      </div>

      {/* Timeline */}
      <div className="space-y-1">
        {timeSlots.map((slot) => {
          const meeting = getMeetingAtSlot(slot);
          
          return (
            <div key={slot} className="flex items-start gap-4">
              {/* Time Label */}
              <div className="w-14 text-xs text-gray-400 pt-1 text-right shrink-0">
                {formatTimeDisplay(slot)}
              </div>

              {/* Slot Content */}
              <div className="flex-1 min-h-[48px] border-t border-gray-100 relative">
                {meeting ? (
                  <button
                    onClick={() => handleMeetingClick(meeting)}
                    className="w-full text-left rounded-lg border border-gray-200 bg-white shadow-sm p-3 mt-1 hover:shadow-md transition-shadow cursor-pointer"
                  >
                    <p className="font-medium text-gray-900 text-sm">
                      {meeting.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {meeting.startTime} - {meeting.endTime}
                    </p>
                    {meeting.attendees && meeting.attendees.length > 0 && (
                      <p className="text-xs text-gray-400 mt-1">
                        {meeting.attendees.join(", ")}
                      </p>
                    )}
                  </button>
                ) : (
                  <div className="h-12" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CalendarView;
