import type { Metadata } from "next";
import { Edu_NSW_ACT_Cursive, Poppins } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const edu = Edu_NSW_ACT_Cursive({
  weight: "variable",
  subsets: ["latin"],
  variable: "--font-edu",
});

export const metadata: Metadata = {
  title: "Revio · Review smarter. Ship confidently.",
  description: "Revio reviews every change for bugs and security holes before you ship.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`dark ${poppins.variable} ${edu.variable}`}>
      <body>{children}</body>
    </html>
  );
}
