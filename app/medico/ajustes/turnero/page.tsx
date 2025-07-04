"use client";
import { useLazyGetPractitionerAppointmentQuery } from "@/app/redux/api/practitionerAppointment.api";
import { useLazyGetAllPractitionerSocialWorksQuery } from "@/app/redux/api/practitionerSocialWork.api";
import HorarioAtencionContainer from "@/components/Ajustes/HorarioAtencion/HorarioAtencionContainer";
import ObraSocialContainer from "@/components/Ajustes/ObraSocial/ObraSocialContainer";
import VistaErrorGenerico from "@/components/ErrorComponents/VistaErrorGenerico";
import HeaderPage from "@/components/PageComponents/HeaderPage";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Page() {
  const { data: session } = useSession();
  ////////////////////////////////////////////
  const [
    trigger,
    { data: practitionerAppointment, isLoading, isError, isSuccess },
  ] = useLazyGetPractitionerAppointmentQuery();
  const [
    triggerObraSocial,
    {
      data: practitionerSocialWork,
      isLoading: isLoadingObraSocial,
      isError: isErrorObraSocial,
      isSuccess: isSuccessObraSocial,
    },
  ] = useLazyGetAllPractitionerSocialWorksQuery();
  ////////////////////////////////////////////
  useEffect(() => {
    const id: string = localStorage.getItem("MID") || session?.user.id || "";
    const token: string = session?.user.accessToken || "";
    trigger(id);
    triggerObraSocial({id, token});
    if (localStorage.getItem("MID") == undefined && id !== "") {
      localStorage.setItem("MID", id); //Por si acaso guardamos el id en localStorage
    }
  }, [session]);

  if (isLoading || isLoadingObraSocial) {
    return <div>Cargando...</div>;
  }
  if (isError || isErrorObraSocial) {
    return (
      <VistaErrorGenerico
        titulo={"Error de configuracion"}
        cuerpo={"Error al cargar la configuracion"}
        tituloHeader={"Configuracion del Turnero"}
      />
    );
  }
  if (isSuccess && isSuccessObraSocial) {
    return (
      <div>
        <HeaderPage
          titulo={"Configuración del Turnero"}
          urlRetorno="/medico/ajustes"
        />
        <HorarioAtencionContainer
          practitionerAppointments={practitionerAppointment}
        />
        <ObraSocialContainer practitionerSocialWork={practitionerSocialWork.data}/>
      </div>
    );
  }
}
