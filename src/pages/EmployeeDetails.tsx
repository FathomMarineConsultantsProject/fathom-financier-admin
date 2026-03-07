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
  if (!url) return <span className="text-slate-400 text-xs">Not available</span>;

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

function ImagePreview({
  url,
  alt,
}: {
  url?: string | null;
  alt: string;
}) {
  if (!url) return <span className="text-slate-400 text-xs">Not available</span>;

  return (
    <a href={url} target="_blank" rel="noreferrer" className="block w-fit">
      <img
        src={url}
        alt={alt}
        className="h-14 w-14 rounded-md border border-slate-200 object-cover hover:opacity-80"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    </a>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-3 py-3 text-left text-[12px] font-semibold whitespace-nowrap text-slate-700">
      {children}
    </th>
  );
}

function Td({
  children,
  long = false,
  center = false,
}: {
  children: React.ReactNode;
  long?: boolean;
  center?: boolean;
}) {
  return (
    <td
      className={[
        "px-3 py-3 align-top text-[13px] text-slate-700",
        long ? "max-w-[180px] break-words whitespace-normal" : "whitespace-nowrap",
        center ? "text-center" : "",
      ].join(" ")}
    >
      {children}
    </td>
  );
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
        setItems(data.items);
        setTotal(data.total);
        setTotalPages(data.totalPages);
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
        <div className="mt-2 text-xs text-slate-500">
          Search updates automatically after typing stops
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
          <div className="p-6 text-sm text-red-600">
            {error}
            <div className="mt-2 text-xs text-slate-500">
              Check API URL in <b>.env</b> and backend CORS.
            </div>
          </div>
        ) : items.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No employees found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-max min-w-full border-separate border-spacing-0 text-sm">
              <thead className="sticky top-0 z-10 bg-slate-50">
                <tr className="border-b border-slate-200">
                  <Th>ID</Th>
                  <Th>Full Name</Th>
                  <Th>Qualification</Th>
                  <Th>Email</Th>
                  <Th>Phone</Th>
                  <Th>Address</Th>
                  <Th>City</Th>
                  <Th>State</Th>
                  <Th>Postal Code</Th>
                  <Th>Aadhar Name</Th>
                  <Th>Aadhar Number</Th>
                  <Th>Passport Number</Th>
                  <Th>Passport Validity</Th>
                  <Th>PAN Number</Th>
                  <Th>Father Name</Th>
                  <Th>Mother Name</Th>
                  <Th>Siblings</Th>
                  <Th>Local Guardian</Th>
                  <Th>Bank Holder</Th>
                  <Th>Bank Account</Th>
                  <Th>IFSC</Th>
                  <Th>Branch</Th>
                  <Th>Emergency Name</Th>
                  <Th>Emergency Phone</Th>
                  <Th>Emergency Email</Th>
                  <Th>Emergency Relation</Th>
                  <Th>Hobbies</Th>
                  <Th>Books</Th>
                  <Th>Sports</Th>
                  <Th>Favourite Artist</Th>
                  <Th>Favourite Cuisine</Th>
                  <Th>Favourite Movies</Th>
                  <Th>T-shirt Size</Th>
                  <Th>Shoe Size</Th>
                  <Th>Police Verification</Th>
                  <Th>Police Station</Th>
                  <Th>Police Report</Th>
                  <Th>Medical Insurance</Th>
                  <Th>Medical Report Recent</Th>
                  <Th>Medical Report</Th>
                  <Th>Medical Issues</Th>
                  <Th>Documents</Th>
                  <Th>Cheque Preview</Th>
                </tr>
              </thead>

              <tbody>
                {items.map((emp, index) => (
                  <tr
                    key={emp.id}
                    className={[
                      "border-b border-slate-100 hover:bg-slate-50",
                      index % 2 === 0 ? "bg-white" : "bg-slate-50/40",
                    ].join(" ")}
                  >
                    <Td>{emp.id}</Td>
                    <Td>{emp.full_name}</Td>
                    <Td>{emp.latest_qualification}</Td>
                    <Td>{emp.email}</Td>
                    <Td>{emp.phone_number}</Td>

                    <Td long>{emp.address}</Td>
                    <Td>{emp.city}</Td>
                    <Td>{emp.state}</Td>
                    <Td>{emp.postal_code}</Td>

                    <Td>{emp.aadhar_name}</Td>
                    <Td>{emp.aadhar_number}</Td>

                    <Td>{emp.passport_number ?? "-"}</Td>
                    <Td>{emp.passport_validity ?? "-"}</Td>

                    <Td>{emp.pan_number}</Td>

                    <Td>{emp.father_name}</Td>
                    <Td>{emp.mother_name}</Td>

                    <Td>{emp.siblings}</Td>
                    <Td>{emp.local_guardian}</Td>

                    <Td>{emp.bank_account_holder_name}</Td>
                    <Td>{emp.bank_account_number}</Td>
                    <Td>{emp.bank_ifsc_code}</Td>
                    <Td>{emp.bank_branch_name}</Td>

                    <Td>{emp.emergency_contact_name}</Td>
                    <Td>{emp.emergency_contact_phone}</Td>
                    <Td>{emp.emergency_contact_email}</Td>
                    <Td>{emp.emergency_contact_relation}</Td>

                    <Td long>{emp.hobbies}</Td>
                    <Td long>{emp.books_like_to_read}</Td>
                    <Td long>{emp.sports_you_play}</Td>

                    <Td>{emp.favourite_artist}</Td>
                    <Td>{emp.favourite_cuisine}</Td>
                    <Td long>{emp.favourite_movies_bollywood}</Td>

                    <Td>{emp.tshirt_size}</Td>
                    <Td>{emp.shoe_size}</Td>

                    <Td>{emp.police_verification}</Td>
                    <Td>{emp.police_station ?? "-"}</Td>
                    <Td>
                      <FileLink
                        url={emp.police_report_url}
                        label="Open"
                      />
                    </Td>

                    <Td>{emp.has_medical_insurance}</Td>
                    <Td>{emp.medical_report_recent}</Td>
                    <Td>
                      <FileLink
                        url={emp.medical_report_url}
                        label="Open"
                      />
                    </Td>
                    <Td long>{emp.medical_issues ?? "-"}</Td>

                    <Td>
                      <FileLink
                        url={emp.documents_url}
                        label="Open"
                      />
                    </Td>
                    <Td center>
                      <ImagePreview
                        url={emp.cheque_url}
                        alt={`${emp.full_name} cheque`}
                      />
                    </Td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm disabled:opacity-50 hover:bg-slate-50"
            disabled={loading || page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Prev
          </button>

          <div className="text-sm text-slate-700">
            Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of{" "}
            {total}
          </div>

          <button
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm disabled:opacity-50 hover:bg-slate-50"
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