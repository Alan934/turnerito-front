"use client";
import React from "react";
import useAuth from "@/app/utils/useAuth";
import LinkBtn from "@/components/RootComponents/LinkBtn";
import Image from "next/image";// yhug
const TipoRegistro = () => {
  useAuth();
  return (
    <div className="flex items-center justify-center bg-[#E4ECEC] h-screen p-10">
      <div className="flex flex-col items-center gap-4 w-96">
        <Image src={"/logo.png"} alt="Servicio" width={176} height={176} />
        <div className="text-base text-black font-semibold text-center leading-normal">
          Tus citas medicas, recetas, historial clinico y mas en un solo lugar
        </div>
        <div className="w-full flex flex-col items-center gap-4 ">
          <LinkBtn url={"/login"} texto={"Iniciar Sesion"} />
          <LinkBtn url={"/register"} texto={"Crear Cuenta"} />
        </div>
      </div>
    </div>
  );
};

export default TipoRegistro;
