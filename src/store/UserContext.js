
import React from 'react'

let reducer = (state, action) => {
    switch(action.type) {
        case 'SET_CHANNEL_ID':
            return { ...state, channelId: action.channelId }
        case 'SET_IS_LOGGED_IN':
            return { ...state, isLoggedIn: action.isLoggedIn }
        default:
            return state
    }
}

const initialState = {
    channelId: null,
    isLoggedIn: false,
}

const UserContext = React.createContext(null)   

function UserProvider(props) {    
    const [state, dispatch] = React.useReducer(reducer, initialState)
    
    return (
        <UserContext.Provider value={{ state, dispatch }}>
            {props.children}
        </UserContext.Provider>
    )
}


export { UserContext, UserProvider }