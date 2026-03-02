import { useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from '../../../../libs/axios'
import useStore from '../../../store'
import useUsersStore from '../store'
import HtmlForm from '../components/HtmlForm'

const emptyForm = { name: '', roleId: '', email: '', password: '', passwordConfirmation: '' }

export default function EditModal({ id, disabled = false }) {
    const { url: apiBase } = useStore()
    const setRefresh = useUsersStore((s) => s.setRefresh)

    const [show, setShow] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState(emptyForm)
    const [roles, setRoles] = useState([])
    const [errors, setErrors] = useState(null)

    const onChange = (field) => (value) => setForm((prev) => ({ ...prev, [field]: value }))

    const handleShowClick = () => {
        setErrors(null)
        setIsLoading(true)
        setShow(true)

        // Fetch roles and user data in parallel
        Promise.all([
            axios({ method: 'get', url: `${apiBase}/users/roles` }),
            axios({ method: 'get', url: `${apiBase}/users/${id}` }),
        ])
            .then(([rolesRes, userRes]) => {
                setRoles(rolesRes.data.roles)
                const user = userRes.data.user
                setForm({
                    name: user.name ?? '',
                    roleId: user.role_id ?? '',
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
        formData.append('name', form.name)
        formData.append('role_id', form.roleId)
        formData.append('email', form.email)
        formData.append('_method', 'put')
        // Only send password if user typed something
        if (form.password) {
            formData.append('password', form.password)
            formData.append('password_confirmation', form.passwordConfirmation)
        }

        axios({ method: 'post', url: `${apiBase}/users/${id}`, data: formData })
            .then(() => {
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
            <Button size='sm' variant='outline-primary' onClick={handleShowClick} disabled={disabled}>
                <FontAwesomeIcon icon={['fas', 'pen-to-square']} />
            </Button>

            <Modal size='lg' show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit User</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <HtmlForm
                        form={form}
                        onChange={onChange}
                        roles={roles}
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
        </>
    )
}
