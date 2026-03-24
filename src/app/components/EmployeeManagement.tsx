import React, { useState, useEffect } from 'react';
import { DataGrid, GridColDef, GridRowsProp, GridRenderCellParams } from '@mui/x-data-grid';
import { toast } from 'sonner';
import Papa from 'papaparse';
import {
  getAllStaff,
  addEmployee,
  updateEmployee,
  deleteEmployee,
  importEmployeesFromCSV,
  Staff
} from '../utils/database';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';
import { Trash2, Plus, Upload, Download } from 'lucide-react';

interface EmployeeManagementProps {
  isAdmin: boolean;
}

export function EmployeeManagement({ isAdmin }: EmployeeManagementProps) {
  const [employees, setEmployees] = useState<Staff[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState<Omit<Staff, 'id'>>({
    payrollNumber: '',
    fullName: '',
    email: '',
    phone: '',
    department: 'City Inspectorate',
    position: '',
    dateJoined: new Date().toISOString().split('T')[0],
    password: 'password123'
  });
  const [csvFile, setCsvFile] = useState<File | null>(null);

  // Load employees
  const loadEmployees = () => {
    const staff = getAllStaff();
    setEmployees(staff);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  // Handle add employee
  const handleAddEmployee = () => {
    const result = addEmployee(newEmployee);
    if (result.success) {
      toast.success(result.message);
      loadEmployees();
      setIsAddDialogOpen(false);
      setNewEmployee({
        payrollNumber: '',
        fullName: '',
        email: '',
        phone: '',
        department: 'City Inspectorate',
        position: '',
        dateJoined: new Date().toISOString().split('T')[0],
        password: 'password123'
      });
    } else {
      toast.error(result.message);
    }
  };

  // Handle edit employee (inline edit in DataGrid)
  const handleProcessRowUpdate = (newRow: Staff) => {
    const result = updateEmployee(newRow.id, newRow);
    if (result.success) {
      toast.success(result.message);
      loadEmployees();
    } else {
      toast.error(result.message);
      throw new Error(result.message); // Prevent update if validation fails
    }
    return newRow;
  };

  // Handle delete employee
  const handleDeleteEmployee = (id: string) => {
    if (window.confirm('Are you sure you want to delete this employee? This action cannot be undone.')) {
      const result = deleteEmployee(id);
      if (result.success) {
        toast.success(result.message);
        loadEmployees();
      } else {
        toast.error(result.message);
      }
    }
  };

  // Handle CSV import
  const handleCSVImport = () => {
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    Papa.parse(csvFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const employeesToImport = results.data.map((row: any) => ({
          payrollNumber: row.payrollNumber || row.PayrollNumber || '',
          fullName: row.fullName || row.FullName || row.name || row.Name || '',
          email: row.email || row.Email || '',
          phone: row.phone || row.Phone || row.telephone || '',
          department: row.department || row.Department || 'City Inspectorate',
          position: row.position || row.Position || row.role || row.Role || '',
          dateJoined: row.dateJoined || row.DateJoined || new Date().toISOString().split('T')[0],
          password: row.password || 'password123'
        }));

        const result = importEmployeesFromCSV(employeesToImport);

        if (result.success) {
          toast.success(result.message);
          if (result.errors.length > 0) {
            console.error('Import errors:', result.errors);
            toast.warning(`Some rows had errors. Check console for details.`);
          }
        } else {
          toast.error(result.message);
        }

        loadEmployees();
        setIsImportDialogOpen(false);
        setCsvFile(null);
      },
      error: (error) => {
        toast.error(`CSV parsing error: ${error.message}`);
      }
    });
  };

  // Download CSV template
  const downloadCSVTemplate = () => {
    const template = `payrollNumber,fullName,email,phone,department,position,dateJoined,password
NCC2024010,John Doe,john.doe@nairobi.go.ke,+254700000000,City Inspectorate,Inspector,2024-03-01,password123
NCC2024011,Jane Smith,jane.smith@nairobi.go.ke,+254711111111,City Inspectorate,Senior Inspector,2024-03-01,password123`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // DataGrid columns
  const columns: GridColDef[] = [
    { field: 'payrollNumber', headerName: 'Payroll Number', width: 150, editable: isAdmin },
    { field: 'fullName', headerName: 'Full Name', width: 200, editable: isAdmin },
    { field: 'email', headerName: 'Email', width: 220, editable: isAdmin },
    { field: 'phone', headerName: 'Phone', width: 150, editable: isAdmin },
    { field: 'department', headerName: 'Department', width: 180, editable: isAdmin },
    { field: 'position', headerName: 'Position', width: 180, editable: isAdmin },
    { field: 'dateJoined', headerName: 'Date Joined', width: 130, editable: isAdmin },
    ...(isAdmin ? [{
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => handleDeleteEmployee(params.row.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    }] : [])
  ];

  const rows: GridRowsProp = employees;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Employee Management</h2>
        {isAdmin && (
          <div className="flex gap-2">
            <Button onClick={downloadCSVTemplate} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download Template
            </Button>
            <Button onClick={() => setIsImportDialogOpen(true)} variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </div>
        )}
      </div>

      <div style={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          processRowUpdate={handleProcessRowUpdate}
          onProcessRowUpdateError={(error) => {
            console.error('Row update error:', error);
          }}
          pageSizeOptions={[10, 25, 50, 100]}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          checkboxSelection={isAdmin}
          disableRowSelectionOnClick
        />
      </div>

      {/* Add Employee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Enter the employee details below. All fields are required.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="payrollNumber">Payroll Number</Label>
              <Input
                id="payrollNumber"
                value={newEmployee.payrollNumber}
                onChange={(e) => setNewEmployee({ ...newEmployee, payrollNumber: e.target.value })}
                placeholder="NCC2024XXX"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={newEmployee.fullName}
                onChange={(e) => setNewEmployee({ ...newEmployee, fullName: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={newEmployee.email}
                onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                placeholder="john.doe@nairobi.go.ke"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={newEmployee.phone}
                onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })}
                placeholder="+254700000000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={newEmployee.department}
                onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                placeholder="City Inspectorate"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={newEmployee.position}
                onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                placeholder="Inspector"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateJoined">Date Joined</Label>
              <Input
                id="dateJoined"
                type="date"
                value={newEmployee.dateJoined}
                onChange={(e) => setNewEmployee({ ...newEmployee, dateJoined: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={newEmployee.password}
                onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                placeholder="password123"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddEmployee}>Add Employee</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import CSV Dialog */}
      <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Import Employees from CSV</DialogTitle>
            <DialogDescription>
              Upload a CSV file with employee data. Download the template to see the required format.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="csvFile">Select CSV File</Label>
              <Input
                id="csvFile"
                type="file"
                accept=".csv"
                onChange={(e) => setCsvFile(e.target.files?.[0] || null)}
              />
            </div>
            {csvFile && (
              <div className="text-sm text-green-600">
                Selected: {csvFile.name}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsImportDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCSVImport} disabled={!csvFile}>
              Import
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
