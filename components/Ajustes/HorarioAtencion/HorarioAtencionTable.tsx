import { PractitionerAppointment } from "@/app/definitions/definitions";
import { SetStateAction } from "react";

interface Props {
  practitionerAppointments: PractitionerAppointment[];
  setModify: React.Dispatch<SetStateAction<boolean>>;
}

export default function HorarioAtencionTable({
  practitionerAppointments,
  setModify,
}: Props) {
  return (
    <div className="overflow-x-auto space-y-2 rounded-box border border-base-content/5 bg-base-100">
      <table className="table">
        <thead className="text-black">
          <tr>
            <th>Dia</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
          </tr>
        </thead>
        <tbody>
          {practitionerAppointments.map((item, index) => (
            <tr key={index}>
              <td>{item.day}</td>
              <td>{item.startHour}</td>
              <td>{item.endHour}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-col justify-center p-2 space-y-2">
       <div className="flex flex-row justify-around items-center">
        <span className="font-medium text-gray-700">Duracion del turno</span>
        <div>
          <span className="btn border-2 bg-inherit font-normal text-lg text-gray-500">
            {practitionerAppointments[0].durationAppointment} minutos
          </span>
        </div>
      </div>
        <button
          onClick={() => setModify(true)}
          className="btn bg-[#078B8C] text-white"
        >
          Modificar Horarios
        </button>
      </div>
    </div>
  );
}
