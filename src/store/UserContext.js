
import React from 'react'

let reducer = (state, action) => {
    switch(action.type) {
        case 'SET_CHANNEL_ID':
            return { ...state, channelId: action.channelId }
        case 'SET_IS_LOGGED_IN':
            return { ...state, isLoggedIn: action.isLoggedIn }
        case 'SET_PROFILE_PIC_URL':
            return { ...state, profilePicUrl: action.profilePicUrl }
        default:
            return state
    }
}

const initialState = {
    channelId: null,
    isLoggedIn: false,
    profilePicUrl: null,
}

const UserContext = React.createContext(null)   

function UserProvider(props) {    
    const [userStore, dispatch] = React.useReducer(reducer, initialState)
    
    return (
        <UserContext.Provider value={{ userStore, dispatch }}>
            {props.children}
        </UserContext.Provider>
    )
}


export { UserContext, UserProvider }