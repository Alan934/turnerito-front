"use client";
import { PractitionerAppointment } from "@/app/definitions/definitions";
import { isHorarioAtencionActivo } from "@/app/utils/helperFunctions";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

interface TurnoCardProps {
  index: number;
  fechaTurno: Date;
  horaTurno: string;
  disponibilidad: PractitionerAppointment[];
}

const TurnoCard: React.FC<TurnoCardProps> = ({
  index,
  fechaTurno,
  horaTurno,
  disponibilidad,
}) => {
  const { data: session } = useSession();

  const blockHeight = 48;
  const top = index * blockHeight;
  const router = useRouter();

  const handleClick = () => {
    if (!isHorarioAtencionActivo(horaTurno, disponibilidad, fechaTurno)) {
      return;
    }
    localStorage.setItem("fechaTurno", fechaTurno.toISOString().split("T")[0]);
    localStorage.setItem("horaTurno", horaTurno);
    if (session) {
      router.push(`/medico/crearTurno`);
    } else {
      router.push(`/turnero/nuevoTurno`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`absolute left-0 w-full border-b border-black cursor-pointer ${
        isHorarioAtencionActivo(horaTurno, disponibilidad, fechaTurno)
          ? "bg-blue-400 hover:bg-blue-600"
          : "bg-gray-400 opacity-50 cursor-not-allowed"
      }`}
      style={{
        top: `${top + 16}px`,
        height: `${blockHeight}px`,
        transform: "translateX(70px)",
      }}
    >
      <p className="font-bold text-black mt-1 ml-20 p-2 absolute inline-block">
        {isHorarioAtencionActivo(horaTurno, disponibilidad, fechaTurno)
          ? "Disponible"
          : "No Disponible"}
      </p>
    </div>
  );
};

export default TurnoCard;
