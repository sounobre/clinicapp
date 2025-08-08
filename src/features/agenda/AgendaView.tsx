import React, { type Dispatch, type SetStateAction } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import type { Appointment } from "../admin/schemas";


interface AgendaViewProps {
  appointments: Appointment[];
  onOpenModal: (date: Date, hour: string) => void;
  onOpenDetailsModal: (appointment: Appointment) => void;
  currentDate: Date;
  setCurrentDate: Dispatch<SetStateAction<Date>>;
}

export function AgendaView({
  appointments,
  onOpenModal,
  onOpenDetailsModal,
  currentDate,
  setCurrentDate,
}: AgendaViewProps) {
  const hours = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];
  const weekDays = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb","Dom"];

  const getWeekDays = (date: Date) => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);
    return Array.from({ length: 6 }).map((_, i) => {
      const weekDay = new Date(startOfWeek);
      weekDay.setDate(startOfWeek.getDate() + i);
      return weekDay;
    });
  };

  const week = getWeekDays(currentDate);

  const changeWeek = (amount: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + amount);
    setCurrentDate(newDate);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [year, month, day] = e.target.value.split("-").map(Number);
    setCurrentDate(new Date(year, month - 1, day));
  };

  return (
    // 1. O Card se torna um container flex que ocupa toda a altura disponível
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <CardTitle>Agenda Semanal</CardTitle>
            <CardDescription>
              Clique em um horário para agendar ou editar.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => changeWeek(-7)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="relative">
              <Input
                type="date"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                value={currentDate.toISOString().split("T")[0]}
                onChange={handleDateChange}
              />
              <Button variant="outline" className="w-48">
                <Calendar className="mr-2 h-4 w-4" />{" "}
                {currentDate.toLocaleDateString("pt-BR", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </Button>
            </div>
            <Button variant="outline" size="icon" onClick={() => changeWeek(7)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      {/* 2. O conteúdo do Card cresce para preencher o espaço e controla o scroll */}
      <CardContent className="p-0 flex-1 overflow-hidden">
        <div className="grid grid-cols-[minmax(60px,auto)_repeat(6,1fr)] border-t border-border">
          <div className="p-2 text-center border-b sm:border-b-0 sm:border-r border-border text-muted-foreground">
            Horas
          </div>
          {week.map((day, index) => (
            <div
              key={day.toISOString()}
              className="p-2 text-center border-b sm:border-b-0 sm:border-r border-border last:border-r-0"
            >
              <p className="font-semibold text-sm">{weekDays[index]}</p>
              <p className="text-xs text-muted-foreground">{day.getDate()}</p>
            </div>
          ))}
        </div>
        {/* 3. A grade interna agora ocupa 100% da altura do seu pai (CardContent) e rola internamente */}
        <div className="grid grid-cols-[minmax(60px,auto)_repeat(6,1fr)] h-full overflow-y-auto">
          <div className="border-r border-border">
            {hours.map((hour) => (
              <div
                key={hour}
                className="h-16 border-b border-border p-2 flex items-center justify-center text-sm text-muted-foreground"
              >
                {hour}
              </div>
            ))}
          </div>
          {week.map((day) => (
            <div
              key={day.toISOString()}
              className="border-r border-border last:border-r-0"
            >
              {hours.map((hour) => {
                const appointment = appointments.find(
                  (a) =>
                    new Date(a.date).toDateString() === day.toDateString() &&
                    a.hour === hour
                );
                return (
                  <div
                    key={`${day.toISOString()}-${hour}`}
                    className="h-16 border-b border-border p-1"
                  >
                    {appointment ? (
                      <button
                        onClick={() => onOpenDetailsModal(appointment)}
                        className="w-full h-full bg-primary/80 p-1 rounded-md text-center flex flex-col justify-center hover:bg-primary transition-colors"
                      >
                        <p className="font-bold text-xs text-primary-foreground truncate">
                          {appointment.clientName}
                        </p>
                        <p className="text-xs text-primary-foreground/80 truncate">
                          {appointment.serviceName}
                        </p>
                      </button>
                    ) : (
                      <button
                        onClick={() => onOpenModal(day, hour)}
                        className="w-full h-full text-left text-transparent hover:bg-accent/50 rounded-md transition-colors"
                      >
                        .
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

