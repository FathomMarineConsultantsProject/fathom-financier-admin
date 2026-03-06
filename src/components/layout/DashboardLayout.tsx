import { NavLink, Outlet } from "react-router-dom";

const navItem =
  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition";
const active = "bg-blue-600 text-white";
const idle = "text-slate-700 hover:bg-slate-100";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col">
        {/* Brand */}
        <div className="p-5 flex items-center gap-3 border-b border-slate-200">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            ⚓
          </div>
          <div>
            <div className="font-semibold text-slate-900">Fathom Marine</div>
            <div className="text-xs text-slate-500">Consultants</div>
          </div>
        </div>

        {/* Menu */}
        <nav className="p-4 space-y-2 flex-1">
          <NavLink
            to="/employees"
            className={({ isActive }: { isActive: boolean }) =>
              `${navItem} ${isActive ? active : idle}`
            }
          >
            <span className="w-5 h-5 rounded bg-blue-100 inline-block" />
            Employee Details
          </NavLink>
        </nav>

        {/* User block (bottom like screenshot) */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-200" />
            <div>
              <div className="text-sm font-semibold text-slate-900">
                Fathom Marine
              </div>
              <div className="text-xs text-slate-500">Admin</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header (like screenshot) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <div>
            <div className="text-lg font-semibold text-slate-900">
              Dashboard
            </div>
            <div className="text-xs text-slate-500">
              Financial overview and analytics
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white" />
            <button className="w-9 h-9 rounded-xl border border-slate-200 bg-white" />
          </div>
        </header>

        {/* Page */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}