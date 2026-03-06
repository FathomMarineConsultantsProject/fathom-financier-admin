import { Routes, Route,Navigate} from "react-router-dom";
import DashboardLayout from "./components/layout/DashboardLayout";
import EmployeeDetails from "./pages/EmployeeDetails";

export default function App() {
  return (
    
    <Routes>
      <Route path="/" element={<DashboardLayout />}>
        <Route path ="/" element={<Navigate to ="/employees" replace />} />
        <Route path="/employees" element={<EmployeeDetails />} />
      </Route>

    </Routes>
    
  );
} 