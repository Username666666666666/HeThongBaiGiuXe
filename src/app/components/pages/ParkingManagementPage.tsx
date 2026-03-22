import { useState } from 'react';
import { useParking } from '../../contexts/ParkingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Search, Pencil, Trash2, Eye, Filter, CarFront, Clock, User } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

export function ParkingManagementPage() {
  const { getParkedVehicles, deleteVehicle, updateVehicle } = useParking();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [selectedVehicle, setSelectedVehicle] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<string | null>(null);

  const parkedVehicles = getParkedVehicles();

  const filteredVehicles = parkedVehicles.filter((v) => {
    const matchesSearch =
      v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.parkingSpot.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filterType === 'all' || v.vehicleType === filterType;

    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (vehicle: any) => {
    setSelectedVehicle(vehicle);
    setShowDetailsDialog(true);
  };

  const handleDeleteClick = (id: string) => {
    setVehicleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (vehicleToDelete) {
      deleteVehicle(vehicleToDelete);
      toast.success('Đã xóa xe khỏi danh sách!');
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

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

  const getParkingDuration = (entryTime: string) => {
    const entry = new Date(entryTime);
    const now = new Date();
    const diff = now.getTime() - entry.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  // Parking spot visualization
  const parkingZones = ['A', 'B', 'C', 'D', 'E'];
  const spotsPerZone = 20;

  const getSpotStatus = (zone: string, spotNum: number) => {
    const spotId = `${zone}${String(spotNum).padStart(2, '0')}`;
    const vehicle = parkedVehicles.find((v) => v.parkingSpot === spotId);
    return vehicle;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Quản Lý Vị Trí Đỗ Xe</h2>
        <p className="text-gray-600 mt-1">Xem và quản lý tất cả xe trong bãi</p>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Danh Sách</TabsTrigger>
          <TabsTrigger value="map">Sơ Đồ Bãi</TabsTrigger>
        </TabsList>

        {/* List View */}
        <TabsContent value="list" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm biển số, tên chủ xe, vị trí..."
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
              </div>
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>Danh Sách Xe ({filteredVehicles.length})</CardTitle>
              <CardDescription>Tất cả xe đang trong bãi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Biển Số</TableHead>
                      <TableHead>Loại Xe</TableHead>
                      <TableHead>Chủ Xe</TableHead>
                      <TableHead>Số ĐT</TableHead>
                      <TableHead>Vị Trí</TableHead>
                      <TableHead>Thời Gian Vào</TableHead>
                      <TableHead>Thời Gian Đỗ</TableHead>
                      <TableHead className="text-right">Thao Tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredVehicles.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                          Không tìm thấy xe nào
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredVehicles.map((vehicle) => (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium">{vehicle.licensePlate}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{getVehicleTypeLabel(vehicle.vehicleType)}</Badge>
                          </TableCell>
                          <TableCell>{vehicle.ownerName}</TableCell>
                          <TableCell>{vehicle.phoneNumber}</TableCell>
                          <TableCell>
                            <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                              {vehicle.parkingSpot}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm">
                            {new Date(vehicle.entryTime).toLocaleString('vi-VN')}
                          </TableCell>
                          <TableCell className="text-sm">{getParkingDuration(vehicle.entryTime)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewDetails(vehicle)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteClick(vehicle.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Map View */}
        <TabsContent value="map" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sơ Đồ Bãi Đỗ Xe</CardTitle>
              <CardDescription>Trực quan hóa các vị trí đỗ xe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {parkingZones.map((zone) => (
                <div key={zone}>
                  <h3 className="font-bold text-lg mb-3">Khu {zone}</h3>
                  <div className="grid grid-cols-10 gap-2">
                    {Array.from({ length: spotsPerZone }, (_, i) => i + 1).map((spotNum) => {
                      const vehicle = getSpotStatus(zone, spotNum);
                      const spotId = `${zone}${String(spotNum).padStart(2, '0')}`;
                      
                      return (
                        <div
                          key={spotId}
                          onClick={() => vehicle && handleViewDetails(vehicle)}
                          className={`aspect-square rounded-lg border-2 flex items-center justify-center text-xs font-medium cursor-pointer transition-all ${
                            vehicle
                              ? 'bg-red-100 border-red-300 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 border-green-300 text-green-700 hover:bg-green-200'
                          }`}
                        >
                          {spotId}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}

              <div className="flex gap-6 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-green-100 border-2 border-green-300"></div>
                  <span className="text-sm">Trống</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-red-100 border-2 border-red-300"></div>
                  <span className="text-sm">Đã đỗ</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Chi Tiết Xe</DialogTitle>
            <DialogDescription>Thông tin chi tiết về xe đã đăng ký</DialogDescription>
          </DialogHeader>
          {selectedVehicle && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                  <CarFront className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-bold text-xl">{selectedVehicle.licensePlate}</p>
                  <Badge variant="outline">{getVehicleTypeLabel(selectedVehicle.vehicleType)}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Chủ Xe</p>
                  <p className="font-medium">{selectedVehicle.ownerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Số Điện Thoại</p>
                  <p className="font-medium">{selectedVehicle.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Vị Trí Đỗ</p>
                  <p className="font-medium">{selectedVehicle.parkingSpot}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Thời Gian Đỗ</p>
                  <p className="font-medium">{getParkingDuration(selectedVehicle.entryTime)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-600">Thời Gian Vào</p>
                  <p className="font-medium">
                    {new Date(selectedVehicle.entryTime).toLocaleString('vi-VN')}
                  </p>
                </div>
                {selectedVehicle.notes && (
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600">Ghi Chú</p>
                    <p className="font-medium">{selectedVehicle.notes}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác Nhận Xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa xe này khỏi danh sách? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
