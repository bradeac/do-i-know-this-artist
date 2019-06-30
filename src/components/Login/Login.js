import React, { useContext, useEffect } from 'react'

import { UserContext } from '../../store/UserContext'

import './Login.css'

const Login = ({ history }) => {
    const { dispatch } = useContext(UserContext)

    useEffect(() => {
        const responseGoogle = user => {
            localStorage.setItem('DIKTA_TOKEN', user.Zi.access_token)
            localStorage.setItem('DIKTA_PROFILE_PIC', user.w3.Paa)
    
            dispatch({ type: 'SET_IS_LOGGED_IN', isLoggedIn: true })
    
            history.push('/')
        }
    
        const failureGoogle = error => {
            localStorage.clear()
    
            dispatch({ type: 'SET_IS_LOGGED_IN', isLoggedIn: false })
    
            history.push('/login')
        }

        window.gapi.signin2.render('google-signin-button', {
            'longtitle': window.innerWidth > 768 ? true : false,
            'onsuccess': responseGoogle,
            'onfail': failureGoogle,
            'scope': 'https://www.googleapis.com/auth/youtube.readonly',
            'theme': 'light',
            'width': window.innerWidth > 768 ? 200 : 100,
        })
    }, [dispatch, history])


    return (
        <div className="login">
            <div id='google-signin-button'/>
        </div>
    )
}

export default Login
