/*
export const getClients = async (): Promise<Client[]> => {
    const response = await fetch(`${API_URL}/clients`);
    if (!response.ok) throw new Error('Falha ao buscar clientes');
    return response.json();
};
export const createClient = async (clientData: ClientSchema): Promise<Client> => {
    const response = await fetch(`${API_URL}/clients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
    });
    if (!response.ok) throw new Error('Falha ao criar cliente');
    return response.json();
};
export const updateClient = async (id: number, clientData: ClientSchema): Promise<Client> => {
    const response = await fetch(`${API_URL}/clients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clientData),
    });
    if (!response.ok) throw new Error('Falha ao atualizar cliente');
    return response.json();
};
export const deleteClient = async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/clients/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('Falha ao deletar cliente');
};
*/