import { useState, useEffect } from 'react'
import axios from '../../../../../../libs/axios'
import useStore from '../../../../../store'


const ShowPdf = ({ article_data_id }) => {
    const store = useStore()
    const [filename, setFilename] = useState(null)
    const serverUrl = process.env.REACT_APP_SERVER_URL

    useEffect(() => {
        axios({ method: 'get', url: `${store.url}/article-pdf/${article_data_id}` })
            .then(response => {
                setFilename(response.data.article_pdf?.filename || null)
            })
            .catch(error => console.warn(error))
    }, [article_data_id, store.getValue('refresh')])

    if (!filename) {
        return <p className='text-muted small'>No PDF attached</p>
    }

    const pdfUrl = `${serverUrl}/storage/article_pdf/${filename}`

    return (
        <div className='mb-2'>
            <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />
        </div>
    )
}

export default ShowPdf
