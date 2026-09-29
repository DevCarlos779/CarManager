import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./global.css";
import { Sidebar } from "../components/Sidebar";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Car Manager",
  description: "Gerenciamento de veículos e pagamentos",
};

export default function RootLayout({
  children,
}: LayoutProps<"/">) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.className} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F8FAFC] text-[#0F172A]">
        <Sidebar />

        <main className="min-h-screen pl-64">
          <div className="mx-auto w-full max-w-[1600px] px-10 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}