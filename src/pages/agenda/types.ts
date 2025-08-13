// Interface a ser usada pelos componentes de visualização
import type { Session } from '@/types';
import type { useCalendar } from '@/hooks/useCalendar';

export interface CalendarViewProps {
  calendar: ReturnType<typeof useCalendar>;
  sessions: Session[];
  onDateClick: (date: Date) => void;
  onAppointmentClick: (session: Session) => void;
  onTimeSlotClick: (date: Date, time: string) => void;
}