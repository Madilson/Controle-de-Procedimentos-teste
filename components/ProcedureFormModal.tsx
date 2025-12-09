
import React, { useState, useEffect } from 'react';
import { Procedure, Role } from '../types';

type ProcedureFormData = Omit<Procedure, 'id'>;

interface ProcedureFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (procedure: Omit<Procedure, 'id'> & { id?: string }) => void;
  procedureToEdit: Procedure | null;
  regions: string[];
  states: string[];
  procedureNames: string[];
  currentUserRole: Role;
}

const initialFormState: ProcedureFormData = {
  date: new Date().toISOString().split('T')[0],
  region: '',
  state: '',
  hospitalUnit: '',
  patientName: '',
  procedureName: '',
  qtyPerformed: 1, // Default to 1
  qtyBilled: 0,
  qtyPaid: 0,
  valuePerformed: 0,
  valueBilled: 0,
  valuePaid: 0,
  // Initialize audit fields safely
  createdBy: '',
  lastModifiedBy: '',
  lastModifiedAt: '',
};

const fieldLabels: Record<Exclude<keyof ProcedureFormData, 'lastModifiedBy' | 'lastModifiedAt' | 'createdBy' | 'qtyPerformed' | 'qtyBilled' | 'qtyPaid' | 'valueBilled' | 'valuePaid'>, string> = {
  date: 'Data do Procedimento',
  region: 'Região',
  state: 'Estado (UF)',
  hospitalUnit: 'Unidade Hospitalar',
  patientName: 'Nome do Paciente',
  procedureName: 'Nome do Procedimento',
  valuePerformed: 'Valor Realizado (R$)',
};

const formatCurrencyForDisplay = (num: number): string => {
  if (typeof num !== 'number' || isNaN(num)) return '';
  // Format the number to a string with 2 decimal places, then replace dot with comma
  const formatted = num.toFixed(2).replace('.', ',');
  // Add dot as a thousands separator
  const parts = formatted.split(',');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return parts.join(',');
};


const ProcedureFormModal: React.FC<ProcedureFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  procedureToEdit,
  regions,
  states,
  procedureNames,
  currentUserRole
}) => {
  const [formData, setFormData] = useState<ProcedureFormData>(initialFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof ProcedureFormData, string>>>({});
  
  // Local state for checkboxes
  const [isBilled, setIsBilled] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const canEditStatus = currentUserRole === 'admin' || currentUserRole === 'faturamento';

  const validate = (data: ProcedureFormData): Partial<Record<keyof ProcedureFormData, string>> => {
    const newErrors: Partial<Record<keyof ProcedureFormData, string>> = {};

    // Required fields
    if (!data.procedureName.trim()) newErrors.procedureName = 'Este campo é obrigatório.';
    if (!data.hospitalUnit.trim()) newErrors.hospitalUnit = 'Este campo é obrigatório.';
    if (!data.patientName.trim()) newErrors.patientName = 'Este campo é obrigatório.';
    if (!data.date) newErrors.date = 'Este campo é obrigatório.';
    if (!data.region) newErrors.region = 'Este campo é obrigatório.';
    if (!data.state) newErrors.state = 'Este campo é obrigatório.';

    // Date validation
    if (data.date) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date
        const procedureDate = new Date(data.date + 'T00:00:00'); // Ensure timezone consistency
        if (procedureDate > today) {
            newErrors.date = 'A data não pode ser no futuro.';
        }
    }

    // Value validation
    if (data.valuePerformed < 0) newErrors.valuePerformed = 'O valor não pode ser negativo.';

    return newErrors;
  };

  useEffect(() => {
    if (procedureToEdit) {
      setFormData(procedureToEdit);
      // Initialize checkboxes based on existing data
      setIsBilled(procedureToEdit.qtyBilled > 0);
      setIsPaid(procedureToEdit.qtyPaid > 0);
    } else {
      setFormData(initialFormState);
      setIsBilled(false);
      setIsPaid(false);
    }
    setErrors({}); // Reset errors when modal opens or procedure changes
  }, [procedureToEdit, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    // Clear the error for the field being edited
    if (errors[name as keyof ProcedureFormData]) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name as keyof ProcedureFormData];
          return newErrors;
        });
    }
    
    if (name === 'valuePerformed') {
      const digitsOnly = value.replace(/\D/g, '');
      if (digitsOnly === '') {
          setFormData((prev) => ({ ...prev, [name]: 0 }));
          return;
      }
      const numberValue = Number(digitsOnly) / 100;
      setFormData((prev) => ({
          ...prev,
          [name]: isNaN(numberValue) ? 0 : numberValue,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    
    // Logic for checkbox dependencies
    // If Billed is checked: qtyBilled = 1, valueBilled = valuePerformed
    // If Paid is checked: qtyPaid = 1, valuePaid = valuePerformed
    
    const dataToSave = {
        ...formData,
        qtyPerformed: 1, // Always adds 1
        
        qtyBilled: isBilled ? 1 : 0,
        valueBilled: isBilled ? formData.valuePerformed : 0,

        qtyPaid: isPaid ? 1 : 0,
        valuePaid: isPaid ? formData.valuePerformed : 0,

        id: procedureToEdit?.id 
    };
    
    onSave(dataToSave);
  };

  if (!isOpen) return null;
  
  const commonInputClass = "block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm text-gray-900 dark:text-white";
  const errorInputClass = "border-red-500 dark:border-red-500 focus:ring-red-500 focus:border-red-500";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            {procedureToEdit ? 'Editar Procedimento' : 'Adicionar Novo Procedimento'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} noValidate>
          <div className="p-6 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="procedureName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{fieldLabels.procedureName}</label>
                  <input
                    type="text"
                    id="procedureName"
                    name="procedureName"
                    value={formData.procedureName}
                    onChange={handleChange}
                    className={`${commonInputClass} ${errors.procedureName ? errorInputClass : ''}`}
                    required
                    list="procedure-names-datalist"
                  />
                  <datalist id="procedure-names-datalist">
                    {procedureNames.map(name => <option key={name} value={name} />)}
                  </datalist>
                  {errors.procedureName && <p className="mt-1 text-sm text-red-600">{errors.procedureName}</p>}
                </div>

                <div>
                  <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{fieldLabels.patientName}</label>
                  <input
                    type="text"
                    id="patientName"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    className={`${commonInputClass} ${errors.patientName ? errorInputClass : ''}`}
                    required
                    placeholder="Nome completo do paciente"
                  />
                  {errors.patientName && <p className="mt-1 text-sm text-red-600">{errors.patientName}</p>}
                </div>
            </div>

            <div>
              <label htmlFor="hospitalUnit" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{fieldLabels.hospitalUnit}</label>
              <input
                type="text"
                id="hospitalUnit"
                name="hospitalUnit"
                value={formData.hospitalUnit}
                onChange={handleChange}
                className={`${commonInputClass} ${errors.hospitalUnit ? errorInputClass : ''}`}
                required
              />
               {errors.hospitalUnit && <p className="mt-1 text-sm text-red-600">{errors.hospitalUnit}</p>}
            </div>
            
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{fieldLabels.date}</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`${commonInputClass} ${errors.date ? errorInputClass : ''}`}
                required
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="region" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{fieldLabels.region}</label>
                  <select
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className={`${commonInputClass} ${errors.region ? errorInputClass : ''}`}
                    required
                  >
                    <option value="" disabled>Selecione uma região</option>
                    {regions.map(region => <option key={region} value={region}>{region}</option>)}
                  </select>
                  {errors.region && <p className="mt-1 text-sm text-red-600">{errors.region}</p>}
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{fieldLabels.state}</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={`${commonInputClass} ${errors.state ? errorInputClass : ''}`}
                    required
                  >
                    <option value="" disabled>Selecione um estado</option>
                    {states.map(state => <option key={state} value={state}>{state}</option>)}
                  </select>
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>
            </div>
            
            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-100 dark:border-blue-800">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Valores e Status
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div>
                        <label htmlFor="valuePerformed" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{fieldLabels.valuePerformed}</label>
                        <input 
                            type="text" 
                            inputMode="decimal" 
                            id="valuePerformed" 
                            name="valuePerformed" 
                            value={formatCurrencyForDisplay(formData.valuePerformed)} 
                            onChange={handleChange} 
                            className={`${commonInputClass} ${errors.valuePerformed ? errorInputClass : ''} text-lg font-semibold`} 
                            required 
                        />
                        {errors.valuePerformed && <p className="mt-1 text-sm text-red-600">{errors.valuePerformed}</p>}
                    </div>

                    <div className="flex flex-col space-y-3 pt-6 md:pt-1">
                        <label className={`flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 transition-colors ${!canEditStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600'}`}>
                            <input 
                                type="checkbox" 
                                checked={isBilled} 
                                onChange={(e) => setIsBilled(e.target.checked)}
                                disabled={!canEditStatus}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900 dark:text-white">Faturado</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Marcar se já foi enviado para faturamento</span>
                            </div>
                        </label>

                        <label className={`flex items-center space-x-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 transition-colors ${!canEditStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600'}`}>
                            <input 
                                type="checkbox" 
                                checked={isPaid} 
                                onChange={(e) => setIsPaid(e.target.checked)}
                                disabled={!canEditStatus}
                                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
                            />
                            <div className="flex flex-col">
                                <span className="font-medium text-gray-900 dark:text-white">Pago</span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">Marcar se o pagamento já foi recebido</span>
                            </div>
                        </label>
                    </div>
                </div>
                
                <p className="text-xs text-gray-500 mt-4 italic">* A quantidade realizada será registrada automaticamente como 1.</p>
                {!canEditStatus && (
                    <p className="text-xs text-orange-500 mt-2 font-medium">
                        * Apenas administradores e faturamento podem alterar o status de pagamento.
                    </p>
                )}
            </div>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-900/50 flex justify-end items-center space-x-4 rounded-b-lg sticky bottom-0 z-10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProcedureFormModal;