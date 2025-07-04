"use client";
import { signOut } from "next-auth/react";

interface Props {
  icono: string;
  titulo: string;
  cuerpo: string;
}

export default function LogoutButton({ icono, titulo, cuerpo }: Props) {
  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="flex flex-row bg-white rounded-lg drop-shadow-lg w-full h-22 appearance-none border-0 p-0 text-left"
      // Quita los estilos por defecto del botón
      style={{ WebkitAppearance: "none", MozAppearance: "none", appearance: "none" }}
    >
      <div className="flex justify-around items-center w-full p-2">
        <div className="flex justify-center items-center rounded-full w-[55px] h-[55px] bg-[#A4D4D4]">
          <img src={icono} alt="icono" className="w-[28px] h-[28px]" />
        </div>
        <div className="flex flex-col w-2/3">
          <span className="text-black font-bold text-lg">{titulo}</span>
          <p className="text-[#4C4C4C] text-[14px]">{cuerpo}</p>
        </div>
      </div>
      <div className="bg-[#A4D4D4] px-4 rounded-r-lg">
        <div className="flex justify-center items-center w-full h-full">
          <img src="/arrow-right.svg" alt="arrow" className="w-6 h-6" />
        </div>
      </div>
    </button>
  );
}