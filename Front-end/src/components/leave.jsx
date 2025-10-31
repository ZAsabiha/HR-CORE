import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

const employees = [
  { name: 'Sanjana Afreen', role: 'UI UX Designer', startDate: '28/04/2022', type: 'Full time', gender: 'Female' },
  { name: 'Israt Risha Ivey', role: 'Backend Engineer', startDate: '28/04/2022', type: 'Remote', gender: 'Female' },
  { name: 'Zannatul Adon', role: 'UI UX Designer', startDate: '28/04/2022', type: 'Full time', gender: 'Female' },
  { name: 'Nishat Tasnim', role: 'UI UX Designer', startDate: '28/04/2022', type: 'Full time', gender: 'Female' },
  { name: 'Adib Rahman', role: 'UI UX Designer', startDate: '28/04/2022', type: 'Full time', gender: 'Male' },
  { name: 'Navid Ibrahim', role: 'UI UX Designer', startDate: '28/04/2022', type: 'Full time', gender: 'Male' },
  { name: 'Hasibul Karim', role: 'UI UX Designer', startDate: '28/04/2022', type: 'Full time', gender: 'Male' },
];

export default function LeaveManagement() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Leave Requests</h2>
        <Button className="bg-slate-800 hover:bg-slate-900 text-white">+ Add Employee</Button>
      </div>
      <Card>
        <CardContent className="overflow-x-auto p-0">\          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name(s)</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Duration(s)</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Start Date</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Gender</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employees.map((emp, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.startDate}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{emp.gender}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          Actions <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem>View Profile</DropdownMenuItem>
                        <DropdownMenuItem>Edit Profile</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500">Delete Profile</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
