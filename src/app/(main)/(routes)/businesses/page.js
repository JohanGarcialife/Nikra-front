'use client'

import React, { useState, useEffect, useRef } from 'react'
import Business from './_components/Business'
import useAuthStore from '@/store/auth'

import comercios from '@/test/comercios.json'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

const PER_PAGE = 10

export default function Businesses() {
  const { user, logout } = useAuthStore();
  const router = useRouter()

  const [allItems, setAllItems] = useState(comercios) // datos completos (fallback desde JSON)
  const [businesses, setBusinesses] = useState(() => comercios.slice(0, PER_PAGE)) // items visibles (paginados)
  const [loading, setLoading] = useState(false)
  const sentinelRef = useRef(null)

console.log(businesses);


  const API_URL = process.env.NEXT_PUBLIC_API_URL || '' // usa la URL desde .env (NEXT_PUBLIC_API_URL)
  // Fetch inicial de /api/associates usando la URL del .env, incluyendo token desde cookies en Authorization header
  useEffect(() => {
    let mounted = true

    const getCookie = (name) => {
      if (typeof document === 'undefined') return ''
      const match = document.cookie.match(new RegExp('(^|; )' + name + '=([^;]+)'))
      return match ? decodeURIComponent(match[2]) : ''
    }

    const fetchAssociates = async () => {
      try {
        const url = API_URL ? `${API_URL.replace(/\/$/, '')}/api/associates` : '/api/associates'

        // intentamos obtener token desde cookies o desde el user del store como fallback
        const token =
          getCookie('token') ||
          getCookie('access_token') ||
          getCookie('auth_token') ||
          (user && (user.token || user.access_token || user.auth_token)) ||
          ''

        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        const res = await fetch(url, { headers })
        if (!res.ok) {
          console.warn('Error fetching associates:', res.status)
          return
        }
        const data = await res.json()
        if (mounted && Array.isArray(data)) {
          setAllItems(data)
          setBusinesses(data.slice(0, PER_PAGE))
        }
      } catch (err) {
        console.warn('Fetch associates failed:', err)
      }
    }
    fetchAssociates()
    return () => { mounted = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // solo al montar

  const loadMore = () => {
    if (loading) return
    setLoading(true)
    // simulamos fetch con timeout; si quieres puedes reemplazar por paginado real en backend
    setTimeout(() => {
      setItems(prev => {
        const start = prev.length
        const next = allItems.slice(start, start + PER_PAGE)
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
      { root: null, rootMargin: '400px', threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // se monta una vez; loadMore usa setState funcional para evitar dependencias

  // Si la página no tiene suficiente contenido para hacer scroll, forzamos más cargas
  useEffect(() => {
    const tryFillUntilScrollable = () => {
      if (document.documentElement.scrollHeight <= window.innerHeight && items.length < allItems.length && !loading) {
        loadMore()
      }
    }
    const t = setTimeout(tryFillUntilScrollable, 100)
    window.addEventListener('resize', tryFillUntilScrollable)
    return () => {
      clearTimeout(t)
      window.removeEventListener('resize', tryFillUntilScrollable)
    }
  }, [businesses, loading, allItems.length])

  return (
    <div>
      <div className="flex flex-row w-full justify-between items-center  gap-1 mb-10">
        <div onClick={() => router.back()} className=" bg-[#133D74] p-3 shadow rounded text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-chevron-compact-left"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M13 20l-3 -8l3 -8" /></svg>
        </div>
        <Image
          width={162}
          height={243}
          src="/CCA-800X600-(2).png"
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
        <div style={{ textAlign: 'center', padding: 12 }}>
          Cargando...
        </div>
      )}
    </div>
  )
}