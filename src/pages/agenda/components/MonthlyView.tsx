// Caminho: src/pages/agenda/components/MonthlyView.tsx
import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// Importando a interface de um arquivo de tipos (ou defina-a aqui)
import type { CalendarViewProps } from '../types'; // Supondo que você criou um arquivo types.ts

export function MonthlyView({ calendar, sessions, onDateClick }: CalendarViewProps) {
  const { currentDate, monthNames, daysOfWeek, isToday, isSameDay, changeDate } = calendar;
  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  // Calcula os dias do mês e os dias em branco no início para evitar re-cálculo a cada renderização
  const { days, blankDays } = useMemo(() => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    return {
      days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
      blankDays: Array(firstDayOfMonth).fill(null),
    };
  }, [month, year]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{`${monthNames[month]} ${year}`}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" onClick={() => changeDate(-1, 'month')}>
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" onClick={() => changeDate(1, 'month')}>
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 text-center text-sm text-slate-500 dark:text-slate-400 mb-2">
          {daysOfWeek.map(day => <div key={day}>{day}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {blankDays.map((_, i) => <div key={`blank-${i}`} className="border rounded-md border-transparent"></div>)}
          {days.map(date => {
            const dayDate = new Date(year, month, date);
            const sessionsForDay = sessions.filter(apt => isSameDay(new Date(apt.data_sessao.replace(/-/g, '\/')), dayDate));
            
            return (
              <div
                key={date}
                onClick={() => onDateClick(dayDate)}
                className="h-24 md:h-28 flex flex-col p-1 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 rounded-md cursor-pointer transition-colors"
              >
                <div className={cn("h-8 w-8 flex items-center justify-center rounded-full self-end md:self-auto", isToday(dayDate) ? "bg-blue-600 text-white" : "dark:text-slate-200")}>
                  {date}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {sessionsForDay.slice(0, 3).map(apt => (
                    <div key={apt.id} className={cn("w-2 h-2 rounded-full", 'bg-blue-500')}></div>
                  ))}
                  {sessionsForDay.length > 3 && (
                     <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}