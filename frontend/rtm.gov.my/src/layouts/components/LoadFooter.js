import { NavLink } from 'react-router-dom';
import useFetch from '../../libs/useFetch';

function resolveHref(article) {
    const setting = article.article_setting
    if (setting?.redirect_url) {
        const isInternal = setting.redirect_url.startsWith('/')
        return { href: setting.redirect_url, external: !isInternal }
    }
    if (setting?.listing_type === 'single_article') return { href: `/listings/${article.id}`, external: false }
    return { href: `/listings/${article.id}`, external: false }
}

function LoadFooter({ id }) {
    const url = process.env.REACT_APP_API_URL;
    const { data, isLoading } = useFetch(`${url}/articles/${id}`);
    const articles = data?.articles || [];

    if (isLoading || articles.length === 0) {
        return null;
    }

    return (
        <ul className="footer_ul_amrc">
            {articles.map(article => {
                const { href, external } = resolveHref(article)
                return (
                    <li key={article.id}>
                        {external
                            ? <a href={href} target="_blank" rel="noreferrer">{article.title}</a>
                            : <NavLink to={href}>{article.title}</NavLink>
                        }
                    </li>
                )
            })}
        </ul>
    );
}

export default LoadFooter;
