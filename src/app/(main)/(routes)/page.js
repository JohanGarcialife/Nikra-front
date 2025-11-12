"use client";
import useAuthStore from "../../../store/auth";
import { useRouter } from "next/navigation";
import BoxCampaing from "./_components/BoxCampaing";
import MainMenuBar from "./_components/MainMenuBar";
import Image from "next/image";
import apiClient from "@/lib/axios";
import { useEffect, useRef, useState } from "react";

const PER_PAGE = 10;

export default function Home() {
  const { user, login, logout } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // paginación / scroll infinito
  const [allCampaigns, setAllCampaigns] = useState([]); // datos completos
  const [campaigns, setCampaigns] = useState([]); // visibles (paginados)
  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [campaignsError, setCampaignsError] = useState(null);

  const sentinelRef = useRef(null);
  const loadingRef = useRef(loadingCampaigns);
  useEffect(() => {
    loadingRef.current = loadingCampaigns;
  }, [loadingCampaigns]);

  const allRef = useRef(allCampaigns);
  useEffect(() => {
    allRef.current = allCampaigns;
  }, [allCampaigns]);

  const scrollContainerRef = useRef(null);
  const headerRef = useRef(null);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      setLoadingCampaigns(true);
      setCampaignsError(null);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
        if (!apiUrl) throw new Error("NEXT_PUBLIC_API_URL no está configurada");
        const res = await apiClient.get(`${apiUrl}/api/campaigns/active`);
        const data = Array.isArray(res.data) ? res.data : [];
        setAllCampaigns(data);
        setCampaigns(data.slice(0, PER_PAGE));
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setCampaignsError(err);
      } finally {
        setLoadingCampaigns(false);
      }
    };

    fetchCampaigns();
  }, []);

  // carga más usando refs para evitar dependencias en efectos
  const loadMore = () => {
    if (loadingRef.current) return;
    if (campaigns.length >= allRef.current.length) return;

    setLoadingCampaigns(true);
    setTimeout(() => {
      setCampaigns((prev) => {
        const start = prev.length;
        const next = allRef.current.slice(start, start + PER_PAGE);
        return [...prev, ...next];
      });
      setLoadingCampaigns(false);
    }, 350);
  };

  // observer sobre el sentinel; root será el contenedor scrollable si existe
  useEffect(() => {
    const rootEl = scrollContainerRef.current || null;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) loadMore();
        });
      },
      { root: rootEl, rootMargin: "400px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentinelRef.current, scrollContainerRef.current]);

  // Si el contenedor no es scrollable, forzamos cargas hasta llenarlo
  useEffect(() => {
    const tryFillUntilScrollable = () => {
      const el = scrollContainerRef.current;
      if (!el) return;
      // Verificamos si hay scroll disponible
      const hasScroll = el.scrollHeight > el.clientHeight;
      if (
        !hasScroll &&
        campaigns.length < allCampaigns.length &&
        !loadingCampaigns
      ) {
        loadMore();
      }
    };
    const t = setTimeout(tryFillUntilScrollable, 150);
    window.addEventListener("resize", tryFillUntilScrollable);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", tryFillUntilScrollable);
    };
  }, [campaigns, loadingCampaigns, allCampaigns.length]);

  // Ya no necesitamos calcular maxHeight manualmente, flex-1 se encarga de eso

  const handleLogout = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
      if (apiUrl) {
        await apiClient.post(`${apiUrl}/api/auth/logout`, {});
      }
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      logout();
      document.cookie =
        "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/login");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Asumimos que el backend tiene un endpoint para obtener el perfil del usuario
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`;
        const response = await apiClient.get(url);

        if (response.data) {
          login(response.data); // Re-hidrata el store con los datos del usuario
        } else {
          throw new Error("No user data received");
        }
      } catch (error) {
        console.error("Session validation failed:", error);
        logout(); // Limpia el store de Zustand
        document.cookie =
          "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Limpia la cookie
        router.push("/login"); // Redirige al login
      } finally {
        setLoading(false);
      }
    };

    if (!user) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, [user, login, logout, router]);

  return (
    <div className="fixed inset-0 z-20 overflow-hidden">
      <div className="font-sans h-full w-full flex flex-col">
        {/* HEADER (siempre visible) */}
        <div
          ref={headerRef}
          className="w-full z-30 bg-transparent flex-shrink-0 px-2 pt-2"
        >
          <div className="flex flex-row w-full justify-between items-center gap-1 mb-4">
            <div
              onClick={handleLogout}
              className=" bg-[#133D74] p-3 shadow rounded text-white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-left"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M13 20l-3 -8l3 -8" />
              </svg>
            </div>
            <Image
              width={120}
              height={180}
              src={`/CCA-800X600-(2).png`}
              alt="Logo"
            />
            <div />
          </div>
        </div>

        {/* CONTENIDO SCROLLABLE (campaings + lista) */}
        <div
          ref={scrollContainerRef}
          id="campaign-scroll"
          className="overflow-y-auto flex-1 w-full px-2"
          style={{
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
        >
          <div className="mt-10 w-full">
            {/* MainMenuBar dejado fuera del scroll (ver abajo) */}
          </div>

          {/* Lista de campañas (visible, paginada) */}
          <div className="mt-4 space-y-4 pb-32">
            {campaigns.map((camp, idx) => (
              <BoxCampaing
                key={camp.id ?? idx}
                src={`${process.env.NEXT_PUBLIC_API_URL}/api/upload/campaign/${camp.imagenUrl}`}
                campaigns={campaigns}
              />
            ))}
            {/* sentinel para scroll infinito */}
            <div ref={sentinelRef} style={{ height: 1 }} />
            {loadingCampaigns && (
              <div className="text-center p-3">Cargando...</div>
            )}
            {!loadingCampaigns &&
              campaigns.length >= allCampaigns.length &&
              allCampaigns.length > 0 && (
                <div className="text-center text-sm text-gray-500 py-4">
                  No hay más campañas
                </div>
              )}
          </div>
        </div>

        {/* estilos para ocultar scrollbar */}
        <style jsx>{`
          /* Chrome, Safari, Edge, Opera */
          #campaign-scroll::-webkit-scrollbar {
            display: none;
          }
          /* Firefox */
          #campaign-scroll {
            scrollbar-width: none;
            -ms-overflow-style: none;
          }
        `}</style>

        {/* MAIN MENU (siempre visible) */}
        <div
          ref={menuRef}
          className="fixed bottom-0 left-0 right-0 z-40 bg-transparent p-3 "
        >
          <MainMenuBar
            images={[
              {
                src: "/Vector(4).svg",
                alt: "Error",
                foot: "bases",
                route: "/contacto",
              },
              { src: "/bi_qr-code-scan.png", alt: "Error", foot: "Registrar" },
              {
                src: "/Vector(3).svg",
                alt: "Error",
                foot: "Comercios",
                route: "/businesses",
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
}
