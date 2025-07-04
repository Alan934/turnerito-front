"use client";
import { SetStateAction, useState } from "react";
import AddButton from "./AddButton";
import DeleteButton from "./DeleteButton";
import ObraSocialModal from "./ObraSocialModal";
import { PractitionerSocialWork } from "@/app/definitions/definitions";
import Image from "next/image";

interface Props {
  setModify: React.Dispatch<SetStateAction<boolean>>;
  practitionerSocialWork: PractitionerSocialWork[];
}

export default function ObraSocialEdit({
  setModify,
  practitionerSocialWork,
}: Props) {
  const [editPractitionerSocialWork, setEditPractitionerSocialWork] =
    useState<PractitionerSocialWork | null>(null);
  return (
    <div>
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black">Modificar Obra Social</h1>
        <p className="text-gray-600">
          Modifica el precio de atencion y coseguro.
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
                <th>Accion</th>
              </tr>
            </thead>
            <tbody>
              {/* Filas*/}
              {practitionerSocialWork.map((data) => (
                <tr key={data.id}>
                  <td>{data.socialWork.name}</td>
                  <td>${data.price}</td>
                  <td>
                    <div className="flex flex-row justify-around items-center">
                      <button
                        onClick={() => {
                          setEditPractitionerSocialWork(data);
                          const modal = document.getElementById(
                            "obraSocialModal"
                          ) as HTMLDialogElement;
                          modal.showModal();
                        }}
                        className="btn p-3 bg-inherit"
                      >
                        <Image
                          src="/edit.svg"
                          alt="edit"
                          width={15}
                          height={15}
                        />
                      </button>
                      <DeleteButton practitionerSocialWorkId={data.id} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center p-2">
          <button
            onClick={() => setModify(false)}
            className="btn rounded-lg text-[#48a7a8] border-2 border-[#48a7a8]"
          >
            Cancelar
          </button>
          <AddButton setPractitionerEdit={setEditPractitionerSocialWork} />
        </div>
      </div>

      <ObraSocialModal editData={editPractitionerSocialWork} />
    </div>
  );
}
