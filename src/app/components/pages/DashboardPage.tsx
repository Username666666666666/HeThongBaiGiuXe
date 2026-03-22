import { useParking } from '../../contexts/ParkingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { CarFront, TrendingUp, Clock, DollarSign, ParkingSquare, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';

export function DashboardPage() {
  const { getParkedVehicles, getTotalSpots, getAvailableSpots, getVehicleHistory } = useParking();
  
  const parkedVehicles = getParkedVehicles();
  const totalSpots = getTotalSpots();
  const availableSpots = getAvailableSpots();
  const occupancyRate = ((totalSpots - availableSpots) / totalSpots) * 100;
  const history = getVehicleHistory();
  const todayRevenue = history.reduce((sum, v) => sum + (v.fee || 0), 0);

  const stats = [
    {
      title: 'Xe Đang Đỗ',
      value: parkedVehicles.length,
      icon: CarFront,
      description: `Tổng ${totalSpots} chỗ`,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Chỗ Trống',
      value: availableSpots,
      icon: ParkingSquare,
      description: `${occupancyRate.toFixed(0)}% đã sử dụng`,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Doanh Thu Hôm Nay',
      value: `${todayRevenue.toLocaleString('vi-VN')}đ`,
      icon: DollarSign,
      description: `${history.length} lượt xe`,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Thời Gian Trung Bình',
      value: '2.5 giờ',
      icon: Clock,
      description: 'Thời gian đỗ xe',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentVehicles = parkedVehicles.slice(-5).reverse();

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao Tác Nhanh</CardTitle>
          <CardDescription>Các chức năng thường dùng</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Link to="/entry">
            <Button className="w-full h-20 flex flex-col gap-2 bg-blue-600 hover:bg-blue-700">
              <CarFront className="h-6 w-6" />
              <span>Xe Vào Bãi</span>
            </Button>
          </Link>
          <Link to="/exit">
            <Button className="w-full h-20 flex flex-col gap-2 bg-green-600 hover:bg-green-700">
              <TrendingUp className="h-6 w-6" />
              <span>Xe Ra Bãi</span>
            </Button>
          </Link>
          <Link to="/parking">
            <Button className="w-full h-20 flex flex-col gap-2 bg-purple-600 hover:bg-purple-700">
              <ParkingSquare className="h-6 w-6" />
              <span>Quản Lý Vị Trí</span>
            </Button>
          </Link>
          <Link to="/statistics">
            <Button className="w-full h-20 flex flex-col gap-2 bg-orange-600 hover:bg-orange-700">
              <DollarSign className="h-6 w-6" />
              <span>Báo Cáo</span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Occupancy */}
        <Card>
          <CardHeader>
            <CardTitle>Tình Trạng Bãi Xe</CardTitle>
            <CardDescription>Mức độ sử dụng hiện tại</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Đã sử dụng: {totalSpots - availableSpots}/{totalSpots}</span>
                <span className="font-medium">{occupancyRate.toFixed(1)}%</span>
              </div>
              <Progress value={occupancyRate} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4 pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{parkedVehicles.filter(v => v.vehicleType === 'car').length}</p>
                <p className="text-xs text-gray-600">Ô tô</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{parkedVehicles.filter(v => v.vehicleType === 'motorbike').length}</p>
                <p className="text-xs text-gray-600">Xe máy</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{parkedVehicles.filter(v => v.vehicleType === 'truck').length}</p>
                <p className="text-xs text-gray-600">Xe tải</p>
              </div>
            </div>

            {occupancyRate > 90 && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <p className="text-sm text-red-600">Bãi xe sắp đầy! Chỉ còn {availableSpots} chỗ trống.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Vehicles */}
        <Card>
          <CardHeader>
            <CardTitle>Xe Vào Gần Đây</CardTitle>
            <CardDescription>5 xe mới nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentVehicles.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">Chưa có xe nào trong bãi</p>
              ) : (
                recentVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <CarFront className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{vehicle.licensePlate}</p>
                        <p className="text-xs text-gray-600">{vehicle.ownerName}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{vehicle.parkingSpot}</Badge>
                      <p className="text-xs text-gray-600 mt-1">
                        {new Date(vehicle.entryTime).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <Link to="/parking">
              <Button variant="outline" className="w-full mt-4">
                Xem Tất Cả
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
