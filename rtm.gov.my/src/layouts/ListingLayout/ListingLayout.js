import Menu1 from '../components/Menu1';
import Menu2 from '../components/Menu2';
import Footer from '../components/Footer';
import PageContent from './components/PageContent';
import Menu3 from '../components/Menu3';
import Footer2 from '../components/Footer2';
import SiteSearch from '../components/SiteSearch';

const ListingLayout = () => {

    return (
        <>
            <div className="d-none d-md-block" id="menu-desktop">
                <Menu1 />
                <Menu2 />
            </div>

            <div className="d-md-none" id="menu-mobile">
                <Menu3 />
            </div>

            <div className="container">
                <SiteSearch />
            </div>

            <PageContent />

            <div className="d-none d-md-block" id="footer-desktop">
                <Footer />
            </div>
            
            <div className="d-md-none" id="footer-mobile">
                <Footer2 />
            </div>

        </>
    );
};
export default ListingLayout;