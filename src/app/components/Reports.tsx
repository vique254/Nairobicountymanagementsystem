import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import {
  getEmployeeStatsByDepartment,
  getEmployeeStatsByPosition,
  getActivityStatsByStatus,
  getAllStaff,
  getAllDailyRecords
} from '../utils/database';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658'];

interface ChartData {
  name: string;
  value: number;
}

export function Reports() {
  const [departmentData, setDepartmentData] = useState<ChartData[]>([]);
  const [positionData, setPositionData] = useState<ChartData[]>([]);
  const [statusData, setStatusData] = useState<ChartData[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);

  useEffect(() => {
    loadReportData();
  }, []);

  const loadReportData = () => {
    const deptStats = getEmployeeStatsByDepartment();
    const posStats = getEmployeeStatsByPosition();
    const actStats = getActivityStatsByStatus();
    const staff = getAllStaff();
    const records = getAllDailyRecords();

    setDepartmentData(deptStats);
    setPositionData(posStats);
    setStatusData(actStats);
    setTotalEmployees(staff.length);
    setTotalActivities(records.length);
  };

  const renderCustomLabel = ({ name, value, percent }: any) => {
    return `${name}: ${value} (${(percent * 100).toFixed(0)}%)`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Employees</CardDescription>
            <CardTitle className="text-3xl">{totalEmployees}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Active staff members</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Activities</CardDescription>
            <CardTitle className="text-3xl">{totalActivities}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Inspection records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Departments</CardDescription>
            <CardTitle className="text-3xl">{departmentData.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Active departments</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="department" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="department">By Department</TabsTrigger>
          <TabsTrigger value="position">By Position</TabsTrigger>
          <TabsTrigger value="status">By Activity Status</TabsTrigger>
        </TabsList>

        <TabsContent value="department" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Employees by Department</CardTitle>
              <CardDescription>
                Distribution of employees across different departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              {departmentData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  No employee data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="position" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Employees by Position</CardTitle>
              <CardDescription>
                Distribution of employees across different positions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {positionData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={positionData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {positionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  No employee data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Activities by Status</CardTitle>
              <CardDescription>
                Distribution of inspection activities by completion status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height={400}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomLabel}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                  No activity data available
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Data Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Department Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {departmentData.map((dept, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">{dept.name}</span>
                  <span className="text-muted-foreground">{dept.value} employees</span>
                </div>
              ))}
              {departmentData.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Position Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {positionData.map((pos, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <span className="font-medium">{pos.name}</span>
                  <span className="text-muted-foreground">{pos.value} employees</span>
                </div>
              ))}
              {positionData.length === 0 && (
                <p className="text-center text-muted-foreground py-4">No data available</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
