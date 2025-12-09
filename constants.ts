
import { Procedure, User } from './types';

export const INITIAL_USERS: User[] = [
  {
    id: 'admin-user',
    username: 'admin',
    password: '123',
    name: 'Administrador',
    role: 'admin'
  },
  {
    id: 'std-user',
    username: 'user',
    password: '123',
    name: 'Usuário Padrão',
    role: 'user'
  }
];

export const INITIAL_DATA: Procedure[] = [
  {
    id: 'a1b2c3d4',
    date: '2024-07-20',
    region: 'Sudeste',
    state: 'SP',
    hospitalUnit: 'Hospital Sírio-Libanês',
    patientName: 'João Silva',
    procedureName: 'Consulta Cardiológica',
    qtyPerformed: 1,
    qtyBilled: 1,
    qtyPaid: 1,
    valuePerformed: 225,
    valueBilled: 225,
    valuePaid: 225,
    createdBy: 'Sistema',
    lastModifiedBy: 'Sistema',
    lastModifiedAt: new Date().toISOString()
  },
  {
    id: 'e5f6g7h8',
    date: '2024-07-21',
    region: 'Sul',
    state: 'RS',
    hospitalUnit: 'Hospital Moinhos de Vento',
    patientName: 'Maria Oliveira',
    procedureName: 'Exame de Sangue',
    qtyPerformed: 1,
    qtyBilled: 1,
    qtyPaid: 1,
    valuePerformed: 50,
    valueBilled: 50,
    valuePaid: 50,
    createdBy: 'Sistema',
    lastModifiedBy: 'Sistema',
    lastModifiedAt: new Date().toISOString()
  },
  {
    id: 'i9j0k1l2',
    date: '2024-07-22',
    region: 'Nordeste',
    state: 'BA',
    hospitalUnit: 'Hospital Aliança',
    patientName: 'Carlos Santos',
    procedureName: 'Fisioterapia Motora',
    qtyPerformed: 1,
    qtyBilled: 1,
    qtyPaid: 1,
    valuePerformed: 100,
    valueBilled: 100,
    valuePaid: 100,
    createdBy: 'Sistema',
    lastModifiedBy: 'Sistema',
    lastModifiedAt: new Date().toISOString()
  },
  {
    id: 'm3n4o5p6',
    date: '2024-07-23',
    region: 'Centro-Oeste',
    state: 'GO',
    hospitalUnit: 'Hospital Órion',
    patientName: 'Ana Pereira',
    procedureName: 'Raio-X de Tórax',
    qtyPerformed: 1,
    qtyBilled: 1,
    qtyPaid: 1,
    valuePerformed: 150,
    valueBilled: 150,
    valuePaid: 150,
    createdBy: 'Sistema',
    lastModifiedBy: 'Sistema',
    lastModifiedAt: new Date().toISOString()
  },
];

export const BRAZILIAN_REGIONS = [
  'Centro-Oeste',
  'Nordeste',
  'Norte',
  'Sudeste',
  'Sul',
];

export const BRAZILIAN_STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 
  'SP', 'SE', 'TO'
];
