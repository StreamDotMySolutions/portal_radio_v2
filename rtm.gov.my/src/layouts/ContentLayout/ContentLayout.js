import Menu1 from '../components/Menu1';
import Menu2 from '../components/Menu2';
import Footer from '../components/Footer';
import PageContent from './components/PageContent';


const ContentLayout = () => {

    return (
        <>
      
            <Menu1 />
            <Menu2 />
            <PageContent />
            <Footer />
        </>
    );
};
export default ContentLayout;