"use client";

import React, { useState, useEffect, useRef } from "react";
import Business from "./_components/Business";
import useAuthStore from "@/store/auth";
import { useRouter } from "next/navigation";
import Image from "next/image";

const PER_PAGE = 10;

export default function Businesses() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [businesses, setBusinesses] = useState([]); // items visibles (paginados)
  const [allItems, setAllItems] = useState([]); // datos completos (fallback desde JSON)
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef(null);

  const loadingRef = useRef(loading);
  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  const allItemsRef = useRef(allItems);
  useEffect(() => {
    allItemsRef.current = allItems;
  }, [allItems]);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || ""; // usa la URL desde .env (NEXT_PUBLIC_API_URL)
  // Fetch inicial de /api/associates usando la URL del .env, incluyendo token desde cookies en Authorization header
  useEffect(() => {
    let mounted = true;

    const getCookie = (name) => {
      if (typeof document === "undefined") return "";
      const match = document.cookie.match(
        new RegExp("(^|; )" + name + "=([^;]+)")
      );
      return match ? decodeURIComponent(match[2]) : "";
    };

    const fetchAssociates = async () => {
      try {
        const url = `${API_URL}/api/associates`;

        // intentamos obtener token desde cookies o desde el user del store como fallback
        const token =
          getCookie("token") ||
          getCookie("access_token") ||
          getCookie("auth_token") ||
          (user && (user.token || user.access_token || user.auth_token)) ||
          "";

        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        const res = await fetch(url, { headers });
        if (!res.ok) {
          console.warn("Error fetching associates:", res.status);
          return;
        }
        const data = await res.json();
        console.log(data);

        const associates = data.associates || data;
        if (mounted && Array.isArray(associates)) {
          setAllItems(associates);
          setBusinesses(associates.slice(0, PER_PAGE));
        }
      } catch (err) {
        console.warn("Fetch associates failed:", err);
      }
    };
    fetchAssociates();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // solo al montar

  // loadMore usa refs para leer estado actual y setState funcional para evitar dependencias innecesarias
  const loadMore = () => {
    if (loadingRef.current) return;
    // si ya cargamos todo, no hacer nada
    if (businesses.length >= allItemsRef.current.length) return;

    setLoading(true);
    // simulamos latencia; se puede reemplazar por paginado real
    setTimeout(() => {
      setBusinesses((prev) => {
        const start = prev.length;
        const next = allItemsRef.current.slice(start, start + PER_PAGE);
        return [...prev, ...next];
      });
      setLoading(false);
    }, 400);
  };

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) loadMore();
        });
      },
      { root: null, rootMargin: "400px", threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // se monta una vez; loadMore usa refs para evitar dependencias

  // Si la página no tiene suficiente contenido para hacer scroll, forzamos más cargas
  useEffect(() => {
    const tryFillUntilScrollable = () => {
      if (typeof window === "undefined") return;
      if (
        document.documentElement.scrollHeight <= window.innerHeight &&
        businesses.length < allItems.length &&
        !loading
      ) {
        loadMore();
      }
    };
    const t = setTimeout(tryFillUntilScrollable, 100);
    window.addEventListener("resize", tryFillUntilScrollable);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", tryFillUntilScrollable);
    };
  }, [businesses, loading, allItems.length]);

  return (
    <div>
      <div className="flex flex-row w-full justify-between items-center  gap-1 mb-10">
        <div
          onClick={() => router.back()}
          className=" bg-primary p-3 shadow rounded text-white"
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

      {businesses.map((business, index) => (
        <Business key={index} business={business} />
      ))}

      {/* sentinel al final */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {loading && (
        <div style={{ textAlign: "center", padding: 12 }}>Cargando...</div>
      )}
    </div>
  );
}
