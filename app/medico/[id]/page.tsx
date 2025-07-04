"use client";
import { useGetOneAppointmentQuery } from "@/app/redux/api/appointment.api";
import VistaErrorGenerico from "@/components/ErrorComponents/VistaErrorGenerico";
import HeaderPage from "@/components/Turnero/HeaderPage";
import { use } from "react";
import { useSession } from "next-auth/react";
import DetalleTurnoContainer from "@/components/DetalleTurno/DetalleTurnoContainer";
import DetalleTurnoSkeleton from "@/components/Skeletons/DetalleTurnoSkeleton";

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { data: session } = useSession();
  const { id } = use(params);
  const {
    data: appointment,
    isLoading,
    isError,
    isSuccess,
  } = useGetOneAppointmentQuery(id);

  if (isLoading) {
    return (
      <div className="text-black">
        <HeaderPage titulo="Detalle Turno" />
        <div className="px-3"></div>
        <DetalleTurnoSkeleton />
      </div>
    );
  }
  if (isError)
    return (
      <VistaErrorGenerico
        titulo={"Error al cargar el turno"}
        cuerpo={
          "Ocurrio un error al cargar el detalle turno, intentelo mas tarde"
        }
        tituloHeader={"Detalle Turno"}
      />
    );
  if (isSuccess) {
    return (
      <div className="w-full h-screen text-black overflow-auto">
        <HeaderPage
          titulo={"Detalle Turno"}
          urlRetorno={session ? "/medico" : "/turnero/agenda"}
        />
        <DetalleTurnoContainer appointment={appointment} session={session} />
      </div>
    );
  }
}
