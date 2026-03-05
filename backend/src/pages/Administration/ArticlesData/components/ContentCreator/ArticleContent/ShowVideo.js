import React, { useEffect, useRef } from 'react'

const serverUrl = process.env.REACT_APP_SERVER_URL

const ShowVideo = ({ article_data_id, vod, videoPoster }) => {
    const videoRef = useRef(null)
    const posterUrl = videoPoster ? `${serverUrl}/storage/assets/${videoPoster}` : null

    useEffect(() => {
        if (!vod) return
        const src = `${serverUrl}/storage/vods/${vod.name}/playlist.m3u8`
        const video = videoRef.current
        if (!video) return

        const initHls = () => {
            if (window.Hls?.isSupported()) {
                const hls = new window.Hls()
                hls.loadSource(src)
                hls.attachMedia(video)
                return () => hls.destroy()
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src
            }
        }

        if (!window.Hls) {
            const script = document.createElement('script')
            script.src = 'https://cdn.jsdelivr.net/npm/hls.js@1.4.12/dist/hls.min.js'
            script.async = true
            script.onload = initHls
            document.body.appendChild(script)
        } else {
            initHls()
        }
    }, [vod])

    if (!vod) return <div className='text-muted text-center py-3'>No video selected</div>

    return (
        <div className='text-center'>
            <video
                ref={videoRef}
                controls
                poster={posterUrl}
                style={{ width: '100%', maxHeight: '400px', borderRadius: '4px' }}
            />
            <div className='text-muted small mt-1'>{vod.name}</div>
        </div>
    )
}

export default ShowVideo
