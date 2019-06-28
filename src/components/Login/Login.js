import React, { useContext, useEffect } from 'react'
import { navigate } from '@reach/router'

import { UserContext } from '../../store/UserContext'

import './Login.css'

const Login = () => {
    const { dispatch } = useContext(UserContext)

    useEffect(() => {
        const responseGoogle = user => {
            localStorage.setItem('DIKTA_TOKEN', user.Zi.access_token)
    
            dispatch({ type: 'SET_IS_LOGGED_IN', isLoggedIn: true })
    
            navigate('/')
        }
    
        const failureGoogle = error => {
            localStorage.clear()
    
            dispatch({ type: 'SET_IS_LOGGED_IN', isLoggedIn: false })
    
            navigate('/login')
        }

        window.gapi.signin2.render('google-signin-button', {
            'longtitle': window.innerWidth > 768 ? true : false,
            'onsuccess': responseGoogle,
            'onfail': failureGoogle,
            'scope': 'https://www.googleapis.com/auth/youtube.readonly',
            'theme': 'light',
            'width': window.innerWidth > 768 ? 200 : 100,
        })
    }, [dispatch])


    return (
        <div className="login">
            <div id='google-signin-button'/>
        </div>
    )
}

export default Login
