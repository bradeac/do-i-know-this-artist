import React from 'react'

let reducer = (state, action) => {
    switch(action.type) {
        case 'SET_PLAYLISTS':
            return { ...state, playlists: action.playlists }
        default:
            return state
    }
}

const initialState = {
    playlists: [],
}

const DataContext = React.createContext(null)

function DataProvider(props) {
    const [dataStore, dispatchData] = React.useReducer(reducer, initialState)

    return (
        <DataContext.Provider value={{ dataStore, dispatchData }}>
            {props.children}
        </DataContext.Provider>
    )
}

export { DataContext, DataProvider }