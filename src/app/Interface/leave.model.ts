export interface LeaveRequest {
  empCode: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status?: string;
}
 
export interface LeaveApplicationResponse {
  id: number;
  empCode: string;
  employeeName: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
} 


export const LEAVE_TYPES = [
  { id: 'PTO', name: 'Paid Time Off' },
  { id: 'CLSL', name: 'Casual/Sick Leave' }
];
