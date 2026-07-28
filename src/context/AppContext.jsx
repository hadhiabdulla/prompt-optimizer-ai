import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { nanoid } from 'nanoid'

// Global application state: prompt history, saved library, favorites, settings
const AppContext = createContext(null)

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable - fail silently
  }
}

export function AppProvider({ children }) {
  const [history, setHistory] = useState(() => load('poai_history', []))
  const [saved, setSaved] = useState(() => load('poai_saved', []))
  const [collections, setCollections] = useState(() => load('poai_collections', ['General']))
  const [favoriteModes, setFavoriteModes] = useState(() => load('poai_fav_modes', []))
  const [recentModes, setRecentModes] = useState(() => load('poai_recent_modes', []))
  const [chatHistory, setChatHistory] = useState(() => load('poai_chat', []))

  useEffect(() => save('poai_history', history), [history])
  useEffect(() => save('poai_saved', saved), [saved])
  useEffect(() => save('poai_collections', collections), [collections])
  useEffect(() => save('poai_fav_modes', favoriteModes), [favoriteModes])
  useEffect(() => save('poai_recent_modes', recentModes), [recentModes])
  useEffect(() => save('poai_chat', chatHistory), [chatHistory])

  const addToHistory = useCallback((entry) => {
    const item = { id: nanoid(), createdAt: Date.now(), favorite: false, ...entry }
    setHistory((prev) => [item, ...prev].slice(0, 500))
    return item
  }, [])

  const deleteFromHistory = useCallback((id) => {
    setHistory((prev) => prev.filter((h) => h.id !== id))
  }, [])

  const toggleHistoryFavorite = useCallback((id) => {
    setHistory((prev) => prev.map((h) => (h.id === id ? { ...h, favorite: !h.favorite } : h)))
  }, [])

  const restoreHistory = useCallback((id) => history.find((h) => h.id === id), [history])

  const saveToLibrary = useCallback((entry, collection = 'General', tags = []) => {
    const item = { id: nanoid(), createdAt: Date.now(), collection, tags, favorite: false, ...entry }
    setSaved((prev) => [item, ...prev])
    return item
  }, [])

  const deleteFromLibrary = useCallback((id) => {
    setSaved((prev) => prev.filter((s) => s.id !== id))
  }, [])

  const toggleLibraryFavorite = useCallback((id) => {
    setSaved((prev) => prev.map((s) => (s.id === id ? { ...s, favorite: !s.favorite } : s)))
  }, [])

  const renameLibraryItem = useCallback((id, title) => {
    setSaved((prev) => prev.map((s) => (s.id === id ? { ...s, title } : s)))
  }, [])

  const addCollection = useCallback((name) => {
    setCollections((prev) => (prev.includes(name) ? prev : [...prev, name]))
  }, [])

  const toggleFavoriteMode = useCallback((modeId) => {
    setFavoriteModes((prev) => (prev.includes(modeId) ? prev.filter((m) => m !== modeId) : [...prev, modeId]))
  }, [])

  const registerRecentMode = useCallback((modeId) => {
    setRecentModes((prev) => [modeId, ...prev.filter((m) => m !== modeId)].slice(0, 6))
  }, [])

  const clearAllHistory = useCallback(() => setHistory([]), [])

  const addChatMessage = useCallback((message) => {
    setChatHistory((prev) => [...prev, { id: nanoid(), timestamp: Date.now(), ...message }])
  }, [])

  const clearChat = useCallback(() => setChatHistory([]), [])

  const exportData = useCallback(() => {
    return JSON.stringify({ history, saved, collections, favoriteModes }, null, 2)
  }, [history, saved, collections, favoriteModes])

  const importData = useCallback((json) => {
    try {
      const data = JSON.parse(json)
      if (data.history) setHistory(data.history)
      if (data.saved) setSaved(data.saved)
      if (data.collections) setCollections(data.collections)
      if (data.favoriteModes) setFavoriteModes(data.favoriteModes)
      return true
    } catch {
      return false
    }
  }, [])

  const resetSettings = useCallback(() => {
    localStorage.removeItem('poai_theme')
    localStorage.removeItem('poai_accent')
    localStorage.removeItem('poai_fontsize')
  }, [])

  return (
    <AppContext.Provider
      value={{
        history, addToHistory, deleteFromHistory, toggleHistoryFavorite, restoreHistory, clearAllHistory,
        saved, saveToLibrary, deleteFromLibrary, toggleLibraryFavorite, renameLibraryItem,
        collections, addCollection,
        favoriteModes, toggleFavoriteMode,
        recentModes, registerRecentMode,
        chatHistory, addChatMessage, clearChat,
        exportData, importData, resetSettings,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
