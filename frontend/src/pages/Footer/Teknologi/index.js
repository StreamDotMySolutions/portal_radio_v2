import React from "react";
import { Outlet } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Card from 'react-bootstrap/Card';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import { Link} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'


const Teknologi = () => {
    return (
        <>
            <Container>
                <Breadcrumb>
                    <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }}>
                        <FontAwesomeIcon icon="fas fa-home" />
                    </Breadcrumb.Item>

                    <Breadcrumb.Item active>
                        Teknologi
                    </Breadcrumb.Item>
                </Breadcrumb>
                <Card>
                    <Card.Header>
                    <h2>
                        Teknologi
                    </h2>
                    </Card.Header>
                    <Card.Body>
                        <Card.Text>
                        Dalam usaha menyampaikan maklumat data PRU DUN Ke-15, portal ini menjadikan teknologi <i>Open Source</i> sebagai asas yang inovatif.  Jabatan Penyiaran Malaysia melalui Bahagian Berita dan Ehwal Semasa (BES) telah menyerahkan tanggungjawab dan kepercayaan kepada Seksyen Aplikasi ICT (SAICT) untuk membangunkan laman web yang memberikan paparan mesra MOBILE dan DESKTOP, memungkinkan penyampaian maklumat pilihanraya secara <i>REALTIME</i> dari Bilik Gerakan PRU15 RTM.
                        </Card.Text>

                        <Card.Text>
                        Ketepatan masa dalam pemaparan data diutamakan, dan sebagai langkah untuk mencapainya, latensi data dikekalkan di bawah 5 saat dari bilik gerakan ke portal. Bagi memudahkan pengisian maklumat, Pengisi Data RTM di bilik gerakan memanfaatkan teknologi GOOGLE CLOUD PLATFORM, sebelum dipaparkan di PORTAL rasmi di https://pilihanraya.rtm.gov.my.
                            <br />
                            <br />
                            Kolaborasi antara pelapor petugas RTM di lapangan dan pusat data Suruhanjaya Pilihanraya (SPR) diperlukan untuk menjamin integriti data di dalam PORTAL.
                        </Card.Text>

                        <h2>Perisian</h2>
                        <Card.Text>
                            Pembinaan laman web ini dilakukan dengan mengaplikasikan teknologi OPEN SOURCE seperti berikut:
                            <ol>
                                <li>Frontend menggunakan teknologi SpA ( Single Page Action ) dari ReactJS.</li>
                                <li>API Backend menggunakan teknologi RESTful dari perisian <i>framework</i> LARAVEL.</li>
                                <li>API <i>server</i> yang dikuasai oleh NGINX dan PHP Swoole untuk pastikan kelajuan tinggi dan kemampuan menahan <i>load concurrent</i> yang tinggi.</li>
                                <li><i>Process Manager</i> dari PM2 untuk melihat metrik penggunaan <i>resource server</i> secara <i>realtime</i>.</li>
                                <li>Sistem Smart CACHE untuk pastikan Pangkalan Data tidak <i>overload</i> sewaktu trafik tinggi.</li>
                                <li>Pangkalan Data MySQL Enterprise dari ORACLE.</li>
                                <li><i>Web server</i> prestasi tinggi dari NGINX yang telah ditala untuk keselamatan dan trafik yang tinggi.</li>
                                <li>Paparan yang mudah dan kemas menggunakan Bootstrap 5 CSS <i>Framework</i>.</li>
                                <li>Sistem pengurusan <i>source code</i> dari GIT.</li>
                                <li>Sistem operasi dari UBUNTU.</li>
                                <li>Sistem automasi dari CRON.</li>
                                <li>Sistem automasi dari BASH Script.</li>
                            </ol>
                        </Card.Text>

                        <Card.Text>
                        <h2>Bahasa</h2>
                            Bahasa aturcara yang digunakan adalah seperti berikut :
                            <ol>
                                <li>JAVASCRIPT di <i>frontend</i></li>
                                <li>HTML di <i>frontend</i></li>
                                <li>CSS di <i>frontend</i></li>
                                <li>PHP di <i>backend</i></li>
                                <li>Protokol REST untuk API</li>
                                <li>Google App Script di <i>backend</i></li>
                            </ol>
                        </Card.Text>

                        <Card.Text>
                            <h2>Proses</h2>
                            SAICT menggunakan pendekatan <i>Rapid Software Development Life Cycle (SDLC)</i> untuk mempercepatkan pembangunan portal.
                        </Card.Text>

                        <Card.Text>
                            <h2>Keselamatan</h2>
                            Keutamaan keselamatan ditekankan melalui penarafan keselamatan dari Mozilla Observatory, yang memberikan penilaian terhadap tahap keselamatan laman web ini dan berjaya memperoleh gred <strong>B+</strong>. Anda boleh merujuk penilaian keselamatan di pautan berikut: <a target="_blank" href="https://observatory.mozilla.org/analyze/pilihanraya.rtm.gov.my">
                            <strong>https://observatory.mozilla.org/analyze/pilihanraya.rtm.gov.my</strong>
                            </a>. Seterusnya, untuk memastikan kestabilan dan kebolehpercayaan portal ini, semua perkhidmatan server dijalankan melalui Pusat Data Sektor Awam (PDSA, MAMPU).
                            <br/>
                            <br/>
                            Secara keseluruhan, pelaksanaan teknologi ini merupakan hasil dari inovasi dalam bidang teknologi maklumat yang telah disesuaikan dengan keperluan penyampaian maklumat melalui platform RTM. Ia juga mampu menonjolkan kemampuan Jabatan Penyiaran secara dalaman melalui koordinasi berkesan dalam perancangan dan pelaksanaan teknologi oleh pihak SAICT, khususnya dalam konteks teknologi cloud computing.
                        </Card.Text>

                    </Card.Body>
                </Card>
       
            </Container>
    
        </>
    )
}

export default Teknologi