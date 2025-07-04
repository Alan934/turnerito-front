import AjustesButton from "./AjustesButton";
import LogoutButton from "./LogoutButton";

export default function AjustesContainer() {
  return (
    <div className="w-full h-screen flex flex-col justify-between bg-[#E4ECEC] text-black p-4">
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold py-2">Configura tu cuenta</h1>
        <div className="flex flex-col gap-4">
          <AjustesButton
            icono={"/user.svg"}
            titulo={"Perfil"}
            cuerpo={"Edita los datos básicos como tu información personal."}
            url={`/medico/ajustes/perfil`}
          />
          <AjustesButton
            icono={"/password.svg"}
            titulo={"Cambiar contraseña"}
            cuerpo={"Cambia tu contraseña."}
            url={`/medico/ajustes/password`}
          />
          <AjustesButton
            icono={"/ajustes.svg"}
            titulo={"Configuracion"}
            cuerpo={"Modifica turnos y horarios del Turnero."}
            url={`/medico/ajustes/turnero`}
          />
          <LogoutButton
            icono={"/logout.svg"}
            titulo={"Cerrar sesión"}
            cuerpo={"Cierra sesión de tu cuenta."}
          />
          
        </div>
      </div>
    </div>
  );
}
