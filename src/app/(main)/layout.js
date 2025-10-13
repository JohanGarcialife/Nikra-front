import { Montserrat } from "next/font/google";
import "../globals.css";
import Image from "next/image";

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
            "bg-white flex flex-col items-center justify-start w-full max-w-full min-h-screen p-5 box-border overflow-hidden m-0 rounded-none shadow-none " +
            "lg:max-w-[390px] lg:mx-auto lg:my-[15px] lg:rounded-[30px] lg:min-h-[calc(100vh-30px)] lg:p-5 lg:shadow-[0_0_36px_rgba(0,0,0,0.07)]"
          }
        >
          <Image src={"/Group786.png"} fill className="absolute z-10"/>
          {children}
        </div>
      </body>
    </html>
  );
}
