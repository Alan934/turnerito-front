"use client";

import React, { use, useEffect, useState } from "react";
import CalendarioModal from "./CalendarioModal/CalendarioModal";
import Image from "next/image";
import CalendarioHorizontal from "./CalendarioHorizontal/CalendarioHorizontal";
import TurnoCard from "./TurnoCard/TurnoCard";
import TurnoRender from "./TurnoRender/TurnoRender";
import { Appointment } from "@/app/definitions/definitions";
import { useLazyGetPractitionerAppointmentQuery } from "@/app/redux/api/practitionerAppointment.api";
import AgendaSkeleton from "./AgendaSkeleton";
import VistaErrorGenerico from "../ErrorComponents/VistaErrorGenerico";
import { useSession } from "next-auth/react";
import {
  calcularIntervalos,
  filtrarTurnos,
  monthNames,
} from "@/app/utils/helperFunctions";

interface Props {
  turnos: Appointment[];
}

export default function AgendaPaciente({ turnos }: Props) {
  const { data: session } = useSession();
  const [trigger, { data: disponibilidad, isLoading, isError, isSuccess }] =
    useLazyGetPractitionerAppointmentQuery();

  useEffect(() => {
    const id = localStorage.getItem("MID") || session?.user?.id || "";
    trigger(id);
    if (localStorage.getItem("MID") == undefined && id !== "") {
      localStorage.setItem("MID", id); //Por si acaso guardamos el id en localStorage
    }
  }, [session]);

  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | Date>(new Date());

  const handleDateClick = () => {
    setShowCalendar(true);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setShowCalendar(false);
  };

  const handleCloseCalendar = () => {
    setShowCalendar(false);
  };
  const turnoFiltro = filtrarTurnos(turnos, selectedDate);

  if (isLoading) return <AgendaSkeleton />;
  if (isError)
    return (
      <VistaErrorGenerico
        titulo={"Error de agenda"}
        cuerpo={"Ocurrio un error al cargar la agenda, intentelo mas tarde"}
        tituloHeader={"Agenda Medico"}
      />
    );
  if (isSuccess) {
    // Calcular intervalos de tiempo
    // de 7 a 23 horas, con intervalos de 15 a 120 minutos maximo
    const intervalos: string[] = calcularIntervalos(
      7,
      23,
      disponibilidad[0]?.durationAppointment
    );
    return (
      <div className="flex flex-col h-screen overflow-hidden bg-[#E4ECEC] text-black">
        <div className="flex items-center justify-between font-bold p-4">
          <div className="flex items-center justify-center flex-grow">
            <div>
              <Image src="/logo.png" alt="Logo" width={75} height={75} />
            </div>

            <div
              className="flex cursor-pointer text-xl gap-2"
              onClick={handleDateClick}
            >
              {monthNames[selectedDate?.getMonth() || 0]},{" "}
              {selectedDate?.getDate()}
              <Image src="/arrow-down2.svg" alt="Logo" width={15} height={15} />
            </div>
          </div>


        </div>

        <div>
          <CalendarioHorizontal
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            disponibilidad={disponibilidad}
          />
        </div>

        <div className="flex-grow overflow-y-auto p-4 relative">
          {intervalos.map((interval, index) => (
            <div
              key={index}
              className="h-12 border-b border-gray-400 flex items-center px-2"
            >
              {interval}
            </div>
          ))}

          {intervalos.map((interval, index) => (
            <TurnoCard
              key={index}
              index={index}
              fechaTurno={selectedDate}
              horaTurno={interval}
              disponibilidad={disponibilidad}
            />
          ))}

          {turnoFiltro.map((turno, index) => (
            <TurnoRender
              key={turno.id || index}
              turno={turno}
              disponibilidad={disponibilidad}
            />
          ))}
        </div>

        {showCalendar && (
          <CalendarioModal
            onSelectDate={handleDateSelect}
            initialDate={selectedDate || new Date()}
            onClose={handleCloseCalendar}
            disponibilidad={disponibilidad}
          />
        )}
      </div>
    );
  }
}
