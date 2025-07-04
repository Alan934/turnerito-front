import SnackbarDatos from "../Historial/SnackbarDatos";
import TurnoStatus from "./TurnoStatus";

interface Props {
  fechaTurno: string;
  horaTurno: string;
  direccion: string;
  estado: string;
}

function corregirFecha(fecha?: string) {
  if (!fecha || !fecha.includes("-")) {
    return "";
  }

  const fechaArray = fecha.split("-");
  return `${fechaArray[2]}/${fechaArray[1]}/${fechaArray[0]}`;
}

const DatosTurno: React.FC<Props> = ({
  fechaTurno,
  horaTurno,
  direccion,
  estado,
}) => {
  return (
    <div className="text-black flex flex-col space-y-4">
      <h2 className="text-xl font-medium">Datos del Turno</h2>
      <SnackbarDatos
        titulo="Fecha"
        cuerpo={corregirFecha(fechaTurno)}
      />
      <SnackbarDatos titulo="Hora" cuerpo={horaTurno} />
      <SnackbarDatos titulo="Dirección" cuerpo={direccion} />
      <TurnoStatus status={estado} />
    </div>
  );
};

export default DatosTurno;