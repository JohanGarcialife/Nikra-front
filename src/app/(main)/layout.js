import { Montserrat } from "next/font/google";
import "../globals.css";
import ParallaxLayout from "./_components/ParallaxLayout";
// import { useEffect, useState } from "react";
import useAuthStore from "@/store/auth";
import apiClient from "@/lib/axios";
// import { useRouter } from "next/navigation";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
   title: "CCA Ceuta App",
  description: "CCA Ceuta App para comercios asociados",
};

export default function RootLayout({ children }) {
  // const { user, login, logout } = useAuthStore();
  // const [loading, setLoading] = useState(true);
  // const router = useRouter();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       // Asumimos que el backend tiene un endpoint para obtener el perfil del usuario
  //               const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`;
  //       const response = await apiClient.get(url);
        
  //       if (response.data) {
  //         login(response.data); // Re-hidrata el store con los datos del usuario
  //       } else {
  //         throw new Error("No user data received");
  //       }
  //     } catch (error) {
  //       console.error("Session validation failed:", error);
  //       logout(); // Limpia el store de Zustand
  //       document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Limpia la cookie
  //       router.push("/login"); // Redirige al login
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   if (!user) {
  //     fetchUser();
  //   } else {
  //     setLoading(false);
  //   }
  // }, [user, login, logout, router]);

 

  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <ParallaxLayout>
          {children}
        </ParallaxLayout>
      </body>
    </html>
  );
}