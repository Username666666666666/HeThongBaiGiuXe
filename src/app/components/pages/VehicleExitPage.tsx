import { useState } from 'react';
import { useParking, Vehicle } from '../../contexts/ParkingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Search, LogOut, Calculator, DollarSign, Clock, User, Phone, CarFront } from 'lucide-react';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog';

export function VehicleExitPage() {
  const { getParkedVehicles, exitVehicle } = useParking();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
  const [calculatedFee, setCalculatedFee] = useState(0);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const parkedVehicles = getParkedVehicles();
  const filteredVehicles = parkedVehicles.filter(
    (v) =>
      v.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.phoneNumber.includes(searchTerm)
  );

  const calculateFee = (vehicle: Vehicle) => {
    const entryTime = new Date(vehicle.entryTime);
    const exitTime = new Date();
    const hours = Math.ceil((exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60));

    let ratePerHour = 0;
    switch (vehicle.vehicleType) {
      case 'motorbike':
        ratePerHour = 5000;
        break;
      case 'car':
        ratePerHour = 15000;
        break;
      case 'truck':
        ratePerHour = 25000;
        break;
    }

    return hours * ratePerHour;
  };

  const handleSelectVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    const fee = calculateFee(vehicle);
    setCalculatedFee(fee);
  };

  const handleProcessExit = () => {
    setShowConfirmDialog(true);
  };

  const confirmExit = () => {
    if (selectedVehicle) {
      exitVehicle(selectedVehicle.id, calculatedFee);
      toast.success(`Xe ${selectedVehicle.licensePlate} đã ra bãi. Phí: ${calculatedFee.toLocaleString('vi-VN')}đ`);
      setSelectedVehicle(null);
      setCalculatedFee(0);
      setSearchTerm('');
      setShowConfirmDialog(false);
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

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Xe Ra Bãi</h2>
        <p className="text-gray-600 mt-1">Tìm kiếm và xử lý xe ra khỏi bãi</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Search and List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh Sách Xe Trong Bãi</CardTitle>
            <CardDescription>{parkedVehicles.length} xe đang đỗ</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm biển số, tên, hoặc SĐT..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Vehicle List */}
            <div className="space-y-2 max-h-[600px] overflow-y-auto">
              {filteredVehicles.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  {parkedVehicles.length === 0
                    ? 'Không có xe nào trong bãi'
                    : 'Không tìm thấy xe phù hợp'}
                </p>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    onClick={() => handleSelectVehicle(vehicle)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedVehicle?.id === vehicle.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <p className="font-bold text-lg">{vehicle.licensePlate}</p>
                          <Badge variant="outline">{vehicle.parkingSpot}</Badge>
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center gap-2">
                            <User className="w-3 h-3" />
                            {vehicle.ownerName}
                          </p>
                          <p className="flex items-center gap-2">
                            <Phone className="w-3 h-3" />
                            {vehicle.phoneNumber}
                          </p>
                          <p className="flex items-center gap-2">
                            <Clock className="w-3 h-3" />
                            {getParkingDuration(vehicle.entryTime)}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                        {getVehicleTypeLabel(vehicle.vehicleType)}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Fee Calculation */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Tính Phí Đỗ Xe
              </CardTitle>
              <CardDescription>
                {selectedVehicle ? 'Thông tin chi tiết' : 'Chọn xe để tính phí'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedVehicle ? (
                <div className="space-y-6">
                  {/* Vehicle Info */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CarFront className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-bold text-xl">{selectedVehicle.licensePlate}</p>
                        <p className="text-sm text-gray-600">{selectedVehicle.ownerName}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-600">Loại Xe</Label>
                        <p className="font-medium">{getVehicleTypeLabel(selectedVehicle.vehicleType)}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Vị Trí</Label>
                        <p className="font-medium">{selectedVehicle.parkingSpot}</p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Thời Gian Vào</Label>
                        <p className="font-medium">
                          {new Date(selectedVehicle.entryTime).toLocaleString('vi-VN')}
                        </p>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-600">Thời Gian Đỗ</Label>
                        <p className="font-medium">{getParkingDuration(selectedVehicle.entryTime)}</p>
                      </div>
                    </div>

                    {selectedVehicle.notes && (
                      <div>
                        <Label className="text-xs text-gray-600">Ghi Chú</Label>
                        <p className="text-sm">{selectedVehicle.notes}</p>
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Fee Calculation */}
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Đơn giá</span>
                      <span className="font-medium">
                        {selectedVehicle.vehicleType === 'motorbike' && '5,000đ/giờ'}
                        {selectedVehicle.vehicleType === 'car' && '15,000đ/giờ'}
                        {selectedVehicle.vehicleType === 'truck' && '25,000đ/giờ'}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Số giờ</span>
                      <span className="font-medium">
                        {Math.ceil(
                          (new Date().getTime() - new Date(selectedVehicle.entryTime).getTime()) /
                            (1000 * 60 * 60)
                        )}{' '}
                        giờ
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                      <span className="font-medium">Tổng Phí</span>
                      <div className="text-right">
                        <p className="text-3xl font-bold text-green-600">
                          {calculatedFee.toLocaleString('vi-VN')}đ
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Button
                      onClick={handleProcessExit}
                      size="lg"
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Xử Lý Ra Bãi
                    </Button>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setSelectedVehicle(null);
                        setCalculatedFee(0);
                      }}
                    >
                      Hủy
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <CarFront className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p>Vui lòng chọn xe từ danh sách bên trái</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Price Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <DollarSign className="w-5 h-5 text-blue-600 mt-0.5" />
                <div className="space-y-1 text-sm">
                  <p className="font-medium text-blue-900">Bảng Giá Đỗ Xe</p>
                  <p className="text-blue-700">• Xe máy: 5,000đ/giờ</p>
                  <p className="text-blue-700">• Ô tô: 15,000đ/giờ</p>
                  <p className="text-blue-700">• Xe tải: 25,000đ/giờ</p>
                  <p className="text-xs text-blue-600 mt-2">* Làm tròn lên theo giờ</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác Nhận Xe Ra Bãi</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xử lý xe{' '}
              <span className="font-bold">{selectedVehicle?.licensePlate}</span> ra bãi với phí{' '}
              <span className="font-bold">{calculatedFee.toLocaleString('vi-VN')}đ</span>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmExit} className="bg-green-600 hover:bg-green-700">
              Xác Nhận
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
