import type {Appointment, ItemToDelete, Role, SelectedSlot, UserType} from "@/features/admin/schemas.ts";
import type {Client} from "@/features/clients/schemas.ts";
import type {Service} from "@/features/services/schemas.ts";
import {useState} from 'react';
import { Header } from "./components/shared/Header";
import { AppointmentDetailsModal } from "./components/shared/modals/AppointmentDetailsModal";
import { DeleteConfirmationModal } from "./components/shared/modals/DeleteConfirmationModal";
import { NewAppointmentModal } from "./components/shared/modals/NewAppointmentModal";
import { SaleSuccessModal } from "./components/shared/modals/SaleSuccessModal";
import { AdminView } from "./features/admin/AdminView";
import { UserForm } from "./features/admin/components/UserForm";
import { AgendaView } from "./features/agenda/AgendaView";
import { LoginView } from "./features/auth/LoginView";
import { ClientForm } from "./features/clients/components/ClientForm";
import { ClientList } from "./features/clients/components/ClientList";
import { DashboardView } from "./features/dashboard/DashboardView";
import { FinancialView } from "./features/financial/FinancialView";
import { PDVView } from "./features/pdv/PDVView";
import { ProfileView } from "./features/profile/ProfileView";
import { ServiceForm } from "./features/services/components/ServiceForm";
import { ServiceList } from "./features/services/components/ServiceList";
import { SettingsView } from "./features/settings/SettingsView";
import { cn } from "./lib/utils";
import { Sidebar } from "./components/shared/Sidebar";
import { initialClientsData, initialServicesData, initialUsersData } from "./mock";


export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [currentUserRole, setCurrentUserRole] = useState<Role | null>(null);
  const [currentViewRole, setCurrentViewRole] = useState<Role | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [clients, setClients] = useState<Client[]>(initialClientsData);
  const [services, setServices] = useState<Service[]>(initialServicesData);
  const [users, setUsers] = useState<UserType[]>(initialUsersData);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [cart, setCart] = useState<(Service & { quantity: number })[]>([]);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<ItemToDelete | null>(null);
  const [isAppointmentModalOpen, setAppointmentModalOpen] = useState<boolean>(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState<boolean>(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null);
  const [isSaleSuccessModalOpen, setSaleSuccessModalOpen] = useState<boolean>(false);
  const [lastSaleTotal, setLastSaleTotal] = useState<number>(0);

  // --- LÓGICA PARA BUSCAR DADOS DO BACKEND (COMENTADO) ---
  // Descomente este bloco quando seu backend (json-server) estiver rodando
  /*
  useEffect(() => {
    const fetchData = async () => {
      try {
        const clientsData = await getClients();
        const servicesData = await getServices();
        const usersData = await getUsers();
        setClients(clientsData);
        setServices(servicesData);
        setUsers(usersData);
      } catch (error) {
        console.error("Falha ao buscar dados do backend:", error);
        // Aqui você pode adicionar um toast ou uma mensagem de erro para o usuário
      }
    };

    fetchData();
  }, []);
  */

  const handleLogin = (role: Role) => {
    setCurrentUserRole(role);
    setCurrentViewRole(role);
    setIsLoggedIn(true);
    setActiveView('dashboard');
  };

  const handleSaveClient = (clientData: Client) => {
    const isEditing = clients.some(c => c.id === clientData.id);
    // Lógica com Backend (descomente para usar)
    /*
    try {
        if (isEditing) {
            const updatedClient = await updateClient(clientData.id, clientData);
            setClients(clients.map(c => c.id === clientData.id ? updatedClient : c));
        } else {
            const newClient = await createClient(clientData);
            setClients([...clients, newClient]);
        }
    } catch (error) {
        console.error("Falha ao salvar cliente:", error);
    }
    */

    // Lógica Mock (comente ou remova ao usar backend)
    if (isEditing) { setClients(clients.map(c => c.id === clientData.id ? clientData : c)); } else { setClients([...clients, clientData]); }

    setEditingClient(null);
    setActiveView('listClients');
  };
  const handleEditClient = (client: Client) => { setEditingClient(client); setActiveView('clientForm'); };
  const openDeleteClientModal = (client: Client) => { setItemToDelete({ type: 'client', data: client }); setDeleteModalOpen(true); };

  const handleSaveService = (serviceData: Service) => {
      const isEditing = services.some(s => s.id === serviceData.id);
      // Lógica Mock
      if (isEditing) { setServices(services.map(s => s.id === serviceData.id ? serviceData : s)); } else { setServices([...services, serviceData]); }
      setEditingService(null);
      setActiveView('listServices');
  };
  const handleEditService = (service: Service) => { setEditingService(service); setActiveView('serviceForm'); };
  const openDeleteServiceModal = (service: Service) => { setItemToDelete({ type: 'service', data: service }); setDeleteModalOpen(true); };

  const handleSaveUser = (userData: UserType) => {
      const isEditing = users.some(u => u.id === userData.id);
      // Lógica Mock
      if (isEditing) { setUsers(users.map(u => u.id === userData.id ? userData : u)); } else { setUsers([...users, userData]); }
      setEditingUser(null);
      setActiveView('adminPanel');
  };
  const handleEditUser = (user: UserType) => { setEditingUser(user); setActiveView('userForm'); };
  const openDeleteUserModal = (user: UserType) => { setItemToDelete({ type: 'user', data: user }); setDeleteModalOpen(true); };

  const handleOpenAppointmentModal = (date: Date, hour: string) => { setSelectedSlot({ date, hour }); setAppointmentModalOpen(true); };
  const handleOpenAppointmentDetails = (appointment: Appointment) => { setSelectedAppointment(appointment); setIsDetailsModalOpen(true); };
  const handleSaveAppointment = (clientId: string, serviceId: string) => {
    const client = clients.find(c => c.id === parseInt(clientId));
    const service = services.find(s => s.id === parseInt(serviceId));
    if (client && service && selectedSlot) {
        const newAppointment: Appointment = { id: Date.now(), ...selectedSlot, clientId: client.id, clientName: client.name, serviceId: service.id, serviceName: service.name };
        setAppointments([...appointments, newAppointment]);
        setAppointmentModalOpen(false);
        setSelectedSlot(null);
    }
  };
  const handleUpdateAppointment = (updatedData: Appointment) => {
    setAppointments(appointments.map(app => app.id === updatedData.id ? updatedData : app));
    setIsDetailsModalOpen(false);
    setSelectedAppointment(null);
  };
  const openDeleteAppointmentModal = (appointment: Appointment) => {
    setItemToDelete({ type: 'appointment', data: appointment });
    setIsDetailsModalOpen(false);
    setDeleteModalOpen(true);
  };

  const handleSaleComplete = (total: number) => { setLastSaleTotal(total); setSaleSuccessModalOpen(true); };
  const handleGoToPdvFromAppointment = (service: Service) => {
    setCart(currentCart => {
        const existingItem = currentCart.find(item => item.id === service.id);
        if (existingItem) { return currentCart.map(item => item.id === service.id ? { ...item, quantity: item.quantity + 1 } : item); }
        return [...currentCart, { ...service, quantity: 1 }];
    });
    setIsDetailsModalOpen(false);
    setActiveView('pdv');
  };

  const handleConfirmDelete = () => {
    if (!itemToDelete) return;
    const { type, data } = itemToDelete;

    // Lógica com Backend (descomente para usar)
    /*
    try {
        await deleteClient(data.id);
        setClients(clients.filter(c => c.id !== data.id));
    } catch(error) {
        console.error("Falha ao deletar:", error);
    }
    */

    // Lógica Mock
    if (type === 'client') { setClients(clients.filter(c => c.id !== data.id)); }
    else if (type === 'service') { setServices(services.filter(s => s.id !== data.id)); }
    else if (type === 'user') { setUsers(users.filter(u => u.id !== data.id)); }
    else if (type === 'appointment') { setAppointments(appointments.filter(a => a.id !== data.id)); }

    setDeleteModalOpen(false); setItemToDelete(null);
  };

  const themeStyles = `
    .theme-barbershop {
        --background: 220 13% 18%; --foreground: 210 40% 98%;
        --sidebar: 220 14% 10%; --card: 220 13% 22%;
        --card-foreground: 210 40% 98%; --popover: 220 14% 10%;
        --popover-foreground: 210 40% 98%; --primary: 38 92% 50%;
        --primary-foreground: 220 14% 10%; --secondary: 217 33% 17%;
        --secondary-foreground: 210 40% 98%; --muted: 217 33% 17%;
        --muted-foreground: 215 20% 65%; --accent: 217 33% 22%;
        --accent-foreground: 210 40% 98%; --destructive: 0 72% 51%;
        --destructive-foreground: 210 40% 98%; --border: 217 33% 27%;
        --input: 217 33% 22%; --ring: 38 92% 50%; --radius: 0.75rem;
    }`;

  const renderActiveView = () => {
    switch (activeView) {
        case 'listClients': return <ClientList clients={clients} setActiveView={setActiveView} onEdit={handleEditClient} onDelete={openDeleteClientModal} />;
        case 'clientForm': return <ClientForm setActiveView={setActiveView} onSave={handleSaveClient} clientToEdit={editingClient} />;
        case 'listServices': return <ServiceList services={services} setActiveView={setActiveView} onEdit={handleEditService} onDelete={openDeleteServiceModal} />;
        case 'serviceForm': return <ServiceForm setActiveView={setActiveView} onSave={handleSaveService} serviceToEdit={editingService} />;
        case 'agenda': return <AgendaView appointments={appointments} onOpenModal={handleOpenAppointmentModal} onOpenDetailsModal={handleOpenAppointmentDetails} currentDate={currentDate} setCurrentDate={setCurrentDate} />;
        case 'financeiro': return <FinancialView />;
        case 'pdv': return <PDVView services={services} onSaleComplete={handleSaleComplete} cart={cart} setCart={setCart} />;
        case 'perfil': return <ProfileView />;
        case 'configuracoes': return <SettingsView />;
        case 'adminPanel': return <AdminView users={users} onEdit={handleEditUser} onDelete={openDeleteUserModal} setActiveView={setActiveView} setCurrentViewRole={setCurrentViewRole} />;
        case 'userForm': return <UserForm setActiveView={setActiveView} onSave={handleSaveUser} userToEdit={editingUser} />;
        case 'dashboard': default: return <DashboardView />;
    }
  }

  if (!isLoggedIn || !currentViewRole) {
      return (
          <>
            <style>{themeStyles}</style>
            <div className="theme-barbershop"><LoginView onLogin={handleLogin} /></div>
          </>
      );
  }

  return (
    <>
      <style>{themeStyles}</style>
      <div className="theme-barbershop min-h-screen w-full bg-background text-foreground">
        <DeleteConfirmationModal isOpen={isDeleteModalOpen} onClose={() => setDeleteModalOpen(false)} onConfirm={handleConfirmDelete} itemName={itemToDelete ? ('name' in itemToDelete.data ? itemToDelete.data.name : `Agendamento de ${(itemToDelete.data as Appointment).clientName}`) : ''} />
        <NewAppointmentModal isOpen={isAppointmentModalOpen} onClose={() => setAppointmentModalOpen(false)} onSave={handleSaveAppointment} selectedSlot={selectedSlot} clients={clients} services={services} />
        <AppointmentDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} onSave={handleUpdateAppointment} onDelete={openDeleteAppointmentModal} onGoToPdv={handleGoToPdvFromAppointment} appointment={selectedAppointment} clients={clients} services={services} />
        <SaleSuccessModal isOpen={isSaleSuccessModalOpen} onClose={() => setSaleSuccessModalOpen(false)} total={lastSaleTotal} />
        <div className="flex">
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} activeView={activeView} setActiveView={(view) => { setActiveView(view); setEditingClient(null); setEditingService(null); setEditingUser(null); }} currentViewRole={currentViewRole} />
          {isSidebarOpen && ( <div onClick={() => setIsSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/60 sm:hidden"></div> )}
          <div className={cn( "flex flex-col flex-1 transition-all duration-300", isSidebarOpen ? "sm:ml-64" : "sm:ml-20" )}>
            <Header setIsSidebarOpen={setIsSidebarOpen} setActiveView={setActiveView} currentUserRole={currentUserRole!} currentViewRole={currentViewRole!} setCurrentViewRole={setCurrentViewRole} />
            <main className="flex flex-1 flex-col gap-4 p-4 sm:p-6 md:gap-8 md:p-8">
              {renderActiveView()}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}
