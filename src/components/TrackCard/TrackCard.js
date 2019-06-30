import * as React from 'react'

import './TrackCard.css'

const TrackCard = ({ data }) => {
    const { 
        playlistId,
        position, 
        resourceId: { videoId }, 
        thumbnails: { medium: { url } }, 
        title, 
    } = data.snippet

    const trackUrl = `https://youtube.com/watch?v=${videoId}&list=${playlistId}&index=${position + 2}`

    return (
        <div className="card-container">
            <a 
                href={trackUrl} 
                className="card"
            >
                <div className="info">
                    <img 
                        alt="Track thumbnail"
                        className="thumb-wrapper" 
                        src={url}
                    />
                    <div className="meta">
                        <div className="track-info">
                            <div className="title">{title}</div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    )
}

export default TrackCard