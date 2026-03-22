import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { ParkingProvider } from './contexts/ParkingContext';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <AuthProvider>
      <ParkingProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" richColors />
      </ParkingProvider>
    </AuthProvider>
  );
}
