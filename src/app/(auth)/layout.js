import { Montserrat } from "next/font/google";
import "../globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
   title: "Nikra App",
  description: "Nikra App Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <div
          className={
            // mobile-first: full-width, no radius, no shadow, min-h screen
            // desktop (lg): constrained max-width, rounded, shadow, min-h calc(100vh - 30px)
            "bg-white fixed flex flex-col items-center justify-start w-full max-w-full min-h-screen p-5 box-border overflow-hidden m-0 rounded-none shadow-none " +
            "lg:max-w-screen lg:mx-auto lg:my-[15px] lg:rounded-[30px] lg:min-h-[calc(100vh-30px)] lg:p-5 lg:shadow-[0_0_36px_rgba(0,0,0,0.07)]"
          }
        >
          {children}
        </div>
      </body>
    </html>
  );
}
