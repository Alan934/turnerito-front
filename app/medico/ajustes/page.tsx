
import AjustesContainer from "@/components/Ajustes/AjustesContainer";
import HeaderPage from "@/components/PageComponents/HeaderPage";

export default function Page() {
  return (
    <div>
      <HeaderPage titulo={"Ajustes de cuenta"} urlRetorno="/medico" />
      <AjustesContainer />
    </div>
  );
}
