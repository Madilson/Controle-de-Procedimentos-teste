import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-3 md:p-6 flex flex-col items-start space-y-2 transition-transform duration-300 hover:scale-[1.02]">
      <div className="flex items-center space-x-2 w-full">
         <div className={`rounded-full p-2 ${colorClass}`}>
            {icon}
         </div>
         <p className="text-xs font-medium text-gray-500 dark:text-gray-400 truncate flex-1">{title}</p>
      </div>
      <div className="w-full">
        <p 
          className="text-lg md:text-2xl font-semibold text-gray-900 dark:text-white truncate"
          data-tooltip-id="dashboard-card-tooltip"
          data-tooltip-content={String(value)}
        >
          {value}
        </p>
      </div>
    </div>
  );
};

export default DashboardCard;