import axios from "./axios";

export type Employee = {
  id: number;
  full_name: string;
  latest_qualification: string;
  email: string;
  phone_number: string;

  address: string;
  city: string;
  state: string;
  postal_code: string;

  aadhar_name: string;
  aadhar_number: string;

  passport_number?: string | null;
  passport_validity?: string | null;

  pan_number: string;

  father_name: string;
  mother_name: string;

  siblings: string;
  local_guardian: string;

  bank_account_holder_name: string;
  bank_account_number: string;
  bank_ifsc_code: string;
  bank_branch_name: string;

  emergency_contact_name: string;
  emergency_contact_phone: string;
  emergency_contact_email: string;
  emergency_contact_relation: string;

  hobbies: string;
  books_like_to_read: string;
  sports_you_play: string;
  favourite_artist: string;
  favourite_cuisine: string;
  favourite_movies_bollywood: string;

  tshirt_size: string;
  shoe_size: string;

  police_verification: string;
  police_station?: string | null;
  police_report_path?: string | null;
  police_report_url?: string | null;

  has_medical_insurance: string;
  medical_report_recent: string;
  medical_report_path?: string | null;
  medical_report_url?: string | null;
  medical_issues?: string | null;

  documents_path: string;
  documents_url?: string | null;

  cheque_path: string;
  cheque_url?: string | null;

  created_at?: string;
};

export type EmployeeResponse = {
  items: Employee[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export const getEmployees = async (
  params: { page: number; limit: number; q?: string }
): Promise<EmployeeResponse> => {
  const res = await axios.get("/employees", { params });
  return res.data;
};

export const getEmployeeById = async (id: number) => {
  const res = await axios.get(`/employees/${id}`);
  return res.data;
};

export const getEmployeeFiles = async (id: number) => {
  const res = await axios.get(`/employees/${id}/files`);
  return res.data;
};