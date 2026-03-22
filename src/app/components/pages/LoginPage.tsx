import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { CarFront, LogIn, User, Lock, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/alert';

export function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(true);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = login(username, password);
    if (success) {
      navigate('/');
    } else {
      setError('Tên đăng nhập hoặc mật khẩu không đúng!');
    }
  };

  const handleDemoLogin = (role: 'admin' | 'staff') => {
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
      login('admin', 'admin123');
    } else {
      setUsername('staff');
      setPassword('staff123');
      login('staff', 'staff123');
    }
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo và tiêu đề */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-4 rounded-full">
              <CarFront className="w-12 h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Hệ Thống Bãi Giữ Xe</h1>
          <p className="text-gray-600">Quản lý bãi đỗ xe thông minh</p>
        </div>

        {/* Form đăng nhập */}
        <Card>
          <CardHeader>
            <CardTitle>Đăng Nhập</CardTitle>
            <CardDescription>Nhập thông tin để truy cập hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên đăng nhập</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" size="lg">
                <LogIn className="mr-2 h-4 w-4" />
                Đăng Nhập
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tài khoản demo */}
        {showDemo && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-sm">Tài Khoản Demo</CardTitle>
              <CardDescription className="text-xs">
                Nhấn nút để đăng nhập nhanh
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                onClick={() => handleDemoLogin('admin')}
                variant="outline"
                className="w-full justify-start"
              >
                <User className="mr-2 h-4 w-4" />
                Admin (admin / admin123)
              </Button>
              <Button
                onClick={() => handleDemoLogin('staff')}
                variant="outline"
                className="w-full justify-start"
              >
                <User className="mr-2 h-4 w-4" />
                Nhân viên (staff / staff123)
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
