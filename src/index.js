import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from "react-router-dom"
import dotenv from 'dotenv'

import { DataProvider } from './store/DataContext'
import { UserProvider } from './store/UserContext'

import './index.css'

const Home = React.lazy(() => import('./components/Home/Home'))
const Login = React.lazy(() => import('./components/Login/Login'))

dotenv.config()

ReactDOM.render(
    <UserProvider>
        <DataProvider>
            <Router>
                <Suspense
                    fallback={
                        <p>Loading ...</p>
                    }
                >
                    <Route path="/login" component={Login} />
                    <Route path="/" component={Home} />
                </Suspense>
            </Router>        
        </DataProvider>
    </UserProvider>
, document.getElementById('root'))