import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Plus, Edit, Trash2 } from "lucide-react";
import { useState } from "react";

export function FuncionariosPage({ employees, setEmployees }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const handleSaveEmployee = (data) => {
        const newEmployee = { id: Date.now(), ...data };
        setEmployees(prev => [...prev, newEmployee]);
    };

    return (
        <main className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Funcionários</h2>
                <Button onClick={() => setIsModalOpen(true)}><Plus className="mr-2 h-4 w-4" /> Novo Funcionário</Button>
            </div>
            <Card>
                <CardContent className="!p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Nome</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Cargo</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Email de Acesso</th>
                                    <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-300">Status</th>
                                    <th className="p-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                {employees.map(employee => (
                                    <tr key={employee.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50">
                                        <td className="p-4 font-medium">{employee.fullName}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-400">{employee.role}</td>
                                        <td className="p-4 text-slate-600 dark:text-slate-400">{employee.accessEmail}</td>
                                        <td className="p-4">
                                            <span className={cn("px-2 py-1 text-xs font-medium rounded-full", employee.status ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300')}>
                                                {employee.status ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8"><Trash2 className="h-4 w-4" /></Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
            <FuncionarioModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveEmployee} />
        </main>
    );
}