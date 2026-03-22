import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Save, Bell, DollarSign, MapPin, Users, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';

export function SettingsPage() {
  const [settings, setSettings] = useState({
    // Pricing
    motorbikeRate: '5000',
    carRate: '15000',
    truckRate: '25000',
    
    // Parking
    totalSpots: '100',
    parkingZones: '5',
    
    // Notifications
    emailNotifications: true,
    smsNotifications: false,
    lowSpaceAlert: true,
    alertThreshold: '10',
    
    // System
    autoLogout: true,
    sessionTimeout: '30',
    theme: 'light',
  });

  const handleSave = () => {
    localStorage.setItem('parkingSettings', JSON.stringify(settings));
    toast.success('Đã lưu cài đặt thành công!');
  };

  const handleReset = () => {
    const defaultSettings = {
      motorbikeRate: '5000',
      carRate: '15000',
      truckRate: '25000',
      totalSpots: '100',
      parkingZones: '5',
      emailNotifications: true,
      smsNotifications: false,
      lowSpaceAlert: true,
      alertThreshold: '10',
      autoLogout: true,
      sessionTimeout: '30',
      theme: 'light',
    };
    setSettings(defaultSettings);
    toast.success('Đã khôi phục cài đặt mặc định!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold">Cài Đặt Hệ Thống</h2>
        <p className="text-gray-600 mt-1">Quản lý cấu hình và tùy chỉnh hệ thống</p>
      </div>

      <Tabs defaultValue="pricing" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pricing">
            <DollarSign className="w-4 h-4 mr-2" />
            Giá
          </TabsTrigger>
          <TabsTrigger value="parking">
            <MapPin className="w-4 h-4 mr-2" />
            Bãi Xe
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Thông Báo
          </TabsTrigger>
          <TabsTrigger value="system">
            <Shield className="w-4 h-4 mr-2" />
            Hệ Thống
          </TabsTrigger>
        </TabsList>

        {/* Pricing Settings */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Cài Đặt Giá</CardTitle>
              <CardDescription>Thiết lập giá đỗ xe theo loại xe</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="motorbikeRate">Giá Xe Máy (đ/giờ)</Label>
                    <Input
                      id="motorbikeRate"
                      type="number"
                      value={settings.motorbikeRate}
                      onChange={(e) => setSettings({ ...settings, motorbikeRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="carRate">Giá Ô Tô (đ/giờ)</Label>
                    <Input
                      id="carRate"
                      type="number"
                      value={settings.carRate}
                      onChange={(e) => setSettings({ ...settings, carRate: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="truckRate">Giá Xe Tải (đ/giờ)</Label>
                    <Input
                      id="truckRate"
                      type="number"
                      value={settings.truckRate}
                      onChange={(e) => setSettings({ ...settings, truckRate: e.target.value })}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-3 p-4 bg-blue-50 rounded-lg">
                  <p className="font-medium text-blue-900">Bảng Giá Hiện Tại</p>
                  <div className="grid gap-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Xe Máy:</span>
                      <Badge className="bg-blue-600">{Number(settings.motorbikeRate).toLocaleString('vi-VN')}đ/giờ</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Ô Tô:</span>
                      <Badge className="bg-green-600">{Number(settings.carRate).toLocaleString('vi-VN')}đ/giờ</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-700">Xe Tải:</span>
                      <Badge className="bg-purple-600">{Number(settings.truckRate).toLocaleString('vi-VN')}đ/giờ</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Parking Settings */}
        <TabsContent value="parking">
          <Card>
            <CardHeader>
              <CardTitle>Cài Đặt Bãi Xe</CardTitle>
              <CardDescription>Quản lý số lượng chỗ đỗ và khu vực</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="totalSpots">Tổng Số Chỗ Đỗ</Label>
                  <Input
                    id="totalSpots"
                    type="number"
                    value={settings.totalSpots}
                    onChange={(e) => setSettings({ ...settings, totalSpots: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Tổng số vị trí đỗ xe trong bãi</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="parkingZones">Số Khu Vực</Label>
                  <Input
                    id="parkingZones"
                    type="number"
                    value={settings.parkingZones}
                    onChange={(e) => setSettings({ ...settings, parkingZones: e.target.value })}
                  />
                  <p className="text-xs text-gray-500">Số khu vực (A, B, C...)</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3 p-4 bg-green-50 rounded-lg">
                <p className="font-medium text-green-900">Thông Tin Bãi Xe</p>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-green-700">Tổng chỗ đỗ</p>
                    <p className="text-2xl font-bold text-green-900">{settings.totalSpots}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Số khu vực</p>
                    <p className="text-2xl font-bold text-green-900">{settings.parkingZones}</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700">Chỗ/Khu vực</p>
                    <p className="text-2xl font-bold text-green-900">
                      {Math.floor(Number(settings.totalSpots) / Number(settings.parkingZones))}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Cài Đặt Thông Báo</CardTitle>
              <CardDescription>Quản lý các thông báo và cảnh báo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Thông Báo Email</Label>
                    <p className="text-sm text-gray-500">Nhận thông báo qua email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Thông Báo SMS</Label>
                    <p className="text-sm text-gray-500">Nhận thông báo qua tin nhắn</p>
                  </div>
                  <Switch
                    checked={settings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, smsNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Cảnh Báo Bãi Gần Đầy</Label>
                    <p className="text-sm text-gray-500">Thông báo khi bãi xe sắp hết chỗ</p>
                  </div>
                  <Switch
                    checked={settings.lowSpaceAlert}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, lowSpaceAlert: checked })
                    }
                  />
                </div>

                {settings.lowSpaceAlert && (
                  <div className="space-y-2 ml-4">
                    <Label htmlFor="alertThreshold">Ngưỡng Cảnh Báo (số chỗ trống)</Label>
                    <Input
                      id="alertThreshold"
                      type="number"
                      value={settings.alertThreshold}
                      onChange={(e) => setSettings({ ...settings, alertThreshold: e.target.value })}
                      className="max-w-xs"
                    />
                    <p className="text-xs text-gray-500">
                      Cảnh báo khi còn {settings.alertThreshold} chỗ trống
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>Cài Đặt Hệ Thống</CardTitle>
              <CardDescription>Cấu hình bảo mật và giao diện</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Tự Động Đăng Xuất</Label>
                    <p className="text-sm text-gray-500">Đăng xuất tự động khi không hoạt động</p>
                  </div>
                  <Switch
                    checked={settings.autoLogout}
                    onCheckedChange={(checked) => setSettings({ ...settings, autoLogout: checked })}
                  />
                </div>

                {settings.autoLogout && (
                  <div className="space-y-2 ml-4">
                    <Label htmlFor="sessionTimeout">Thời Gian Chờ (phút)</Label>
                    <Input
                      id="sessionTimeout"
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                      className="max-w-xs"
                    />
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="theme">Giao Diện</Label>
                  <Select value={settings.theme} onValueChange={(value) => setSettings({ ...settings, theme: value })}>
                    <SelectTrigger className="max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Sáng</SelectItem>
                      <SelectItem value="dark">Tối</SelectItem>
                      <SelectItem value="auto">Tự Động</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-3 p-4 bg-purple-50 rounded-lg">
                  <p className="font-medium text-purple-900">Thông Tin Phiên Bản</p>
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Phiên bản:</span>
                      <Badge variant="outline">v1.0.0</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Cập nhật lần cuối:</span>
                      <span className="text-purple-900">{new Date().toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <Button onClick={handleSave} size="lg" className="flex-1">
              <Save className="mr-2 h-4 w-4" />
              Lưu Cài Đặt
            </Button>
            <Button onClick={handleReset} variant="outline" size="lg">
              Khôi Phục Mặc Định
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
