import Link from "next/link";

interface Props {
  icono: string;
  titulo: string;
  cuerpo: string;
  url: string;
}

export default function AjustesButton({ icono, titulo, cuerpo, url }: Props) {
  return (
    <Link
      href={url}
      className="flex flex-row bg-white rounded-lg drop-shadow-lg w-full h-22"
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
    </Link>
  );
}
