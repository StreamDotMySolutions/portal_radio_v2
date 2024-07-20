import Menu1 from '../components/Menu1';
import Menu2 from '../components/Menu2';
import Footer from '../components/Footer';
import PageContent from './components/PageContent';
import Menu3 from '../components/Menu3';
import Footer2 from '../components/Footer2';
import { useParams } from 'react-router-dom';
import ShowStaffContent from './components/ShowStaffContent';
import SearchResult from './components/SearchResult';

const SearchResultLayout = () => {
    const { id } = useParams(); // parentid
    // Set id to 0 if it's undefined
    const parentId = id === undefined ? 1 : id;

    return (
        <>
            <div className="d-none d-md-block" id="menu-desktop">
                <Menu1 />
                <Menu2 />
            </div>
            
            <div className="d-md-none" id="menu-mobile">
                <Menu3 />
            </div>
       
           <SearchResult />

            <div className="d-none d-md-block" id="footer-desktop">
                <Footer />
            </div>
            
            <div className="d-md-none" id="footer-mobile">
                <Footer2 />
            </div>

        </>
    );
};
export default SearchResultLayout;