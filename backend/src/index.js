/** React Helmet Async - SEO */
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"
/** Font Awesome **/
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

/** Layouts */
import AuthLayout from './pages/Auth/layout.js';
import Layout from './layouts/Layout';

/** Protected Route */
import ProtectedRoute from './libs/ProtectedRoute';

/** Error */
import Error404 from "./pages/Error404"

/** Pages - PUBLIC */
import Home from "./pages/Home"
import Dashboard from "./pages/Dashboard"
import Account from './pages/Account'
import ResetPassword from './pages/Auth/components/ResetPassword'
import SignInForm from './pages/Auth/components/SignIn'
import SignUpForm from './pages/Auth/components/SignUp'
import EmailPassword from './pages/Auth/components/EmailPassword'
import Unauthorized from './pages/Auth/components/Unauthorized'
import SignOut from './pages/Auth/components/SignOut'

/** SIGNED */
import RoleManagement from './pages/Administration/Roles'
import UserManagement from './pages/Administration/Users'
import ArticleManagement from './pages/Administration/Articles'
import ArticleDataManagement from './pages/Administration/ArticlesData'
import BannerManagement from './pages/Administration/Banners'
import ProgrammeManagement from './pages/Administration/Programmes'
import VideoManagement from './pages/Administration/Videos'
import DirectoryManagement from './pages/Administration/Directories'
import AssetManagement from './pages/Administration/Assets'
import VodManagement from './pages/Administration/Vods'
import Analytics from './pages/Administration/Analytics'
import Activity from './pages/Administration/Activity'

library.add(fas)

export default function App() {

  return (

      <BrowserRouter basename="/backend">
        <Routes>            
          <Route path="*" element={<Error404 />} />
        
            <Route element={<AuthLayout />}>
              <Route path="/sign-in" element={<SignInForm />} />
              {/* <Route path="/sign-up" element={<SignUpForm />} /> */}
              <Route path="/sign-out" element={<SignOut />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              {/* <Route path="/password/email" element={<EmailPassword />} />
              <Route path="/password/reset/:token" element={<ResetPassword />} /> */}
            </Route>

            <Route element={<Layout />}>
              <Route element={<ProtectedRoute />}>  
                <Route index element={<Home />} />
                <Route path="/home" element={<Home />} />
                <Route path="/account" element={<Account />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/administration/roles" element={<RoleManagement />} />
                <Route path="/administration/users" element={<UserManagement />} />
                <Route path="/administration/articles/:parentId" element={<ArticleManagement />} />
                
                <Route path="/administration/articles-data/:parentId" element={<ArticleDataManagement />} />
                <Route path="/administration/banners" element={<BannerManagement />} />
                <Route path="/administration/programmes" element={<ProgrammeManagement />} />
                <Route path="/administration/videos" element={<VideoManagement />} />
                <Route path="/administration/directories/:parentId" element={<DirectoryManagement />} />
                <Route path="/administration/assets/:parentId" element={<AssetManagement />} />
                <Route path="/administration/vods/:parentId" element={<VodManagement />} />
                <Route path="/administration/analytics" element={<Analytics />} />
                <Route path="/administration/activity" element={<Activity />} />
              </Route>
            </Route>
        </Routes>
      </BrowserRouter>

  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
