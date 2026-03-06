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
  if (!url) return <span className="text-slate-400">-</span>;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
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
  if (!url) return <span className="text-slate-400">-</span>;

  return (
    <a href={url} target="_blank" rel="noreferrer" className="block">
      <img
        src={url}
        alt={alt}
        className="h-16 w-16 rounded-lg border border-slate-200 object-cover hover:opacity-80"
      />
    </a>
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
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Employee Details
          </h1>
          <p className="text-sm text-slate-500">
            View all employee submissions and manage records
          </p>
        </div>

        <div className="hidden sm:block">
          <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
            <div className="text-xs text-slate-500">Total Employees</div>
            <div className="text-xl font-semibold text-slate-900">{total}</div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
            🔍
          </div>
          <input
            value={q}
            onChange={(e) => {
              setPage(1);
              setQ(e.target.value);
            }}
            placeholder="Search by name, email, phone, aadhar, pan..."
            className="w-full rounded-xl border border-slate-200 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        <div className="mt-2 text-xs text-slate-500">
          Tip: search is debounced (auto fetch after you stop typing)
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
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
            <table className="min-w-[3000px] w-full text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  {[
                    "ID",
                    "Full Name",
                    "Qualification",
                    "Email",
                    "Phone",
                    "Address",
                    "City",
                    "State",
                    "Postal Code",
                    "Aadhar Name",
                    "Aadhar Number",
                    "Passport Number",
                    "Passport Validity",
                    "PAN Number",
                    "Father Name",
                    "Mother Name",
                    "Siblings",
                    "Local Guardian",
                    "Bank Holder",
                    "Bank Account",
                    "IFSC",
                    "Branch",
                    "Emergency Name",
                    "Emergency Phone",
                    "Emergency Email",
                    "Emergency Relation",
                    "Hobbies",
                    "Books",
                    "Sports",
                    "Favourite Artist",
                    "Favourite Cuisine",
                    "Favourite Movies",
                    "T-shirt Size",
                    "Shoe Size",
                    "Police Verification",
                    "Police Station",
                    "Police Report",
                    "Medical Insurance",
                    "Medical Report Recent",
                    "Medical Report",
                    "Medical Issues",
                    "Documents",
                    "Cheque Preview",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {items.map((emp) => (
                  <tr
                    key={emp.id}
                    className="border-t border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">{emp.id}</td>

                    <td className="px-4 py-3 whitespace-nowrap font-medium text-slate-900">
                      {emp.full_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.latest_qualification}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.email}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.phone_number}
                    </td>

                    <td className="px-4 py-3 min-w-[260px]">{emp.address}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.city}</td>
                    <td className="px-4 py-3 whitespace-nowrap">{emp.state}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.postal_code}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.aadhar_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.aadhar_number}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.passport_number ?? "-"}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.passport_validity ?? "-"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.pan_number}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.father_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.mother_name}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.siblings}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.local_guardian}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.bank_account_holder_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.bank_account_number}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.bank_ifsc_code}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.bank_branch_name}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.emergency_contact_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.emergency_contact_phone}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.emergency_contact_email}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.emergency_contact_relation}
                    </td>

                    <td className="px-4 py-3 min-w-[240px]">{emp.hobbies}</td>
                    <td className="px-4 py-3 min-w-[240px]">
                      {emp.books_like_to_read}
                    </td>
                    <td className="px-4 py-3 min-w-[240px]">
                      {emp.sports_you_play}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.favourite_artist}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.favourite_cuisine}
                    </td>
                    <td className="px-4 py-3 min-w-[240px]">
                      {emp.favourite_movies_bollywood}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.tshirt_size}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.shoe_size}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.police_verification}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.police_station ?? "-"}
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <FileLink
                        url={emp.police_report_url}
                        label="View Police Report"
                      />
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.has_medical_insurance}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {emp.medical_report_recent}
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <FileLink
                        url={emp.medical_report_url}
                        label="View Medical Report"
                      />
                    </td>
                    <td className="px-4 py-3 min-w-[240px]">
                      {emp.medical_issues ?? "-"}
                    </td>

                    <td className="px-4 py-3 min-w-[180px]">
                      <FileLink
                        url={emp.documents_url}
                        label="View Document"
                      />
                    </td>
                    <td className="px-4 py-3 min-w-[100px]">
                      <ImagePreview
                        url={emp.cheque_url}
                        alt={`${emp.full_name} cheque`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 border-t border-slate-200 flex items-center justify-between">
          <button
            className="px-4 py-2 rounded-xl border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
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
            className="px-4 py-2 rounded-xl border border-slate-200 disabled:opacity-50 hover:bg-slate-50"
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