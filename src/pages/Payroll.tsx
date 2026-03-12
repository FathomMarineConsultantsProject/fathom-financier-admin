import {
  Plus,
  Settings,
  Calculator,
  Upload,
  Download,
  DollarSign,
  CalendarDays,
  TrendingUp,
  Users,
  FileText,
  Eye,
  Pencil,
} from "lucide-react";
import { useMemo } from "react";
import { usePayroll } from "../hooks/usePayroll";
import type { PayrollTab } from "../hooks/usePayroll";
import {
  AddPayrollModal,
  TaxCalculatorModal,
} from "../components/payroll/PayrollModals";

const tabs: { key: PayrollTab; label: string }[] = [
  { key: "records", label: "Payroll Records" },
  { key: "salaries", label: "Employee Salaries" },
  { key: "bank", label: "Bank Details" },
  { key: "analytics", label: "Analytics" },
];

const periodOptions = [
  { label: "All Periods", value: "all" },
  { label: "This Month", value: "this_month" },
  { label: "Last Month", value: "last_month" },
  { label: "This Year", value: "this_year" },
];

const filingStatusOptions = ["Single", "Married", "Head of Household"];
const providerOptions = ["QuickBooks", "ADP", "Manual"];

export default function Payroll() {
  const {
    activeTab,
    setActiveTab,
    search,
    setSearch,
    period,
    setPeriod,
    employeeFilter,
    setEmployeeFilter,
    stats,
    filteredRecords,
    employeeOptions,
    isLoading,

    openPayrollModal,
    handleOpenPayrollModal,
    handleClosePayrollModal,
    payrollForm,
    handlePayrollChange,
    handleSubmitPayroll,

    openTaxCalculatorModal,
    handleOpenTaxCalculatorModal,
    handleCloseTaxCalculatorModal,
    taxCalculatorForm,
    handleTaxCalculatorChange,
    handleCalculateTaxes,
  } = usePayroll();

  const employeeFilterOptions = useMemo(
    () => [
      { label: "All Employees", value: "all" },
      ...employeeOptions
        .filter((item) => item.value !== "")
        .map((item) => ({
          label: item.label,
          value: item.value,
        })),
    ],
    [employeeOptions]
  );

  return (
    <>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-slate-950">
              Payroll Management
            </h1>
            <p className="mt-1 text-lg text-slate-600">
              Process payroll, manage salaries, and track employee compensation
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              <Settings size={16} />
              Integrations
            </button>

            <button
              type="button"
              onClick={handleOpenTaxCalculatorModal}
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              <Calculator size={16} />
              Tax Calculator
            </button>

            <button
              type="button"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
            >
              <Upload size={16} />
              Import Payroll
            </button>

            <button
              type="button"
              onClick={handleOpenPayrollModal}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-slate-950 px-5 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus size={16} />
              Add Payroll Record
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Payroll"
            value={`₹${stats.totalPayroll.toFixed(2)}`}
            subtitle="+2.5% from last month"
            subtitleClassName="text-emerald-600"
            icon={<DollarSign size={32} className="text-emerald-500" />}
          />

          <StatCard
            title="This Month"
            value={`₹${stats.thisMonth.toFixed(2)}`}
            subtitle="Current month total"
            icon={<CalendarDays size={30} className="text-blue-600" />}
          />

          <StatCard
            title="Average Salary"
            value={`₹${stats.averageSalary.toFixed(2)}`}
            subtitle="Per employee average"
            icon={<TrendingUp size={28} className="text-violet-500" />}
          />

          <StatCard
            title="Employees Paid"
            value={`${stats.employeesPaid}`}
            subtitle="Total processed"
            icon={<Users size={30} className="text-amber-600" />}
          />
        </div>

        <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
          <div className="flex-1">
            <div className="flex h-12 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
              <FileText size={18} className="text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search payroll records..."
                className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              />
            </div>
          </div>

          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="h-12 min-w-[160px] rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none"
          >
            {periodOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select
            value={employeeFilter}
            onChange={(e) => setEmployeeFilter(e.target.value)}
            className="h-12 min-w-[180px] rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-800 outline-none"
          >
            {employeeFilterOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <button
            type="button"
            className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 transition hover:bg-slate-50"
          >
            <Download size={16} />
            Export Report
          </button>
        </div>

        <div className="rounded-2xl bg-slate-100 p-1">
          <div className="grid grid-cols-2 gap-1 md:grid-cols-4">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;

              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                    isActive
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-3xl font-bold text-slate-950">
              {activeTab === "records" &&
                `Payroll Records (${filteredRecords.length})`}
              {activeTab === "salaries" && "Employee Salaries"}
              {activeTab === "bank" && "Bank Details"}
              {activeTab === "analytics" && "Analytics"}
            </h2>

            {activeTab === "records" && (
              <button
                type="button"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-blue-900 px-5 text-sm font-semibold text-white transition hover:bg-blue-800"
              >
                <FileText size={16} />
                Process New Payroll
              </button>
            )}
          </div>

          <div className="min-h-[420px] p-6">
            {activeTab === "records" ? (
              isLoading ? (
                <EmptyState title="Loading payroll records..." />
              ) : filteredRecords.length > 0 ? (
                <div className="overflow-hidden rounded-2xl border border-slate-200">
                  <table className="min-w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Employee
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Period
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Base Salary
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Deductions
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Bonuses
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Net Pay
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-slate-700">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRecords.map((record) => (
                        <tr key={record.id} className="border-t border-slate-200">
                          <td className="px-4 py-4 text-sm text-slate-800">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                                {record.employee_name?.charAt(0)?.toUpperCase() || "N"}
                              </div>
                              <div>
                                <div className="font-semibold text-slate-900">
                                  {record.employee_name}
                                </div>
                                <div className="text-xs text-slate-500">
                                  Employee ID: {record.employee_id}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-800">
                            {record.period}
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-800">
                            ₹{record.base_salary.toFixed(2)}
                          </td>

                          <td className="px-4 py-4 text-sm text-red-500">
                            -₹{record.deductions.toFixed(2)}
                          </td>

                          <td className="px-4 py-4 text-sm text-emerald-500">
                            +₹{record.bonuses.toFixed(2)}
                          </td>

                          <td className="px-4 py-4 text-sm font-semibold text-slate-900">
                            ₹{record.net_pay.toFixed(2)}
                          </td>

                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                                record.status === "processed"
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {record.status}
                            </span>
                          </td>

                          <td className="px-4 py-4 text-sm text-slate-700">
                            <div className="flex items-center gap-5">
                              <button
                                type="button"
                                className="inline-flex items-center gap-2 hover:text-slate-950"
                              >
                                <Eye size={16} />
                                View
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center gap-2 hover:text-slate-950"
                              >
                                <Pencil size={16} />
                                Edit
                              </button>
                              <button
                                type="button"
                                className="inline-flex items-center gap-2 hover:text-slate-950"
                              >
                                <Download size={16} />
                                Export
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <EmptyState title="No payroll records found" />
              )
            ) : activeTab === "salaries" ? (
              <EmptyState title="No employee salary data found" />
            ) : activeTab === "bank" ? (
              <EmptyState title="No bank details found" />
            ) : (
              <EmptyState title="No payroll analytics available" />
            )}
          </div>
        </div>
      </div>

      <AddPayrollModal
        open={openPayrollModal}
        form={payrollForm}
        employeeOptions={employeeOptions}
        onClose={handleClosePayrollModal}
        onChange={handlePayrollChange}
        onSubmit={handleSubmitPayroll}
      />

      <TaxCalculatorModal
        open={openTaxCalculatorModal}
        form={taxCalculatorForm}
        employeeOptions={employeeOptions}
        filingStatusOptions={filingStatusOptions}
        providerOptions={providerOptions}
        onClose={handleCloseTaxCalculatorModal}
        onChange={handleTaxCalculatorChange}
        onSubmit={handleCalculateTaxes}
      />
    </>
  );
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  subtitleClassName = "text-slate-500",
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  subtitleClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-lg font-medium text-slate-700">{title}</div>
          <div className="mt-2 text-4xl font-bold tracking-tight text-slate-950">
            {value}
          </div>
          <div className={`mt-3 text-sm ${subtitleClassName}`}>{subtitle}</div>
        </div>

        <div className="pt-2">{icon}</div>
      </div>
    </div>
  );
}

function EmptyState({ title }: { title: string }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl bg-white text-center">
      <div className="mb-4 text-slate-400">
        <FileText size={60} strokeWidth={1.5} />
      </div>
      <h3 className="text-3xl font-medium text-slate-500">{title}</h3>
    </div>
  );
}