import React, { useMemo } from 'react';
import { Procedure } from '../types';
import EditIcon from './icons/EditIcon';
import TrashIcon from './icons/TrashIcon';

interface ProcedureTableProps {
  procedures: Procedure[];
  onEdit: (procedure: Procedure) => void;
  onDelete: (id: string) => void;
  currentUserRole: 'admin' | 'user';
}

const formatCurrency = (value: number) => {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
}

const ProcedureTable: React.FC<ProcedureTableProps> = ({ procedures, onEdit, onDelete, currentUserRole }) => {
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
              <th scope="col" className={thClasses}>Procedimento</th>
              <th scope="col" className={`${thClasses} hidden lg:table-cell`}>Registrado Por</th>
              <th scope="col" className={`${thClasses} hidden lg:table-cell text-center`}>Qtd. Realizados</th>
              <th scope="col" className={`${thClasses} hidden lg:table-cell text-center`}>Qtd. Faturados</th>
              <th scope="col" className={`${thClasses} hidden lg:table-cell text-center`}>Qtd. Pagos</th>
              <th scope="col" className={`${thClasses} hidden lg:table-cell`}>Valor Realizado</th>
              <th scope="col" className={`${thClasses} hidden lg:table-cell`}>Valor Faturado</th>
              <th scope="col" className={thClasses}>Valor Pago</th>
              <th scope="col" className={thClasses}>Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {procedures.length === 0 ? (
              <tr>
                <td colSpan={13} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
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
                  <td className={`${tdClasses} font-medium text-gray-900 dark:text-white break-words relative`}>
                    {proc.procedureName}
                  </td>
                  <td className={`${tdClasses} text-gray-500 dark:text-gray-300 hidden lg:table-cell`}>
                    <div className="flex flex-col">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 self-start">
                            {proc.createdBy || '-'}
                        </span>
                        {proc.lastModifiedBy && proc.lastModifiedBy !== proc.createdBy && (
                            <span className="text-[10px] text-gray-400 mt-1">
                                Alt: {proc.lastModifiedBy}
                            </span>
                        )}
                    </div>
                  </td>
                  <td className={`${tdClasses} text-gray-500 dark:text-gray-300 text-center hidden lg:table-cell`}>{proc.qtyPerformed.toLocaleString('pt-BR')}</td>
                  <td className={`${tdClasses} text-gray-500 dark:text-gray-300 text-center hidden lg:table-cell`}>{proc.qtyBilled.toLocaleString('pt-BR')}</td>
                  <td className={`${tdClasses} text-gray-500 dark:text-gray-300 text-center hidden lg:table-cell`}>{proc.qtyPaid.toLocaleString('pt-BR')}</td>
                  <td className={`${tdClasses} text-green-600 dark:text-green-400 font-medium hidden lg:table-cell`}>{formatCurrency(proc.valuePerformed)}</td>
                  <td className={`${tdClasses} text-blue-600 dark:text-blue-400 font-medium hidden lg:table-cell`}>{formatCurrency(proc.valueBilled)}</td>
                  <td className={`${tdClasses} text-purple-600 dark:text-purple-400 font-medium`}>{formatCurrency(proc.valuePaid)}</td>
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
                <td className="hidden lg:table-cell px-4 py-3 text-right text-sm uppercase" colSpan={6}>Totais</td>
                <td className="hidden md:table-cell lg:hidden px-4 py-3 text-right text-sm uppercase" colSpan={4}>Totais</td>
                
                <td className={`${tdClasses} py-3 text-center hidden lg:table-cell`}>{totals.qtyPerformed.toLocaleString('pt-BR')}</td>
                <td className={`${tdClasses} py-3 text-center hidden lg:table-cell`}>{totals.qtyBilled.toLocaleString('pt-BR')}</td>
                <td className={`${tdClasses} py-3 text-center hidden lg:table-cell`}>{totals.qtyPaid.toLocaleString('pt-BR')}</td>
                <td className={`${tdClasses} py-3 text-green-700 dark:text-green-400 hidden lg:table-cell`}>{formatCurrency(totals.valuePerformed)}</td>
                <td className={`${tdClasses} py-3 text-blue-700 dark:text-blue-400 hidden lg:table-cell`}>{formatCurrency(totals.valueBilled)}</td>
                <td className={`${tdClasses} py-3 text-purple-700 dark:text-purple-400 hidden md:table-cell`}>{formatCurrency(totals.valuePaid)}</td>
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
                    <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight break-words">
                        {proc.procedureName}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{proc.hospitalUnit}</p>
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
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                     <span className="bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{formatDate(proc.date)}</span>
                     <span>•</span>
                     <span>{proc.state}</span>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
                    {/* Qty Row */}
                    <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Qtd Real.</p>
                        <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{proc.qtyPerformed}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Qtd Fat.</p>
                        <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{proc.qtyBilled}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[10px] text-gray-400 uppercase tracking-wide">Qtd Pago</p>
                        <p className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{proc.qtyPaid}</p>
                    </div>

                    {/* Value Row */}
                     <div className="text-center">
                        <p className="font-bold text-green-600 dark:text-green-400 text-xs">{formatCurrency(proc.valuePerformed)}</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-blue-600 dark:text-blue-400 text-xs">{formatCurrency(proc.valueBilled)}</p>
                    </div>
                    <div className="text-center">
                        <p className="font-bold text-purple-600 dark:text-purple-400 text-xs">{formatCurrency(proc.valuePaid)}</p>
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