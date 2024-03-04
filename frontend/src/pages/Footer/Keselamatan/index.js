import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Keselamatan = () => {
    return (
        <>
            <Container>
                <Breadcrumb>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                        <FontAwesomeIcon icon="fas fa-home" />
                    </Breadcrumb.Item>

                    <Breadcrumb.Item active>
                        DASAR KESELAMATAN
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Card>
                    <Card.Header>
                        <h2>
                        Dasar Keselamatan
                        </h2>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            <ol>
                                <li className="py-3">
                                Sumbangan dan penyebaran maklumat yang dilarang dan bahan-bahan negatif yang bertentangan dengan dasar-dasar negara adalah dilarang.
                                </li>
                                <li className="py-3">
                                Menyebar maklumat berbau politik, hasutan atau perkauman atau apa-apa yang menjejaskan reputasi Jabatan Penyiaran Malaysia adalah dilarang.
                                </li>
                                <li className="py-3">
                                Pengunjung yang ingin menggunakan kemudahan seperti forum dikehendaki mendaftar sebagai langkah keselamatan bagi mengelakkan perkara-perkara yang tidak diingini timbul.
                                </li>
                                <li className="py-3">
                                Pengunjung hendaklah memastikan fail yang dihantar melalui kepilan (attachment) bebas dari virus.
                                </li>
                                <li className="py-3">
                                Pengunjung adalah bertanggungjawab sepenuhnya ke atas maklumat yang dikunci masuk.
                                </li>
                                <li className="py-3">
                                Semua maklumat yang hendak dimuatkan ke dalam Portal RTM mestilah mendapat kelulusan Ketua Bahagian/Jabatan.
                                </li>
                                <li className="py-3">
                                Laman web agensi atau syarikat yang memerlukan pautan ke Portal RTM atau sebaliknya mestilah mendapat kebenaran Ketua Jabatan.
                                </li>
                                <li className="py-3">
                                Pencerobohan atau percubaan untuk menggodam Portal RTM adalah dilarang.
                                </li>
                            </ol>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </Container>
      
        </>
    )
}

export default Keselamatan