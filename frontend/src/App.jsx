import { Route, Routes } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Shorts from "./pages/Shorts/Shorts";
import GetCurrentUser from "./customHooks/GetCurrentUser";

export const serverUrl = "http://localhost:8000";

function App() {
  GetCurrentUser();
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="shorts" element={<Shorts />} />
        </Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
    </>
  );
}

export default App;