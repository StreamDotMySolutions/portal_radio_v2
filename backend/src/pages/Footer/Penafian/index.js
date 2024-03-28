import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Penafian = () => {
    return (
        <>
            <Container>
                <Breadcrumb>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                        <FontAwesomeIcon icon="fas fa-home" />
                    </Breadcrumb.Item>

                    <Breadcrumb.Item active>
                        PENAFIAN
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Card>
                    <Card.Header>
                        <h2>
                        Penafian
                        </h2>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            Kerajaan Malaysia dan Radio Televisyen Malaysia adalah tidak bertanggungjawab atas kehilangan atau kerugian yang disebabkan oleh penggunaan mana-mana maklumat yang diperolehi dari laman web ini serta tidak boleh ditafsirkan sebagai agen kepada, ataupun syarikat yang disyorkan oleh RTM
                        </Card.Text>
                    </Card.Body>
                </Card>
       
            </Container>
    
        </>
    )
}

export default Penafian