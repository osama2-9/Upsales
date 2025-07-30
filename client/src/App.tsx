import { Route, Routes } from "react-router-dom";
import LoginForm from "./pages/Login";
import SignupForm from "./pages/Signup";
import { AdminDashboard } from "./pages/AdminDashboard";
import { AdminProtectedRoute } from "./components/ProtectedRoute/AdminProtectedRoute";
import HomePage from "./pages/HomePage";
import { AddNewMedia } from "./pages/AddNewMedia";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route
          path="/admin"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/add-new-media"
          element={
            <AdminProtectedRoute>
              <AddNewMedia />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
