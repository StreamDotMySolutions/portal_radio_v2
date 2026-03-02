import { NavLink } from 'react-router-dom';
import useFetch from '../../libs/useFetch';
import LoadingSpinner from './LoadingSpinner';

function LoadFooter({ id }) {
    const url = process.env.REACT_APP_API_URL;
    const { data, isLoading } = useFetch(`${url}/articles/${id}`);
    const articles = data?.articles || [];

    if (isLoading) {
        return <LoadingSpinner />;
    }

    return (
        <div className="col-sm-6 col-md-3 col-12 col">
            <ul className="footer_ul_amrc">
                {articles.map(article => (
                    <li key={article.id}>
                        <NavLink to={`/listings/${article.id}`}>
                            {article.title}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LoadFooter;
