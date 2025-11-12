"use client";

import React, { memo, useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  motion,
  useDragControls,
  useMotionValue,
  useAnimate,
} from "framer-motion";
import { Check } from "lucide-react";
import { useMeasure } from "react-use";

const MotionUl = memo(motion.ul);

export const MobileSelect = memo(
  ({
    open,
    value,
    options = [],
    placeholder = "Selecciona una opción",
    onOptionSelect,
    onClose,
    searchable = true,
    label = "",
  }) => {
    const [scope, animate] = useAnimate();
    const [drawerRef, { height }] = useMeasure();
    const controls = useDragControls();
    const y = useMotionValue(0);
    const [isClosing, setIsClosing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const closeTimeoutRef = useRef(null);
    const listContainerRef = useRef(null);
    const searchInputRef = useRef(null);

    const dragDuration = useRef({ init: 0, finish: 0 });
    const dragPosition = useRef({ init: { y: 0 }, finish: { y: 0 } });

    // Detectar si es móvil
    const [isMobile, setIsMobile] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);

      const checkMobile = () => {
        setIsMobile(window.innerWidth <= 768);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);

      return () => window.removeEventListener("resize", checkMobile);
    }, []);

    // Filtrar opciones según búsqueda
    const filteredOptions = options.filter((opt) =>
      opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Bloquear scroll del body cuando el modal está abierto (SOLO MÓVIL)
    useEffect(() => {
      if (!open || !isMobile) return;

      const originalOverflow = document.body.style.overflow;
      const originalTouchAction = document.body.style.touchAction;

      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      const preventTouch = (e) => {
        const modal = document.querySelector("#mobile-select-drawer");
        if (modal && !modal.contains(e.target)) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      document.addEventListener("touchstart", preventTouch, {
        passive: false,
        capture: true,
      });
      document.addEventListener("touchmove", preventTouch, {
        passive: false,
        capture: true,
      });
      document.addEventListener("touchend", preventTouch, {
        passive: false,
        capture: true,
      });

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.touchAction = originalTouchAction;

        document.removeEventListener("touchstart", preventTouch, {
          passive: false,
          capture: true,
        });
        document.removeEventListener("touchmove", preventTouch, {
          passive: false,
          capture: true,
        });
        document.removeEventListener("touchend", preventTouch, {
          passive: false,
          capture: true,
        });
      };
    }, [open, isMobile]);

    const handleClose = async () => {
      if (isClosing) return;
      setIsClosing(true);

      try {
        const yStart = typeof y.get() === "number" ? y.get() : 0;

        const drawerElement = document.querySelector("#mobile-select-drawer");
        if (drawerElement) {
          animate("#mobile-select-drawer", {
            y: [yStart, height],
          });
        }

        if (scope.current) {
          await animate(scope.current, {
            opacity: [1, 0],
          });
        }
      } catch (error) {
        console.debug("Animation error:", error);
      } finally {
        closeTimeoutRef.current = setTimeout(() => {
          setIsClosing(false);
          setSearchTerm("");
          onClose();
        }, 100);
      }
    };

    // Cleanup del timeout al desmontar
    useEffect(() => {
      return () => {
        if (closeTimeoutRef.current) {
          clearTimeout(closeTimeoutRef.current);
        }
      };
    }, []);

    // Variables para detectar si es un tap o un scroll
    const touchStartY = useRef(0);
    const touchStartTime = useRef(0);

    // Event listeners para las opciones de la lista
    useEffect(() => {
      const listContainer = listContainerRef.current;
      if (!listContainer || !open || !isMobile) return;

      const handleTouchStart = (e) => {
        const target = e.target;
        const listItem = target.closest("li[data-option]");

        if (listItem) {
          touchStartY.current = e.touches[0].clientY;
          touchStartTime.current = Date.now();
        }
      };

      const handleTouchEnd = (e) => {
        const target = e.target;
        const listItem = target.closest("li[data-option]");

        if (listItem) {
          const touchEndY = e.changedTouches[0].clientY;
          const touchDuration = Date.now() - touchStartTime.current;
          const touchDistance = Math.abs(touchEndY - touchStartY.current);

          // Solo procesar como click si no fue un scroll
          if (touchDistance < 10 && touchDuration < 300) {
            e.preventDefault();
            e.stopPropagation();

            if (isClosing) return;

            const optionId = listItem.getAttribute("data-option");
            if (optionId) {
              onOptionSelect(optionId);

              requestAnimationFrame(() => {
                handleClose();
              });
            }
          }
        }
      };

      listContainer.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      listContainer.addEventListener("touchend", handleTouchEnd, {
        passive: false,
      });

      return () => {
        listContainer.removeEventListener("touchstart", handleTouchStart);
        listContainer.removeEventListener("touchend", handleTouchEnd);
      };
    }, [open, isMobile, isClosing, onOptionSelect]);

    if (!open) return null;

    // Renderizado para móvil con drawer
    if (isMobile && mounted) {
      const drawerContent = (
        <motion.div
          ref={scope}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ ease: "easeInOut", duration: 0.2 }}
          className="fixed inset-0 bg-black/50 h-screen w-screen z-[99999] flex justify-center items-center"
          style={{
            pointerEvents: isClosing ? "none" : "auto",
            touchAction: "none",
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            margin: 0,
            padding: 0,
          }}
          onTouchStart={(e) => {
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
          }}
          onTouchEnd={(e) => {
            e.stopPropagation();
            if (e.target === e.currentTarget && !isClosing) {
              handleClose();
            }
          }}
          onClick={(e) => {
            e.stopPropagation();
            if (e.target === e.currentTarget && !isClosing) {
              handleClose();
            }
          }}
        >
          <motion.div
            id="mobile-select-drawer"
            ref={drawerRef}
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ ease: "easeInOut", duration: 0.3 }}
            onDragStart={(_, info) => {
              dragDuration.current.init = new Date().getTime();
              dragPosition.current.init = { y: info.point.y };
            }}
            onDragEnd={(_, info) => {
              dragDuration.current.finish = new Date().getTime();
              dragPosition.current.finish = { y: info.point.y };

              const toLowCondition = y.get() >= height / 2.5;
              const toFastCondition =
                y.get() < 200 &&
                dragDuration.current.finish - dragDuration.current.init < 300;
              const upDirectionCondition =
                dragPosition.current.init.y > dragPosition.current.finish.y;

              if (upDirectionCondition) return;

              if (toLowCondition || toFastCondition) {
                handleClose();
              }
            }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 1 }}
            style={{
              y,
              height: "65vh",
              maxWidth: "100vw",
              pointerEvents: isClosing ? "none" : "auto",
              touchAction: "pan-y",
            }}
            className="absolute flex flex-col bottom-0 w-screen bg-white rounded-t-3xl"
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onTouchMove={(e) => {
              e.stopPropagation();
            }}
            onTouchEnd={(e) => {
              e.stopPropagation();
            }}
          >
            {/* Handle de drag */}
            <div
              className="group/drag h-[45px] w-full flex justify-center items-center p-4 shadow-sm cursor-grab touch-none active:cursor-grabbing"
              onPointerDown={(e) => {
                controls.start(e);
              }}
            >
              <div className="h-[5px] w-[60px] rounded-full bg-primary/40 group-active/drag:bg-primary/60 transition-all duration-200" />
            </div>

            {/* Título */}
            {label && (
              <div className="px-4 pb-2">
                <h3 className="text-lg font-semibold text-primary">{label}</h3>
              </div>
            )}

            {/* Barra de búsqueda */}
            {/*{searchable && (
            <div className="sticky top-0 bg-white z-10 px-4 pb-4">
              <div className="relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={`Buscar ${label.toLowerCase() || 'opciones'}...`}
                  autoFocus={false}
                  className="w-full p-3 border-2 border-primary/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3E6FA7] focus:border-transparent transition-all bg-white/80 text-[#36454F]"
                />
              </div>
            </div>
          )*/}

            {/* Lista scrolleable */}
            <div
              ref={listContainerRef}
              className="flex-1 overflow-y-auto overscroll-contain"
              style={{
                WebkitOverflowScrolling: "touch",
                touchAction: "pan-y",
              }}
            >
              {filteredOptions.length > 0 ? (
                <ul>
                  {filteredOptions.map((opt) => {
                    const isSelected = opt.id.toString() === value.toString();

                    return (
                      <li
                        key={opt.id}
                        data-option={opt.id}
                        className={`p-4 cursor-pointer border-b border-gray-200 last:border-b-0 transition-all duration-150 ${
                          isSelected
                            ? "bg-[#3E6FA7]/10"
                            : "active:bg-[#3E6FA7]/20"
                        } text-left`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          if (isClosing) return;
                          onOptionSelect(opt.id);
                          handleClose();
                        }}
                        style={{
                          WebkitTapHighlightColor: "transparent",
                          touchAction: "pan-y",
                          userSelect: "none",
                          WebkitUserSelect: "none",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span
                            className={`${
                              isSelected
                                ? "font-semibold text-primary"
                                : "text-[#36454F]"
                            } flex-1`}
                          >
                            {opt.name}
                          </span>

                          {isSelected && (
                            <Check
                              size={20}
                              className="text-primary ml-2 flex-shrink-0"
                            />
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <div className="p-8 text-center text-gray-500">
                  No se encontraron resultados
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      );

      // Usar portal para renderizar fuera del contenedor del formulario
      return createPortal(drawerContent, document.body);
    }

    // Renderizado para desktop (dropdown tradicional)
    return (
      <MotionUl
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className="absolute z-50 w-full bg-white border-2 border-primary rounded-lg shadow-xl mt-1 max-h-60 overflow-y-auto"
        style={{
          WebkitOverflowScrolling: "touch",
        }}
      >
        {/* Barra de búsqueda para desktop */}
        {searchable && (
          <div className="sticky top-0 bg-white z-10 p-2 border-b border-gray-200">
            <input
              ref={searchInputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={`Buscar...`}
              autoFocus
              className="w-full p-2 border border-primary/30 rounded focus:outline-none focus:ring-2 focus:ring-[#3E6FA7] bg-white/80 text-[#36454F] text-sm"
            />
          </div>
        )}

        {filteredOptions.length > 0 ? (
          filteredOptions.map((opt) => {
            const isSelected = opt.id.toString() === value.toString();

            return (
              <li
                key={opt.id}
                className={`p-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${
                  isSelected
                    ? "bg-[#3E6FA7]/10 hover:bg-[#3E6FA7]/20"
                    : "hover:bg-[#3E6FA7]/10"
                } text-left`}
                onClick={() => {
                  onOptionSelect(opt.id);
                  onClose();
                }}
                style={{
                  WebkitTapHighlightColor: "transparent",
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`${
                      isSelected
                        ? "font-semibold text-primary"
                        : "text-[#36454F]"
                    }`}
                  >
                    {opt.name}
                  </span>

                  {isSelected && (
                    <Check
                      size={18}
                      className="text-primary ml-2 flex-shrink-0"
                    />
                  )}
                </div>
              </li>
            );
          })
        ) : (
          <li className="p-4 text-center text-gray-500 text-sm">
            No se encontraron resultados
          </li>
        )}
      </MotionUl>
    );
  }
);

MobileSelect.displayName = "MobileSelect";
