/* eslint-disable */
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Main from './components/nav/Main';
import { AuthProvider } from './context/auth';
import AccountActivate from './pages/auth/AccountActivate';
import AccessAccount from './pages/auth/AccessAccount';
import PrivateRoute from './components/routes/PrivateRoute';
import SellHouse from './pages/user/ad/SellHouse';
import RentHouse from './pages/user/ad/RentHouse';
import Footer from './components/nav/Footer';
import Dashboard from './pages/user/Dashboard';
import CreateAd from './pages/user/ad/AdCreate';
import AdView from './pages/AdView';
import Buy from './pages/Buy';
import Rent from './pages/Rent';
import Profile from './pages/user/Profile';
import AdEdit from './pages/user/ad/AdEdit';
import Wishlist from './pages/user/Wishlist';
import Enquiries from './pages/user/Enquiries';
import ForgotPassword from './pages/auth/ForgotPassword';
import { SearchProvider } from './context/search';
import Page404 from './pages/Page404';
import ErrorBoundary from 'antd/es/alert/ErrorBoundary';
import ChangePassword from './pages/user/ChangePassword';
import Search from './pages/Search';
import AuthStore from './components/store/AuthStore';
console.log(process.env);
function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AuthStore>
          <AuthProvider>
            <SearchProvider>
              <Main />
              <Toaster />
              <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
                <Route path='/auth/account-activate/:token' element={<AccountActivate />} />
                <Route path='/auth/access-account/:token' element={<AccessAccount />} />
                <Route path='/auth/password-reset' element={<ForgotPassword />} />
                <Route path='/' element={<PrivateRoute />} >
                  <Route path='dashboard' element={<Dashboard />} />
                  <Route path='ad/create' element={<CreateAd />} />
                  <Route path='ad/create/sell' element={<SellHouse />} />
                  <Route path='ad/create/rent' element={<RentHouse />} />
                  <Route path="user/profile" element={<Profile />} />
                  <Route path="user/change-password" element={<ChangePassword />} />
                  <Route path="user/ad/:slug" element={<AdEdit />} />
                  <Route path="user/wishlist" element={<Wishlist />} />
                  <Route path="user/enquiries" element={<Enquiries />} />
                </Route>
                <Route path='/ad/:slug' element={<AdView />} />
                <Route path="/search" element={<Search />} />
                <Route path='/buy' element={<Buy />} />
                <Route path='/rent' element={<Rent />} />
                <Route path='*' element={<Page404 />} />
              </Routes>
              <Footer />
            </SearchProvider>
          </AuthProvider>
        </AuthStore>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;