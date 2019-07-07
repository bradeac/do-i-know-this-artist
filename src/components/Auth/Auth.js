import React, { Suspense, useContext, useEffect } from 'react'
import useGapi from 'usegapi'

import { UserContext } from '../../store/UserContext'
import './Auth.css'

const Home = React.lazy(() => import('../Home/Home'))

const Auth = () => {
    const { userStore, dispatch } = useContext(UserContext)
    const response = useGapi('https://www.googleapis.com/auth/youtube.readonly')

    useEffect(() => {
        if (response.error) {
            dispatch({ type: 'SET_IS_LOGGED_IN', isLoggedIn: false })
        } 
        
        if (Object.entries(response).length !== 0) {    
            dispatch({ type: 'SET_IS_LOGGED_IN', isLoggedIn: true })
            dispatch({ type: 'SET_PROFILE_PIC_URL', profilePicUrl: response.w3.Paa })
        }
    }, [dispatch, response, userStore])

    if (userStore.isLoggedIn) {
        return (
            <Suspense
                fallback={
                    <p className="login">Loading ...</p>
                }
            >
                <Home token={response.Zi.access_token}/>
            </Suspense>
        )
    }
    return (
        <div className="login">
            <div id='google-signin-button'/>
        </div>
    )
}

export default Auth
