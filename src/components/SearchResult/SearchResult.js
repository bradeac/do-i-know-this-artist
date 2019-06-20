import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { apiKey, getTracksDataUrl } from '../../config/environment'
import TrackCard from '../TrackCard/TrackCard'

const SearchResult = ({ playlist, query }) => {
    const [tracks, setTracks] = useState([])

    useEffect(() => {
        async function findTracks() {
            let url = `${getTracksDataUrl}${playlist.id.playlistId}${apiKey}`
            const response = await axios(url)
            let tracks = [ ...response.data.items ]

            while (response.nextPagetoken) {
                url = `${getTracksDataUrl}${playlist.id.playlistId}&pageToken=${response.nextPagetoken}&${apiKey}`

                const response = await axios(url)

                tracks = [ tracks, ...response.data.items ]
            }

            const filteredTracks = tracks.filter(track =>
                track.snippet.title.toUpperCase().includes(query.toUpperCase())
            )

            setTracks(filteredTracks)

            return () => setTracks([])
        }

        findTracks()
    }, [])

    if (tracks.length > 0) {
        return (
            <>
                <p>{playlist.snippet.title}</p>
                {tracks.map(track => (
                    <TrackCard
                        key={track.id}
                        data={track}
                    />
                ))}
            </>
        )
    }

    return null
}

export default SearchResult