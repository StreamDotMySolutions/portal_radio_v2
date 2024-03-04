import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Row from "react-bootstrap/esm/Row";


const Privasi = () => {
    return (
        <>
            <Container>
                <Breadcrumb>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                        <FontAwesomeIcon icon="fas fa-home" />
                    </Breadcrumb.Item>

                    <Breadcrumb.Item active>
                        DASAR PRIVASI
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Card>
                    <Card.Header>
                        <h2>
                        Dasar Privasi
                        </h2>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                            Halaman ini menerangkan dasar privasi yang merangkumi penggunaan dan perlindungan maklumat yang dikemukakan oleh pengunjung. Sekiranya anda ingin mendaftar dan membuat transaksi atau menghantar e-mel yang mengandungi maklumat peribadi, maklumat ini mungkin akan dikongsi bersama dengan agensi awam lain untuk membantu penyediaan perkhidmatan yang  lebih berkesan dan efektif. Contohnya seperti di dalam menyelesaikan aduan yang memerlukan maklum balas dari agensi-agensi lain.
                            <Row className="py-4">
                                <Card.Title>Perlindungan Data</Card.Title>
                                <Card.Text>
                                    Teknologi terkini termasuk penyulitan data adalah digunakan untuk melindungi data yang dikemukakan dan pematuhan kepada standard keselamatan yang ketat adalah terpakai untuk menghalang capaian yang tidak dibenarkan.
                                </Card.Text>
                            </Row>
                            <Row className="py-4">
                                <Card.Title>Keselamatan Storan</Card.Title>
                                <Card.Text>
                                    Semua storan elektronik dan penghantaran data peribadi akan dilindungi dan disimpan dengan menggunakan teknologi keselamatan yang sesuai.
                                </Card.Text>
                            </Row>
                            <Row className="py-4">
                                <Card.Title>Maklumat Yang Dikumpul</Card.Title>
                                <Card.Text>
                                    Tiada maklumat peribadi akan dikumpul semasa anda melayari portal RTM kecuali maklumat yang dikemukakan oleh anda melalui e-mel atau pendaftaran di e-aduan yang merupakan bahagian yang dilindungi dalam Portal ini.
                                </Card.Text>
                            </Row>
                            <Row className="py-4">
                                <Card.Title>Maklum Balas</Card.Title>
                                <Card.Text>
                                Kami amat mengalu-alukan maklum balas/pertanyaan anda.

                                Sekiranya maklumat yang terperinci diperlukan tidak terdapat di dalam Portal ini, keperluan anda akan dimajukan kepada agensi yang berkaitan.
                                </Card.Text>
                            </Row>
                            <Row className="py-4">
                                <Card.Title>Cookies</Card.Title>
                                <Card.Text>
                                Cookies yang dihasilkan oleh pelayan web hanya akan digunakan untuk mengumpul maklumat bagi mengenal pasti layaran anda yang akan datang.

                                Portal RTM menggunakan non-persistent cookies atau per-session cookies untuk tujuan teknikal sahaja seperti penukaran bahasa pada Portal ini. Cookies ini tidak akan merekodkan data secara kekal dan ia tidak juga disimpan di dalam pemacu keras komputer anda. Ia akan terus di padam sebaik sahaja anda meninggalkan Portal ini.
                                </Card.Text>
                            </Row>
                            <Row className="py-4">
                                <Card.Title>Keselamatan Storan</Card.Title>
                                <Card.Text>
                                    Semua storan elektronik dan penghantaran data peribadi akan dilindungi dan disimpan dengan menggunakan teknologi keselamatan yang sesuai.
                                </Card.Text>
                            </Row>
                            <Row className="py-4">
                                <Card.Title>Implikasi Pautan Laman Lain</Card.Title>
                                <Card.Text>
                                Dasar privasi ini hanya terpakai untuk Portal ini sahaja. Perlu diingatkan bahawa laman web yang terdapat dalam pautan

                                Portal ini mungkin mempunyai dasar privasi yang berbeza dan pengunjung dinasihatkan supaya meneliti dan memahami dasar privasi bagi setiap laman web yang dilayari.
                                </Card.Text>
                            </Row>
                            <Row className="py-4">
                                <Card.Title>Pindaan Dasar</Card.Title>
                                <Card.Text>
                                    Sekiranya dasar privasi ini dipinda, pindaan akan dikemas kini di halaman ini. Dengan sering melayari halaman ini, anda akan dikemas kini dengan maklumat yang dikumpul, cara ia digunakan dan dalam keadaan tertentu, bagaimana maklumat dikongsi bersama pihak yang lain.
                                </Card.Text>
                            </Row>
                            <Row className="py-4">
                                <Card.Title>Pertanyaan atau Aduan</Card.Title>
                                <Card.Text>
                                    Sekiranya anda mempunyai sebarang pertanyaan atau aduan mengenai dasar privasi atau Portal ini, anda boleh menghubungi kami melalui ruangan 'Hubungi Kami' atau 'Bantuan' yang disediakan dalam Portal ini.
                                </Card.Text>
                            </Row>

                        </Card.Text>
                    </Card.Body>
                </Card>
       
            </Container>
      
        </>
    )
}

export default Privasi