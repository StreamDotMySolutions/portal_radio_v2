import Menu1 from '../components/Menu1';
import Menu2 from '../components/Menu2';
import Footer from '../components/Footer';
import PageContent from './components/PageContent';
import Menu3 from '../components/Menu3';
import Footer2 from '../components/Footer2';


const ContentLayout = () => {

    return (
        <>
            <div class="d-none d-md-block" id="menu-desktop">
                <Menu1 />
                <Menu2 />
            </div>
            
            <div class="d-md-none" id="menu-mobile">
                <Menu3 />
            </div>
       
  
            <PageContent />

            <div class="d-none d-md-block" id="footer-desktop">
                <Footer />
            </div>
            
            <div class="d-md-none" id="footer-mobile">
                <Footer2 />
            </div>

        </>
    );
};
export default ContentLayout;