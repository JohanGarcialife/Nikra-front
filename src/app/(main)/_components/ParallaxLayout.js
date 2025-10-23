'use client'
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

export default function ParallaxLayout({ children }) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const handleScroll = (e) => {
      setScrollTop(e.target.scrollTop);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return (
    <>
      <Image
      alt='Background'
        src={"/Group786.png"}
        fill
        className="fixed top-0 left-0 w-full h-full z-10 object-cover"
        style={{ transform: `translateY(-${scrollTop * 0.5}px)` }}
      />
      <div
        ref={scrollContainerRef}
        className={
          "bg-white relative flex flex-col items-center justify-start w-full max-w-full min-h-screen p-5 box-border overflow-y-auto m-0 rounded-none shadow-none " +
          "lg:max-w-screen lg:mx-auto lg:my-[15px] lg:rounded-[30px] lg:min-h-[calc(100vh-30px)] lg:p-5 lg:shadow-[0_0_36px_rgba(0,0,0,0.07)]"
        }
      >
        <div className="relative z-20 flex flex-col w-full">
          {children}
        </div>
      </div>
    </>
  );
}