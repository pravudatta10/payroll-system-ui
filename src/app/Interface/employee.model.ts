export interface Employee {
  fullName: string;
  empCode: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  taxPercentage: number;
  pfPercentage: number;
  totalPTO: number;
  usedPTO: number;
  totalCLSL: number;
  usedCLSL: number;
}

export interface EmployeeFormPayload {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  department: string;
  designation: string;
  joiningDate: string;
  basicSalary: number;
  hra: number;
  allowances: number;
  taxPercentage: number;
  pfPercentage: number;
}

export interface OnboardingResponse {
  empCode: string;
  fullName: string;
  deptName: string;
  designation: string;
  joiningDate: string;
  totalCompensation: number;
}
