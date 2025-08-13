// Caminho: src/components/modals/SessionModal.tsx
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bold, Italic, List, Upload } from "lucide-react";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sessionSchema } from "@/schemas";
import type { Session, Client, Role } from "@/types";

// O tipo de dado do formulário inferido a partir do schema
type SessionFormData = z.infer<typeof sessionSchema>;

// Define as props que o componente espera receber
interface SessionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SessionFormData) => void;
  userRole: Role;
  clients: Client[];
  editingData?: Session | null; // Dados da sessão que está sendo editada
  onDateClickData?: { date: Date; time: string } | null; // Dados para pré-preencher
}

export function SessionModal({
  open,
  onClose,
  onSave,
  userRole,
  clients,
  editingData,
  onDateClickData,
}: SessionModalProps) {
  // Configuração do formulário com React Hook Form e Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<SessionFormData>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      recorrencia: "Nao se repete",
      duracao_minutos: 50,
      tipo_sessao: "Online",
      status_sessao: "Pendente",
      valor_sessao: 0,
      status_pagamento: "Pendente",
      forma_recebimento: "Pix",
    },
  });

  // Observa o campo 'recorrencia' para mostrar/ocultar o campo de data final
  const recorrencia = watch("recorrencia");

  // Efeito para popular o formulário quando o modal abre
  useEffect(() => {
    if (open) {
      if (editingData) {
        const data = editingData;
        setValue("pacienteId", data.pacienteId?.toString() || "");
        setValue("titulo_sessao", data.titulo_sessao);
        setValue("data_sessao", data.data_sessao);
        setValue("hora_inicio", data.hora_inicio);
        setValue("duracao_minutos", data.duracao_minutos);
        setValue("tipo_sessao", data.tipo_sessao);
        setValue("status_sessao", data.status_sessao);
        setValue("valor_sessao", data.valor_sessao);
        setValue("status_pagamento", data.status_pagamento || "Pendente");
        setValue("data_recebimento", data.data_recebimento || "");
        setValue("forma_recebimento", data.forma_recebimento || "Pix");
        setValue("recorrencia", data.recorrencia);
        setValue("recorrencia_data_fim", data.recorrencia_data_fim || "");
        setValue("notas_agendamento", data.notas_agendamento || "");
        setValue("notas_internas", data.notas_internas || "");
      } else if (onDateClickData) {
        // Modo de criação a partir de um clique no calendário
        reset(); // Limpa o form antes de setar novos valores
        setValue(
          "data_sessao",
          onDateClickData.date.toISOString().split("T")[0]
        );
        setValue("hora_inicio", onDateClickData.time);
      } else {
        // Modo de criação a partir do botão "Novo Agendamento"
        reset();
      }
    }
  }, [editingData, onDateClickData, open, reset, setValue]);

  const onSubmit = (data: SessionFormData) => {
    onSave(data);
    internalClose();
  };

  const internalClose = () => {
    reset(); // Limpa os campos do formulário
    onClose(); // Fecha o modal
  };

  const canSeeEvolution = userRole === "admin" || userRole === "medico";
  const modalTitle = editingData ? "Editar Sessão" : "Nova Sessão";

  return (
    <Dialog
      open={open}
      onClose={internalClose}
      size={canSeeEvolution ? "4xl" : "2xl"}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>{modalTitle}</CardTitle>
        </CardHeader>
        <div className="max-h-[70vh] overflow-y-auto">
          <Tabs defaultValue="details">
            <div className="px-6">
              <TabsList>
                <TabsTrigger value="details">Detalhes da Sessão</TabsTrigger>
                <TabsTrigger value="financial">Financeiro</TabsTrigger>
                {canSeeEvolution && (
                  <TabsTrigger value="evolution">Evolução & Anexos</TabsTrigger>
                )}
              </TabsList>
            </div>
            {/* --- Aba de Detalhes da Sessão --- */}
            <TabsContent value="details">
              <div className="p-6 space-y-4">
                <div>
                  <Label htmlFor="pacienteId">Paciente</Label>
                  <select
                    id="pacienteId"
                    {...register("pacienteId")}
                    disabled={!!editingData}
                    className="w-full h-10 rounded-md border border-slate-300 bg-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    <option value="">Selecione um paciente</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.name}
                      </option>
                    ))}
                  </select>
                  {errors.pacienteId && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.pacienteId.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="titulo_sessao">Título</Label>
                  <Input id="titulo_sessao" {...register("titulo_sessao")} />
                  {errors.titulo_sessao && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.titulo_sessao.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data_sessao">Data</Label>
                    <Input
                      id="data_sessao"
                      type="date"
                      {...register("data_sessao")}
                    />
                    {errors.data_sessao && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.data_sessao.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="hora_inicio">Hora</Label>
                    <Input
                      id="hora_inicio"
                      type="time"
                      {...register("hora_inicio")}
                    />
                    {errors.hora_inicio && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.hora_inicio.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipo_sessao">Tipo</Label>
                    <select
                      id="tipo_sessao"
                      {...register("tipo_sessao")}
                      className="w-full h-10 rounded-md border border-slate-300 bg-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3"
                    >
                      <option>Online</option>
                      <option>Presencial</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="status_sessao">Status</Label>
                    <select
                      id="status_sessao"
                      {...register("status_sessao")}
                      className="w-full h-10 rounded-md border border-slate-300 bg-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3"
                    >
                      <option>Pendente</option>
                      <option>Confirmada</option>
                      <option>Realizada</option>
                      <option>Cancelada</option>
                      <option>Faltou</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="recorrencia">Recorrência</Label>
                    <select
                      id="recorrencia"
                      {...register("recorrencia")}
                      className="w-full h-10 rounded-md border border-slate-300 bg-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3"
                    >
                      <option>Nao se repete</option>
                      <option>Semanalmente</option>
                      <option>Quinzenalmente</option>
                      <option>Mensalmente</option>
                    </select>
                  </div>
                  {recorrencia !== "Nao se repete" && (
                    <div>
                      <Label htmlFor="recorrencia_data_fim">Repetir até</Label>
                      <Input
                        id="recorrencia_data_fim"
                        type="date"
                        {...register("recorrencia_data_fim")}
                      />
                      {errors.recorrencia_data_fim && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.recorrencia_data_fim.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="notas_agendamento">
                    Notas do Agendamento
                  </Label>
                  <textarea
                    id="notas_agendamento"
                    {...register("notas_agendamento")}
                    className="min-h-[100px] w-full p-2 bg-transparent focus:outline-none rounded-md border border-slate-300 dark:border-slate-700 mt-1"
                  />
                </div>
              </div>
            </TabsContent>

            {/* --- Aba Financeira --- */}
            <TabsContent value="financial">
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="valor_sessao">Valor (R$)</Label>
                    <Input
                      id="valor_sessao"
                      type="number"
                      step="0.01"
                      {...register("valor_sessao")}
                    />
                    {errors.valor_sessao && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.valor_sessao.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="status_pagamento">
                      Status do Pagamento
                    </Label>
                    <select
                      id="status_pagamento"
                      {...register("status_pagamento")}
                      className="w-full h-10 rounded-md border border-slate-300 bg-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3"
                    >
                      <option>Pendente</option>
                      <option>Pago</option>
                      <option>Vencido</option>
                      <option>Isento</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="data_recebimento">Data Recebimento</Label>
                    <Input
                      id="data_recebimento"
                      type="date"
                      {...register("data_recebimento")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="forma_recebimento">Forma Recebimento</Label>
                    <select
                      id="forma_recebimento"
                      {...register("forma_recebimento")}
                      className="w-full h-10 rounded-md border border-slate-300 bg-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3"
                    >
                      <option>Pix</option>
                      <option>Dinheiro</option>
                      <option>Transferência</option>
                      <option>Cartão de Crédito</option>
                    </select>
                  </div>
                </div>
                <div>
                  <Button type="button" variant="ghost" disabled>
                    Gerar Recibo
                  </Button>
                  <p className="text-xs text-slate-400 mt-1">
                    A geração de PDF será implementada futuramente.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* --- Aba de Evolução (condicional) --- */}
            {canSeeEvolution && (
              <TabsContent value="evolution">
                <div className="p-6 space-y-4">
                  <div>
                    <Label htmlFor="notas_internas">
                      Evolução da Sessão (Notas Internas)
                    </Label>
                    <div className="rounded-md border border-slate-300 dark:border-slate-700 mt-1">
                      <div className="p-2 border-b border-slate-300 dark:border-slate-700 flex space-x-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Bold className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Italic className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                      <textarea
                        id="notas_internas"
                        {...register("notas_internas")}
                        className="min-h-[200px] w-full p-2 bg-transparent focus:outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Anexos</Label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-12 w-12 text-slate-400" />
                        <div className="flex text-sm text-slate-600 dark:text-slate-400">
                          <label
                            htmlFor="anexos"
                            className="relative cursor-pointer bg-white dark:bg-slate-800 rounded-md font-medium text-blue-600 hover:text-blue-500"
                          >
                            <span>Carregar arquivos</span>
                            <input
                              id="anexos"
                              type="file"
                              multiple
                              className="sr-only"
                            />
                          </label>
                          <p className="pl-1">ou arraste e solte</p>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-500">
                          PDF, DOCX, JPG, PNG até 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
        <div className="flex justify-end p-6 pt-4 space-x-2 border-t border-slate-200 dark:border-slate-700">
          <Button variant="ghost" type="button" onClick={internalClose}>
            Cancelar
          </Button>
          <Button type="submit">Salvar</Button>
        </div>
      </form>
    </Dialog>
  );
}
