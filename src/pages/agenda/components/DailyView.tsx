// Caminho: src/pages/agenda/components/DailyView.tsx
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Importando a interface de um arquivo de tipos
import type { CalendarViewProps } from '../types';

const HOUR_HEIGHT_PX = 64; // Altura de cada hora em pixels

export function DailyView({ calendar, sessions, onAppointmentClick, onTimeSlotClick }: CalendarViewProps) {
  const { currentDate, changeDate } = calendar;

  // Define as horas que serão exibidas na linha do tempo (8h às 20h)
  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  const sessionsForDay = sessions.filter(apt => calendar.isSameDay(new Date(apt.data_sessao.replace(/-/g, '\/')), currentDate));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{currentDate.toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => changeDate(-1, 'day')}><ChevronLeft className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" onClick={() => changeDate(1, 'day')}><ChevronRight className="h-5 w-5" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative divide-y divide-slate-200 dark:divide-slate-700 -mx-6 px-6">
          {/* Linha do tempo de fundo */}
          {hours.map(hour => (
            <div
              key={hour}
              className="flex items-start h-16" // h-16 = 64px
              onClick={() => onTimeSlotClick(currentDate, `${hour.toString().padStart(2, '0')}:00`)}
            >
              <span className="w-16 text-sm text-slate-500 text-right pr-4 -translate-y-2">{`${hour}:00`}</span>
              <div className="flex-1 border-t border-slate-200 dark:border-slate-700 h-full cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"></div>
            </div>
          ))}

          {/* Agendamentos posicionados sobre a linha do tempo */}
          <div className="absolute top-0 left-20 right-6 bottom-0">
            {sessionsForDay.map(apt => {
              const startHour = parseInt(apt.hora_inicio.split(':')[0]);
              const startMinutes = parseInt(apt.hora_inicio.split(':')[1]);
              
              const top = ((startHour - 8) * HOUR_HEIGHT_PX) + (startMinutes / 60 * HOUR_HEIGHT_PX);
              const height = (apt.duracao_minutos / 60) * HOUR_HEIGHT_PX;

              return (
                <div
                  key={apt.id}
                  onClick={(e) => { e.stopPropagation(); onAppointmentClick(apt); }}
                  className={cn("absolute w-full p-2 rounded-lg text-white text-sm cursor-pointer transition-all duration-200 ease-in-out bg-blue-500 hover:bg-blue-600 z-10")}
                  style={{ top: `${top}px`, height: `${height}px`, left: '1rem', right: '1rem' }}
                >
                  <p className="font-bold">{apt.titulo_sessao}</p>
                  <p className="text-xs opacity-80">{`${apt.hora_inicio}`}</p>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}