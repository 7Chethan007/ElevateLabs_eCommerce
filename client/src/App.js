import React from 'react'
import Header from './components/headers/Header'
import Pages from './components/mainpages/Pages'
import { BrowserRouter as Router } from 'react-router-dom'
import { DataProvider } from './GlobalState'
import { ThemeProvider } from './contexts/ThemeContext'
import { ComparisonProvider } from './contexts/ComparisonContext'
import ThemeToggle from './components/common/ThemeToggle'

const App = () => {
  return (
    <ThemeProvider>
      <ComparisonProvider>
        <DataProvider>
          <Router>
            <div className='App'>
              <Header/>
              <Pages/>
              <ThemeToggle />
            </div>
          </Router>
        </DataProvider>
      </ComparisonProvider>
    </ThemeProvider>
  )
}
export default App