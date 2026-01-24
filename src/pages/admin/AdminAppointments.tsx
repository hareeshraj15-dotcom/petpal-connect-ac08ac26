import { useState } from 'react';
import { Calendar, Search, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const mockAppointments = [
  { id: 1, pet: 'Max', owner: 'John Doe', vet: 'Dr. Sarah Wilson', date: '2024-02-20', time: '10:00 AM', status: 'scheduled', reason: 'Annual checkup' },
  { id: 2, pet: 'Whiskers', owner: 'Lisa Brown', vet: 'Dr. James Miller', date: '2024-02-20', time: '11:30 AM', status: 'completed', reason: 'Vaccination' },
  { id: 3, pet: 'Buddy', owner: 'Mike Johnson', vet: 'Dr. Maria Garcia', date: '2024-02-21', time: '09:00 AM', status: 'scheduled', reason: 'Dental cleaning' },
  { id: 4, pet: 'Luna', owner: 'Sarah Adams', vet: 'Dr. Sarah Wilson', date: '2024-02-19', time: '02:00 PM', status: 'cancelled', reason: 'Skin allergy' },
  { id: 5, pet: 'Charlie', owner: 'Tom Wilson', vet: 'Dr. Emily Chen', date: '2024-02-21', time: '03:30 PM', status: 'scheduled', reason: 'General checkup' },
];

const AdminAppointments = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesSearch =
      apt.pet.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.owner.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.vet.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-500 gap-1">
            <CheckCircle className="h-3 w-3" />
            Completed
          </Badge>
        );
      case 'cancelled':
        return (
          <Badge variant="destructive" className="gap-1">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-500 gap-1">
            <Clock className="h-3 w-3" />
            Scheduled
          </Badge>
        );
    }
  };

  const stats = {
    total: mockAppointments.length,
    scheduled: mockAppointments.filter((a) => a.status === 'scheduled').length,
    completed: mockAppointments.filter((a) => a.status === 'completed').length,
    cancelled: mockAppointments.filter((a) => a.status === 'cancelled').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Appointment Management</h1>
          <p className="text-muted-foreground">Monitor all appointments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">Total</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.scheduled}</p>
              <p className="text-sm text-muted-foreground">Scheduled</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-destructive">{stats.cancelled}</p>
              <p className="text-sm text-muted-foreground">Cancelled</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              All Appointments
            </CardTitle>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Pet</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Veterinarian</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Reason</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((apt) => (
                <TableRow key={apt.id}>
                  <TableCell className="font-medium">{apt.pet}</TableCell>
                  <TableCell>{apt.owner}</TableCell>
                  <TableCell>{apt.vet}</TableCell>
                  <TableCell>
                    {apt.date} at {apt.time}
                  </TableCell>
                  <TableCell>{apt.reason}</TableCell>
                  <TableCell>{getStatusBadge(apt.status)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAppointments;
