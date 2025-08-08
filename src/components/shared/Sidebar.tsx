import type { Role } from "@/features/admin/schemas";
import { cn } from "@/lib/utils";
import { Home, ShoppingCart, Calendar, Users, Scissors, DollarSign, Shield, ChevronLeft, Menu } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import  { Button } from "../ui/button";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
  activeView: string;
  setActiveView: (view: string) => void;
  currentViewRole: Role;
}
export function Sidebar({ isSidebarOpen, setIsSidebarOpen, activeView, setActiveView, currentViewRole }: SidebarProps) {
  const allNavItems = [
    { name: "Dashboard", icon: Home, view: "dashboard", roles: ["Admin", "Funcionário"] },
    { name: "PDV", icon: ShoppingCart, view: "pdv", roles: ["Admin", "Funcionário"] },
    { name: "Agenda", icon: Calendar, view: "agenda", roles: ["Admin", "Funcionário", "Cliente"] },
    { name: "Clientes", icon: Users, view: "listClients", activeIn: ['listClients', 'clientForm'], roles: ["Admin", "Funcionário"] },
    { name: "Serviços", icon: Scissors, view: "listServices", activeIn: ['listServices', 'serviceForm'], roles: ["Admin", "Funcionário"] },
    { name: "Financeiro", icon: DollarSign, view: "financeiro", roles: ["Admin"] },
    { name: "Administração", icon: Shield, view: "adminPanel", activeIn: ['adminPanel', 'userForm'], roles: ["Admin"] },
  ];
  
  const navItems = allNavItems.filter(item => item.roles.includes(currentViewRole));

  const handleNavClick = (view: string) => {
    setActiveView(view);
    if (window.innerWidth < 640) setIsSidebarOpen(false);
  };

  return (
    <aside className={cn( "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-border bg-sidebar transition-transform duration-300", isSidebarOpen ? "w-64 translate-x-0" : "w-64 -translate-x-full sm:w-20 sm:translate-x-0" )}>
      <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4 sm:justify-center">
        <a href="#" className="flex items-center gap-2 font-semibold text-primary-foreground sm:hidden" onClick={() => handleNavClick('dashboard')}>
            <Scissors className="h-7 w-7 text-primary" /> <span className="text-lg">Barber</span>
        </a>
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setIsSidebarOpen(false)}> <ChevronLeft className="h-6 w-6" /> </Button>
        <Button variant="ghost" size="icon" className="hidden sm:flex" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
          {isSidebarOpen ? <ChevronLeft className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>
      <nav className="flex-1 space-y-1 py-4">
        {navItems.map((item) => (
          <a key={item.name} href="#" onClick={() => handleNavClick(item.view)} className={cn( "block w-full transition-colors hover:bg-accent hover:text-accent-foreground", (item.activeIn ? item.activeIn.includes(activeView) : activeView === item.view) && "bg-accent text-accent-foreground" )} title={item.name}>
            <div className={cn( "flex items-center gap-4 py-3", isSidebarOpen ? "px-4 justify-start" : "px-2 justify-center" )}>
              <item.icon className="h-5 w-5 shrink-0" />
              <span className={cn(isSidebarOpen ? "inline" : "hidden")}>{item.name}</span>
            </div>
          </a>
        ))}
      </nav>
    </aside>
  );
}