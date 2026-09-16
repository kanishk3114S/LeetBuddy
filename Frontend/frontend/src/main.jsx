import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider, Outlet, createRoutesFromElements, Route } from 'react-router-dom'
import Auth from './Auth.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'



//ReactJS gets a DOM container [by the name of root] and renders the every JSX components which are written in Java Script style to render the HTML like components//

/*
Interview-safe version

"createRoot() tells React which DOM element it should manage. React then renders our React components into that root element and uses its reconciliation process to efficiently update the real DOM when the UI changes."

*/

const ourRouter = createBrowserRouter(
  createRoutesFromElements(
    <Route path = "/" element = {<App/>}>
      <Route path ='/auth' element = {<Auth/>}/>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={ourRouter} />
    </ThemeProvider>
  </StrictMode>,
)
