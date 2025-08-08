import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import  { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { metricCardsData, chartData, upcomingAppointmentsData } from "@/mock";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


// src/features/dashboard/DashboardView.tsx
export function DashboardView() {
    return ( 
    <> 
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4"> 
            {metricCardsData.map((card, index) => ( 
            <Card key={index}> 
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"> 
                    <CardTitle className="text-sm font-medium">{card.title}</CardTitle> 
                    <card.Icon className="h-4 w-4 text-muted-foreground" /> 
                </CardHeader> 
                <CardContent> 
                    <div className="text-2xl font-bold">{card.amount}</div> 
                    <p className="text-xs text-muted-foreground">{card.note}</p> 
                </CardContent> 
            </Card> 
            ))} 
        </div> 
        <div className="grid gap-4 md:gap-8 lg:grid-cols-7"> 
            <Card className="lg:col-span-4"> 
                <CardHeader> 
                    <CardTitle>Visão Geral do Faturamento</CardTitle> 
                </CardHeader> 
                <CardContent className="pl-2"> 
                    <ResponsiveContainer width="100%" height={350}> 
                        <BarChart data={chartData}> 
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" vertical={false} /> 
                            <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} /> 
                            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$${value / 1000}k`} /> 
                            <Tooltip cursor={{ fill: 'hsl(var(--accent))' }} contentStyle={{ backgroundColor: 'hsl(var(--popover))', borderColor: 'hsl(var(--border))', color: 'hsl(var(--popover-foreground))', borderRadius: 'var(--radius)', }} /> 
                            <Bar dataKey="total" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} /> 
                        </BarChart> 
                    </ResponsiveContainer> 
                </CardContent> 
            </Card> 
            <Card className="lg:col-span-3"> 
                <CardHeader> 
                    <CardTitle>Próximos Agendamentos</CardTitle> 
                </CardHeader> 
                <CardContent> 
                    {upcomingAppointmentsData.map((item, index) => ( 
                    <div key={index} className={cn("flex items-center gap-4", index > 0 && "mt-4")}> 
                        <Avatar className="h-9 w-9"> 
                            <AvatarFallback>{item.avatar}</AvatarFallback> 
                        </Avatar> 
                        <div className="grid gap-1"> 
                            <p className="text-sm font-medium leading-none">{item.name}</p> 
                            <p className="text-sm text-muted-foreground">{item.service}</p> 
                        </div> 
                        <div className="ml-auto font-medium">{item.time}</div> 
                    </div> 
                    ))} 
                </CardContent> 
            </Card> 
        </div> 
    </> 
    ) 
}