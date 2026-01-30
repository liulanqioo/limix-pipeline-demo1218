import React from 'react';
import { Database, Stethoscope, Wand2, Sparkles, ListTodo, BarChart3, ScanSearch, Rocket, ShieldCheck } from 'lucide-react';
import { NAV_ITEMS } from '../../mock/data';
import { cn } from '../../utils';

const iconMap = {
  Database,
  Stethoscope,
  Wand2,
  Sparkles,
  ListTodo,
  BarChart3,
  ScanSearch,
  Rocket,
  ShieldCheck,
};

export const SideNav = ({ active, setActive }) => {
  return (
    <div className="w-full md:w-64 flex-shrink-0 flex flex-col gap-1 bg-white p-2 rounded-2xl border shadow-sm h-fit">
      {NAV_ITEMS.map((item) => {
        const Icon = iconMap[item.icon] || Database;
        const isActive = active === item.key;
        return (
          <button
            key={item.key}
            onClick={() => setActive(item.key)}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
              isActive
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-gray-600 hover:bg-gray-50 hover:text-primary"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-gray-500")} />
            {item.name}
            {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white" />}
          </button>
        );
      })}
    </div>
  );
};
