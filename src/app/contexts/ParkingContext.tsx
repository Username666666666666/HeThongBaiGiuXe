import { createContext, useContext, useState, useEffect } from 'react';

export interface Vehicle {
  id: string;
  licensePlate: string;
  vehicleType: 'motorbike' | 'car' | 'truck';
  ownerName: string;
  phoneNumber: string;
  entryTime: string;
  exitTime?: string;
  parkingSpot: string;
  fee?: number;
  status: 'parked' | 'exited';
  notes?: string;
}

interface ParkingContextType {
  vehicles: Vehicle[];
  addVehicle: (vehicle: Omit<Vehicle, 'id' | 'status'>) => void;
  exitVehicle: (id: string, fee: number) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;
  deleteVehicle: (id: string) => void;
  getParkedVehicles: () => Vehicle[];
  getVehicleHistory: () => Vehicle[];
  getTotalSpots: () => number;
  getAvailableSpots: () => number;
}

const ParkingContext = createContext<ParkingContextType | undefined>(undefined);

export function ParkingProvider({ children }: { children: React.ReactNode }) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const savedVehicles = localStorage.getItem('vehicles');
    if (savedVehicles) {
      setVehicles(JSON.parse(savedVehicles));
    } else {
      // Dữ liệu mẫu
      const mockVehicles: Vehicle[] = [
        {
          id: '1',
          licensePlate: '29A-12345',
          vehicleType: 'car',
          ownerName: 'Nguyễn Văn A',
          phoneNumber: '0912345678',
          entryTime: new Date().toISOString(),
          parkingSpot: 'A01',
          status: 'parked',
        },
        {
          id: '2',
          licensePlate: '30B-67890',
          vehicleType: 'motorbike',
          ownerName: 'Trần Thị B',
          phoneNumber: '0987654321',
          entryTime: new Date(Date.now() - 3600000).toISOString(),
          parkingSpot: 'B05',
          status: 'parked',
        },
      ];
      setVehicles(mockVehicles);
      localStorage.setItem('vehicles', JSON.stringify(mockVehicles));
    }
  }, []);

  const saveVehicles = (newVehicles: Vehicle[]) => {
    setVehicles(newVehicles);
    localStorage.setItem('vehicles', JSON.stringify(newVehicles));
  };

  const addVehicle = (vehicle: Omit<Vehicle, 'id' | 'status'>) => {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: Date.now().toString(),
      status: 'parked',
    };
    saveVehicles([...vehicles, newVehicle]);
  };

  const exitVehicle = (id: string, fee: number) => {
    const updatedVehicles = vehicles.map(v =>
      v.id === id
        ? { ...v, exitTime: new Date().toISOString(), fee, status: 'exited' as const }
        : v
    );
    saveVehicles(updatedVehicles);
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    const updatedVehicles = vehicles.map(v =>
      v.id === id ? { ...v, ...updates } : v
    );
    saveVehicles(updatedVehicles);
  };

  const deleteVehicle = (id: string) => {
    const updatedVehicles = vehicles.filter(v => v.id !== id);
    saveVehicles(updatedVehicles);
  };

  const getParkedVehicles = () => vehicles.filter(v => v.status === 'parked');
  const getVehicleHistory = () => vehicles.filter(v => v.status === 'exited');
  const getTotalSpots = () => 100;
  const getAvailableSpots = () => getTotalSpots() - getParkedVehicles().length;

  return (
    <ParkingContext.Provider
      value={{
        vehicles,
        addVehicle,
        exitVehicle,
        updateVehicle,
        deleteVehicle,
        getParkedVehicles,
        getVehicleHistory,
        getTotalSpots,
        getAvailableSpots,
      }}
    >
      {children}
    </ParkingContext.Provider>
  );
}

export function useParking() {
  const context = useContext(ParkingContext);
  if (context === undefined) {
    throw new Error('useParking must be used within a ParkingProvider');
  }
  return context;
}
