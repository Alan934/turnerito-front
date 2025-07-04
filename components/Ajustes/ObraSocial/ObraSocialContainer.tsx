"use client";
import { useState } from "react";
import ObraSocialTable from "./ObraSocialTable";
import ObraSocialEdit from "./ObraSocialEdit";
import { PractitionerSocialWork } from "@/app/definitions/definitions";

interface Props {
  practitionerSocialWork: PractitionerSocialWork[];
}

export default function ObraSocialContainer({ practitionerSocialWork }: Props) {
  const [modifyFlag, setModifyFlag] = useState<boolean>(false);
  return (
    <div className="text-black bg-[#E4ECEC] p-3">
      {!modifyFlag ? (
        <ObraSocialTable
          setModify={setModifyFlag}
          practitionerSocialWork={practitionerSocialWork}
        />
      ) : (
        <ObraSocialEdit
          setModify={setModifyFlag}
          practitionerSocialWork={practitionerSocialWork}
        />
      )}
    </div>
  );
}
