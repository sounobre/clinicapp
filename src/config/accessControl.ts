// Caminho: src/config/accessControl.ts
import { LayoutDashboard, Calendar, Users, BarChart, Settings, StickyNote, CircleDollarSign, Briefcase, UserPlus } from "lucide-react";
import type { Role, Plan } from '@/types';

export const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'agenda', label: 'Agenda', icon: Calendar },
  { id: 'pacientes', label: 'Pacientes', icon: Users },
  { id: 'funcionarios', label: 'Funcionários', icon: UserPlus },
  { id: 'prontuarios', label: 'Prontuários', icon: StickyNote },
  { id: 'financeiro', label: 'Financeiro', icon: CircleDollarSign },
  { id: 'servicos', label: 'Serviços', icon: Briefcase },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart },
  { id: 'definicoes', label: 'Definições', icon: Settings }
];

const ALL_MENUS = navItems.map(item => item.id);

const accessConfig = {
  roles: {
    funcionario: ['agenda', 'pacientes'],
    medico: ['agenda', 'pacientes', 'prontuarios', 'financeiro', 'servicos', 'relatorios', 'definicoes'],
    admin: ALL_MENUS,
  },
  plans: {
    plano1: ['agenda', 'pacientes'],
    plano2: ['agenda', 'pacientes', 'prontuarios'],
    plano3: ALL_MENUS,
  }
};

export const getVisibleMenus = (role: Role, plan: Plan) => {
  const roleMenus = accessConfig.roles[role] || [];
  const planMenus = accessConfig.plans[plan] || [];
  const accessibleMenus = roleMenus.filter(menuId => planMenus.includes(menuId));
  return navItems.filter(item => accessibleMenus.includes(item.id));
};