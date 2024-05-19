import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Badge, Breadcrumb,BreadcrumbItem } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const BreadCrumbMenu = ({items}) => {

    const handleLinkClick = (url) => {
        //useStore.setState({url: url}) // update the url state in store
        //store.setValue('url',url)
        //console.log(url)
    }



    const contentItems = () => {
        if (items?.length > 0) {
            return items.map((item, index) => {
                const isLastItem = index === items.length - 1;
                return (
                    <BreadcrumbItem key={index} active={isLastItem}>
                        {isLastItem ? (
                            item.name.toUpperCase()
                        ) : (
                            <Link 
                                //onClick={handleLinkClick(item.id)}
                                to={`/administration/directories/${item.id}`}
                            >
                                {item.name.toUpperCase()}
                            </Link>
                        )}
                    </BreadcrumbItem>
                );
            });
        }

        return (
            <BreadcrumbItem active>
                Directory
            </BreadcrumbItem>
        );
    };

    return (
        <Breadcrumb>
         <BreadcrumbItem>
            <Badge>
               
                <Link to={`/administration/directories/0`}>
                    <FontAwesomeIcon style={{color:'#FFF'}} icon={['fas', 'home']} /> {/* fas = font awesome solid  */}
                </Link>
            </Badge>
         </BreadcrumbItem>
       
            {contentItems()}
        </Breadcrumb>
    );
};

export default BreadCrumbMenu;