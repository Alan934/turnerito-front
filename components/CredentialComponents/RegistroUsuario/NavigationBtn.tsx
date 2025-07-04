"use client";

interface Props {
  pageNumber: number;
  setPageNumber: React.Dispatch<React.SetStateAction<number>>;
  formRef: React.RefObject<any>;
}

export default function NavigationBtn({
  pageNumber,
  setPageNumber,
  formRef,
}: Props) {
  return (
    <div className="flex justify-around">
      <button
        className="btn bg-gray-500 text-white"
        disabled={pageNumber <= 1}
        onClick={() => {
          if (pageNumber > 1) {
            setPageNumber(pageNumber - 1);
          }
        }}
      >
        Atras
      </button>
      
      <button
        className={`btn bg-[#078B8C] text-white ${pageNumber >= 3 && "hidden"}`}
        disabled={pageNumber >= 3}
        onClick={() => {
          if (pageNumber < 3) {
            setPageNumber(pageNumber + 1);
          }
        }}
      >
        Siguiente
      </button>

      <button
        type="button"
        className={`btn bg-[#078B8C] text-white ${pageNumber <= 2 && "hidden"}`}
        disabled={pageNumber <= 1}
        onClick={() => {
          if (pageNumber === 3) {
            formRef.current?.submitForm();
          }
        }}
      >
        Registrarse
      </button>
    </div>
  );
}
