/** ReactDOM */
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

/** Font Awesome **/
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

/** Layouts */
import Layout from './layouts/Default';
import HomeLayout from "./layouts/HomeLayout/HomeLayout";

/** Error */
import Error404 from "./pages/Error404"

/** Pages - PUBLIC */
import Home from "./pages/Home"

library.add(fas)

export default function App() {

  return (
      <BrowserRouter basename="/">
        <Routes>            
          <Route path="*" element={<Error404 />} />
          <Route element={<HomeLayout />}>
              <Route index element={<Home />} />
              <Route path="/home" element={<Home />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
