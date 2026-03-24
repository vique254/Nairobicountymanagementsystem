// Mock database using localStorage for Nairobi City County Inspectorate

export interface Staff {
  id: string;
  payrollNumber: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  dateJoined: string;
  password?: string;
}

export interface DailyRecord {
  id: string;
  staffId: string;
  staffName: string;
  date: string;
  location: string;
  activity: string;
  findings: string;
  actionTaken: string;
  status: 'Pending' | 'Completed' | 'Follow-up Required';
  createdAt: string;
}

export interface Admin {
  username: string;
  password: string;
  fullName: string;
}

// Initialize database with default data
export function initializeDatabase() {
  // Approved payroll numbers (only these can register)
  if (!localStorage.getItem('approvedPayrolls')) {
    const approvedPayrolls = [
      'NCC2024001',
      'NCC2024002',
      'NCC2024003',
      'NCC2024004',
      'NCC2024005',
      'NCC2023101',
      'NCC2023102',
      'NCC2023103',
      'NCC2023104',
      'NCC2023105'
    ];
    localStorage.setItem('approvedPayrolls', JSON.stringify(approvedPayrolls));
  }

  // Default admin credentials
  if (!localStorage.getItem('admins')) {
    const admins: Admin[] = [
      {
        username: 'admin',
        password: 'admin123',
        fullName: 'Chief Inspectorate Officer'
      }
    ];
    localStorage.setItem('admins', JSON.stringify(admins));
  }

  // Initialize staff array if not exists
  if (!localStorage.getItem('staff')) {
    const sampleStaff: Staff[] = [
      {
        id: '1',
        payrollNumber: 'NCC2024001',
        fullName: 'John Kamau',
        email: 'john.kamau@nairobi.go.ke',
        phone: '+254712345678',
        department: 'City Inspectorate',
        position: 'Senior Inspector',
        dateJoined: '2024-01-15',
        password: 'password123'
      },
      {
        id: '2',
        payrollNumber: 'NCC2024002',
        fullName: 'Mary Wanjiku',
        email: 'mary.wanjiku@nairobi.go.ke',
        phone: '+254723456789',
        department: 'City Inspectorate',
        position: 'Inspector',
        dateJoined: '2024-02-01',
        password: 'password123'
      }
    ];
    localStorage.setItem('staff', JSON.stringify(sampleStaff));
  }

  // Initialize daily records if not exists
  if (!localStorage.getItem('dailyRecords')) {
    const sampleRecords: DailyRecord[] = [
      {
        id: '1',
        staffId: '1',
        staffName: 'John Kamau',
        date: '2026-03-11',
        location: 'CBD - Tom Mboya Street',
        activity: 'Business License Inspection',
        findings: 'Found 3 businesses operating without valid licenses',
        actionTaken: 'Issued compliance notices, 14-day deadline',
        status: 'Follow-up Required',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        staffId: '2',
        staffName: 'Mary Wanjiku',
        date: '2026-03-11',
        location: 'Westlands - Parklands Road',
        activity: 'Fire Safety Compliance Check',
        findings: 'All inspected premises compliant',
        actionTaken: 'Issued compliance certificates',
        status: 'Completed',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('dailyRecords', JSON.stringify(sampleRecords));
  }
}

// Payroll number verification
export function verifyPayrollNumber(payrollNumber: string): boolean {
  const approvedPayrolls = JSON.parse(localStorage.getItem('approvedPayrolls') || '[]');
  return approvedPayrolls.includes(payrollNumber);
}

export function isPayrollUsed(payrollNumber: string): boolean {
  const staff = JSON.parse(localStorage.getItem('staff') || '[]');
  return staff.some((s: Staff) => s.payrollNumber === payrollNumber);
}

// Staff operations
export function registerStaff(staff: Staff): { success: boolean; message: string } {
  if (!verifyPayrollNumber(staff.payrollNumber)) {
    return { success: false, message: 'Invalid payroll number. Contact admin.' };
  }

  if (isPayrollUsed(staff.payrollNumber)) {
    return { success: false, message: 'This payroll number is already registered.' };
  }

  const allStaff = JSON.parse(localStorage.getItem('staff') || '[]');
  allStaff.push({ ...staff, id: Date.now().toString() });
  localStorage.setItem('staff', JSON.stringify(allStaff));

  return { success: true, message: 'Registration successful!' };
}

export function loginStaff(payrollNumber: string, password: string): Staff | null {
  const staff = JSON.parse(localStorage.getItem('staff') || '[]');
  const user = staff.find((s: Staff) => s.payrollNumber === payrollNumber && s.password === password);
  return user || null;
}

export function getAllStaff(): Staff[] {
  return JSON.parse(localStorage.getItem('staff') || '[]');
}

export function getStaffById(id: string): Staff | null {
  const staff = getAllStaff();
  return staff.find(s => s.id === id) || null;
}

// Admin operations
export function loginAdmin(username: string, password: string): Admin | null {
  const admins = JSON.parse(localStorage.getItem('admins') || '[]');
  const admin = admins.find((a: Admin) => a.username === username && a.password === password);
  return admin || null;
}

// Daily records operations
export function addDailyRecord(record: DailyRecord): void {
  const records = JSON.parse(localStorage.getItem('dailyRecords') || '[]');
  records.push({ ...record, id: Date.now().toString(), createdAt: new Date().toISOString() });
  localStorage.setItem('dailyRecords', JSON.stringify(records));
}

export function getAllDailyRecords(): DailyRecord[] {
  return JSON.parse(localStorage.getItem('dailyRecords') || '[]');
}

export function getDailyRecordsByStaff(staffId: string): DailyRecord[] {
  const records = getAllDailyRecords();
  return records.filter(r => r.staffId === staffId);
}

export function updateDailyRecord(id: string, updates: Partial<DailyRecord>): void {
  const records = getAllDailyRecords();
  const index = records.findIndex(r => r.id === id);
  if (index !== -1) {
    records[index] = { ...records[index], ...updates };
    localStorage.setItem('dailyRecords', JSON.stringify(records));
  }
}

export function deleteDailyRecord(id: string): void {
  const records = getAllDailyRecords();
  const filtered = records.filter(r => r.id !== id);
  localStorage.setItem('dailyRecords', JSON.stringify(filtered));
}

// Enhanced Employee CRUD Operations
export function addEmployee(employee: Omit<Staff, 'id'>): { success: boolean; message: string; employee?: Staff } {
  const allStaff = getAllStaff();

  // Check if payroll number already exists
  if (allStaff.some(s => s.payrollNumber === employee.payrollNumber)) {
    return { success: false, message: 'Payroll number already exists.' };
  }

  // Check if email already exists
  if (allStaff.some(s => s.email === employee.email)) {
    return { success: false, message: 'Email already exists.' };
  }

  const newEmployee: Staff = {
    ...employee,
    id: Date.now().toString()
  };

  allStaff.push(newEmployee);
  localStorage.setItem('staff', JSON.stringify(allStaff));

  return { success: true, message: 'Employee added successfully!', employee: newEmployee };
}

export function updateEmployee(id: string, updates: Partial<Staff>): { success: boolean; message: string } {
  const allStaff = getAllStaff();
  const index = allStaff.findIndex(s => s.id === id);

  if (index === -1) {
    return { success: false, message: 'Employee not found.' };
  }

  // If updating payroll number, check for duplicates
  if (updates.payrollNumber && updates.payrollNumber !== allStaff[index].payrollNumber) {
    if (allStaff.some(s => s.payrollNumber === updates.payrollNumber)) {
      return { success: false, message: 'Payroll number already exists.' };
    }
  }

  // If updating email, check for duplicates
  if (updates.email && updates.email !== allStaff[index].email) {
    if (allStaff.some(s => s.email === updates.email)) {
      return { success: false, message: 'Email already exists.' };
    }
  }

  allStaff[index] = { ...allStaff[index], ...updates };
  localStorage.setItem('staff', JSON.stringify(allStaff));

  return { success: true, message: 'Employee updated successfully!' };
}

export function deleteEmployee(id: string): { success: boolean; message: string } {
  const allStaff = getAllStaff();
  const filtered = allStaff.filter(s => s.id !== id);

  if (filtered.length === allStaff.length) {
    return { success: false, message: 'Employee not found.' };
  }

  localStorage.setItem('staff', JSON.stringify(filtered));

  // Also delete related daily records
  const records = getAllDailyRecords();
  const filteredRecords = records.filter(r => r.staffId !== id);
  localStorage.setItem('dailyRecords', JSON.stringify(filteredRecords));

  return { success: true, message: 'Employee deleted successfully!' };
}

export function importEmployeesFromCSV(employees: Omit<Staff, 'id'>[]): {
  success: boolean;
  message: string;
  imported: number;
  failed: number;
  errors: string[];
} {
  const allStaff = getAllStaff();
  const errors: string[] = [];
  let imported = 0;
  let failed = 0;

  employees.forEach((employee, index) => {
    const rowNumber = index + 2; // +2 because CSV row 1 is header, and we're 0-indexed

    // Validate required fields
    if (!employee.payrollNumber || !employee.fullName || !employee.email) {
      errors.push(`Row ${rowNumber}: Missing required fields (payrollNumber, fullName, or email)`);
      failed++;
      return;
    }

    // Check for duplicates in existing data
    if (allStaff.some(s => s.payrollNumber === employee.payrollNumber)) {
      errors.push(`Row ${rowNumber}: Payroll number ${employee.payrollNumber} already exists`);
      failed++;
      return;
    }

    if (allStaff.some(s => s.email === employee.email)) {
      errors.push(`Row ${rowNumber}: Email ${employee.email} already exists`);
      failed++;
      return;
    }

    // Add employee
    const newEmployee: Staff = {
      ...employee,
      id: `${Date.now()}-${index}`,
      password: employee.password || 'password123' // Default password if not provided
    };

    allStaff.push(newEmployee);
    imported++;
  });

  localStorage.setItem('staff', JSON.stringify(allStaff));

  return {
    success: imported > 0,
    message: `Imported ${imported} employees. ${failed} failed.`,
    imported,
    failed,
    errors
  };
}

// Analytics/Report Functions
export function getEmployeeStatsByDepartment(): { name: string; value: number }[] {
  const allStaff = getAllStaff();
  const deptCounts: Record<string, number> = {};

  allStaff.forEach(staff => {
    deptCounts[staff.department] = (deptCounts[staff.department] || 0) + 1;
  });

  return Object.entries(deptCounts).map(([name, value]) => ({ name, value }));
}

export function getEmployeeStatsByPosition(): { name: string; value: number }[] {
  const allStaff = getAllStaff();
  const positionCounts: Record<string, number> = {};

  allStaff.forEach(staff => {
    positionCounts[staff.position] = (positionCounts[staff.position] || 0) + 1;
  });

  return Object.entries(positionCounts).map(([name, value]) => ({ name, value }));
}

export function getActivityStatsByStatus(): { name: string; value: number }[] {
  const allRecords = getAllDailyRecords();
  const statusCounts: Record<string, number> = {};

  allRecords.forEach(record => {
    statusCounts[record.status] = (statusCounts[record.status] || 0) + 1;
  });

  return Object.entries(statusCounts).map(([name, value]) => ({ name, value }));
}
