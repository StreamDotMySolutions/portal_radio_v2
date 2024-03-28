import useAuthStore from "../Auth/stores/AuthStore"
import SystemDashboard from "./components/SystemDashboard"
import AdminDashboard from "./components/AdminDashboard"
import UserDashboard from "./components/UserDashboard"
import ManagerDashboard from "./components/ManagerDashboard"
import BossDashboard from "./components/BossDashboard"

const Home = () => {
    const store = useAuthStore();
    let renderedComponent;

    switch (store?.user?.role) {
        case 'system':
            renderedComponent = <SystemDashboard />;
        break;

        case 'admin':
            renderedComponent = <AdminDashboard />;
        break;

        case 'user':
            renderedComponent = <UserDashboard />;
        break;

        case 'manager':
            renderedComponent = <ManagerDashboard />;
        break;

        case 'boss':
            renderedComponent = <BossDashboard />;
        break;

        default:
            // Render a fallback or handle other cases here
            renderedComponent = <div>Hello world</div>;
    }

    return (<>
        {renderedComponent}
        </>)
} 

export default Home