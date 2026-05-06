import { useEffect } from 'react'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import useLoadingStore from '../../libs/loadingStore'

NProgress.configure({ showSpinner: false, trickleSpeed: 180, minimum: 0.12 })

export default function TopProgressBar() {
    const count = useLoadingStore((s) => s.count)
    useEffect(() => {
        if (count > 0) NProgress.start()
        else           NProgress.done()
    }, [count])
    return null
}
