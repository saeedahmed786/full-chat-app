import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css'
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';
import { Navbar } from './components/nav/Navbar';
import AdminRoute from './routes/AdminRoute';
import { Users } from './pages/admin/Users/Users';
import { Profile } from './pages/profile/Profile';
import { SendResetPasswordLink } from './pages/auth/Forgot-Password/SendResetPasswordLink';
import { UpdatePassword } from './pages/auth/Forgot-Password/UpdatePassword';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <div>
            <Navbar />
            <div style = {{marginTop: '100px'}}>
          <Switch>
            <Route exact path='/login' component={Login} />
            <Route exact path='/signup' component={Signup} />
           <Route exact path = '/reset-password' component = {SendResetPasswordLink}/>
           <Route exact path = '/update/:token' component = {UpdatePassword}/>
            <AdminRoute exact path = '/admin/users' component = {Users}/>
            <Route exact path = '/profile/:id' component = {Profile}/>
          </Switch>
        </div>
        </div>
      </BrowserRouter>
    </div>

  )
}

export default App;