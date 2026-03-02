import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Menu1 from '../components/Menu1';
import Menu2 from '../components/Menu2';
import Menu3 from '../components/Menu3';
import Footer from '../components/Footer';
import Footer2 from '../components/Footer2';

const TreeNode = ({ node, depth = 0 }) => {
    const children = node.children || [];

    if (node.article_setting && node.article_setting.active != 1) {
        return null;
    }

    const linkTo = node.id
        ? (node.article_setting && node.article_setting.listing_type === 'single_article'
            ? `/contents/${node.id}`
            : `/listings/${node.id}`)
        : '#';

    return (
        <div style={{ paddingLeft: depth * 20 }}>
            <div className="py-1">
                <i className="bi bi-chevron-right text-muted me-2"></i>
                <NavLink to={linkTo} className="text-decoration-none">
                    {node.title}
                </NavLink>
            </div>
            {children.map(child => (
                <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))}
        </div>
    );
};

const SitemapLayout = () => {
    const url = process.env.REACT_APP_API_URL;
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        axios(`${url}/sitemap`)
            .then((response) => {
                setItems(response.data.items || []);
            })
            .catch((error) => {
                console.warn(error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [url]);

    return (
        <>
            <Helmet>
                <title>Peta Laman — RTM</title>
                <meta name="description" content="Peta laman portal rasmi Radio Televisyen Malaysia." />
            </Helmet>

            <div className="d-none d-md-block" id="menu-desktop">
                <Menu1 />
                <Menu2 />
            </div>

            <div className="d-md-none" id="menu-mobile">
                <Menu3 />
            </div>

            <div className="container py-5">
                <h1 className="mb-4">Peta Laman</h1>

                {isLoading && (
                    <p className="text-muted">Memuatkan...</p>
                )}

                {!isLoading && items.length === 0 && (
                    <p className="text-muted">Tiada kandungan untuk dipaparkan.</p>
                )}

                {!isLoading && items.map(item => (
                    <TreeNode key={item.id} node={item} />
                ))}
            </div>

            <div className="d-none d-md-block" id="footer-desktop">
                <Footer />
            </div>

            <div className="d-md-none" id="footer-mobile">
                <Footer2 />
            </div>
        </>
    );
};

export default SitemapLayout;
