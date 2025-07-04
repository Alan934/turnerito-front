"use client";
import useAuth from "@/app/utils/useAuth";
import { usePathname } from "next/navigation";

export default function FooterMedico() {
  const pathname = usePathname();
  useAuth();
  // useAuth is a custom hook that checks if the user is authenticated
  return (
    <footer className="dock dock-md text-black border-t border-gray-500">
      <a
        href="/medico"
        className={
          pathname.startsWith("/medico")
            ? "dock-active font-bold"
            : "dock"
        }
      >
        <img src="/agenda.svg" alt="Agenda" className="w-6 h-6" />
        <span className="dock-label">Agenda</span>
      </a>
      
      <a
        href="/medico/ajustes"
        className={
          pathname.startsWith("/medico/ajustes")
            ? "dock-active font-bold"
            : "dock"
        }
      >
        <img src="/ajustes.svg" alt="ajustes" className="w-6 h-6" />
        <span className="dock-label text-black">Ajustes</span>
      </a>
    </footer>
  );
} 