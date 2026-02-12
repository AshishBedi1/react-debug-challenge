import { Routes, Route } from 'react-router-dom'
import { useTheme } from './context/ThemeContext'
import { PreferencesProvider } from './context/PreferencesContext'
import Navigation from './components/Navigation'
import HomePage from './components/HomePage'
import TodoManager from './components/TodoManager'
import ShoppingCart from './components/ShoppingCart'
import Products from './components/Products'
import Contact from './components/Contact'
import DashboardBuilder from './components/DashboardBuilder'
import UserDirectory from './components/UserDirectory'
import BlogPage from './components/BlogPage'
import NewsFeed from './components/NewsFeed'
import SettingsPanel from './components/SettingsPanel'
import DataExplorer from './components/DataExplorer'
import EventRegistration from './components/EventRegistration'
import TaskBoard from './components/TaskBoard'
import ProductComparison from './components/ProductComparison'
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
            <Route path="/dashboard" element={<DashboardBuilder />} />
            <Route path="/users" element={<UserDirectory />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/news" element={<NewsFeed />} />
            <Route path="/settings" element={<SettingsPanel />} />
            <Route path="/data-explorer" element={<DataExplorer />} />
            <Route path="/register" element={<EventRegistration />} />
            <Route path="/task-board" element={<TaskBoard />} />
            <Route path="/compare" element={<ProductComparison />} />
          </Routes>
        </PreferencesProvider>
      </main>
    </div>
  )
}

export default App
