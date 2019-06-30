import React, { Suspense, useEffect, useContext, useState } from 'react'
import { Redirect } from 'react-router-dom'
import axios from 'axios'

import { apiKey, getChannelDataUrl, searchOptions, youtubeSearchUrl } from '../../config/environment'
import { DataContext } from '../../store/DataContext'
import { UserContext } from '../../store/UserContext'

import './Home.css'

const SearchResult = React.lazy(() => import('../SearchResult/SearchResult')) 

const Home = () => {
    const textInput = React.createRef()

    const [ query, setQuery ] = useState('')
    const { state, dispatch } = useContext(UserContext)
    const { playlistsState, dispatchPlaylists } = useContext(DataContext)

    useEffect(() => {
        async function getChannelId() {
            const Authorization = `Bearer ${localStorage.getItem('DIKTA_TOKEN')}`
            let response = await axios(getChannelDataUrl, {
                headers: { Authorization }
            })

            if (response.code === 401) {
                setTimeout(async () => {
                    response = await axios(getChannelDataUrl, {
                        headers: { Authorization }
                    })
                }, 3000)
            }

            const channelId = response.data.items[0].id

            dispatch({ type: 'SET_CHANNEL_ID', channelId })
        }

        getChannelId()

        return () => {
            setQuery('')
            
            dispatch({ type: 'SET_PLAYLISTS', playlistsState: [] })
            dispatch({ type: 'SET_CHANNEL_ID', channelId: '' })
        }
    }, [dispatch])

    useEffect(() => {
        async function search() {
            if (query.length > 1) {
                const url = `${youtubeSearchUrl}${state.channelId}${searchOptions}${query}${apiKey}`
                const response = await axios(url)
                const results = response.data.items

                dispatchPlaylists({ type: 'SET_PLAYLISTS', playlistsState: results })
            }
        }

        search()

        return () => {
            dispatch({ type: 'SET_PLAYLISTS', playlistsState: [] })
        }
    }, [dispatch, dispatchPlaylists, state.channelId, query])

    const handleClick = (e) => {
        const code = e.keyCode || e.which

        if (code === 13) {
            if (textInput.current.value.length === 0) {
                dispatchPlaylists({ type: 'SET_PLAYLISTS', playlistsState: [] })
            }
            
            setQuery(textInput.current.value)
        }
    }

    if (state.isLoggedIn) {
        const channelUrl = `https://www.youtube.com/channel/${state.channelId}/playlists`

        return (
            <main className="home">
                <a href={channelUrl}>
                    <img
                        alt="Link to your Youtube channel"
                        className="profile-pic"
                        src={localStorage.getItem('DIKTA_PROFILE_PIC')}
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

                    {query.length > 2 && playlistsState.data.length === 0 &&
                        <p>No results found. Maybe you should try the full word</p>
                    }

                    <Suspense 
                        fallback={
                            <p>Fetching results ...</p>
                        }
                    >
                        {query.length > 1 && playlistsState.data.map(playlist => (
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
    
    return (
        <Redirect to='/login'/>
    )
}

export default Home
