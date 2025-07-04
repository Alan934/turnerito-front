"use client";
import { PractitionerAppointment } from "@/app/definitions/definitions";
import HorarioAtencionForm from "./HorarioAtencionForm";
import { useState } from "react";
import HorarioAtencionTable from "./HorarioAtencionTable";

interface Props {
  practitionerAppointments: PractitionerAppointment[];
}

export default function HoraAtencionContainer({
  practitionerAppointments,
}: Props) {
  const [modifyFlag, setModifyFlag] = useState<boolean>(false);
  return (
    <div className="text-black bg-[#E4ECEC] p-3">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black">Horario de atención</h1>
        <p className="text-gray-600">
          Lista de horarios de atención de tu consultorio.
        </p>
      </div>
      {!modifyFlag ? (
        <HorarioAtencionTable
          practitionerAppointments={practitionerAppointments}
          setModify={setModifyFlag}
        />
      ) : (
        <HorarioAtencionForm setModify={setModifyFlag} practitionerAppointments={practitionerAppointments}/>
      )}
    </div>
  );
}
