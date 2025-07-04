import { Appointment } from "@/app/definitions/definitions";
import { Session } from "next-auth";
import DatosPaciente from "./DatosPaciente";
import DatosProfesional from "./DatosProfesional";
import DatosTurno from "./DatosTurno";
import BotonesDetalleTurno from "./BotonesDetalleTurno";
import ModalConfirmacionTurno from "../ModalConfirmacionTurno/ModalConfirmacionTurno";

interface Props {
  appointment: Appointment;
  session: Session | null;
}

export default function DetalleTurnoContainer({ appointment, session }: Props) {
  return (
    <div>
      <div className="p-3 space-y-4">
        <h1 className="font-bold text-2xl my-4 text-black">
          Detalle del Turno
        </h1>
        {session ? (
          <div>
            <DatosPaciente patient={appointment.patient} />
          </div>
        ) : (
          <div>
            <DatosProfesional practitioner={appointment.practitioners[0]} />
          </div>
        )}

        <DatosTurno
          fechaTurno={appointment.date}
          horaTurno={appointment.hour}
          direccion={"Avenida San Martin 1243"}
          estado={appointment.status}
        />
        <BotonesDetalleTurno appointment={appointment} session={session} />
      </div>

      <ModalConfirmacionTurno
        nombre={`${appointment.practitioners[0].name} ${appointment.practitioners[0].lastName}`}
        fecha={appointment.date}
        hora={appointment.hour}
      />
    </div>
  );
}
