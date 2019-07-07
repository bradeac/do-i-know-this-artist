import React from 'react'
import ReactDOM from 'react-dom'
import dotenv from 'dotenv'

import Auth from './components/Auth/Auth'
import { DataProvider } from './store/DataContext'
import { UserProvider } from './store/UserContext'

import './index.css'

dotenv.config()

ReactDOM.render(
    <UserProvider>
        <DataProvider>
            <Auth />
        </DataProvider>
    </UserProvider>
, document.getElementById('root'))