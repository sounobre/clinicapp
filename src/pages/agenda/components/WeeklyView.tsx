// Caminho: src/pages/agenda/components/WeeklyView.tsx
import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Importando a interface de um arquivo de tipos
import type { CalendarViewProps } from '../types';
import type { Session } from '@/types';

const HOUR_HEIGHT_PX = 64;

const statusColors: Record<Session['statusSessao'], string> = {
  Confirmada: 'bg-green-500 hover:bg-green-600',
  Pendente: 'bg-yellow-500 hover:bg-yellow-600',
  Realizada: 'bg-blue-500 hover:bg-blue-600',
  Cancelada: 'bg-red-500 hover:bg-red-600',
  Faltou: 'bg-slate-500 hover:bg-slate-600'
};

export function WeeklyView({ calendar, sessions, onDateClick, onAppointmentClick, onTimeSlotClick }: CalendarViewProps) {
  const { currentDate, daysOfWeek, isToday, isSameDay, changeDate } = calendar;

  const hours = Array.from({ length: 13 }, (_, i) => i + 8);

  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    const dayOfWeek = start.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Ajusta para segunda-feira
    start.setDate(start.getDate() + diff);
    return Array.from({ length: 6 }, (_, i) => {
      const day = new Date(start);
      day.setDate(start.getDate() + i);
      return day;
    });
  }, [currentDate]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{`Semana de ${weekDays[0].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} a ${weekDays[weekDays.length - 1].toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}`}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => changeDate(-1, 'week')}><ChevronLeft className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" onClick={() => changeDate(1, 'week')}><ChevronRight className="h-5 w-5" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="border border-slate-200 dark:border-slate-700">
          {/* Cabeçalho com os dias da semana */}
          <div className="grid grid-cols-[80px_repeat(6,1fr)]">
            <div className="border-b border-slate-200 dark:border-slate-700"></div>
            {weekDays.map(day => (
              <div
                key={day.toISOString()}
                className="p-2 text-center border-b border-l border-slate-200 dark:border-slate-700 cursor-pointer"
                onClick={() => onDateClick(day)}
              >
                <p className="text-sm text-slate-500">{daysOfWeek[day.getDay()]}</p>
                <p className={cn('mt-1 text-lg font-semibold rounded-full w-10 h-10 flex items-center justify-center mx-auto', isToday(day) && 'bg-blue-600 text-white')}>
                  {day.getDate()}
                </p>
              </div>
            ))}
          </div>

          {/* Grade de horários */}
          <div className="grid grid-cols-[80px_repeat(6,1fr)]">
            {/* Coluna de horários */}
            <div className="flex flex-col">
              {hours.map(hour => (
                <div
                  key={hour}
                  className="h-16 pb-px text-sm text-slate-500 text-right pr-4 -translate-y-2"
                >
                  {`${hour}:00`}
                </div>
              ))}
            </div>

            {/* Colunas para cada dia */}
            {weekDays.map(day => (
              <div key={day.toISOString()} className="relative border-l border-slate-200 dark:border-slate-700">
                {hours.map(hour => (
                  <div
                    key={hour}
                    className="h-16 border-b border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50"
                    onClick={() => onTimeSlotClick(day, `${hour.toString().padStart(2, '0')}:00`)}
                  />
                ))}

                {/* Agendamentos do dia */}
                <div className="absolute inset-0">
                  {sessions
                    .filter(apt => isSameDay(new Date(apt.dataSessao.replace(/-/g, '\/')), day))
                    .map(apt => {
                      const startHour = parseInt(apt.horaInicio.split(':')[0]);
                      const startMinutes = parseInt(apt.horaInicio.split(':')[1]);
                      const top = ((startHour - 8) * HOUR_HEIGHT_PX) + (startMinutes / 60 * HOUR_HEIGHT_PX);
                      const height = (apt.duracaoMinutos / 60) * HOUR_HEIGHT_PX;
                      return (
                        <div
                          key={apt.id}
                          onClick={e => { e.stopPropagation(); onAppointmentClick(apt); }}
                          className={cn('absolute left-1 right-1 p-2 rounded-lg text-white text-xs cursor-pointer z-10', statusColors[apt.statusSessao])}
                          style={{ top: `${top}px`, height: `${height}px` }}
                        >
                          <p className="font-semibold truncate">{apt.tituloSessao}</p>
                          <p className="text-[10px] opacity-80">{apt.horaInicio}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}