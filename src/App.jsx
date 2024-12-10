import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import NotFound from "./Components/NotFound";
import Home from "./Components/Home/Home";
import VerifyOtp from "./Components/Auth/VerifyOtp";
import { loadUser } from "./Redux/actions/userAction";
import Profile from "./Components/Profile/Profile";
import { ProtectedRoute } from "protected-route-react";
import CreateOrder from "./Components/CreateOrder/CreateOrder";
import History from "./Components/History/History";
import GetJobs from "./Components/GetJobs/GetJobs";
import Fare from "./Components/Fare/Fare";
import PaymentSuccess from "./Components/Payment/PaymentSuccess";
import PaymentFailure from "./Components/Payment/PaymentFailure";
import TrackOrder from "./Components/TrackOrder/TrackOrder";
import GetAllUsers from "./Components/GetAllUsers/GetAllUsers";
import { initializeSocket } from "./utils/socket";
import DeliverySuccess from "./Components/DeliveryCompleted/DeliverySuccess";
import Navbar from "./Components/Auth/Shared/Navbar";
import Footer from "./Components/Auth/Shared/Footer";
import Loader from "./Components/Loader/Loader";
import '../i18n.js';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, error, message, loading, user } = useSelector(
    (state) => state.user
  );
  const [isUserLoaded, setIsUserLoaded] = useState(false);

  useEffect(() => {
    dispatch(loadUser()).then(() => {
      setIsUserLoaded(true);
    });
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const socketInstance = initializeSocket();

      return () => {
        socketInstance.disconnect();
      };
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch({ type: "clearError" });
    }
    if (message) {
      toast.success(message);
      dispatch({ type: "clearMessage" });
    }
  }, [error, message, dispatch]);

  return (
    <div className="app">
      <Router>
        {loading ? (
          <Loader />
        ) : (
          <>
            <Navbar isAuthenticated={isAuthenticated} user={user} />
            <Routes>
              <Route path="/" element={<Home />} />

              {/* Authentication Routes */}
              <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/" /> : <Register />}
              />
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/" /> : <Login />}
              />
              <Route
                path="/forgot-password"
                element={
                  isAuthenticated ? (
                    <Navigate to="/login" />
                  ) : (
                    <ForgotPassword />
                  )
                }
              />
              <Route
                path="/reset-password"
                element={
                  isAuthenticated ? <Navigate to="/login" /> : <ResetPassword />
                }
              />
              <Route path="/verify-otp" element={<VerifyOtp />} />

              {/* Protected Routes */}
              <Route
                path="/profile"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Profile user={user} />
                  </ProtectedRoute>
                }
              />

              {/* User-specific Protected Routes */}
              {user?.role === "user" && (
                <Route
                  path="/create-order"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <CreateOrder />
                    </ProtectedRoute>
                  }
                />
              )}

              {/* Driver/Company-specific Protected Routes */}
              {(user?.role === "driver" || user?.role === "company") && (
                <>
                  <Route
                    path="/jobs"
                    element={
                      <ProtectedRoute isAuthenticated={isAuthenticated}>
                        <GetJobs />
                      </ProtectedRoute>
                    }
                  />
                </>
              )}

              <Route
                path="/fares/:jobId"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <Fare />
                  </ProtectedRoute>
                }
              />

              {/* Common Protected Routes */}
              <Route
                path="/history"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-success"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <PaymentSuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment-failure"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <PaymentFailure />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/delivery-success"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <DeliverySuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/track-order/:jobId"
                element={
                  <ProtectedRoute isAuthenticated={isAuthenticated}>
                    <TrackOrder />
                  </ProtectedRoute>
                }
              />

              {/* Admin-specific Protected Routes */}
              {user?.role === "admin" && (
                <Route
                  path="/get-users"
                  element={
                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                      <GetAllUsers />
                    </ProtectedRoute>
                  }
                />
              )}

              {/* 404 Route */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
            <ToastContainer />
          </>
        )}
      </Router>
    </div>
  );
}

export default App;
