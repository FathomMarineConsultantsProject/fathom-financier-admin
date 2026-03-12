import { useEffect, useMemo, useState } from "react";
import {
  calculateTax,
  createPayroll,
  getEmployees,
  getPayrolls,
} from "../services/payroll.api";

export type PayrollTab = "records" | "salaries" | "bank" | "analytics";

export type PayrollRecord = {
  id: number;
  employee_id: number;
  employee_name: string;
  period: string;
  base_salary: number;
  deductions: number;
  bonuses: number;
  net_pay: number;
  status: string;
};

export type PayrollFormState = {
  employee_id: string;
  payroll_period: string;
  base_salary: string;
  overtime: string;
  bonus: string;
  deductions: string;
  gross_pay: string;
  net_pay: string;
  tax_withheld: string;
};

export type TaxCalculatorFormState = {
  employee_id: string;
  gross_pay: string;
  filing_status: string;
  state: string;
  exemptions: string;
  deductions: string;
  provider: string;
};

export type EmployeeOption = {
  label: string;
  value: string;
};

const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const getLastMonth = () => {
  const now = new Date();
  now.setMonth(now.getMonth() - 1);
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
};

const getCurrentYear = () => {
  return String(new Date().getFullYear());
};

const initialPayrollFormState: PayrollFormState = {
  employee_id: "",
  payroll_period: getCurrentMonth(),
  base_salary: "0",
  overtime: "0",
  bonus: "0",
  deductions: "0",
  gross_pay: "0",
  net_pay: "0",
  tax_withheld: "0",
};

const initialTaxCalculatorFormState: TaxCalculatorFormState = {
  employee_id: "",
  gross_pay: "0",
  filing_status: "Single",
  state: "CA",
  exemptions: "0",
  deductions: "0",
  provider: "QuickBooks",
};

export function usePayroll() {
  const [activeTab, setActiveTab] = useState<PayrollTab>("records");
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState("all");
  const [employeeFilter, setEmployeeFilter] = useState("all");

  const [openPayrollModal, setOpenPayrollModal] = useState(false);
  const [openTaxCalculatorModal, setOpenTaxCalculatorModal] = useState(false);

  const [payrollForm, setPayrollForm] = useState<PayrollFormState>(
    initialPayrollFormState
  );

  const [taxCalculatorForm, setTaxCalculatorForm] =
    useState<TaxCalculatorFormState>(initialTaxCalculatorFormState);

  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
  const [employeeOptions, setEmployeeOptions] = useState<EmployeeOption[]>([
    { label: "Select employee", value: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees();

      const options: EmployeeOption[] = [
        { label: "Select employee", value: "" },
        ...(data?.items || []).map((employee: any) => ({
          label: employee.full_name,
          value: String(employee.id),
        })),
      ];

      setEmployeeOptions(options);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  const fetchPayrolls = async () => {
    try {
      setIsLoading(true);

      const params: Record<string, string | number> = {
        page: 1,
        limit: 100,
      };

      if (search.trim()) {
        params.q = search.trim();
      }

      if (period === "this_month") {
        params.period = getCurrentMonth();
      } else if (period === "last_month") {
        params.period = getLastMonth();
      } else if (/^\d{4}-\d{2}$/.test(period)) {
        params.period = period;
      }

      if (employeeFilter !== "all" && !Number.isNaN(Number(employeeFilter))) {
        params.employee_id = Number(employeeFilter);
      }

      const data = await getPayrolls(params);

      let mapped: PayrollRecord[] = (data?.items || []).map((item: any) => ({
        id: item.id,
        employee_id: item.employee_id,
        employee_name: item.employee_name,
        period: item.payroll_period,
        base_salary: Number(item.base_salary || 0),
        deductions: Number(item.deductions || 0),
        bonuses: Number(item.bonus || 0),
        net_pay: Number(item.net_pay || 0),
        status: item.status,
      }));

      if (period === "this_year") {
        const currentYear = getCurrentYear();
        mapped = mapped.filter((item) => item.period.startsWith(currentYear));
      }

      setPayrollRecords(mapped);
    } catch (error) {
      console.error("Failed to fetch payrolls:", error);
      setPayrollRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    fetchPayrolls();
  }, [search, period, employeeFilter]);

  const stats = useMemo(() => {
    const totalPayroll = payrollRecords.reduce((sum, item) => sum + item.net_pay, 0);

    const averageSalary =
      payrollRecords.length > 0 ? totalPayroll / payrollRecords.length : 0;

    const employeesPaid = payrollRecords.filter(
      (item) => item.status === "processed"
    ).length;

    const currentMonth = getCurrentMonth();
    const thisMonth = payrollRecords
      .filter((item) => item.period === currentMonth)
      .reduce((sum, item) => sum + item.net_pay, 0);

    return {
      totalPayroll,
      thisMonth,
      averageSalary,
      employeesPaid,
    };
  }, [payrollRecords]);

  const filteredRecords = useMemo(() => {
    return payrollRecords;
  }, [payrollRecords]);

  const handleOpenPayrollModal = () => {
    setPayrollForm({
      ...initialPayrollFormState,
      payroll_period: getCurrentMonth(),
    });
    setOpenPayrollModal(true);
  };

  const handleClosePayrollModal = () => {
    setOpenPayrollModal(false);
    setPayrollForm({
      ...initialPayrollFormState,
      payroll_period: getCurrentMonth(),
    });
  };

  const handleOpenTaxCalculatorModal = () => {
    setTaxCalculatorForm(initialTaxCalculatorFormState);
    setOpenTaxCalculatorModal(true);
  };

  const handleCloseTaxCalculatorModal = () => {
    setOpenTaxCalculatorModal(false);
    setTaxCalculatorForm(initialTaxCalculatorFormState);
  };

  const handlePayrollChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setPayrollForm((prev) => {
      const next = {
        ...prev,
        [name]: value,
      };

      const baseSalary = Number(next.base_salary) || 0;
      const overtime = Number(next.overtime) || 0;
      const bonus = Number(next.bonus) || 0;
      const deductions = Number(next.deductions) || 0;
      const taxWithheld = Number(next.tax_withheld) || 0;

      const grossPay = baseSalary + overtime + bonus - deductions;
      const netPay = grossPay - taxWithheld;

      next.gross_pay = String(grossPay < 0 ? 0 : grossPay);
      next.net_pay = String(netPay < 0 ? 0 : netPay);

      return next;
    });
  };

  const handleTaxCalculatorChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setTaxCalculatorForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitPayroll = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createPayroll({
        employee_id: Number(payrollForm.employee_id),
        payroll_period: payrollForm.payroll_period,
        base_salary: Number(payrollForm.base_salary || 0),
        overtime: Number(payrollForm.overtime || 0),
        bonus: Number(payrollForm.bonus || 0),
        deductions: Number(payrollForm.deductions || 0),
        tax_withheld: Number(payrollForm.tax_withheld || 0),
        status: "pending",
      });

      await fetchPayrolls();
      handleClosePayrollModal();
    } catch (error) {
      console.error("Failed to create payroll:", error);
      alert("Failed to create payroll record");
    }
  };

  const handleCalculateTaxes = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = await calculateTax({
        employee_id: Number(taxCalculatorForm.employee_id),
        gross_pay: Number(taxCalculatorForm.gross_pay || 0),
        filing_status: taxCalculatorForm.filing_status,
        exemptions: Number(taxCalculatorForm.exemptions || 0),
        deductions: Number(taxCalculatorForm.deductions || 0),
      });

      alert(
        `Tax Amount: ₹${Number(data.tax_amount).toFixed(2)} | Net Pay: ₹${Number(
          data.net_pay
        ).toFixed(2)}`
      );

      handleCloseTaxCalculatorModal();
    } catch (error) {
      console.error("Failed to calculate tax:", error);
      alert("Failed to calculate tax");
    }
  };

  return {
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
  };
}