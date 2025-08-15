import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User, Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Button } from "../ui/button";
import { CardHeader, CardTitle, CardDescription } from "../ui/card";
import { employeeSchema } from "@/schemas/employeeSchema";

interface FuncionarioModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function FuncionarioModal({ open, onClose, onSave }: FuncionarioModalProps) {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isCepLoading, setIsCepLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
    control,
  } = useForm({
    resolver: zodResolver(employeeSchema),
    mode: "onTouched",
  });

  const selectedRole = watch<string>("role");
  const professionalRoles = ["Médico(a)", "Dentista", "Enfermeiro(a)"];
  const showProfessionalFields = professionalRoles.includes(selectedRole);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, "");
    if (cep.length !== 8) return;

    setIsCepLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setValue("street", data.logradouro, { shouldValidate: true });
        setValue("neighborhood", data.bairro, { shouldValidate: true });
        setValue("city", data.localidade, { shouldValidate: true });
        setValue("state", data.uf, { shouldValidate: true });
      }
    } catch (error) {
      console.error("Erro ao buscar CEP:", error);
    } finally {
      setIsCepLoading(false);
    }
  };

  useEffect(() => {
    const roleProfileMap: Record<string, string> = {
      "Médico(a)": "Profissional da Saúde",
      Dentista: "Profissional da Saúde",
      "Enfermeiro(a)": "Profissional da Saúde",
      Recepcionista: "Padrão Recepção",
      Administrativo: "Financeiro",
    };
    if (selectedRole && roleProfileMap[selectedRole]) {
      setValue("accessProfile", roleProfileMap[selectedRole]);
    }
  }, [selectedRole, setValue]);

  const onSubmit = (data: any) => {
    console.log("Dados do funcionário:", data);
    onSave(data);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} size="4xl">
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Cadastro de Funcionário</CardTitle>
          <CardDescription>
            Preencha os dados para cadastrar um novo membro na equipe.
          </CardDescription>
        </CardHeader>
        <div className="max-h-[70vh] overflow-y-auto -mt-6">
          <Tabs defaultValue="personal">
            <div className="px-6 border-b">
              <TabsList>
                <TabsTrigger value="personal">Informações Pessoais</TabsTrigger>
                <TabsTrigger value="contact">Contato e Endereço</TabsTrigger>
                <TabsTrigger value="professional">
                  Dados Profissionais
                </TabsTrigger>
                <TabsTrigger value="system">Acesso ao Sistema</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="personal">
              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1 flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-16 h-16 text-slate-400" />
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() =>
                      document.getElementById("photo-upload-employee")?.click()
                    }
                  >
                    <Upload className="w-4 h-4 mr-2" /> Carregar Foto
                  </Button>
                  <input
                    id="photo-upload-employee"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    {...register("photo")}
                    onChange={handlePhotoChange}
                  />
                </div>
                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="fullName">Nome Completo</Label>
                    <Input id="fullName" {...register("fullName")} />
                    {errors.fullName?.message && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.fullName?.message as string}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="cpf">CPF</Label>
                    <Input id="cpf" {...register("cpf")} />
                    {errors.cpf?.message && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.cpf?.message as string}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="rg">RG</Label>
                    <Input id="rg" {...register("rg")} />
                  </div>
                  <div>
                    <Label htmlFor="birthDate">Data de Nascimento</Label>
                    <Input
                      id="birthDate"
                      type="date"
                      {...register("birthDate")}
                    />
                    {errors.birthDate?.message && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.birthDate?.message as string}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="gender">Gênero</Label>
                    <select
                      id="gender"
                      {...register("gender")}
                      className="w-full h-10 rounded-md border border-slate-300 bg-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3"
                    >
                      <option value="">Selecione...</option>
                      <option>Feminino</option>
                      <option>Masculino</option>
                      <option>Outro</option>
                      <option>Prefiro não informar</option>
                    </select>
                    {errors.gender?.message && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.gender?.message as string}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="contact">
              <div className="p-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <Label htmlFor="personalEmail">E-mail Pessoal</Label>
                  <Input
                    id="personalEmail"
                    type="email"
                    {...register("personalEmail")}
                  />
                  {errors.personalEmail?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.personalEmail?.message as string}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="phone">Telefone Celular</Label>
                  <Input id="phone" {...register("phone")} />
                  {errors.phone?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.phone?.message as string}
                    </p>
                  )}
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="cep">CEP</Label>
                  <Input id="cep" {...register("cep")} onBlur={handleCepBlur} />
                  {isCepLoading && (
                    <p className="text-xs text-blue-500 mt-1">Buscando...</p>
                  )}
                  {errors.cep?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.cep?.message as string}
                    </p>
                  )}
                </div>
                <div className="md:col-span-3">
                  <Label htmlFor="street">Rua</Label>
                  <Input id="street" {...register("street")} />
                  {errors.street?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.street?.message as string}
                    </p>
                  )}
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="number">Número</Label>
                  <Input id="number" {...register("number")} />
                  {errors.number?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.number?.message as string}
                    </p>
                  )}
                </div>
                <div className="md:col-span-1">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input id="complement" {...register("complement")} />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input id="neighborhood" {...register("neighborhood")} />
                  {errors.neighborhood?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.neighborhood?.message as string}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="city">Cidade</Label>
                  <Input id="city" {...register("city")} />
                  {errors.city?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.city?.message as string}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input id="state" {...register("state")} />
                  {errors.state?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.state?.message as string}
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="professional">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="admissionDate">Data de Admissão</Label>
                  <Input
                    id="admissionDate"
                    type="date"
                    {...register("admissionDate")}
                  />
                  {errors.admissionDate?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.admissionDate?.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="role">Cargo/Função</Label>
                  <select
                    id="role"
                    {...register("role")}
                    className="w-full h-10 rounded-md border border-slate-300 bg-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3"
                  >
                    <option value="">Selecione...</option>
                    <option>Recepcionista</option>
                    <option>Administrativo</option>
                    <option>Enfermeiro(a)</option>
                    <option>Técnico(a) de Enfermagem</option>
                    <option>Médico(a)</option>
                    <option>Dentista</option>
                  </select>
                  {errors.role?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.role?.message as string}
                    </p>
                  )}
                </div>
                {showProfessionalFields && (
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 border-t pt-4 mt-4">
                    <div>
                      <Label htmlFor="professionalCouncil">
                        Conselho Profissional
                      </Label>
                      <select
                        id="professionalCouncil"
                        {...register("professionalCouncil")}
                        className="w-full h-10 rounded-md border border-slate-300 bg-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3"
                      >
                        <option value="">Selecione...</option>
                        <option>CRM</option>
                        <option>CRO</option>
                        <option>COREN</option>
                        <option>CRF</option>
                      </select>
                      {errors.professionalCouncil?.message && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.professionalCouncil?.message as string}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="councilNumber">Nº do Registro</Label>
                      <Input
                        id="councilNumber"
                        {...register("councilNumber")}
                      />
                      {errors.councilNumber?.message && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.councilNumber?.message as string}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="councilState">UF do Conselho</Label>
                      <select
                        id="councilState"
                        {...register("councilState")}
                        className="w-full h-10 rounded-md border border-slate-300 bg-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3"
                      >
                        <option value="">UF</option>
                        <option>AC</option>
                        <option>AL</option>
                        <option>AP</option>
                        <option>AM</option>
                        <option>BA</option>
                        <option>CE</option>
                        <option>DF</option>
                        <option>ES</option>
                        <option>GO</option>
                        <option>MA</option>
                        <option>MT</option>
                        <option>MS</option>
                        <option>MG</option>
                        <option>PA</option>
                        <option>PB</option>
                        <option>PR</option>
                        <option>PE</option>
                        <option>PI</option>
                        <option>RJ</option>
                        <option>RN</option>
                        <option>RS</option>
                        <option>RO</option>
                        <option>RR</option>
                        <option>SC</option>
                        <option>SP</option>
                        <option>SE</option>
                        <option>TO</option>
                      </select>
                      {errors.councilState?.message && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.councilState?.message as string}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="system">
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="accessEmail">E-mail de Acesso (Login)</Label>
                  <Input
                    id="accessEmail"
                    type="email"
                    {...register("accessEmail")}
                  />
                  {errors.accessEmail?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.accessEmail?.message as string}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="accessProfile">Perfil de Acesso</Label>
                  <select
                    id="accessProfile"
                    {...register("accessProfile")}
                    className="w-full h-10 rounded-md border border-slate-300 bg-transparent dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 px-3"
                  >
                    <option value="">Selecione...</option>
                    <option>Padrão Recepção</option>
                    <option>Financeiro</option>
                    <option>Admin</option>
                    <option>Profissional da Saúde</option>
                  </select>
                  {errors.accessProfile?.message && (
                    <p className="text-sm text-red-500 mt-1">
                      {errors.accessProfile?.message as string}
                    </p>
                  )}
                </div>
                <div className="md:col-span-2">
                  <Label>Status do Usuário</Label>
                  <div className="flex items-center space-x-2 mt-2">
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <button
                          type="button"
                          onClick={() => field.onChange(!field.value)}
                          className={cn(
                            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
                            field.value
                              ? "bg-blue-600"
                              : "bg-slate-300 dark:bg-slate-600"
                          )}
                        >
                          <span
                            className={cn(
                              "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
                              field.value ? "translate-x-6" : "translate-x-1"
                            )}
                          />
                        </button>
                      )}
                    />
                    <span className="text-sm">
                      {watch("status") ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="flex justify-end p-6 pt-4 space-x-2 border-t border-slate-200 dark:border-slate-700">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" disabled={!isValid}>
            Salvar Cadastro
          </Button>
        </div>
      </form>
    </Dialog>
  );
}
