"use client";

import {
  practitionerAPI,
  useGetOnePractitionerQuery,
} from "@/app/redux/api/practitioner.api";
import CambioForm from "@/components/CambioDatos/CambioForm";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Page() {
  const { data: session } = useSession();
  const [trigger, { data: practitioner, isLoading, isError, isSuccess }] =
    practitionerAPI.endpoints.getOnePractitioner.useLazyQuery();

  useEffect(() => {
    const id = session?.user.id || "";
    trigger(id);
  }, []);

  if (isLoading) {
    return <div>Cargando...</div>;
  }
  if (isError) {
    return <div>Error al cargar los datos del médico</div>;
  }
  if (isSuccess) {
    return (
      <div>
        <CambioForm practitioner={practitioner}/>
      </div>
    );
  }
}
