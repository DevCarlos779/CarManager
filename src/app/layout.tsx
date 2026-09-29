import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./global.css";
import { Sidebar } from "../components/Sidebar";

const roboto = Roboto({
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
      className={`${roboto.className} h-full antialiased`}
    >
      <body className="min-h-full bg-[#F5F7FB] text-slate-900">
        <Sidebar />

        <main className="min-h-screen pl-64">
          <div className="mx-auto w-full max-w-[1400px] px-8 py-8">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}