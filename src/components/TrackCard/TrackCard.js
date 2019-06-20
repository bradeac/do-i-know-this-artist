import React from 'react'

const TrackCard = ({ data }) => {
    const { title } = data.snippet

    return (
        <div>
            {title}
        </div>
    )
}

export default TrackCard