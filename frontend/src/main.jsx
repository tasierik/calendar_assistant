import React, {lazy, Suspense} from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Loading from "./Components/Loading.jsx";


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
      <Suspense fallback={<Loading/>}>
        <App />
      </Suspense>
  </React.StrictMode>,
)
