import Menu1 from '../components/Menu1';
import Menu2 from '../components/Menu2';
import Footer from '../components/Footer';
import ComplaintForm from './components/ComplaintForm';
import Menu3 from '../components/Menu3';
import Footer2 from '../components/Footer2';

const ComplaintLayout = () => {
    return (
        <>
            <div className="d-none d-md-block" id="menu-desktop">
                <Menu1 />
                <Menu2 />
            </div>

            <div className="d-md-none" id="menu-mobile">
                <Menu3 />
            </div>

            <ComplaintForm />

            <div className="d-none d-md-block" id="footer-desktop">
                <Footer />
            </div>

            <div className="d-md-none" id="footer-mobile">
                <Footer2 />
            </div>

        </>
    );
};
export default ComplaintLayout;
