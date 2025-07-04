import { PractitionerSocialWork } from "@/app/definitions/definitions";
import { SetStateAction } from "react";

interface Props {
  setModify: React.Dispatch<SetStateAction<boolean>>;
  practitionerSocialWork: PractitionerSocialWork[];
}

export default function ObraSocialTable({
  setModify,
  practitionerSocialWork,
}: Props) {
  return (
    <div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black">Precios de Atencion</h1>
        <p className="text-gray-600">
          Lista de precios de atencion y coseguro.
        </p>
      </div>
      <div className="rounded-box border border-base-content/5 bg-base-100">
        <div
          className={
            practitionerSocialWork.length > 6 ? "overflow-y-auto h-75" : ""
          }
        >
          <table className="table">
            {/* Cabecera */}
            <thead className="text-black sticky top-0 bg-white">
              <tr>
                <th>Obra Social</th>
                <th>Precio</th>
              </tr>
            </thead>
            <tbody>
              {/* Filas*/}
              {practitionerSocialWork.map((socialWork) => (
                <tr key={socialWork.id}>
                  <td>{socialWork.socialWork.name}</td>
                  <td>${socialWork.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col justify-center p-2">
          <button
            onClick={() => setModify(true)}
            className="btn bg-[#078B8C] text-white"
          >
            Modificar Precios
          </button>
        </div>
      </div>
    </div>
  );
}
