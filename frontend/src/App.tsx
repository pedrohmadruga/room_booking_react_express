import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./contexts/AuthContext";
import RoomsPage from "./pages/RoomsPage";
import BookingsPage from "./pages/BookingsPage";
import NotFoundPage from "./pages/NotFoundPage";
import RoomDetailsPage from "./pages/RoomDetailsPage";
import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./layout/AdminLayout";
import HomepageDashboard from "./pages/admin/HomepageDashboard";
import RoomsDashboardPage from "./pages/admin/RoomsDashboardPage";
import UsersDashboardPage from "./pages/admin/UsersDashboardPage";

function PublicOnlyRoute({ children }: Readonly<{ children: React.ReactNode }>) {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) return <Navigate to="/" replace />;
    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* public routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<PublicOnlyRoute><LoginPage /></PublicOnlyRoute>} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/rooms" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
                <Route path="/rooms/:id" element={<ProtectedRoute><RoomDetailsPage /></ProtectedRoute>} />
                <Route path="/bookings" element={<ProtectedRoute><BookingsPage /></ProtectedRoute>} />
                
                {/* admin routes */}
                <Route path="/dashboard" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                    <Route index element={<HomepageDashboard />} />
                    <Route path="rooms" element={<RoomsDashboardPage />} />
                    <Route path="users" element={<UsersDashboardPage />} />
                    <Route path="bookings" element={<HomepageDashboard />} />
                </Route>

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
