// src/app/payroll/models/payroll.models.ts

export enum PayrollStatus {
  GENERATED = 'GENERATED',
  FINALIZED = 'FINALIZED',
  PAID = 'PAID'
}

export interface PayrollResponse {
  employeeId: number;
  employeeName: string;
  payMonth: string;        // ISO date from backend
  grossSalary: number;
  taxDeduction: number;
  netSalary: number;
  status: PayrollStatus;
}

export interface HrPayrollView {
  employeeId: number;
  employeeName: string;
  designation: string;
  payrollGenerated: boolean;
  status: string;
  grossSalary: number | null;
  netSalary: number | null;
}
export interface PayslipResponse {
  employeeName: string;
  empCode: string;
  payMonth: string;
  year: number;
  month: number;
  basicSalary: number;
  hra: number;
  allowances: number;
  grossSalary: number;
  totalDeductions: number;
  taxDeduction: number;
  pfDeduction: number;
  netSalary: number;
  workingDays: number;
  paidDays: number;
  lopDays: number;
}