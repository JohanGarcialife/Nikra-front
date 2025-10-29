import { Montserrat } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import { HeroUIProvider } from "@heroui/system";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
   title: "CCA Ceuta App",
  description: "CCA Ceuta App para comercios asociados",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <HeroUIProvider>
          <Toaster richColors position="top"/>
          <div
            className={
              // mobile-first: full-width, no radius, no shadow
              // desktop (lg): constrained max-width, rounded, shadow
              "bg-white flex flex-col items-center justify-start w-full max-w-full p-5 box-border m-0 rounded-none shadow-none " +
              "lg:max-w-screen lg:mx-auto lg:my-[15px] lg:rounded-[30px] lg:p-5 lg:shadow-[0_0_36px_rgba(0,0,0,0.07)]"
            }
          >
            {children}
          </div>
        </HeroUIProvider>
      </body>
    </html>
  );
}