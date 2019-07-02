import React, { useContext, useEffect } from 'react'
import useGapi from 'usegapi'

import { UserContext } from '../../store/UserContext'

import './Login.css'

const Login = ({ history }) => {
    const { dispatch } = useContext(UserContext)
    const response = useGapi('https://www.googleapis.com/auth/youtube.readonly')

    useEffect(() => {
        if (response.error) {
            localStorage.clear()
        
            dispatch({ type: 'SET_IS_LOGGED_IN', isLoggedIn: false })
    
            history.push('/login')
        } 
        
        if (Object.entries(response).length !== 0) {    
            localStorage.setItem('DIKTA_TOKEN', response.Zi.access_token)
            localStorage.setItem('DIKTA_PROFILE_PIC', response.w3.Paa)
            
            dispatch({ type: 'SET_IS_LOGGED_IN', isLoggedIn: true })
    
            history.push('/')
        }
    }, [dispatch, history, response])

    return (
        <div className="login">
            <div id='google-signin-button'/>
        </div>
    )
}

export default Login
