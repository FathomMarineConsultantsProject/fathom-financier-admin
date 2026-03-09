export default function Topbar() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div>
        <div className="text-lg font-semibold text-slate-900">Dashboard</div>
        <div className="text-xs text-slate-500">
          Financial overview and analytics
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="h-9 w-9 rounded-xl border border-slate-200 bg-white" />
        <button className="h-9 w-9 rounded-xl border border-slate-200 bg-white" />
      </div>
    </header>
  );
}