import { Routes, Route } from 'react-router-dom'
import Navigation from './components/Navigation'
import HomePage from './components/HomePage'
import TodoManager from './components/TodoManager'
import ShoppingCart from './components/ShoppingCart'
import './App.css'

function App() {
  return (
    <div className="app">
      <Navigation />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/todos" element={<TodoManager />} />
          <Route path="/cart" element={<ShoppingCart />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
