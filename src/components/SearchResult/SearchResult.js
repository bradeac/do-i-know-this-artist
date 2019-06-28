import React, { Suspense, useEffect, useState } from 'react'
import axios from 'axios'

import { apiKey, getTracksDataUrl } from '../../config/environment'

const TrackCard = React.lazy(() => import('../TrackCard/TrackCard'))

const SearchResult = ({ playlist, query }) => {
    const [tracks, setTracks] = useState([])

    useEffect(() => {
        async function findTracks() {
            let url = `${getTracksDataUrl}${playlist.id.playlistId}${apiKey}`
            const response = await axios(url)
            let tracks = [ ...response.data.items ]

            while (response.nextPagetoken) {
                url = `${getTracksDataUrl}${playlist.id.playlistId}&pageToken=${response.nextPagetoken}&${apiKey}`

                const nextResponse = await axios(url)

                tracks = [ tracks, ...nextResponse.data.items ]
            }

            const filteredTracks = tracks.filter(track =>
                track.snippet.title.toUpperCase().includes(query.toUpperCase())
            )

            setTracks(filteredTracks)

            return () => setTracks([])
        }

        findTracks()
    }, [playlist, query])

    if (tracks.length > 0) {
        return (
            <>
                <p>{playlist.snippet.title}</p>
                
                <Suspense
                    fallback={
                        <p>Fetching data ...</p>
                    }
                >
                    {tracks.map(track => (
                        <TrackCard
                            key={track.id}
                            data={track}
                        />
                    ))}
                </Suspense>
            </>
        )
    }

    return null
}

export default SearchResult