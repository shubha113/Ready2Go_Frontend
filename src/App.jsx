import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Login from "./Components/Auth/Login";
import Register from "./Components/Auth/Register";
import ForgotPassword from "./Components/Auth/ForgotPassword";
import ResetPassword from "./Components/Auth/ResetPassword";
import NotFound from "./Components/NotFound";
import Home from "./Components/Home/Home";
import VerifyOtp from "./Components/Auth/VerifyOtp";
import { loadUser } from './Redux/actions/userAction';
import Loader from './Components/Loader/Loader';
import Profile from './Components/Profile/Profile';
import {ProtectedRoute} from "protected-route-react";
import CreateOrder from './Components/CreateOrder/CreateOrder';
import History from './Components/History/History';
import GetJobs from './Components/GetJobs/GetJobs';
import Fare from './Components/Fare/Fare';
import PaymentSuccess from './Components/Payment/PaymentSuccess';
import PaymentFailure from './Components/Payment/PaymentFailure';
import TrackOrder from './Components/TrackOrder/TrackOrder';

function App() {

  const dispatch = useDispatch();
  const { isAuthenticated, error, message, loading, user } = useSelector((state) => state.user);

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

  useEffect(()=>{
    dispatch(loadUser());
  }, [dispatch]);


  return (
    <div className="app">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path='/register' element={isAuthenticated ? <Navigate to="/" /> : <Register />} />
          <Route path='/login' element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path='/profile' element={<ProtectedRoute isAuthenticated={isAuthenticated}> <Profile user={user}/> </ProtectedRoute>}/>
          <Route path='/forgot-password' element={isAuthenticated ? <Navigate to= "/login"/> : <ForgotPassword/>}/>
          <Route path='/reset-passord' element={isAuthenticated ? <Navigate to= "/login"/> : <ResetPassword/>}/>
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/create-order" element={<CreateOrder />} />
          <Route path="/jobs" element={<GetJobs />} />
          <Route path="/history" element={  <History />} />
          <Route path="/fares/:jobId" element={  <Fare/>} />
          <Route path="/payment-success" element={  <PaymentSuccess />} />
          <Route path="/payment-failure" element={  <PaymentFailure />} />
          <Route path="/track-order/:jobId" element={<TrackOrder />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
