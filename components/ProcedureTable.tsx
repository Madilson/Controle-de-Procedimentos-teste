
import React, { useMemo } from 'react';
import { Procedure, Role } from '../types';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';

interface ProcedureTableProps {
  procedures: Procedure[];
  onEdit: (procedure: Procedure) => void;
  onDelete: (id: string) => void;
  onStatusChange: (procedure: Procedure, type: 'billed' | 'paid', value: boolean) => void;
  currentUserRole: Role;
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

const ProcedureTable: React.FC<ProcedureTableProps> = ({ procedures, onEdit, onDelete, onStatusChange, currentUserRole }) => {
  const totals = useMemo(() => {
    return procedures.reduce(
      (acc, proc) => {
        acc.qtyPerformed += proc.qtyPerformed;
        acc.qtyBilled += proc.qtyBilled;
        acc.qtyPaid += proc.qtyPaid;
        acc.valuePerformed += proc.valuePerformed;
        acc.valueBilled += proc.valueBilled;
        acc.valuePaid += proc.valuePaid;
        return acc;
      },
      {
        qtyPerformed: 0,
        qtyBilled: 0,
        qtyPaid: 0,
        valuePerformed: 0,
        valueBilled: 0,
        valuePaid: 0,
      }
    );
  }, [procedures]);

  const canEditStatus = currentUserRole === 'admin' || currentUserRole === 'faturamento';

  const thClasses = "px-4 lg:px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider";
  const tdClasses = "px-4 lg:px-6 py-4 text-sm";

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
      {/* --- DESKTOP/TABLET TABLE --- */}
      <div className="overflow-x-auto hidden md:block">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className={thClasses}>Data</th>
              <th scope="col" className={`${thClasses} hidden md:table-cell`}>Região</th>
              <th scope="col" className={`${thClasses} hidden md:table-cell`}>Estado</th>
              <th scope="col" className={`${thClasses} hidden lg:table-cell`}>Unidade Hospitalar</th>
              <th scope="col" className={thClasses}>Paciente</th>
              <th scope="col" className={thClasses}>Procedimento</th>
              <th scope="col" className={`${thClasses} hidden lg:table-cell`}>Registrado Por</th>
              <th scope="col" className={`${thClasses} text-center`}>Status</th>
              <th scope="col" className={`${thClasses} hidden lg:table-cell`}>Valor</th>
              <th scope="col" className={thClasses}>Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {procedures.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  Nenhum procedimento encontrado.
                </td>
              </tr>
            ) : (
              procedures.map((proc) => (
                <tr 
                  key={proc.id} 
                  className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200 group"
                >
                  <td className={`${tdClasses} text-gray-900 dark:text-gray-200`}>{formatDate(proc.date)}</td>
                  <td className={`${tdClasses} text-gray-500 dark:text-gray-300 hidden md:table-cell`}>{proc.region}</td>
                  <td className={`${tdClasses} text-gray-500 dark:text-gray-300 hidden md:table-cell`}>{proc.state}</td>
                  <td className={`${tdClasses} text-gray-500 dark:text-gray-300 hidden lg:table-cell break-words`}>{proc.hospitalUnit}</td>
                  <td className={`${tdClasses} text-gray-900 dark:text-white font-medium`}>{proc.patientName || '-'}</td>
                  <td className={`${tdClasses} font-medium text-gray-900 dark:text-white break-words relative`}>
                    {proc.procedureName}
                  </td>
                  <td className={`${tdClasses} text-gray-500 dark:text-gray-300 hidden lg:table-cell`}>
                    <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-white font-medium">
                            {proc.createdBy || '-'}
                        </span>
                        {proc.lastModifiedBy && proc.lastModifiedBy !== proc.createdBy && (
                            <span className="text-[10px] text-gray-400">
                                Alt: {proc.lastModifiedBy}
                            </span>
                        )}
                    </div>
                  </td>
                  <td className={`${tdClasses} text-center`}>
                     <div className="flex flex-col space-y-2 items-start justify-center pl-4">
                        <label className={`inline-flex items-center space-x-2 ${canEditStatus ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                            <input 
                                type="checkbox" 
                                checked={proc.qtyBilled > 0} 
                                onChange={(e) => onStatusChange(proc, 'billed', e.target.checked)}
                                disabled={!canEditStatus}
                                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300 dark:border-gray-500 dark:bg-gray-700"
                            />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Faturado</span>
                        </label>
                        <label className={`inline-flex items-center space-x-2 ${canEditStatus ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}>
                            <input 
                                type="checkbox" 
                                checked={proc.qtyPaid > 0} 
                                onChange={(e) => onStatusChange(proc, 'paid', e.target.checked)}
                                disabled={!canEditStatus}
                                className="rounded text-green-600 focus:ring-green-500 h-4 w-4 border-gray-300 dark:border-gray-500 dark:bg-gray-700"
                            />
                            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Pago</span>
                        </label>
                     </div>
                  </td>
                  <td className={`${tdClasses} text-green-600 dark:text-green-400 font-medium hidden lg:table-cell`}>{formatCurrency(proc.valuePerformed)}</td>
                  <td className={tdClasses}>
                    <div className="flex items-center space-x-3">
                      <button onClick={() => onEdit(proc)} className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
                        <EditIcon className="w-5 h-5" />
                      </button>
                      {currentUserRole === 'admin' && (
                        <button onClick={() => onDelete(proc.id)} className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition-colors">
                          <TrashIcon className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
          {procedures.length > 0 && (
            <tfoot className="bg-gray-100 dark:bg-gray-700/50 border-t-2 border-gray-200 dark:border-gray-700">
                <tr className="font-bold text-gray-800 dark:text-gray-100">
                <td className="hidden lg:table-cell px-4 py-3 text-right text-sm uppercase" colSpan={8}>Total Valor Realizado</td>
                <td className="hidden md:table-cell lg:hidden px-4 py-3 text-right text-sm uppercase" colSpan={5}>Total</td>
                
                <td className={`${tdClasses} py-3 text-green-700 dark:text-green-400 hidden lg:table-cell`}>{formatCurrency(totals.valuePerformed)}</td>
                <td className={`${tdClasses} py-3 hidden md:table-cell`}></td>
                </tr>
            </tfoot>
          )}
        </table>
      </div>
      
      {/* --- MOBILE CARD LIST (Optimized) --- */}
      <div className="md:hidden">
        {procedures.length === 0 ? (
          <div className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
            Nenhum procedimento encontrado.
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {procedures.map((proc) => (
              <div key={proc.id} className="p-4 space-y-3 bg-white dark:bg-gray-800">
                
                {/* Header: Title and Actions */}
                <div className="flex justify-between items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight break-words">
                            {proc.procedureName}
                        </h3>
                    </div>
                    <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                        {proc.patientName || 'Paciente N/A'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{proc.hospitalUnit}</p>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0 bg-gray-50 dark:bg-gray-700/50 rounded-lg p-1">
                    <button onClick={() => onEdit(proc)} className="p-1.5 text-primary-600 hover:text-primary-800 dark:text-primary-400">
                      <EditIcon className="w-4 h-4" />
                    </button>
                    {currentUserRole === 'admin' && (
                      <button onClick={() => onDelete(proc.id)} className="p-1.5 text-red-600 hover:text-red-800 dark:text-red-400">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Meta Info */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-2">
                             <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{formatDate(proc.date)}</span>
                             <span>{proc.state}</span>
                        </div>
                        {proc.lastModifiedBy && (
                            <span className="mt-1 text-[10px] text-gray-400">Alt: {proc.lastModifiedBy}</span>
                        )}
                    </div>
                    
                    {/* Status Checkboxes for Mobile */}
                    <div className="flex gap-3">
                        <label className={`flex items-center space-x-1 ${canEditStatus ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600`}>
                            <input 
                                type="checkbox" 
                                checked={proc.qtyBilled > 0} 
                                onChange={(e) => onStatusChange(proc, 'billed', e.target.checked)}
                                disabled={!canEditStatus}
                                className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300 dark:border-gray-500"
                            />
                            <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Fat.</span>
                        </label>
                        <label className={`flex items-center space-x-1 ${canEditStatus ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded border border-gray-200 dark:border-gray-600`}>
                            <input 
                                type="checkbox" 
                                checked={proc.qtyPaid > 0} 
                                onChange={(e) => onStatusChange(proc, 'paid', e.target.checked)}
                                disabled={!canEditStatus}
                                className="rounded text-green-600 focus:ring-green-500 h-4 w-4 border-gray-300 dark:border-gray-500"
                            />
                            <span className="text-[10px] font-medium text-gray-700 dark:text-gray-300">Pago</span>
                        </label>
                    </div>
                </div>

                {/* Value Row */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-700">
                     <div className="text-left">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Qtd.</p>
                        <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{proc.qtyPerformed}</p>
                    </div>
                     <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Valor</p>
                        <p className="font-bold text-green-600 dark:text-green-400 text-sm">{formatCurrency(proc.valuePerformed)}</p>
                    </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProcedureTable;