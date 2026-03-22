import { createBrowserRouter } from 'react-router-dom';
import { DashboardLayout } from "./components/layouts/DashboardLayout";
import { LoginPage } from "./components/pages/LoginPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { VehicleEntryPage } from "./components/pages/VehicleEntryPage";
import { VehicleExitPage } from "./components/pages/VehicleExitPage";
import { ParkingManagementPage } from "./components/pages/ParkingManagementPage";
import { HistoryPage } from "./components/pages/HistoryPage";
import { StatisticsPage } from "./components/pages/StatisticsPage";
import { SettingsPage } from "./components/pages/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/",
    Component: DashboardLayout,
    children: [
      { index: true, Component: DashboardPage },
      { path: "entry", Component: VehicleEntryPage },
      { path: "exit", Component: VehicleExitPage },
      { path: "parking", Component: ParkingManagementPage },
      { path: "history", Component: HistoryPage },
      { path: "statistics", Component: StatisticsPage },
      { path: "settings", Component: SettingsPage },
    ],
  },
]);
