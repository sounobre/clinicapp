// Caminho: src/pages/agenda/components/WeeklyView.tsx
import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Importando a interface de um arquivo de tipos
import type { CalendarViewProps } from '../types';

export function WeeklyView({ calendar, sessions, onDateClick, onAppointmentClick }: CalendarViewProps) {
  const { currentDate, daysOfWeek, isToday, isSameDay, changeDate } = calendar;

  // Calcula os dias da semana a serem exibidos
  const weekDays = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Define para o domingo
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      return day;
    });
  }, [currentDate]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{`Semana de ${weekDays[0].toLocaleDateString('pt-BR', {day: '2-digit', month: 'short'})} a ${weekDays[6].toLocaleDateString('pt-BR', {day: '2-digit', month: 'short', year: 'numeric'})}`}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => changeDate(-1, 'week')}><ChevronLeft className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" onClick={() => changeDate(1, 'week')}><ChevronRight className="h-5 w-5" /></Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-px text-center bg-slate-200 dark:bg-slate-700 border border-slate-200 dark:border-slate-700 min-h-[60vh]">
          {weekDays.map(day => (
            <div key={day.toISOString()} className="bg-white dark:bg-slate-800 p-2">
              <div className="cursor-pointer" onClick={() => onDateClick(day)}>
                <p className="text-sm text-slate-500">{daysOfWeek[day.getDay()]}</p>
                <p className={cn("mt-1 text-lg font-semibold rounded-full w-10 h-10 flex items-center justify-center mx-auto", isToday(day) && "bg-blue-600 text-white")}>
                  {day.getDate()}
                </p>
              </div>
              <div className="mt-2 space-y-1">
                {sessions.filter(apt => isSameDay(new Date(apt.data_sessao.replace(/-/g, '\/')), day))
                  .sort((a, b) => a.hora_inicio.localeCompare(b.hora_inicio))
                  .map(apt => (
                    <div 
                        key={apt.id} 
                        onClick={(e) => { e.stopPropagation(); onAppointmentClick(apt); }} 
                        className={cn("p-1 rounded-md text-xs text-left text-white cursor-pointer bg-blue-500 hover:bg-blue-600")}
                    >
                      <p className="font-semibold">{apt.titulo_sessao}</p>
                      <p>{apt.hora_inicio}</p>
                    </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}