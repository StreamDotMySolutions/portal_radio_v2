import { useState } from 'react'
import { Button, Modal, Toast, ToastContainer } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useChatUsersStore from '../store'
import HtmlForm from '../components/HtmlForm'

const emptyForm = { username: '', email: '', password: '', passwordConfirmation: '' }

export default function EditModal({ id }) {
    const { url: apiBase } = useStore()
    const setRefresh = useChatUsersStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [errors, setErrors] = useState(null)
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')

    const onChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }))

    const handleShowClick = () => {
        setErrors(null)
        setIsLoading(true)
        setShow(true)

        axios({ method: 'get', url: `${apiBase}/chat-users/${id}` })
            .then((response) => {
                const user = response.data.chat_user
                setForm({
                    username: user.username ?? '',
                    email: user.email ?? '',
                    password: '',
                    passwordConfirmation: '',
                })
            })
            .catch((error) => console.warn(error))
            .finally(() => setIsLoading(false))
    }

    const handleClose = () => setShow(false)

    const handleSubmitClick = () => {
        setIsLoading(true)
        const formData = new FormData()
        formData.append('username', form.username)
        formData.append('email', form.email)
        formData.append('_method', 'put')
        if (form.password) {
            formData.append('password', form.password)
            formData.append('password_confirmation', form.passwordConfirmation)
        }

        axios({ method: 'post', url: `${apiBase}/chat-users/${id}`, data: formData })
            .then(() => {
                setToastMessage(`Chat user "${form.username}" berjaya dikemaskini.`)
                setShowToast(true)
                setRefresh()
                handleClose()
            })
            .catch((error) => {
                if (error.response?.status === 422) {
                    setErrors(error.response.data.errors)
                }
            })
            .finally(() => setIsLoading(false))
    }

    return (
        <>
            <Button size='sm' variant='outline-primary' onClick={handleShowClick}>
                <FontAwesomeIcon icon={['fas', 'pen-to-square']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Chat User</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <HtmlForm
                        form={form}
                        onChange={onChange}
                        errors={errors}
                        isLoading={isLoading}
                    />
                </Modal.Body>

                <Modal.Footer>
                    <Button variant='secondary' disabled={isLoading} onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant='primary' disabled={isLoading} onClick={handleSubmitClick}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position='top-end' className='p-3' style={{ position: 'fixed', zIndex: 9999 }}>
                <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
                    <Toast.Body className='bg-success text-white'>
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>
        </>
    )
}
