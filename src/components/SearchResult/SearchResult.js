import React, { Suspense, useEffect, useState } from 'react'
import axios from 'axios'

import { apiKey, getTracksDataUrl } from '../../config/environment'

import './SearchResult.css'

const TrackCard = React.lazy(() => import('../TrackCard/TrackCard'))

const SearchResult = ({ playlist, query }) => {
    const [tracks, setTracks] = useState([])

    const { playlistId } = playlist.id
    const { title } = playlist.snippet

    useEffect(() => {
        async function findTracks() {
            let url = `${getTracksDataUrl}${playlistId}${apiKey}`
            const response = await axios(url)
            let tracks = [ ...response.data.items ]

            while (response.nextPagetoken) {
                url = `${getTracksDataUrl}${playlistId}&pageToken=${response.nextPagetoken}&${apiKey}`

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
    }, [playlist, playlistId, query])

    if (tracks.length > 0) {
        return (
            <>
                <p>
                    <a 
                        className="playlist-title" 
                        href={`https://www.youtube.com/playlist?list=${playlistId}`}
                    >
                        {title}
                    </a>
                </p>
                
                <Suspense
                    fallback={
                        <p>Fetching data ...</p>
                    }
                >
                    <div className="tracks">
                        {tracks.map(track => (
                            <TrackCard
                                key={track.id}
                                data={track}
                            />
                        ))}
                    </div>
                </Suspense>
            </>
        )
    }

    return null
}

export default SearchResult