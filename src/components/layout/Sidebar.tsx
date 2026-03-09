import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  FileText,
  CreditCard,
  Receipt,
  Users,
  Briefcase,
  Upload,
  BarChart3,
  UserCircle2,
} from "lucide-react";

const navItemBase =
  "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition";
const navItemActive = "bg-sky-500 text-white";
const navItemIdle = "text-slate-800 hover:bg-slate-100";

const menuItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/employees", label: "Employees", icon: Users },
  { to: "/payroll", label: "Payroll", icon: CreditCard },
  { to: "/projects", label: "Projects", icon: FolderOpen },
  { to: "/invoices", label: "Invoices", icon: FileText },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/expenses", label: "Expenses", icon: Receipt },
  { to: "/clients", label: "Clients", icon: Users },
  { to: "/vendors", label: "Vendors", icon: Briefcase },
  { to: "/uploads", label: "Uploads", icon: Upload },
  { to: "/reports", label: "Reports", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-5 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-sky-500 text-white">
            ⚓
          </div>
          <div>
            <div className="text-[15px] font-semibold text-slate-900">
              Fathom Marine
            </div>
            <div className="text-sm text-slate-700">Consultants</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-4">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `${navItemBase} ${isActive ? navItemActive : navItemIdle}`
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 px-4 py-5">
        <div className="flex items-center gap-3 rounded-2xl p-2">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-600">
            <UserCircle2 size={22} />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900">
              Fathom Marine
            </div>
            <div className="truncate text-sm text-slate-800">
              Consultants
            </div>
            <div className="text-xs text-slate-500">Finance Manager</div>
          </div>
        </div>
      </div>
    </aside>
  );
}