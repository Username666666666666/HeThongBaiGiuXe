import { useParking } from '../../contexts/ParkingContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, DollarSign, Clock, CarFront } from 'lucide-react';
import { Badge } from '../ui/badge';

export function StatisticsPage() {
  const { getVehicleHistory, getParkedVehicles } = useParking();

  const history = getVehicleHistory();
  const parkedVehicles = getParkedVehicles();
  const allVehicles = [...history, ...parkedVehicles];

  // Vehicle type distribution
  const vehicleTypeData = [
    {
      name: 'Xe Máy',
      value: allVehicles.filter((v) => v.vehicleType === 'motorbike').length,
      color: '#3b82f6',
    },
    {
      name: 'Ô Tô',
      value: allVehicles.filter((v) => v.vehicleType === 'car').length,
      color: '#10b981',
    },
    {
      name: 'Xe Tải',
      value: allVehicles.filter((v) => v.vehicleType === 'truck').length,
      color: '#8b5cf6',
    },
  ];

  // Revenue by vehicle type
  const revenueByType = [
    {
      type: 'Xe Máy',
      revenue: history.filter((v) => v.vehicleType === 'motorbike').reduce((sum, v) => sum + (v.fee || 0), 0),
    },
    {
      type: 'Ô Tô',
      revenue: history.filter((v) => v.vehicleType === 'car').reduce((sum, v) => sum + (v.fee || 0), 0),
    },
    {
      type: 'Xe Tải',
      revenue: history.filter((v) => v.vehicleType === 'truck').reduce((sum, v) => sum + (v.fee || 0), 0),
    },
  ];

  // Daily revenue (mock data for demonstration)
  const dailyData = [
    { day: 'T2', revenue: 450000, vehicles: 45 },
    { day: 'T3', revenue: 520000, vehicles: 52 },
    { day: 'T4', revenue: 480000, vehicles: 48 },
    { day: 'T5', revenue: 610000, vehicles: 61 },
    { day: 'T6', revenue: 720000, vehicles: 72 },
    { day: 'T7', revenue: 850000, vehicles: 85 },
    { day: 'CN', revenue: 680000, vehicles: 68 },
  ];

  // Hourly traffic (mock data)
  const hourlyData = [
    { hour: '00:00', count: 5 },
    { hour: '03:00', count: 2 },
    { hour: '06:00', count: 15 },
    { hour: '09:00', count: 35 },
    { hour: '12:00', count: 42 },
    { hour: '15:00', count: 38 },
    { hour: '18:00', count: 45 },
    { hour: '21:00', count: 25 },
  ];

  const totalRevenue = history.reduce((sum, v) => sum + (v.fee || 0), 0);
  const avgRevenue = history.length > 0 ? totalRevenue / history.length : 0;

  const stats = [
    {
      title: 'Tổng Doanh Thu',
      value: `${totalRevenue.toLocaleString('vi-VN')}đ`,
      icon: DollarSign,
      change: '+12.5%',
      positive: true,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Tổng Lượt Xe',
      value: allVehicles.length,
      icon: CarFront,
      change: '+8.2%',
      positive: true,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'TB Doanh Thu/Xe',
      value: `${Math.round(avgRevenue).toLocaleString('vi-VN')}đ`,
      icon: TrendingUp,
      change: '+5.1%',
      positive: true,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'TB Thời Gian Đỗ',
      value: '2.5 giờ',
      icon: Clock,
      change: '-0.3 giờ',
      positive: false,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Thống Kê & Báo Cáo</h2>
        <p className="text-gray-600 mt-1">Phân tích dữ liệu hoạt động bãi xe</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-xs flex items-center gap-1 ${stat.positive ? 'text-green-600' : 'text-red-600'}`}>
                    <span>{stat.change}</span>
                    <span className="text-gray-500">so với tuần trước</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Vehicle Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân Bổ Loại Xe</CardTitle>
            <CardDescription>Tỷ lệ các loại xe</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={vehicleTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>`${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {vehicleTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4">
              {vehicleTypeData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm">{item.name}: {item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Revenue by Type */}
        <Card>
          <CardHeader>
            <CardTitle>Doanh Thu Theo Loại Xe</CardTitle>
            <CardDescription>So sánh doanh thu</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByType}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="type" />
                <YAxis />
                <Tooltip formatter={(value) => `${Number(value).toLocaleString('vi-VN')}đ`} />
                <Bar dataKey="revenue" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Daily Revenue */}
      <Card>
        <CardHeader>
          <CardTitle>Doanh Thu 7 Ngày Qua</CardTitle>
          <CardDescription>Biểu đồ doanh thu theo ngày</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />npm run dev
              <Legend />npm run dev
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={2}
                name="Doanh thu (đ)"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="vehicles"
                stroke="#3b82f6"
                strokeWidth={2}
                name="Số lượt xe"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Hourly Traffic */}
      <Card>
        <CardHeader>
          <CardTitle>Lưu Lượng Theo Giờ</CardTitle>
          <CardDescription>Số lượng xe theo khung giờ trong ngày</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" name="Số lượng xe" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Customers */}
      <Card>
        <CardHeader>
          <CardTitle>Thống Kê Khách Hàng</CardTitle>
          <CardDescription>Top khách hàng thường xuyên</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.slice(0, 5).map((vehicle, index) => (
              <div key={vehicle.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-600">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{vehicle.ownerName}</p>
                    <p className="text-sm text-gray-600">{vehicle.licensePlate}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">{(vehicle.fee || 0).toLocaleString('vi-VN')}đ</p>
                  <Badge variant="outline" className="mt-1">
                    {vehicle.vehicleType === 'motorbike' && 'Xe Máy'}
                    {vehicle.vehicleType === 'car' && 'Ô Tô'}
                    {vehicle.vehicleType === 'truck' && 'Xe Tải'}
                  </Badge>
                </div>
              </div>
            ))}
            {history.length === 0 && (
              <p className="text-center text-gray-500 py-8">Chưa có dữ liệu</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
