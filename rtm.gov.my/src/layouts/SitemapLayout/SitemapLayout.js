import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Menu1 from '../components/Menu1';
import Menu2 from '../components/Menu2';
import Menu3 from '../components/Menu3';
import Footer from '../components/Footer';
import Footer2 from '../components/Footer2';
import useFetch from '../../libs/useFetch';
const url = process.env.REACT_APP_API_URL;

const STYLES = `
  .sitemap-tree { list-style: none; padding: 0; margin: 0; }

  .sitemap-children {
    list-style: none;
    padding: 0;
    margin: 0 0 0 2rem;
    border-left: 2px solid #dee2e6;
  }

  .sitemap-node { position: relative; padding: 0.15rem 0; }

  .sitemap-node + .sitemap-node { margin-top: 0.15rem; }

  .sitemap-children > .sitemap-node::before {
    content: '';
    position: absolute;
    left: -2rem;
    top: 50%;
    width: 1.75rem;
    border-top: 2px solid #dee2e6;
  }

  .sitemap-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px;
    border: 1px solid #dee2e6;
    border-radius: 6px;
    background: #fff;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    font-size: 0.9rem;
    white-space: nowrap;
  }

  .sitemap-label:hover { border-color: #adb5bd; }

  .sitemap-label.is-folder { cursor: pointer; }

  .sitemap-label a { color: inherit; text-decoration: none; }
  .sitemap-label a:hover { text-decoration: underline; }
`;

const TreeNode = ({ node }) => {
    const children = node.children || [];
    const [open, setOpen] = useState(false);

    if (node.article_setting && node.article_setting.active != 1) {
        return null;
    }

    const linkTo = node.id
        ? (node.article_setting && node.article_setting.listing_type === 'single_article'
            ? `/contents/${node.id}`
            : `/listings/${node.id}`)
        : '#';

    const isFolder = node.type === 'folder';
    const hasChildren = children.length > 0;
    const icon = isFolder
        ? (open && hasChildren ? 'bi-folder2-open' : 'bi-folder-fill')
        : 'bi-file-earmark';

    const toggle = () => { if (isFolder && hasChildren) setOpen(o => !o); };

    return (
        <li className="sitemap-node">
            <div
                className={`sitemap-label${isFolder ? ' is-folder' : ''}`}
                onClick={isFolder ? toggle : undefined}
            >
                <i
                    className={`bi ${icon}`}
                    style={{ color: isFolder ? '#e8780a' : '#6c757d' }}
                />
                {isFolder
                    ? <span>{node.title}</span>
                    : <NavLink to={linkTo}>{node.title}</NavLink>
                }
                {isFolder && hasChildren && (
                    <i
                        className={`bi ${open ? 'bi-chevron-down' : 'bi-chevron-right'} text-muted`}
                        style={{ fontSize: '0.7rem' }}
                    />
                )}
            </div>

            {open && hasChildren && (
                <ul className="sitemap-children mt-1">
                    {children.map(child => (
                        <TreeNode key={child.id} node={child} />
                    ))}
                </ul>
            )}
        </li>
    );
};


const SitemapLayout = () => {
    const { data, isLoading } = useFetch(`${url}/sitemap`);
    const items = data?.items || [];

    return (
        <>
            <Helmet>
                <title>Peta Laman — RTM</title>
                <meta name="description" content="Peta laman portal rasmi Radio Televisyen Malaysia." />
            </Helmet>

            <style>{STYLES}</style>

            <div className="d-none d-md-block" id="menu-desktop">
                <Menu1 />
                <Menu2 />
            </div>

            <div className="d-md-none" id="menu-mobile">
                <Menu3 />
            </div>

            <div className="container py-5">
                <h1 className="mb-4">Peta Laman</h1>

                {/* Sitemap tree */}
                {isLoading && <p className="text-muted small">Memuatkan peta laman...</p>}

                {!isLoading && items.length === 0 && (
                    <p className="text-muted">Tiada kandungan untuk dipaparkan.</p>
                )}

                {!isLoading && (
                    <ul className="sitemap-tree">
                        {items.map(item => (
                            <TreeNode key={item.id} node={item} />
                        ))}
                    </ul>
                )}
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
