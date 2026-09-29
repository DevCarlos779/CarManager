"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  CreditCard,
  TriangleAlert,
  Settings,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Veículos",
    href: "/veiculos",
    icon: Car,
  },
  {
    name: "Pagamentos",
    href: "/pagamentos",
    icon: CreditCard,
  },
  {
    name: "Pendências",
    href: "/pendencias",
    icon: TriangleAlert,
  },
  {
    name: "Configurações",
    href: "/configuracoes",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col bg-[#243F8F] px-4 py-6 text-white">
      <div className="mb-8 px-3">
        <h1 className="text-xl font-bold tracking-tight">
          CarManager
        </h1>

        <p className="mt-1 text-xs text-blue-200">
          Gestão de veículos
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1">
        {navigation.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-white/15 text-white"
                  : "text-blue-100 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} strokeWidth={2} />

              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/15 pt-4">
        <div className="flex items-center gap-3 px-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/15 text-sm font-semibold">
            C
          </div>

          <div>
            <p className="text-sm font-medium">
              Carlos
            </p>

            <p className="text-xs text-blue-200">
              Minha conta
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}