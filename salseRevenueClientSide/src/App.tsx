import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { Provider } from "react-redux"
import { ThemeProvider, CssBaseline } from "@mui/material"
import theme from "./Theme"
import store from "./redux/Store"
import Index from "./compponents/SalseDashBoard"
import Dashboard from "./compponents/Dashboard"

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard/>} />
          </Routes>
        </Router>
        
      </ThemeProvider>
    </Provider>
  )
}

export default App

