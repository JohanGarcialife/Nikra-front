'use client'
import Image from "next/image";
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
      <div className="aboslute z-20">
    <div className="font-sans  items-center justify-items-center min-h-screen p-8 pb-20  sm:py-20 relative">

      <BoxCampaing src={"/Image.png"}/>
      <MainMenuBar images={[
        {src: "/Vector(1).svg", alt: "Error", foot: "Tarjeta"},
        {src: "/bi_qr-code-scan.svg", alt: "Error", foot: "Registrar"},
        {src: "/Vector(3).svg", alt: "Error", foot: "Comercios",},
        ]}/>
      <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
        Logout
      </button>
      </div>

    </div>
  );
}