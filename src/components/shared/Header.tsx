import type { Role } from "@/features/admin/schemas";

import { Eye, Menu, Search, Bell, User, Settings } from "lucide-react";
import { type Dispatch, type SetStateAction, useState, useRef, useEffect } from "react";
import  { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

interface HeaderProps {
    setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
    setActiveView: (view: string) => void;
    currentUserRole: Role;
    currentViewRole: Role;
    setCurrentViewRole: Dispatch<SetStateAction<Role | null>>;
}
export function Header({ setIsSidebarOpen, setActiveView, currentUserRole, currentViewRole, setCurrentViewRole }: HeaderProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) { if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsDropdownOpen(false); }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);
    const handleDropdownItemClick = (view: string) => { setActiveView(view); setIsDropdownOpen(false); }

  return (
    <>
    {currentUserRole === 'Admin' && currentViewRole !== 'Admin' && (
        <div className="bg-primary text-primary-foreground text-center py-2 px-4 flex items-center justify-center gap-4">
            <Eye className="h-5 w-5" />
            <span className="text-sm font-semibold">Visualizando como: {currentViewRole}</span>
            <Button variant="secondary" size="sm" className="ml-auto h-7" onClick={() => setCurrentViewRole('Admin')}>Voltar à Visão de Admin</Button>
        </div>
    )}
    <header className="sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur-sm px-4 md:px-6">
        <Button variant="ghost" size="icon" className="sm:hidden" onClick={() => setIsSidebarOpen(true)}> <Menu className="h-5 w-5" /> <span className="sr-only">Abrir Menu</span> </Button>
      <div className="relative ml-auto flex-1 md:grow-0">
        <Search className="absolute left-2.5 top-3 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Buscar..." className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]" />
      </div>
      <Button variant="ghost" size="icon" className="rounded-full"> <Bell className="h-5 w-5" /> <span className="sr-only">Notificações</span> </Button>
      <div className="relative" ref={dropdownRef}>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
            <Avatar> <AvatarImage src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Barbeiro" /> <AvatarFallback>BB</AvatarFallback> </Avatar>
        </Button>
        {isDropdownOpen && (
            <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="py-1">
                    <div className="px-4 py-2 text-sm text-muted-foreground">Minha Conta</div>
                    <a href="#" onClick={() => handleDropdownItemClick('perfil')} className="flex items-center gap-2 px-4 py-2 text-sm text-popover-foreground hover:bg-accent"> <User className="h-4 w-4" /> Perfil </a>
                    <a href="#" onClick={() => handleDropdownItemClick('configuracoes')} className="flex items-center gap-2 px-4 py-2 text-sm text-popover-foreground hover:bg-accent"> <Settings className="h-4 w-4" /> Configurações </a>
                    <hr className="border-t border-border my-1" />
                    <a href="#" className="block px-4 py-2 text-sm text-destructive hover:bg-accent">Sair</a>
                </div>
            </div>
        )}
      </div>
    </header>
    </>
  );
} 