import React from 'react'

let reducer = (state, action) => {
    switch(action.type) {
        case 'SET_PLAYLISTS':
            return { ...state, data: action.playlistsState }
        default:
            return state
    }
}

const initialState = {
    data: [],
}

const DataContext = React.createContext(null)

function DataProvider(props) {
    const [playlistsState, dispatchPlaylists] = React.useReducer(reducer, initialState)

    return (
        <DataContext.Provider value={{ playlistsState, dispatchPlaylists }}>
            {props.children}
        </DataContext.Provider>
    )
}

export { DataContext, DataProvider }