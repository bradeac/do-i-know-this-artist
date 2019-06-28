import React, { useEffect, useContext, useState } from 'react'
import { navigate } from '@reach/router'
import axios from 'axios'

import { apiKey, getChannelDataUrl, searchOptions, youtubeSearchUrl } from '../../config/environment'
import { DataContext } from '../../store/DataContext'
import { UserContext } from '../../store/UserContext'
import SearchResult from '../SearchResult/SearchResult'

import './Home.css'

const Home = () => {
    const [ query, setQuery ] = useState('')
    const { state, dispatch } = useContext(UserContext)
    const { playlistsState, dispatchPlaylists } = useContext(DataContext)

    useEffect(() => {
        async function getChannelId() {
            const Authorization = `Bearer ${localStorage.getItem('DIKTA_TOKEN')}`
            const response = await axios(getChannelDataUrl, {
                headers: { Authorization }
            })
            const channelId = response.data.items[0].id
            
            dispatch({ type: 'SET_CHANNEL_ID', channelId })
        }

        getChannelId()

        return () => {
            setQuery('')
            
            dispatch({ type: 'SET_PLAYLISTS', playlistsState: [] })
            dispatch({ type: 'SET_CHANNEL_ID', channelId: '' })
        }
    }, [])

    useEffect(() => {
        async function search() {
            if (query.length > 2) {
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
    }, [query])

    const handleInputChange = (e) => {
        if (e.target.value.length === 0) {
            dispatchPlaylists({ type: 'SET_PLAYLISTS', playlistsState: [] })
        }
        
        setQuery(e.target.value)
    }

    if (state.isLoggedIn) {
        return (
            <div className="home">
                <p>
                    {'ChannelId: ' + state.channelId}
                </p>

                <label>
                    <input 
                        placeholder="Search ..."
                        value={query}
                        onChange={handleInputChange}
                    />
                </label>

                {query.length > 2 && playlistsState.data.length === 0 &&
                    <p>No results found. Maybe give a bit more details ?</p>
                }

                {query && playlistsState.data.map(playlist => (
                    <SearchResult
                        key={playlist.id.playlistId}
                        playlist={playlist}
                        query={query}
                    />
                ))}
            </div>
        )
    }
    
    navigate('/login')

    return null
}

export default Home
