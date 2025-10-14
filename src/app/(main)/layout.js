import { Montserrat } from "next/font/google";
import "../globals.css";
import ParallaxLayout from "./_components/ParallaxLayout";

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
        <ParallaxLayout>
          {children}
        </ParallaxLayout>
      </body>
    </html>
  );
}