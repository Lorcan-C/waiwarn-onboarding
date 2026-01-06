import { useState } from "react";
import { format } from "date-fns";
import { Check } from "lucide-react";

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
  const [completedMeetings, setCompletedMeetings] = useState<Set<string>>(new Set());

  const handleMeetingClick = (meeting: Meeting) => {
    onItemClick(meeting.id, "meeting");
  };

  const handleCheckboxChange = (e: React.MouseEvent, meetingId: string) => {
    e.stopPropagation();
    setCompletedMeetings((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(meetingId)) {
        newSet.delete(meetingId);
      } else {
        newSet.add(meetingId);
      }
      return newSet;
    });
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
      {/* Date Header - Single Row */}
      <div className="bg-blue-600 rounded-lg p-4">
        <p className="text-white text-sm uppercase tracking-wide flex items-baseline gap-3">
          <span>{format(today, "EEEE")}</span>
          <span>{format(today, "d")}</span>
          <span>{format(today, "MMMM yyyy")}</span>
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
                    className="w-full text-left rounded-lg border border-gray-200 bg-white shadow-sm p-3 mt-1 hover:shadow-md transition-shadow cursor-pointer flex items-start gap-3"
                  >
                    <div
                      onClick={(e) => handleCheckboxChange(e, meeting.id)}
                      className={`mt-0.5 h-4 w-4 shrink-0 rounded-sm border flex items-center justify-center cursor-pointer transition-colors ${
                        completedMeetings.has(meeting.id)
                          ? "bg-primary border-primary"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      {completedMeetings.has(meeting.id) && (
                        <Check className="h-3 w-3 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium text-sm ${
                        completedMeetings.has(meeting.id)
                          ? "line-through text-gray-400"
                          : "text-gray-900"
                      }`}>
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
                    </div>
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
