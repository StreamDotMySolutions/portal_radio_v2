import { NavLink } from 'react-router-dom';
import useFetch from '../../libs/useFetch';
function LoadFooter({ id }) {
    const url = process.env.REACT_APP_API_URL;
    const { data, isLoading } = useFetch(`${url}/articles/${id}`);
    const articles = data?.articles || [];

    if (isLoading || articles.length === 0) {
        return null;
    }

    return (
        <ul className="footer_ul_amrc">
            {articles.map(article => (
                <li key={article.id}>
                    <NavLink to={`/listings/${article.id}`}>
                        {article.title}
                    </NavLink>
                </li>
            ))}
        </ul>
    );
}

export default LoadFooter;
