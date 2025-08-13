import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Users, Calendar, CircleDollarSign, TrendingDown } from 'lucide-react';

export function DashboardPage() {
  // No futuro, os dados para estes cards viriam de uma chamada de API.
  // Ex: const { data } = await getDashboardStats();
  const stats = {
    pacientesAtivos: 12,
    agendamentosHoje: 4,
    faturamentoMes: 4500.75,
    despesasMes: 1740.50,
  };

  return (
    <main className="p-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6">Dashboard</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pacientes Ativos</CardTitle>
            <Users className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pacientesAtivos}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">+2 no último mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agendamentos de Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.agendamentosHoje}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">2 confirmados, 2 pendentes</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento do Mês</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.faturamentoMes.toFixed(2)}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">+15.2% em relação ao mês passado</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Despesas do Mês</CardTitle>
            <TrendingDown className="h-4 w-4 text-slate-500 dark:text-slate-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.despesasMes.toFixed(2)}</div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Aluguel e CRP pagos</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        {/* Aqui você pode adicionar mais componentes, como um gráfico de faturamento ou uma lista de próximas sessões */}
        <Card>
          <CardHeader>
            <CardTitle>Próximas Sessões</CardTitle>
            <CardDescription>Sessões agendadas para os próximos 7 dias.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-500">O componente de próximas sessões será implementado aqui.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}