import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingSpinner from "./components/LoadingSpinner";
import ProtectRoute from "./components/ProtectRoute";
import PublicRoute from "./components/PublicRoute";
import GetCurrentUser from "./customHooks/GetCurrentUser";
import GetChannelData from "./customHooks/GetChannelData";
import GetAllContentData from "./customHooks/GetAllContentData";
import GetSubscribedData from "./customHooks/GetSubscribedData"

// Lazy load components for code splitting
const Home = lazy(() => import("./pages/Home"));
const SignUp = lazy(() => import("./pages/SignUp"));
const SignIn = lazy(() => import("./pages/SignIn"));
const Shorts = lazy(() => import("./pages/Shorts/Shorts"));
const MobileProfile = lazy(() => import("./component/MobileProfile"));
const ForgetPassword = lazy(() => import("./pages/ForgetPassword"));
const CreateChannel = lazy(() => import("./pages/Channel/CreateChannel"));
const ViewChannel = lazy(() => import("./pages/Channel/ViewChannel"));
const UpdateChannel = lazy(() => import("./pages/Channel/UpdateChannel"));
const CreatePage = lazy(() => import("./pages/CreatePage"));
const CreateVideo = lazy(() => import("./pages/Video/CreateVideo"))
const CreateShort = lazy(() => import("./pages/Shorts/CreateShort"))
const CreatePlayList = lazy(() => import("./pages/Playlist/CreatePlayList"))
const CreatePost = lazy(() => import("./pages/Post/CreatePost"))
const PlayVideo = lazy(() => import("./pages/Video/PlayVideo"))
const PlayShort = lazy(()=>import("./pages/Shorts/PlayShort"))
const ChannelPage = lazy(()=>import("./pages/Channel/ChannelPage"))
const LikdedContent = lazy(()=>import("./pages/LikdedContent"))
const SavedContent = lazy(()=>import("./pages/SavedContent"))
const SavedPlayList = lazy(()=>import("./pages/Playlist/SavedPlayList"))
const Subscription = lazy(()=>import("./pages/Subscription"))

function App() {
  GetCurrentUser();
  GetChannelData();
  GetAllContentData();
  GetSubscribedData();

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
            <Route path="mobilepro" element={<ProtectRoute><MobileProfile /></ProtectRoute>} />
            <Route path="shorts" element={<ProtectRoute><Shorts /></ProtectRoute>} />
            <Route path="viewchannel" element={<ProtectRoute requireChannel><ViewChannel /></ProtectRoute>} />
            <Route path="create" element={<ProtectRoute requireChannel><CreatePage /></ProtectRoute>} />
            <Route path="create-video" element={<ProtectRoute requireChannel><CreateVideo /></ProtectRoute>} />
            <Route path="create-short" element={<ProtectRoute requireChannel><CreateShort /></ProtectRoute>} />
            <Route path="create-playlist" element={<ProtectRoute requireChannel><CreatePlayList /></ProtectRoute>} />
            <Route path="create-post" element={<ProtectRoute requireChannel><CreatePost /></ProtectRoute>} />
            <Route path="playshort/:shortId" element={<ProtectRoute><PlayShort /></ProtectRoute>} />
            <Route path="channelpage/:channelId" element={<ProtectRoute><ChannelPage /></ProtectRoute>} />
            <Route path="likedcontent" element={<ProtectRoute><LikdedContent /></ProtectRoute>} />
            <Route path="savedcontent" element={<ProtectRoute><SavedContent /></ProtectRoute>} />
            <Route path="savedplaylist" element={<ProtectRoute><SavedPlayList /></ProtectRoute>} />
            <Route path="subscription" element={<ProtectRoute><Subscription /></ProtectRoute>} />
          </Route>

          {/* Protected Routes */}
          <Route path="/updatechannel" element={<ProtectRoute requireChannel><UpdateChannel /></ProtectRoute>} />
          <Route path="/createchannel" element={<ProtectRoute><CreateChannel /></ProtectRoute>} />
          <Route path="/playvideo/:videoId" element={<ProtectRoute><PlayVideo /></ProtectRoute>} />

          {/* Public Routes (redirect if already logged in) */}
          <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
          <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
          <Route path="/forgetpass" element={<ForgetPassword />} />
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