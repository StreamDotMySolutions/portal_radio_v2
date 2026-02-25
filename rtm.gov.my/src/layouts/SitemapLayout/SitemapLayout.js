import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { NavLink } from 'react-router-dom';

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

    const TreeNode = ({ node, depth = 0 }) => {
        const children = node.children || [];

        return (
            <div>
                <div style={{ marginLeft: depth * 20 }}>
                    - <NavLink to={node.slug || '#'} style={{ color: '#0000ff' }}>{node.title}</NavLink>
                </div>

                {children.map(child => (
                    <TreeNode
                        key={child.id}
                        node={child}
                        depth={depth + 1}
                    />
                ))}
            </div>
        );
    };

    if (isLoading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <pre>
        <div className="bg-light min-vh-100 w-100 p-4" style={{ color: '#000000' }}>
            <h1>Sitemap</h1>

            {items.map(item => (
                <TreeNode key={item.id} node={item} />
            ))}
        </div>
        </pre>
    );
};

export default SitemapLayout;
