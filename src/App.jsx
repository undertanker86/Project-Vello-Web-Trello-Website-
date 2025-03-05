import Board from "./pages/Boards/_id"
import Boards from "./pages/Boards/index.jsx"
import {Routes, Route, Navigate, Outlet} from "react-router-dom"
import NotFound from './pages/404/NotFound.jsx'
import Auth from "./pages/Auth/Auth.jsx"
import AccountVerification from "./pages/Auth/AccountVerification.jsx"
import { useSelector } from 'react-redux'
import { selectCurrentUser } from './redux/user/userSlice'
import Settings from "./pages/Settings/Settings.jsx"

// Function to need user (logged?) if not loggin redirect to login page, if logged to show child routes to access
const ProtectedRoute = ({ user }) => {
  if(!user) return  <Navigate to='/login' replace={true} />
  // Outlet: react-router-dom will run child routes in here
  return <Outlet />
}
function App() {
  const currentUser = useSelector(selectCurrentUser)
  return (

    <Routes>
      <Route path="/" element={<Navigate to="/boards" replace={true} />} />
      {/* Protected Route mean in the project only routes to access after login */}
      <Route element={<ProtectedRoute user={currentUser} />}>
        {/* // Call only the Board Details page */}
        <Route path="/boards/:boardId" element={<Board />} />
        <Route path="/boards" element={<Boards />} />

        {/* Setting User */}
        <Route path="/settings/account" element={<Settings/>} />
        <Route path="/settings/security" element={<Settings/>} />

      </Route>
       {/* Authentication */}
      <Route path='/login' element={<Auth/>}></Route>
      <Route path='/register' element={<Auth/>}></Route>
      <Route path='/account/verification' element={<AccountVerification/>}></Route>
      {/* 404 Not Found page */}
      <Route path='*' element={<NotFound/>}></Route>
    </Routes>
  )
}

export default App
