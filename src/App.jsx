import React from 'react'
import Order from './pages/Order'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import './css/App.css'
import { Routes, Route } from 'react-router'


function  App () {
  return (
    <div>
      <NavBar/>
      <main className="main-content">
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/order' element={<Order/>}></Route>
        </Routes>
      </main>
    </div>
  )
}

export default App

