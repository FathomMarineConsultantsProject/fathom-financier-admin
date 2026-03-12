import  api  from "./axios";
export type PayrollListParams ={
    page?: number;
    limit?: number;
    q?:string;
    period?:string;
    employee_id?:string;
    status?:string;


};

export type CreatePayrollPayload = {
    employee_id:number;
    payroll_period:string;
    base_salary:number;
    overtime?:number;
    bonus?:number;
    deductions?:number;
    tax_withheld?:number;
    status?:string;
};

export type UpdatePayrollPayload = Partial<CreatePayrollPayload> 

export type CalculateTaxPayload = {
    employee_id:number;
    gross_pay:number;
    filing_status:string;
    exemptions:number;
    deductions:number;
};

export const getEmployees = async ()=>{
    const res = await api.get("/employees",{
        params:{
            page:1,
            limit:100,
        }
    });
    return res.data;
};

export const getPayrolls = async (params : PayrollListParams) =>{
    const res= await api.get("/payroll", { params });
    return res.data;
};

export const createPayroll  = async (data:CreatePayrollPayload) => {
    const res = await api.post("/payroll",data);
    return res.data;
};

export const getPayrollById = async (id:number)=>{
    const res = await api.get(`/payroll/${id}`);
    return res.data;
};

export const updatePayroll = async (id:number, data : UpdatePayrollPayload)=>{
    const res = await api.put(`/payroll/${id}`,data);
    return res.data;

};

export const deletePayroll = async (id:number)=>{
    const res = await api.delete(`/payroll/${id}`);
    return res.data;
}

export const calculateTax = async (data: CalculateTaxPayload) =>{
    const res = await api.post("/payroll/calculate-tax",data);
    return res.data;

};



