import React, { Suspense, useEffect, useContext, useState } from 'react'
import axios from 'axios'

import { apiKey, getChannelDataUrl, searchOptions, youtubeSearchUrl } from '../../config/environment'
import { DataContext } from '../../store/DataContext'
import { UserContext } from '../../store/UserContext'

import './Home.css'

const SearchResult = React.lazy(() => import('../SearchResult/SearchResult')) 

const Home = ({ token }) => {
    const textInput = React.createRef()
    const [ query, setQuery ] = useState('')

    const { userStore, dispatch: dispatchUser } = useContext(UserContext)
    const { dataStore, dispatchData } = useContext(DataContext)

    useEffect(() => {
        async function getChannelId() {
            const Authorization = `Bearer ${token}`
            let response = await axios(getChannelDataUrl, {
                headers: { Authorization }
            })

            const channelId = response.data.items[0].id

            dispatchUser({ type: 'SET_CHANNEL_ID', channelId })
        }

        if (token) {
            getChannelId()
        }

        return () => {
            setQuery('')
            
            dispatchUser({ type: 'SET_CHANNEL_ID', channelId: null })
            dispatchUser({ type: 'SET_PLAYLISTS', playlistsState: [] })
            dispatchUser({ type: 'SET_PROFILE_PIC_URL', profilePicUrl: null })
        }
    }, [dispatchUser, token])

    useEffect(() => {
        async function search() {
            if (query.length > 1) {
                const url = `${youtubeSearchUrl}${userStore.channelId}${searchOptions}${query}${apiKey}`
                const response = await axios(url)
                const results = response.data.items

                dispatchData({ type: 'SET_PLAYLISTS', playlists: results })
            }
        }

        if (userStore.channelId) {
            search()
        }

        return () => {
            dispatchData({ type: 'SET_PLAYLISTS', playlists: [] })
        }
    }, [dispatchData, userStore.channelId, query])

    const handleClick = (e) => {
        const code = e.keyCode || e.which

        if (code === 13 || !code) {
            if (textInput.current.value.length === 0) {
                dispatchData({ type: 'SET_PLAYLISTS', playlists: [] })
            }
            
            setQuery(textInput.current.value)
        }
    }

    const channelUrl = `https://www.youtube.com/channel/${userStore.channelId}/playlists`

    return (
        <main className="home">
            <a href={channelUrl}>
                <img
                    alt="Link to your Youtube channel"
                    className="profile-pic"
                    src={userStore.profilePicUrl}
                />
            </a>
            <section className="section">
                <section className="input-container">
                    <input
                        className="input"
                        onKeyPress={handleClick}
                        placeholder="Search ..."
                        ref={textInput}
                    />
                    <button
                        className="button-search"
                        onClick={handleClick}                        
                    >
                            Search
                    </button>
                </section>

                {query.length > 2 && dataStore.playlists.length === 0 &&
                    <p>No results found. Maybe you should try the full word</p>
                }

                <Suspense 
                    fallback={
                        <p>Fetching results ...</p>
                    }
                >
                    {query.length > 1 && dataStore.playlists.map(playlist => (
                        <SearchResult
                            key={playlist.id.playlistId}
                            playlist={playlist}
                            query={query}
                        />
                    ))}
                </Suspense>
            </section>
        </main>
    )
}

export default Home
