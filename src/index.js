import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from "react-router-dom"
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
                <Route path="/login" component={Login} />
                <Route path="/" component={Home} />
            </Router>        
        </DataProvider>
    </UserProvider>
, document.getElementById('root'))