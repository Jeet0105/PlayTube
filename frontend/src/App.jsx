import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import GetCurrentUser from "./customHooks/GetCurrentUser";
import GetChannelData from "./customHooks/GetChannelData";

// Lazy load components for code splitting
const Home = lazy(() => import("./pages/Home"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const Shorts = lazy(() => import("./pages/Shorts/Shorts"));
const MobileProfile = lazy(() => import("./component/MobileProfile"));
const ForgetPassword = lazy(() => import("./pages/ForgetPassword"));
const CreateChannel = lazy(() => import("./pages/Channel/CreateChannel"));
const ViewChannel = lazy(() => import("./pages/Channel/ViewChannel"));

function App() {
  GetCurrentUser();
  GetChannelData();
  
  return (
    <ErrorBoundary>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center bg-[#0f0f0f]">
            <LoadingSpinner size={50} />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />}>
            <Route path="mobilepro" element={<MobileProfile />} />
            <Route path="shorts" element={<Shorts />} />
            <Route path="viewchannel" element={<ViewChannel />} />
          </Route>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/forgetpass" element={<ForgetPassword />} />
          <Route path="/createchannel" element={<CreateChannel />} />
        </Routes>
      </Suspense>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </ErrorBoundary>
  );
}

export default App;