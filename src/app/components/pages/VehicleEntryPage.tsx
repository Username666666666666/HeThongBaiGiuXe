import { useState } from 'react';
import { useParking } from '../../contexts/ParkingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea';
import { CarFront, Save, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertDescription } from '../ui/alert';

export function VehicleEntryPage() {
  const { addVehicle, getAvailableSpots, getParkedVehicles } = useParking();
  const [formData, setFormData] = useState({
    licensePlate: '',
    vehicleType: 'motorbike' as 'motorbike' | 'car' | 'truck',
    ownerName: '',
    phoneNumber: '',
    parkingSpot: '',
    notes: '',
  });

  const availableSpots = getAvailableSpots();
  const parkedVehicles = getParkedVehicles();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (availableSpots === 0) {
      toast.error('Bãi xe đã đầy! Không thể thêm xe mới.');
      return;
    }

    // Kiểm tra biển số đã tồn tại
    const exists = parkedVehicles.find(v => v.licensePlate === formData.licensePlate);
    if (exists) {
      toast.error('Biển số xe này đã có trong bãi!');
      return;
    }

    addVehicle({
      ...formData,
      entryTime: new Date().toISOString(),
    });

    toast.success(
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4" />
        <span>Đã thêm xe {formData.licensePlate} vào bãi!</span>
      </div>
    );

    handleReset();
  };

  const handleReset = () => {
    setFormData({
      licensePlate: '',
      vehicleType: 'motorbike',
      ownerName: '',
      phoneNumber: '',
      parkingSpot: '',
      notes: '',
    });
  };

  const handleQuickFill = () => {
    const randomPlate = `29A-${Math.floor(10000 + Math.random() * 90000)}`;
    const randomSpot = String.fromCharCode(65 + Math.floor(Math.random() * 5)) + 
                       String(Math.floor(1 + Math.random() * 20)).padStart(2, '0');
    
    setFormData({
      licensePlate: randomPlate,
      vehicleType: 'car',
      ownerName: 'Nguyễn Văn ' + String.fromCharCode(65 + Math.floor(Math.random() * 26)),
      phoneNumber: '09' + Math.floor(10000000 + Math.random() * 90000000),
      parkingSpot: randomSpot,
      notes: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Xe Vào Bãi</h2>
          <p className="text-gray-600 mt-1">Đăng ký xe mới vào bãi đỗ</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Chỗ trống</p>
          <p className="text-3xl font-bold text-green-600">{availableSpots}</p>
        </div>
      </div>

      {/* Warning if almost full */}
      {availableSpots <= 10 && availableSpots > 0 && (
        <Alert className="border-yellow-500 bg-yellow-50">
          <AlertCircle className="h-4 w-4 text-yellow-600" />
          <AlertDescription className="text-yellow-800">
            Cảnh báo: Bãi xe sắp đầy! Chỉ còn {availableSpots} chỗ trống.
          </AlertDescription>
        </Alert>
      )}

      {availableSpots === 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Bãi xe đã đầy! Vui lòng chờ có xe ra hoặc mở rộng bãi.
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CarFront className="w-5 h-5" />
            Thông Tin Xe
          </CardTitle>
          <CardDescription>Nhập đầy đủ thông tin xe vào bãi</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Biển số xe */}
              <div className="space-y-2">
                <Label htmlFor="licensePlate">
                  Biển Số Xe <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="licensePlate"
                  placeholder="VD: 29A-12345"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                  required
                  className="uppercase"
                />
              </div>

              {/* Loại xe */}
              <div className="space-y-2">
                <Label htmlFor="vehicleType">
                  Loại Xe <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.vehicleType}
                  onValueChange={(value: 'motorbike' | 'car' | 'truck') =>
                    setFormData({ ...formData, vehicleType: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motorbike">Xe Máy</SelectItem>
                    <SelectItem value="car">Ô Tô</SelectItem>
                    <SelectItem value="truck">Xe Tải</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Tên chủ xe */}
              <div className="space-y-2">
                <Label htmlFor="ownerName">
                  Tên Chủ Xe <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerName"
                  placeholder="Nhập tên chủ xe"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  required
                />
              </div>

              {/* Số điện thoại */}
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">
                  Số Điện Thoại <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="VD: 0912345678"
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  required
                />
              </div>

              {/* Vị trí đỗ */}
              <div className="space-y-2">
                <Label htmlFor="parkingSpot">
                  Vị Trí Đỗ <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="parkingSpot"
                  placeholder="VD: A01, B15"
                  value={formData.parkingSpot}
                  onChange={(e) => setFormData({ ...formData, parkingSpot: e.target.value.toUpperCase() })}
                  required
                  className="uppercase"
                />
                <p className="text-xs text-gray-500">
                  Khu A-E, số 01-20. VD: A01, B15, C20
                </p>
              </div>
            </div>

            {/* Ghi chú */}
            <div className="space-y-2">
              <Label htmlFor="notes">Ghi Chú (Tùy chọn)</Label>
              <Textarea
                id="notes"
                placeholder="Nhập ghi chú về xe hoặc chủ xe..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <Button
                type="submit"
                size="lg"
                className="flex-1"
                disabled={availableSpots === 0}
              >
                <Save className="mr-2 h-4 w-4" />
                Lưu Thông Tin
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={handleReset}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Làm Mới
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                onClick={handleQuickFill}
              >
                Demo
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm text-blue-600 font-medium">Giá Xe Máy</p>
            <p className="text-2xl font-bold text-blue-900">5,000đ/giờ</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <p className="text-sm text-green-600 font-medium">Giá Ô Tô</p>
            <p className="text-2xl font-bold text-green-900">15,000đ/giờ</p>
          </CardContent>
        </Card>
        <Card className="bg-purple-50 border-purple-200">
          <CardContent className="p-4">
            <p className="text-sm text-purple-600 font-medium">Giá Xe Tải</p>
            <p className="text-2xl font-bold text-purple-900">25,000đ/giờ</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
