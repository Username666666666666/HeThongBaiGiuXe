import { useState } from 'react';
import { useParking } from '../../contexts/ParkingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Download, Calendar, DollarSign, Clock, Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function HistoryPage() {
  const { getVehicleHistory } = useParking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const history = getVehicleHistory();

  const filteredHistory = history.filter((v) => {
    const matchesSearch =
      v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesType = filterType === 'all' || v.vehicleType === filterType;

    let matchesDate = true;
    if (dateFilter !== 'all' && v.exitTime) {
      const exitDate = new Date(v.exitTime);
      const today = new Date();
      const diffDays = Math.floor((today.getTime() - exitDate.getTime()) / (1000 * 60 * 60 * 24));

      if (dateFilter === 'today') matchesDate = diffDays === 0;
      else if (dateFilter === 'week') matchesDate = diffDays <= 7;
      else if (dateFilter === 'month') matchesDate = diffDays <= 30;
    }

    return matchesSearch && matchesType && matchesDate;
  });

  const totalRevenue = filteredHistory.reduce((sum, v) => sum + (v.fee || 0), 0);

  const getVehicleTypeLabel = (type: string) => {
    switch (type) {
      case 'motorbike':
        return 'Xe Máy';
      case 'car':
        return 'Ô Tô';
      case 'truck':
        return 'Xe Tải';
      default:
        return type;
    }
  };

  const getParkingDuration = (entryTime: string, exitTime?: string) => {
    if (!exitTime) return 'N/A';
    const entry = new Date(entryTime);
    const exit = new Date(exitTime);
    const diff = exit.getTime() - entry.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  const handleExport = () => {
    const csvContent = [
      ['Biển Số', 'Loại Xe', 'Chủ Xe', 'Vào', 'Ra', 'Thời Gian', 'Phí'].join(','),
      ...filteredHistory.map((v) =>
        [
          v.licensePlate,
          getVehicleTypeLabel(v.vehicleType),
          v.ownerName,
          new Date(v.entryTime).toLocaleString('vi-VN'),
          v.exitTime ? new Date(v.exitTime).toLocaleString('vi-VN') : '',
          getParkingDuration(v.entryTime, v.exitTime),
          v.fee || 0,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `parking-history-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Lịch Sử Xe Ra Vào</h2>
          <p className="text-gray-600 mt-1">Xem lại tất cả xe đã ra khỏi bãi</p>
        </div>
        <Button onClick={handleExport} className="gap-2">
          <Download className="h-4 w-4" />
          Xuất Excel
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng Lượt Xe</p>
                <p className="text-2xl font-bold">{filteredHistory.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng Doanh Thu</p>
                <p className="text-2xl font-bold">{totalRevenue.toLocaleString('vi-VN')}đ</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">TB Doanh Thu</p>
                <p className="text-2xl font-bold">
                  {filteredHistory.length > 0
                    ? Math.round(totalRevenue / filteredHistory.length).toLocaleString('vi-VN')
                    : 0}
                  đ
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">TB Thời Gian</p>
                <p className="text-2xl font-bold">2.5h</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Tìm kiếm biển số, tên chủ xe..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất Cả Loại Xe</SelectItem>
                  <SelectItem value="motorbike">Xe Máy</SelectItem>
                  <SelectItem value="car">Ô Tô</SelectItem>
                  <SelectItem value="truck">Xe Tải</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất Cả Thời Gian</SelectItem>
                  <SelectItem value="today">Hôm Nay</SelectItem>
                  <SelectItem value="week">7 Ngày Qua</SelectItem>
                  <SelectItem value="month">30 Ngày Qua</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh Sách ({filteredHistory.length})</CardTitle>
          <CardDescription>Lịch sử xe đã ra khỏi bãi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Biển Số</TableHead>
                  <TableHead>Loại Xe</TableHead>
                  <TableHead>Chủ Xe</TableHead>
                  <TableHead>Thời Gian Vào</TableHead>
                  <TableHead>Thời Gian Ra</TableHead>
                  <TableHead>Thời Gian Đỗ</TableHead>
                  <TableHead className="text-right">Phí</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      Không có lịch sử nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredHistory.map((vehicle) => (
                    <TableRow key={vehicle.id}>
                      <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{getVehicleTypeLabel(vehicle.vehicleType)}</Badge>
                      </TableCell>
                      <TableCell>{vehicle.ownerName}</TableCell>
                      <TableCell className="text-sm">
                        {new Date(vehicle.entryTime).toLocaleString('vi-VN', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </TableCell>
                      <TableCell className="text-sm">
                        {vehicle.exitTime
                          ? new Date(vehicle.exitTime).toLocaleString('vi-VN', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : '-'}
                      </TableCell>
                      <TableCell className="text-sm">
                        {getParkingDuration(vehicle.entryTime, vehicle.exitTime)}
                      </TableCell>
                      <TableCell className="text-right font-medium text-green-600">
                        {(vehicle.fee || 0).toLocaleString('vi-VN')}đ
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
