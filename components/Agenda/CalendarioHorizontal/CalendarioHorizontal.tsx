import { PractitionerAppointment } from "@/app/definitions/definitions";
import React, { useEffect, useState } from "react";

interface CalendarioProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  disponibilidad: PractitionerAppointment[];
}

const CalendarioHorizontal: React.FC<CalendarioProps> = ({
  selectedDate,
  onDateSelect,
  disponibilidad
}) => {
  const [days, setDays] = useState<Date[]>([]);

  const dayMap: Record<string, string> = {
    monday: "lunes",
    tuesday: "martes",
    wednesday: "miércoles",
    thursday: "jueves",
    friday: "viernes",
    saturday: "sábado",
    sunday: "domingo",
  };

  useEffect(() => {
    const currentMonth = selectedDate.getMonth();
    const year = selectedDate.getFullYear();
    const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
    const datesArray = Array.from(
      { length: daysInMonth },
      (_, i) => new Date(year, currentMonth, i + 1)
    );
    setDays(datesArray);
  }, [selectedDate]);

  const isDayAvailable = (day: Date): boolean => {
    const today = new Date();
    if (day < today) {
      return false;
    }

    const horariosVacios = disponibilidad.every(
      (d) => !d.startHour || !d.endHour
    );

    if (horariosVacios) {
      return true;
    }

    const dayOfWeek = day
      .toLocaleString("es-ES", { weekday: "long" })
      .toLowerCase();
    return disponibilidad.some(
      (d) => dayMap[d.day.toLowerCase()] === dayOfWeek
    );
  };

  const handleDayClick = (day: Date) => {
    if (isDayAvailable(day)) {
      onDateSelect(day);
    }
  };

  return (
    <div className="flex overflow-x-auto mb-1">
      {days.map((day) => (
        <div
          key={day.toDateString()}
          className="flex flex-col items-center cursor-pointer p-1"
          onClick={() => handleDayClick(day)}
        >
          <span>
            {day
              .toLocaleDateString("es-ES", { weekday: "short" })
              .charAt(0)
              .toUpperCase() +
              day.toLocaleDateString("es-ES", { weekday: "short" }).slice(1)}
          </span>
          <span
            className={`rounded-full flex items-center justify-center ${
              day.toDateString() === selectedDate.toDateString()
                ? "bg-[#078B8C] text-white w-8 h-8 -mt-1"
                : isDayAvailable(day)
                ? "bg-[#6DB52A] w-6 h-6"
                : "cursor-not-allowed w-6 h-6"
            }`}
          >
            {day.getDate()}
          </span>
        </div>
      ))}
    </div>
  );
};

export default CalendarioHorizontal;