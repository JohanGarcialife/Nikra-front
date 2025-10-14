'use client'

import React, { useState, useEffect, useRef } from 'react'
import Business from './_components/Business'
import useAuthStore from '@/store/auth'

const TEMPLATE = {
  img: '/Commerces/CopiadeCarolzapatos.jpg',
  title: 'Charol Zapatos',
  description: 'Tu tienda Multimarca en Ceuta, para ellas y ellos las mejores marcas en el sector del calzado. Conoce nuestros establecimientos donde nuestro equipo de profesionales te atenderá de manera individual, profesional y cercana... Porque llevamos un largo recorrido caminando con nuestros clientes.',
  phone: '956514406',
  address: 'Paseo del Revellín, 9',
  website: 'www.Ejemplo.com',
  hours: 'Mañana: 10:00 - 14:00 Tardes: 16:00 - 20:00'
}

// data de ejemplo 'infinita' (clones con índice para diferenciar)
const ALL_BUSINESSES = Array.from({ length: 200 }, (_, i) => ({ ...TEMPLATE, title: `${TEMPLATE.title} ${i + 1}` }))

export default function Businesses() {
     const { user, logout } = useAuthStore();
  const PER_PAGE = 10
  const [items, setItems] = useState(ALL_BUSINESSES.slice(0, PER_PAGE))
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef(null)

  const loadMore = () => {
    if (loading) return
    setLoading(true)
    // simulamos fetch con timeout; reemplaza por fetch real si lo necesitas
    setTimeout(() => {
      setItems(prev => {
        const start = prev.length
        const next = ALL_BUSINESSES.slice(start, start + PER_PAGE)
        return [...prev, ...next]
      })
      setLoading(false)
    }, 400)
  }

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) loadMore()
        })
      },
      { root: null, rootMargin: '400px', threshold: 0.1 } // rootMargin aumentado
    )
    obs.observe(el)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // se monta una vez; loadMore usa setState funcional para evitar dependencias

  // Si la página no tiene suficiente contenido para hacer scroll, forzamos más cargas
  useEffect(() => {
    const tryFillUntilScrollable = () => {
      if (document.documentElement.scrollHeight <= window.innerHeight && items.length < ALL_BUSINESSES.length && !loading) {
        loadMore()
      }
    }
    // primer intento tras paint
    const t = setTimeout(tryFillUntilScrollable, 100)
    // volver a comprobar al redimensionar ventana
    window.addEventListener('resize', tryFillUntilScrollable)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', tryFillUntilScrollable)
    }
  }, [items, loading]) // se reintenta hasta que haya scroll o se agoten los items

const handleLogout = () => {
    logout();
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.push("/login");
  };

  return (
    <div>
        <div className="flex flex-row items-center  gap-1 mb-10">
<div onClick={handleLogout} className=" bg-[#133D74] p-3 shadow rounded">
       <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 20l-3 -8l3 -8" /></svg>
        </div>
<h2 className="text-[#133D74] font-bold text-xl w-full text-center">Centro Comercial Abierto de Ceuta</h2>
      </div>
      {items.map((business, index) => (
        <Business key={index} business={business} />
      ))}

      {/* sentinel al final */}
      <div ref={sentinelRef} style={{ height: 1 }} />

      {loading && (
        <div style={{ textAlign: 'center', padding: 12 }}>
          Cargando...
        </div>
      )}
    </div>
  )
}