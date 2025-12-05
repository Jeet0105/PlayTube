import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Shorts from "./pages/Shorts/Shorts";
import GetCurrentUser from "./customHooks/GetCurrentUser";
import MobileProfile from "./component/MobileProfile";
import ForgetPassword from "./pages/ForgetPassword";
import CreateChannel from "./pages/Channel/CreateChannel";
import ViewChannel from "./pages/Channel/ViewChannel";

export const serverUrl = "http://localhost:8000";

function App() {
  GetCurrentUser();
  return (
    <>
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

      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
    </>
  );
}

export default App;