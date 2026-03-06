import React, { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const ComplaintForm = () => {
    const recaptchaRef = useRef();
    const [form, setForm] = useState({
        full_name: '',
        email: '',
        phone_number: '',
        category: '',
        platform: '',
        programme_name: '',
        incident_at: '',
        subject: '',
        description: '',
    });
    const [attachment, setAttachment] = useState(null);
    const [captchaToken, setCaptchaToken] = useState(null);
    const [acknowledged, setAcknowledged] = useState(false);
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const [referenceNumber, setReferenceNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const categoryOptions = [
        'Kandungan Siaran',
        'Masalah Teknikal',
        'Perkhidmatan Pelanggan',
        'Lain-lain'
    ];

    const platformOptions = [
        'TV1',
        'TV2',
        'Okey',
        'Sukan RTM',
        'Nasional FM',
        'Klasik Nasional',
        'Minnal FM',
        'Traxx FM',
        'Ai FM',
        'RTM Website',
        'Lain-lain'
    ];

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleAttachmentChange = (e) => {
        setAttachment(e.target.files[0] || null);
    };

    const handleCaptchaChange = (token) => {
        setCaptchaToken(token);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        try {
            const formData = new FormData();
            Object.keys(form).forEach(key => {
                formData.append(key, form[key]);
            });

            if (attachment) {
                formData.append('attachment', attachment);
            }

            if (captchaToken) {
                formData.append('recaptcha_token', captchaToken);
            }

            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/complaints`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' }
                }
            );

            if (response.status === 200) {
                setSuccess(true);
                setReferenceNumber(response.data.reference_number);
                setForm({
                    full_name: '',
                    email: '',
                    phone_number: '',
                    category: '',
                    platform: '',
                    programme_name: '',
                    incident_at: '',
                    subject: '',
                    description: '',
                });
                setAttachment(null);
                setAcknowledged(false);
                if (recaptchaRef.current) {
                    recaptchaRef.current.reset();
                }
                setCaptchaToken(null);
                // Auto-hide success message after 10 seconds
                setTimeout(() => setSuccess(false), 10000);
            }
        } catch (error) {
            if (error.response?.status === 422) {
                const errorData = error.response.data;
                if (errorData.errors) {
                    setErrors(errorData.errors);
                } else if (errorData.message) {
                    setErrors({ form: errorData.message });
                } else {
                    setErrors({ form: 'Sila semak semula borang anda. Ada maklumat yang tidak sah.' });
                }
            } else {
                setErrors({ form: 'Terjadi kesalahan. Sila cuba semula.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '3rem', paddingBottom: '3rem' }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-7">
                        {/* Header */}
                        <div className="text-center mb-5">
                            <div style={{ fontSize: '3rem', color: '#F8A131', marginBottom: '1rem' }}>
                                <FontAwesomeIcon icon={['fas', 'comments']} />
                            </div>
                            <h1 style={{ color: '#303381', fontWeight: '700', marginBottom: '0.5rem' }}>
                                Borang Aduan
                            </h1>
                            <p style={{ color: '#666', fontSize: '1.05rem' }}>
                                Laporan masalah atau cadangan anda adalah penting kepada kami
                            </p>
                        </div>

                        {success && (
                            <div className="alert alert-success alert-dismissible fade show" role="alert" style={{ borderRadius: '8px', borderLeft: '4px solid #28a745' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={['fas', 'check-circle']} style={{ marginRight: '1rem', fontSize: '1.3rem', color: '#F8A131' }} />
                                    <div>
                                        <strong style={{ color: '#303381' }}>Berjaya!</strong> Aduan anda telah diterima.
                                        <br />
                                        <strong>Nombor Rujukan:</strong> <span style={{ fontSize: '1.1rem', fontFamily: 'monospace', color: '#303381' }}>{referenceNumber}</span>
                                    </div>
                                </div>
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setSuccess(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        )}

                        {errors.form && (
                            <div className="alert alert-danger alert-dismissible fade show" role="alert" style={{ borderRadius: '8px', borderLeft: '4px solid #dc3545' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={['fas', 'exclamation-circle']} style={{ marginRight: '1rem', fontSize: '1.3rem', color: '#F8A131' }} />
                                    <div>{errors.form}</div>
                                </div>
                                <button type="button" className="close" data-dismiss="alert" aria-label="Close" onClick={() => setErrors(prev => ({ ...prev, form: null }))}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        )}

                        {/* Form Card */}
                        <div style={{ backgroundColor: 'white', borderRadius: '10px', padding: '2.5rem', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
                            <form onSubmit={handleSubmit} encType="multipart/form-data">
                            {/* Section 1: Personal Information */}
                            <div className="mb-4">
                                <h5 style={{ color: '#303381', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '2px solid #F8A131', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={['fas', 'user']} style={{ color: '#F8A131', marginRight: '3px' }} />
                                    Maklumat Peribadi
                                </h5>
                                <div className="form-group">
                                    <label htmlFor="full_name" style={{ fontWeight: '500', color: '#333' }}>Nama Penuh *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.full_name ? 'is-invalid' : ''}`}
                                        id="full_name"
                                        name="full_name"
                                        value={form.full_name}
                                        onChange={handleFormChange}
                                        placeholder="Masukkan nama penuh anda"
                                        style={{ borderRadius: '6px', padding: '0.75rem' }}
                                    />
                                    {errors.full_name && <div className="invalid-feedback d-block" style={{ color: '#dc3545', marginTop: '0.5rem' }}>{errors.full_name}</div>}
                                </div>
                            </div>

                                <div className="form-group">
                                    <label htmlFor="email" style={{ fontWeight: '500', color: '#333' }}>Email *</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleFormChange}
                                        placeholder="nama@contoh.com"
                                        style={{ borderRadius: '6px', padding: '0.75rem' }}
                                    />
                                    {errors.email && <div className="invalid-feedback d-block" style={{ color: '#dc3545', marginTop: '0.5rem' }}>{errors.email}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="phone_number" style={{ fontWeight: '500', color: '#333' }}>Nombor Telefon</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.phone_number ? 'is-invalid' : ''}`}
                                        id="phone_number"
                                        name="phone_number"
                                        value={form.phone_number}
                                        onChange={handleFormChange}
                                        placeholder="Cth: 012-3456789"
                                        style={{ borderRadius: '6px', padding: '0.75rem' }}
                                    />
                                    {errors.phone_number && <div className="invalid-feedback d-block" style={{ color: '#dc3545', marginTop: '0.5rem' }}>{errors.phone_number}</div>}
                                </div>

                            {/* Section 2: Complaint Details */}
                            <div className="mb-4">
                                <h5 style={{ color: '#303381', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '2px solid #F8A131', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={['fas', 'file-lines']} style={{ color: '#F8A131', marginRight: '3px' }} />
                                    Butiran Aduan
                                </h5>
                                <div className="row" style={{ marginTop: '1rem' }}>
                                    <div className="col-md-6">
                                        <div className="form-group" style={{ marginBottom: '1rem' }}>
                                            <label htmlFor="category" style={{ fontWeight: '500', color: '#333' }}>Kategori *</label>
                                            <select
                                                className={`form-control ${errors.category ? 'is-invalid' : ''}`}
                                                id="category"
                                                name="category"
                                                value={form.category}
                                                onChange={handleFormChange}
                                                style={{
                                                    borderRadius: '6px',
                                                    padding: '0.75rem 0.75rem 0.75rem 0.75rem',
                                                    width: '100%',
                                                    fontSize: '1rem',
                                                    height: 'auto',
                                                    minHeight: '44px'
                                                }}
                                            >
                                                <option value="">Pilih kategori</option>
                                                {categoryOptions.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                            {errors.category && <div className="invalid-feedback d-block" style={{ color: '#dc3545', marginTop: '0.5rem' }}>{errors.category}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-group">
                                            <label htmlFor="platform" style={{ fontWeight: '500', color: '#333' }}>Platform *</label>
                                            <select
                                                className={`form-control ${errors.platform ? 'is-invalid' : ''}`}
                                                id="platform"
                                                name="platform"
                                                value={form.platform}
                                                onChange={handleFormChange}
                                                style={{
                                                    borderRadius: '6px',
                                                    padding: '0.75rem 0.75rem 0.75rem 0.75rem',
                                                    width: '100%',
                                                    fontSize: '1rem',
                                                    height: 'auto',
                                                    minHeight: '44px'
                                                }}
                                            >
                                                <option value="">Pilih platform</option>
                                                {platformOptions.map(plat => (
                                                    <option key={plat} value={plat}>{plat}</option>
                                                ))}
                                            </select>
                                            {errors.platform && <div className="invalid-feedback d-block" style={{ color: '#dc3545', marginTop: '0.5rem' }}>{errors.platform}</div>}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="programme_name" style={{ fontWeight: '500', color: '#333' }}>Nama Program</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.programme_name ? 'is-invalid' : ''}`}
                                        id="programme_name"
                                        name="programme_name"
                                        value={form.programme_name}
                                        onChange={handleFormChange}
                                        placeholder="Masukkan nama program (jika berkaitan)"
                                        style={{ borderRadius: '6px', padding: '0.75rem' }}
                                    />
                                    {errors.programme_name && <div className="invalid-feedback d-block" style={{ color: '#dc3545', marginTop: '0.5rem' }}>{errors.programme_name}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="incident_at" style={{ fontWeight: '500', color: '#333' }}>Tarikh & Masa Insiden *</label>
                                    <input
                                        type="datetime-local"
                                        className={`form-control ${errors.incident_at ? 'is-invalid' : ''}`}
                                        id="incident_at"
                                        name="incident_at"
                                        value={form.incident_at}
                                        onChange={handleFormChange}
                                        style={{ borderRadius: '6px', padding: '0.75rem' }}
                                    />
                                    {errors.incident_at && <div className="invalid-feedback d-block" style={{ color: '#dc3545', marginTop: '0.5rem' }}>{errors.incident_at}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="subject" style={{ fontWeight: '500', color: '#333' }}>Tajuk *</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                                        id="subject"
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleFormChange}
                                        placeholder="Ringkasan ringkas mengenai aduan anda"
                                        style={{ borderRadius: '6px', padding: '0.75rem' }}
                                    />
                                    {errors.subject && <div className="invalid-feedback d-block" style={{ color: '#dc3545', marginTop: '0.5rem' }}>{errors.subject}</div>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="description" style={{ fontWeight: '500', color: '#333' }}>Penerangan *</label>
                                    <textarea
                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                        id="description"
                                        name="description"
                                        value={form.description}
                                        onChange={handleFormChange}
                                        rows="5"
                                        placeholder="Sila berikan penerangan terperinci mengenai aduan anda..."
                                        style={{ borderRadius: '6px', padding: '0.75rem' }}
                                    />
                                    {errors.description && <div className="invalid-feedback d-block" style={{ color: '#dc3545', marginTop: '0.5rem' }}>{errors.description}</div>}
                                </div>
                            </div>

                            {/* Section 3: Attachment & Verification */}
                            <div className="mb-4">
                                <h5 style={{ color: '#303381', fontWeight: '600', marginBottom: '1.5rem', borderBottom: '2px solid #F8A131', paddingBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
                                    <FontAwesomeIcon icon={['fas', 'paperclip']} style={{ color: '#F8A131', marginRight: '3px' }} />
                                    Lampiran & Pengesahan
                                </h5>
                                <div className="form-group">
                                    <label htmlFor="attachment" style={{ fontWeight: '500', color: '#333', marginBottom: '0.5rem', display: 'block' }}>
                                        <FontAwesomeIcon icon={['fas', 'image']} style={{ color: '#F8A131', marginRight: '3px' }} />
                                        Lampiran (Gambar sahaja, maks 2MB)
                                    </label>
                                    <div className="custom-file">
                                        <input
                                            type="file"
                                            className={`custom-file-input ${errors.attachment ? 'is-invalid' : ''}`}
                                            id="attachment"
                                            name="attachment"
                                            onChange={handleAttachmentChange}
                                            accept="image/jpeg,image/png,image/jpg,image/gif,image/webp"
                                            lang="ms"
                                        />
                                        <label className="custom-file-label" htmlFor="attachment" style={{ borderRadius: '6px' }}>
                                            {attachment ? attachment.name : 'Pilih fail...'}
                                        </label>
                                    </div>
                                    {errors.attachment && <div className="invalid-feedback d-block" style={{ color: '#dc3545', marginTop: '0.5rem' }}>{errors.attachment}</div>}
                                </div>

                                <div style={{ backgroundColor: '#f0f0f0', padding: '1.5rem', borderRadius: '6px', marginBottom: '1.5rem' }}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey={process.env.REACT_APP_RECAPTCHA_SITE_KEY}
                                            onChange={handleCaptchaChange}
                                        />
                                        {errors.recaptcha_token && <div className="invalid-feedback d-block" style={{ color: '#dc3545', marginTop: '0.5rem' }}>{errors.recaptcha_token}</div>}
                                    </div>
                                </div>

                                <div style={{ backgroundColor: '#fff3cd', padding: '1.5rem', borderRadius: '6px', borderLeft: '4px solid #ffc107' }}>
                                    <div className="custom-control custom-checkbox">
                                        <input
                                            type="checkbox"
                                            className="custom-control-input"
                                            id="acknowledged"
                                            checked={acknowledged}
                                            onChange={(e) => setAcknowledged(e.target.checked)}
                                        />
                                        <label className="custom-control-label" htmlFor="acknowledged" style={{ fontWeight: '500', color: '#333', cursor: 'pointer', paddingLeft: '1.5rem' }}>
                                            Saya mengesahkan bahawa maklumat yang saya berikan adalah benar dan sah. Saya memahami bahawa aduan palsu adalah kesalahan.
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #e0e0e0' }}>
                                <button
                                    type="submit"
                                    className="btn"
                                    disabled={isLoading || !captchaToken || !acknowledged}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1.5rem',
                                        fontSize: '1.05rem',
                                        fontWeight: '600',
                                        backgroundColor: (isLoading || !captchaToken || !acknowledged) ? '#ccc' : '#303381',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: (isLoading || !captchaToken || !acknowledged) ? 'not-allowed' : 'pointer',
                                        transition: 'background-color 0.3s'
                                    }}
                                >
                                    <FontAwesomeIcon icon={['fas', isLoading ? 'spinner' : 'paper-plane']} style={{ color: '#F8A131', marginRight: '3px' }} spin={isLoading} />
                                    {isLoading ? 'Sedang menghantar...' : 'Hantar Aduan'}
                                </button>
                            </div>
                        </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintForm;
