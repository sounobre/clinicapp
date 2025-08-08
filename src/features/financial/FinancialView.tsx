import  { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import  { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { financialTransactionsData } from "@/mock";


// src/features/financial/FinancialView.tsx
export function FinancialView() {
    return ( 
    <Card> 
        <CardHeader> <CardTitle>Painel Financeiro</CardTitle> <CardDescription>Acompanhe as entradas e saídas do seu negócio.</CardDescription> </CardHeader> 
        <CardContent> 
            <div className="grid gap-4 md:grid-cols-3 mb-6"> 
                <Card className="bg-secondary"> <CardHeader className="pb-2"><CardTitle className="text-sm font-normal">Saldo Atual</CardTitle></CardHeader> <CardContent><p className="text-2xl font-bold text-emerald-400">R$ 8.540,00</p></CardContent> </Card> 
                <Card className="bg-secondary"> <CardHeader className="pb-2"><CardTitle className="text-sm font-normal">Receita do Mês</CardTitle></CardHeader> <CardContent><p className="text-2xl font-bold text-primary">R$ 12.750,00</p></CardContent> </Card> 
                <Card className="bg-secondary"> <CardHeader className="pb-2"><CardTitle className="text-sm font-normal">Despesas do Mês</CardTitle></CardHeader> <CardContent><p className="text-2xl font-bold text-destructive">R$ 4.210,00</p></CardContent> </Card> 
            </div> 
            <h3 className="text-lg font-semibold mb-4">Últimas Transações</h3> 
            <Table> 
                <TableHeader><TableRow><TableHead>Descrição</TableHead><TableHead>Data</TableHead><TableHead className="text-right">Valor</TableHead></TableRow></TableHeader> 
                <TableBody>
                    {financialTransactionsData.map((t) => ( 
                        <TableRow key={t.id}>
                            <TableCell>{t.description}</TableCell>
                            <TableCell className="text-muted-foreground">{t.date}</TableCell>
                            <TableCell className={cn("text-right font-semibold", t.type === 'credit' ? 'text-emerald-400' : 'text-destructive')}>{t.amount}</TableCell>
                        </TableRow> 
                    ))} 
                </TableBody> 
            </Table> 
        </CardContent> 
    </Card> 
    ); 
}