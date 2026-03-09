import { useEffect, useMemo, useState } from "react";
import { getEmployees } from "../services/employee.api";
import type { Employee } from "../services/employee.api";

function useDebouncedValue<T>(value: T, delay = 400) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return debounced;
}

function FileLink({
  url,
  label,
}: {
  url?: string | null;
  label: string;
}) {
  if (!url) {
    return <span className="text-xs text-slate-400">Not available</span>;
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center rounded-md border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-100"
    >
      {label}
    </a>
  );
}

function Th({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <th
      className={[
        "px-3 py-3 text-left text-[12px] font-semibold text-slate-700",
        wide ? "min-w-[360px]" : "whitespace-nowrap",
      ].join(" ")}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  wide = false,
}: {
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <td
      className={[
        "px-3 py-3 align-top text-[13px] text-slate-700",
        wide ? "min-w-[360px]" : "whitespace-nowrap",
      ].join(" ")}
    >
      {children}
    </td>
  );
}

type QuickInfoTab = "address" | "bank" | "ids" | "family" | "other";

const quickInfoTabs: { key: QuickInfoTab; label: string }[] = [
  { key: "address", label: "Address" },
  { key: "bank", label: "Bank" },
  { key: "ids", label: "IDs" },
  { key: "family", label: "Family" },
  { key: "other", label: "Other" },
];

function InfoLine({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  const displayValue =
    value && String(value).trim() !== "" ? String(value) : "-";

  return (
    <div className="text-[12px] leading-5 text-slate-700">
      <span className="font-semibold text-slate-900">{label}: </span>
      <span>{displayValue}</span>
    </div>
  );
}

function QuickInfoContent({
  emp,
  activeTab,
}: {
  emp: Employee;
  activeTab: QuickInfoTab;
}) {
  if (activeTab === "address") {
    return (
      <div className="space-y-1">
        <InfoLine label="Address" value={emp.address} />
        <InfoLine label="City" value={emp.city} />
        <InfoLine label="State" value={emp.state} />
        <InfoLine label="Postal Code" value={emp.postal_code} />
      </div>
    );
  }

  if (activeTab === "bank") {
    return (
      <div className="space-y-1">
        <InfoLine label="Account Holder" value={emp.bank_account_holder_name} />
        <InfoLine label="Account Number" value={emp.bank_account_number} />
        <InfoLine label="IFSC" value={emp.bank_ifsc_code} />
        <InfoLine label="Branch" value={emp.bank_branch_name} />
      </div>
    );
  }

  if (activeTab === "ids") {
    return (
      <div className="space-y-1">
        <InfoLine label="Aadhar Name" value={emp.aadhar_name} />
        <InfoLine label="Aadhar Number" value={emp.aadhar_number} />
        <InfoLine label="PAN Number" value={emp.pan_number} />
        <InfoLine label="Passport Number" value={emp.passport_number} />
        <InfoLine label="Passport Validity" value={emp.passport_validity} />
      </div>
    );
  }

  if (activeTab === "family") {
    return (
      <div className="space-y-1">
        <InfoLine label="Father Name" value={emp.father_name} />
        <InfoLine label="Mother Name" value={emp.mother_name} />
        <InfoLine label="Siblings" value={emp.siblings} />
        <InfoLine label="Local Guardian" value={emp.local_guardian} />
        <InfoLine label="Emergency Name" value={emp.emergency_contact_name} />
        <InfoLine label="Emergency Phone" value={emp.emergency_contact_phone} />
        <InfoLine label="Emergency Email" value={emp.emergency_contact_email} />
        <InfoLine
          label="Relation"
          value={emp.emergency_contact_relation}
        />
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <InfoLine label="Qualification" value={emp.latest_qualification} />
      <InfoLine label="Hobbies" value={emp.hobbies} />
      <InfoLine label="Books" value={emp.books_like_to_read} />
      <InfoLine label="Sports" value={emp.sports_you_play} />
      <InfoLine label="Favourite Artist" value={emp.favourite_artist} />
      <InfoLine label="Favourite Cuisine" value={emp.favourite_cuisine} />
      <InfoLine
        label="Favourite Movies"
        value={emp.favourite_movies_bollywood}
      />
      <InfoLine label="T-shirt Size" value={emp.tshirt_size} />
      <InfoLine label="Shoe Size" value={emp.shoe_size} />
      <InfoLine label="Police Verification" value={emp.police_verification} />
      <InfoLine label="Police Station" value={emp.police_station} />
      <InfoLine label="Medical Insurance" value={emp.has_medical_insurance} />
      <InfoLine
        label="Medical Report Recent"
        value={emp.medical_report_recent}
      />
      <InfoLine label="Medical Issues" value={emp.medical_issues} />
    </div>
  );
}

function normalizeEmployeesResponse(data: any) {
  if (Array.isArray(data?.items)) {
    return {
      items: data.items as Employee[],
      total: typeof data.total === "number" ? data.total : data.items.length,
      totalPages:
        typeof data.totalPages === "number" ? data.totalPages : 1,
    };
  }

  if (Array.isArray(data)) {
    return {
      items: data as Employee[],
      total: data.length,
      totalPages: 1,
    };
  }

  if (Array.isArray(data?.data)) {
    return {
      items: data.data as Employee[],
      total: typeof data.total === "number" ? data.total : data.data.length,
      totalPages:
        typeof data.totalPages === "number" ? data.totalPages : 1,
    };
  }

  return {
    items: [] as Employee[],
    total: 0,
    totalPages: 1,
  };
}

export default function EmployeeDetails() {
  const [items, setItems] = useState<Employee[]>([]);
  const [page, setPage] = useState(1);
  const limit = 10;

  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [q, setQ] = useState("");
  const debouncedQ = useDebouncedValue(q, 400);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activeTabs, setActiveTabs] = useState<Record<number, QuickInfoTab>>(
    {}
  );

  const params = useMemo(
    () => ({ page, limit, q: debouncedQ.trim() || undefined }),
    [page, limit, debouncedQ]
  );

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await getEmployees(params);

        if (!mounted) return;

        const normalized = normalizeEmployeesResponse(data);

        setItems(normalized.items);
        setTotal(normalized.total);
        setTotalPages(normalized.totalPages);

        setActiveTabs((prev) => {
          const next = { ...prev };
          for (const emp of normalized.items) {
            if (!next[emp.id]) next[emp.id] = "address";
          }
          return next;
        });
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load employees");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [params]);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Employee Details
          </h1>
          <p className="text-sm text-slate-500">
            View all employee submissions and manage records
          </p>
        </div>

        <div className="w-full sm:w-auto">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <div className="text-xs text-slate-500">Total Employees</div>
            <div className="text-xl font-semibold text-slate-900">{total}</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            🔍
          </div>
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Search by name, email, phone, aadhar, pan..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="font-semibold text-slate-900">Employees</div>
          <div className="text-xs text-slate-500">
            Page {page} of {totalPages}
          </div>
        </div>

        {loading ? (
          <div className="p-6 text-sm text-slate-500">Loading employees...</div>
        ) : error ? (
          <div className="p-6 text-sm text-red-600">{error}</div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No employees found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr>
                  <Th>ID</Th>
                  <Th>Full Name</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Police Report</Th>
                  <Th>Medical Report</Th>
                  <Th>Documents</Th>
                  <Th>Cheque</Th>
                  <Th wide>Quick Info</Th>
                </tr>
              </thead>

              <tbody>
                {items.map((emp, index) => {
                  const activeTab = activeTabs[emp.id] ?? "address";

                  return (
                    <tr
                      key={emp.id}
                      className={[
                        "border-b border-slate-100 hover:bg-slate-50",
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/40",
                      ].join(" ")}
                    >
                      <Td>{emp.id}</Td>
                      <Td>{emp.full_name}</Td>
                      <Td>
                        <div className="max-w-[220px] break-words whitespace-normal">
                          {emp.email}
                        </div>
                      </Td>
                      <Td>{emp.phone_number}</Td>
                      <Td>
                        <FileLink url={emp.police_report_url} label="Open" />
                      </Td>
                      <Td>
                        <FileLink url={emp.medical_report_url} label="Open" />
                      </Td>
                      <Td>
                        <FileLink url={emp.documents_url} label="Open" />
                      </Td>
                      <Td>
                        <FileLink url={emp.cheque_url} label="Open" />
                      </Td>
                      <Td wide>
                        <div className="min-w-[380px] rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <div className="mb-3 flex flex-wrap gap-2">
                            {quickInfoTabs.map((tab) => {
                              const isActive = activeTab === tab.key;

                              return (
                                <button
                                  key={tab.key}
                                  type="button"
                                  onClick={() =>
                                    setActiveTabs((prev) => ({
                                      ...prev,
                                      [emp.id]: tab.key,
                                    }))
                                  }
                                  className={[
                                    "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                                    isActive
                                      ? "bg-blue-600 text-white"
                                      : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
                                  ].join(" ")}
                                >
                                  {tab.label}
                                </button>
                              );
                            })}
                          </div>

                          <div className="rounded-lg bg-white p-3">
                            <QuickInfoContent emp={emp} activeTab={activeTab} />
                          </div>
                        </div>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
            disabled={loading || page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <div className="text-sm text-slate-700">
            Showing {total === 0 ? 0 : (page - 1) * limit + 1} -{" "}
            {Math.min(page * limit, total)} of {total}
          </div>

          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm hover:bg-slate-50 disabled:opacity-50"
            disabled={loading || page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}