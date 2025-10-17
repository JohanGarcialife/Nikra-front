'use client'
import useAuthStore from "../../../store/auth";
import { useRouter } from "next/navigation";
import BoxCampaing from "./_components/BoxCampaing";
import MainMenuBar from "./_components/MainMenuBar";

export default function Home() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
      <div className="aboslute z-20 min-h-screen">
    <div className="font-sans  items-center justify-items-center min-h-screen p-2 pb-20  sm:py-20 relative">
      <div className="flex flex-row items-center  gap-1 mb-10">
<div onClick={handleLogout} className=" bg-[#133D74] p-3 shadow rounded text-white">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 20l-3 -8l3 -8" /></svg>
        </div>
<h2 className="text-[#133D74] font-bold text-xl w-full text-center">Centro Comercial Abierto de Ceuta</h2>
      </div>
      <BoxCampaing src={"/Image.png"}/>
     <div className="mt-10 w-full">
       <MainMenuBar images={[
        {src: "/Vector(4).svg", alt: "Error", foot: "bases", route: "/contacto"},
        {src: "/bi_qr-code-scan.png", alt: "Error", foot: "Registrar"},
        {src: "/Vector(3).svg", alt: "Error", foot: "Comercios", route: "/businesses"},
        ]}/>
      </div>
     
      </div>
 
    </div>
  );
}