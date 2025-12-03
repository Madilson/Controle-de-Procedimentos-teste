import { Procedure, User } from '../types';
import { INITIAL_DATA, INITIAL_USERS } from '../constants';

// CONFIGURAÇÃO:
// Mude para 'true' se você hospedar o arquivo 'api.php' em um servidor PHP (XAMPP, Apache, etc).
// Mude para 'false' para usar o modo de demonstração local (localStorage).
const USE_PHP_BACKEND = false;
const API_URL = 'http://localhost/sistema-controle/api.php'; 

// Simulação de delay de rede para parecer uma aplicação real
const NETWORK_DELAY = 600;

class ApiService {
  
  // --- PROCEDIMENTOS ---

  async getProcedures(): Promise<Procedure[]> {
    if (USE_PHP_BACKEND) {
      const response = await fetch(`${API_URL}?endpoint=procedures`);
      if (!response.ok) throw new Error('Erro ao buscar dados do PHP');
      return await response.json();
    } else {
      // Modo Mock (Local)
      await this.delay();
      const stored = localStorage.getItem('procedures_data');
      if (stored) return JSON.parse(stored);
      // Se não houver dados, salva os iniciais
      localStorage.setItem('procedures_data', JSON.stringify(INITIAL_DATA));
      return INITIAL_DATA;
    }
  }

  async saveProcedure(procedure: Procedure): Promise<Procedure> {
    if (USE_PHP_BACKEND) {
      const response = await fetch(`${API_URL}?endpoint=procedures`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(procedure)
      });
      if (!response.ok) throw new Error('Erro ao salvar no PHP');
      return await response.json();
    } else {
      // Modo Mock (Local)
      await this.delay();
      const stored = await this.getProcedures();
      let updatedList;
      
      const existingIndex = stored.findIndex(p => p.id === procedure.id);
      if (existingIndex >= 0) {
        updatedList = stored.map(p => p.id === procedure.id ? procedure : p);
      } else {
        updatedList = [...stored, procedure];
      }
      
      localStorage.setItem('procedures_data', JSON.stringify(updatedList));
      return procedure;
    }
  }

  async deleteProcedure(id: string): Promise<void> {
    if (USE_PHP_BACKEND) {
        const response = await fetch(`${API_URL}?endpoint=procedures&id=${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error('Erro ao excluir no PHP');
    } else {
        // Modo Mock (Local)
        await this.delay();
        const stored = await this.getProcedures();
        const updatedList = stored.filter(p => p.id !== id);
        localStorage.setItem('procedures_data', JSON.stringify(updatedList));
    }
  }

  // --- USUÁRIOS & AUTH ---

  async login(username: string, pass: string): Promise<User | null> {
    if (USE_PHP_BACKEND) {
        try {
            const response = await fetch(`${API_URL}?endpoint=login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password: pass })
            });
            const data = await response.json();
            return data.success ? data.user : null;
        } catch (e) {
            console.error("Erro no login PHP:", e);
            return null;
        }
    } else {
        await this.delay();
        const users = await this.getUsers();
        return users.find(u => u.username === username && u.password === pass) || null;
    }
  }

  async getUsers(): Promise<User[]> {
    if (USE_PHP_BACKEND) {
        try {
            const response = await fetch(`${API_URL}?endpoint=users`);
            if (!response.ok) throw new Error('Erro ao buscar usuários PHP');
            return await response.json();
        } catch (e) {
             console.error("Erro ao buscar usuários", e);
             return [];
        }
    } else {
        await this.delay();
        const stored = localStorage.getItem('users_data');
        if (stored) return JSON.parse(stored);
        localStorage.setItem('users_data', JSON.stringify(INITIAL_USERS));
        return INITIAL_USERS;
    }
  }

  async createUser(user: User): Promise<void> {
      if (USE_PHP_BACKEND) {
        await fetch(`${API_URL}?endpoint=users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
      } else {
        await this.delay();
        const users = await this.getUsers();
        const updated = [...users, user];
        localStorage.setItem('users_data', JSON.stringify(updated));
      }
  }

  async deleteUser(id: string): Promise<void> {
      if (USE_PHP_BACKEND) {
        await fetch(`${API_URL}?endpoint=users&id=${id}`, {
            method: 'DELETE'
        });
      } else {
        await this.delay();
        const users = await this.getUsers();
        const updated = users.filter(u => u.id !== id);
        localStorage.setItem('users_data', JSON.stringify(updated));
      }
  }

  // Helper
  private delay() {
    return new Promise(resolve => setTimeout(resolve, NETWORK_DELAY));
  }
}

export const api = new ApiService();