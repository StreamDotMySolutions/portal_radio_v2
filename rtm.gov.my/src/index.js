/** ReactDOM */
import ReactDOM from "react-dom/client"
import { BrowserRouter, Routes, Route } from "react-router-dom"

/** Font Awesome **/
import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

/** Layouts */
import Layout from './layouts/Default';
import HomeLayout from "./layouts/HomeLayout/HomeLayout";
import ContentLayout from "./layouts/ContentLayout/ContentLayout";
import ListingLayout from "./layouts/ListingLayout/ListingLayout";

/** Error */
import Error404 from "./pages/Error404"

/** Pages - PUBLIC */
import Home from "./pages/Home"
import DirectoryLayout from "./layouts/DirectoryLayout/DirectoryLayout";
import ShowStaffLayout from "./layouts/DirectoryLayout/ShowStaff";
import SearchResult from "./layouts/DirectoryLayout/components/SearchResult";
import SearchResultLayout from "./layouts/DirectoryLayout/SearchResultLayout";

/** Helmet Async */
import { HelmetProvider } from "react-helmet-async";

library.add(fas)

export default function App() {

  return (
    <HelmetProvider>
      <BrowserRouter basename="/">
        <Routes>            
          <Route path="*" element={<Error404 />} />
          <Route index element={<HomeLayout />}  />
          <Route path="/contents/:id" element={<ContentLayout />}/>
          <Route path="/listings/:id" element={<ListingLayout />}/>

          <Route path="/directories" element={<DirectoryLayout />}/>
          <Route path="/directories/:id" element={<DirectoryLayout />}/>
          <Route path="/directories/:id/show" element={<ShowStaffLayout />}/>
          <Route path="/directories/search/:query" element={<SearchResultLayout /> } />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
