import FooterMedico from "@/components/FooterNavegacion/FooterMedico";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-[#E4ECEC] flex flex-col min-h-screen pb-16
    ">
      <main>{children}</main>
      <FooterMedico />
    </div>
  );
}