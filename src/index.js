import React from 'react'
import ReactDOM from 'react-dom'
import { Router } from "@reach/router"
import dotenv from 'dotenv'

import Home from './components/Home/Home'
import Login from './components/Login/Login'
import { DataProvider } from './store/DataContext'
import { UserProvider } from './store/UserContext'

import './index.css'

dotenv.config()

ReactDOM.render(
    <UserProvider>
        <DataProvider>
            <Router>
                <Login path="/login" />
                <Home path="/" />
            </Router>        
        </DataProvider>
    </UserProvider>
, document.getElementById('root'))