import { Routes, Route } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import { PreferencesProvider } from './context/PreferencesContext'
import Navigation from './components/Navigation'
import HomePage from './components/HomePage'
import TodoManager from './components/TodoManager'
import ShoppingCart from './components/ShoppingCart'
import Products from './components/Products'
import Contact from './components/Contact'
import './App.css'

function App() {
  const { theme } = useTheme()
  return (
    <div className={`app ${theme}`}>
      <Navigation />
      <main className="main-content">
        <PreferencesProvider>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/todos" element={<TodoManager />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<ShoppingCart />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </PreferencesProvider>
      </main>
    </div>
  )
}

export default App
