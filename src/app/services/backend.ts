// Backend Service Layer for Nairobi City County Inspectorate
// This layer abstracts data operations, allowing easy migration from localStorage to Supabase

import {
  Staff,
  DailyRecord,
  getAllStaff as getLocalStaff,
  addEmployee as addLocalEmployee,
  updateEmployee as updateLocalEmployee,
  deleteEmployee as deleteLocalEmployee,
  importEmployeesFromCSV as importLocalEmployeesFromCSV,
  getAllDailyRecords as getLocalDailyRecords,
  addDailyRecord as addLocalDailyRecord,
  getEmployeeStatsByDepartment as getLocalEmployeeStatsByDepartment,
  getEmployeeStatsByPosition as getLocalEmployeeStatsByPosition,
  getActivityStatsByStatus as getLocalActivityStatsByStatus,
} from '../utils/database';

// Configuration
const USE_SUPABASE = false; // Set to true when Supabase is connected

// Employee Operations
export async function getAllEmployees(): Promise<Staff[]> {
  if (USE_SUPABASE) {
    // TODO: Implement Supabase fetch
    // const { data, error } = await supabase.from('employees').select('*');
    // if (error) throw error;
    // return data || [];
    return [];
  }
  return Promise.resolve(getLocalStaff());
}

export async function createEmployee(
  employee: Omit<Staff, 'id'>
): Promise<{ success: boolean; message: string; employee?: Staff }> {
  if (USE_SUPABASE) {
    // TODO: Implement Supabase insert
    // const { data, error } = await supabase.from('employees').insert([employee]).select();
    // if (error) return { success: false, message: error.message };
    // return { success: true, message: 'Employee added successfully!', employee: data[0] };
    return { success: false, message: 'Supabase not configured' };
  }
  return Promise.resolve(addLocalEmployee(employee));
}

export async function modifyEmployee(
  id: string,
  updates: Partial<Staff>
): Promise<{ success: boolean; message: string }> {
  if (USE_SUPABASE) {
    // TODO: Implement Supabase update
    // const { error } = await supabase.from('employees').update(updates).eq('id', id);
    // if (error) return { success: false, message: error.message };
    // return { success: true, message: 'Employee updated successfully!' };
    return { success: false, message: 'Supabase not configured' };
  }
  return Promise.resolve(updateLocalEmployee(id, updates));
}

export async function removeEmployee(
  id: string
): Promise<{ success: boolean; message: string }> {
  if (USE_SUPABASE) {
    // TODO: Implement Supabase delete
    // const { error } = await supabase.from('employees').delete().eq('id', id);
    // if (error) return { success: false, message: error.message };
    // return { success: true, message: 'Employee deleted successfully!' };
    return { success: false, message: 'Supabase not configured' };
  }
  return Promise.resolve(deleteLocalEmployee(id));
}

export async function bulkImportEmployees(
  employees: Omit<Staff, 'id'>[]
): Promise<{
  success: boolean;
  message: string;
  imported: number;
  failed: number;
  errors: string[];
}> {
  if (USE_SUPABASE) {
    // TODO: Implement Supabase bulk insert with error handling
    return {
      success: false,
      message: 'Supabase not configured',
      imported: 0,
      failed: employees.length,
      errors: ['Supabase not configured'],
    };
  }
  return Promise.resolve(importLocalEmployeesFromCSV(employees));
}

// Daily Records Operations
export async function getAllRecords(): Promise<DailyRecord[]> {
  if (USE_SUPABASE) {
    // TODO: Implement Supabase fetch
    return [];
  }
  return Promise.resolve(getLocalDailyRecords());
}

export async function createDailyRecord(record: DailyRecord): Promise<void> {
  if (USE_SUPABASE) {
    // TODO: Implement Supabase insert
    return;
  }
  return Promise.resolve(addLocalDailyRecord(record));
}

// Analytics Operations
export async function getEmployeeStatsByDepartment(): Promise<
  { name: string; value: number }[]
> {
  if (USE_SUPABASE) {
    // TODO: Implement Supabase aggregation query
    return [];
  }
  return Promise.resolve(getLocalEmployeeStatsByDepartment());
}

export async function getEmployeeStatsByPosition(): Promise<
  { name: string; value: number }[]
> {
  if (USE_SUPABASE) {
    // TODO: Implement Supabase aggregation query
    return [];
  }
  return Promise.resolve(getLocalEmployeeStatsByPosition());
}

export async function getActivityStatsByStatus(): Promise<
  { name: string; value: number }[]
> {
  if (USE_SUPABASE) {
    // TODO: Implement Supabase aggregation query
    return [];
  }
  return Promise.resolve(getLocalActivityStatsByStatus());
}

// Supabase Migration Helper
export function enableSupabase() {
  console.log(
    'To enable Supabase: 1) Connect Supabase in Make settings, 2) Set USE_SUPABASE = true in backend.ts'
  );
}
