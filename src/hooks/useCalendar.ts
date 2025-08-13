// Caminho: src/hooks/useCalendar.ts
import { useState } from 'react';

export const useCalendar = (initialView: 'monthly' | 'weekly' | 'daily' = 'monthly') => {
    const [currentDate, setCurrentDate] = useState(new Date()); // Usa a data atual
    const [view, setView] = useState(initialView);
    
    const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const daysOfWeek = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    const changeDate = (amount: number, unit: 'day' | 'week' | 'month') => {
        const newDate = new Date(currentDate);
        if (unit === 'day') newDate.setDate(newDate.getDate() + amount);
        if (unit === 'week') newDate.setDate(newDate.getDate() + amount * 7);
        if (unit === 'month') newDate.setMonth(newDate.getMonth() + amount);
        setCurrentDate(newDate);
    };

    const setDate = (date: Date) => setCurrentDate(date);

    const isSameDay = (d1: Date, d2: Date) => 
        d1.getFullYear() === d2.getFullYear() && 
        d1.getMonth() === d2.getMonth() && 
        d1.getDate() === d2.getDate();

    const isToday = (date: Date) => isSameDay(date, new Date());

    return { currentDate, view, setView, monthNames, daysOfWeek, changeDate, setDate, isToday, isSameDay };
};