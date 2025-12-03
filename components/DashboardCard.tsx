import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, colorClass }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 transition-transform duration-300 hover:scale-[1.02]">
      <div className={`rounded-full p-2 md:p-3 ${colorClass} self-start md:self-center`}>
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs md:text-sm font-medium text-gray-500 dark:text-gray-400 truncate w-full">{title}</p>
        <p 
          className="mt-0.5 md:mt-1 text-lg md:text-2xl font-semibold text-gray-900 dark:text-white truncate"
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