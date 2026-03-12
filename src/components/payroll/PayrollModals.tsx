import { ChevronDown, X } from "lucide-react";
import type {
  PayrollFormState,
  TaxCalculatorFormState,
} from "../../hooks/usePayroll";

type ChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
) => void;

type SubmitHandler = (e: React.FormEvent) => void;

type EmployeeOption = {
  label: string;
  value: string;
};

export function AddPayrollModal({
  open,
  form,
  employeeOptions,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean;
  form: PayrollFormState;
  employeeOptions: EmployeeOption[];
  onClose: () => void;
  onChange: ChangeHandler;
  onSubmit: SubmitHandler;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-[760px] rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 pb-2 pt-5">
          <h3 className="text-[20px] font-semibold text-slate-900">
            Add Payroll Record
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 pb-6">
          <div className="space-y-5">
            <SelectField
              label="Employee"
              name="employee_id"
              value={form.employee_id}
              onChange={onChange}
              options={employeeOptions}
            />

            <InputField
              label="Payroll Period"
              name="payroll_period"
              value={form.payroll_period}
              onChange={onChange}
              type="month"
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <InputField
                label="Base Salary (₹)"
                name="base_salary"
                value={form.base_salary}
                onChange={onChange}
                type="number"
              />
              <InputField
                label="Overtime (₹)"
                name="overtime"
                value={form.overtime}
                onChange={onChange}
                type="number"
              />
              <InputField
                label="Bonus (₹)"
                name="bonus"
                value={form.bonus}
                onChange={onChange}
                type="number"
              />
              <InputField
                label="Deductions (₹)"
                name="deductions"
                value={form.deductions}
                onChange={onChange}
                type="number"
              />
              <InputField
                label="Gross Pay (₹)"
                name="gross_pay"
                value={form.gross_pay}
                onChange={onChange}
                type="number"
                readOnly
                bgMuted
              />
              <InputField
                label="Net Pay (₹)"
                name="net_pay"
                value={form.net_pay}
                onChange={onChange}
                type="number"
                readOnly
                bgMuted
              />
            </div>

            <InputField
              label="Tax Withheld (₹)"
              name="tax_withheld"
              value={form.tax_withheld}
              onChange={onChange}
              type="number"
            />
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-6 text-sm font-medium text-slate-800 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-900 px-6 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Add Payroll Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function TaxCalculatorModal({
  open,
  form,
  employeeOptions,
  filingStatusOptions,
  providerOptions,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean;
  form: TaxCalculatorFormState;
  employeeOptions: EmployeeOption[];
  filingStatusOptions: string[];
  providerOptions: string[];
  onClose: () => void;
  onChange: ChangeHandler;
  onSubmit: SubmitHandler;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-[760px] rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between px-6 pb-2 pt-5">
          <h3 className="text-[20px] font-semibold text-slate-900">
            Tax Calculator
          </h3>

          <button
            type="button"
            onClick={onClose}
            className="rounded-md p-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="px-6 pb-6">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <SelectField
              label="Employee"
              name="employee_id"
              value={form.employee_id}
              onChange={onChange}
              options={employeeOptions}
            />

            <InputField
              label="Gross Pay"
              name="gross_pay"
              value={form.gross_pay}
              onChange={onChange}
            />

            <SelectField
              label="Filing Status"
              name="filing_status"
              value={form.filing_status}
              onChange={onChange}
              options={filingStatusOptions.map((item) => ({
                label: item,
                value: item,
              }))}
            />

            <InputField
              label="State"
              name="state"
              value={form.state}
              onChange={onChange}
            />

            <InputField
              label="Exemptions"
              name="exemptions"
              value={form.exemptions}
              onChange={onChange}
            />

            <InputField
              label="Deductions"
              name="deductions"
              value={form.deductions}
              onChange={onChange}
            />
          </div>

          <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="w-full max-w-[220px]">
              <SelectField
                label=""
                name="provider"
                value={form.provider}
                onChange={onChange}
                options={providerOptions.map((item) => ({
                  label: item,
                  value: item,
                }))}
              />
            </div>

            <button
              type="submit"
              className="inline-flex h-11 items-center justify-center rounded-xl bg-blue-900 px-6 text-sm font-semibold text-white transition hover:bg-blue-800"
            >
              Calculate Taxes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function InputField({
  label,
  name,
  value,
  onChange,
  type = "text",
  readOnly = false,
  bgMuted = false,
}: {
  label: string;
  name: string;
  value: string;
  onChange: ChangeHandler;
  type?: string;
  readOnly?: boolean;
  bgMuted?: boolean;
}) {
  return (
    <div>
      {label ? (
        <label className="mb-2 block text-sm font-medium text-slate-800">
          {label}
        </label>
      ) : null}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        readOnly={readOnly}
        className={`h-12 w-full rounded-xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200 ${
          bgMuted ? "bg-slate-50" : ""
        }`}
      />
    </div>
  );
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
}: {
  label: string;
  name: string;
  value: string;
  onChange: ChangeHandler;
  options: EmployeeOption[];
}) {
  return (
    <div>
      {label ? (
        <label className="mb-2 block text-sm font-medium text-slate-800">
          {label}
        </label>
      ) : null}
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="h-12 w-full appearance-none rounded-xl border border-slate-300 bg-white px-4 pr-10 text-sm text-slate-700 outline-none transition focus:border-slate-950 focus:ring-2 focus:ring-slate-200"
        >
          {options.map((option) => (
            <option key={`${name}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}