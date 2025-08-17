// Caminho: src/components/modals/SessionModal.tsx
import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";

// O tipo de dado do formulário inferido a partir do schema
type SessionFormData = z.infer<typeof sessionSchema>;

// Define as props que o componente espera receber
interface SessionModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: SessionFormData) => void;
  userRole: Role;
  clients?: Client[];
  editingData?: Session | null; // Dados da sessão que está sendo editada
  onDateClickData?: { date: Date; time: string } | null; // Dados para pré-preencher
}

export function SessionModal({
  open,
  onClose,
  onSave,
  userRole,
  clients = [],
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
      duracaoMinutos: 50,
      tipoSessao: "Online",
      statusSessao: "Pendente",
      valorSessao: 0,
      statusPagamento: "Pendente",
      formaRecebimento: "Pix",
    },
  });

  // Observa o campo 'recorrencia' para mostrar/ocultar o campo de data final
  const recorrencia = watch("recorrencia");

  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSearchTerm(value);
    setValue("pacienteId", "");
    setIsOpen(true);
    setHighlightIndex(0);
  };

  const handleSelect = (client: Client) => {
    setSearchTerm(client.name);
    setValue("pacienteId", client.id.toString());
    setIsOpen(false);
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (!isOpen || filteredClients.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightIndex((prev) => (prev + 1) % filteredClients.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightIndex(
        (prev) => (prev - 1 + filteredClients.length) % filteredClients.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightIndex >= 0) {
        handleSelect(filteredClients[highlightIndex]);
      }
    }
  };

  // Efeito para popular o formulário quando o modal abre
  useEffect(() => {
    if (open) {
      if (editingData) {
        const data = editingData;
        setValue("pacienteId", data.pacienteId?.toString() || "");
        setValue("tituloSessao", data.tituloSessao);
        setValue("dataSessao", data.dataSessao);
        setValue("horaInicio", data.horaInicio);
        setValue("duracaoMinutos", data.duracaoMinutos);
        setValue("tipoSessao", data.tipoSessao);
        setValue("statusSessao", data.statusSessao);
        setValue("valorSessao", data.valorSessao);
        setValue("statusPagamento", data.statusPagamento || "Pendente");
        setValue("dataRecebimento", data.dataRecebimento || "");
        setValue("formaRecebimento", data.formaRecebimento || "Pix");
        setValue("recorrencia", data.recorrencia);
        setValue("recorrenciaDataFim", data.recorrenciaDataFim || "");
        setValue("notasAgendamento", data.notasAgendamento || "");
        setValue("notasInternas", data.notasInternas || "");
        const selectedClient = clients.find(
          (c) => c.id === data.pacienteId
        );
        setSearchTerm(selectedClient ? selectedClient.name : "");
      } else if (onDateClickData) {
        // Modo de criação a partir de um clique no calendário
        reset(); // Limpa o form antes de setar novos valores
        setValue(
          "dataSessao",
          onDateClickData.date.toISOString().split("T")[0]
        );
        setValue("horaInicio", onDateClickData.time);
        setSearchTerm("");
      } else {
        // Modo de criação a partir do botão "Novo Agendamento"
        reset();
        setSearchTerm("");
      }
    }
  }, [clients, editingData, onDateClickData, open, reset, setValue]);

  const onSubmit = (data: SessionFormData) => {
    onSave(data);
    internalClose();
  };

  const internalClose = () => {
    reset(); // Limpa os campos do formulário
    setSearchTerm("");
    setIsOpen(false);
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
              <div className="p-6 space-y-4 min-h-[450px]">
                <div className="relative">
                  <Label htmlFor="pacienteId">Paciente</Label>
                  <Input
                    id="pacienteId"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsOpen(true)}
                    onBlur={() => setTimeout(() => setIsOpen(false), 100)}
                    placeholder="Selecione um paciente"
                    disabled={!!editingData}
                    autoComplete="off"
                  />
                  <input type="hidden" {...register("pacienteId")} />
                  {isOpen && filteredClients.length > 0 && (
                    <ul className="absolute z-10 w-full border border-slate-300 dark:border-slate-700 mt-1 rounded-md max-h-40 overflow-y-auto bg-white dark:bg-slate-950">
                      {filteredClients.map((client, idx) => (
                        <li
                          key={client.id}
                          onMouseDown={() => handleSelect(client)}
                          className={cn(
                            "px-3 py-2 cursor-pointer",
                            idx === highlightIndex && "bg-blue-500 text-white"
                          )}
                        >
                          {client.name}
                        </li>
                      ))}
                    </ul>
                  )}
                  {errors.pacienteId && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.pacienteId.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="tituloSessao">Título</Label>
                  <Input id="tituloSessao" {...register("tituloSessao")} />
                  {errors.tituloSessao && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.tituloSessao.message}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="dataSessao">Data</Label>
                    <Input
                      id="dataSessao"
                      type="date"
                      {...register("dataSessao")}
                    />
                    {errors.dataSessao && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.dataSessao.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="horaInicio">Hora</Label>
                    <Input
                      id="horaInicio"
                      type="time"
                      {...register("horaInicio")}
                    />
                    {errors.horaInicio && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.horaInicio.message}
                      </p>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="tipoSessao">Tipo</Label>
                    <select
                      id="tipoSessao"
                      {...register("tipoSessao")}
                      className="w-full h-10 rounded-md border border-slate-300 bg-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3"
                    >
                      <option>Online</option>
                      <option>Presencial</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="statusSessao">Status</Label>
                    <select
                      id="statusSessao"
                      {...register("statusSessao")}
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
                      <Label htmlFor="recorrenciaDataFim">Repetir até</Label>
                      <Input
                        id="recorrenciaDataFim"
                        type="date"
                        {...register("recorrenciaDataFim")}
                      />
                      {errors.recorrenciaDataFim && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.recorrenciaDataFim.message}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="notasAgendamento">
                    Notas do Agendamento
                  </Label>
                  <textarea
                    id="notasAgendamento"
                    {...register("notasAgendamento")}
                    className="min-h-[100px] w-full p-2 bg-transparent focus:outline-none rounded-md border border-slate-300 dark:border-slate-700 mt-1"
                  />
                </div>
              </div>
            </TabsContent>

            {/* --- Aba Financeira --- */}
            <TabsContent value="financial">
              <div className="p-6 space-y-4 min-h-[450px]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="valorSessao">Valor (R$)</Label>
                    <Input
                      id="valorSessao"
                      type="number"
                      step="0.01"
                      {...register("valorSessao")}
                    />
                    {errors.valorSessao && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.valorSessao.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="statusPagamento">
                      Status do Pagamento
                    </Label>
                    <select
                      id="statusPagamento"
                      {...register("statusPagamento")}
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
                    <Label htmlFor="dataRecebimento">Data Recebimento</Label>
                    <Input
                      id="dataRecebimento"
                      type="date"
                      {...register("dataRecebimento")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="formaRecebimento">Forma Recebimento</Label>
                    <select
                      id="formaRecebimento"
                      {...register("formaRecebimento")}
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
                <div className="p-6 space-y-4 min-h-[450px]">
                  <div>
                    <Label htmlFor="notasInternas">
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
                        id="notasInternas"
                        {...register("notasInternas")}
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
