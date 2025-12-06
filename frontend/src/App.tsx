import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Home from './pages/Home';
import Shop from './pages/Shop';
import CustomOrder from './pages/CustomOrder';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';


function App() {

  const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    throw new Error('REACT_APP_GOOGLE_CLIENT_ID environment variable is not set');
  }

  return(
    <GoogleOAuthProvider clientId={googleClientId}>
<Router>
<Routes>
  <Route path='/' element={<Home/>}/>
  <Route path='/shop' element={<Shop/>}/>
  <Route path='/custom-order' element={<ProtectedRoute><CustomOrder/></ProtectedRoute>}/>
  <Route path='/admin/dashboard' element={<ProtectedRoute isAdmin><AdminDashboard/></ProtectedRoute>}/>
</Routes>
</Router>
    </GoogleOAuthProvider>
  )
}


export default App;