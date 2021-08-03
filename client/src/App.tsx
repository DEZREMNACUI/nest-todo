import React, { FC, useEffect, useState } from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom'
import Todo from "./pages/Todo"
import Login from "./pages/Login"
import AuthContext from "./contexts/AuthContext"
import useAuth from "./hooks/useAuth"
import AuthButton from "./Components/AuthButton"
import PrivateRoute from "./Components/PrivateRoute"
import Admin from './pages/Admin';
import AdminRoute from './Components/AdminRoute';
import http from './http';
import { CountRsp } from '../types/Common';

const App: FC = () => {
  const auth = useAuth();

  const [count, setCount] = useState(0);

  const updateAndGetCount = async () => {
    http.post('/count').then();

    const { data } = await http.get<CountRsp>('/count');
    setCount(data.count);
  }

  useEffect(() => {
    updateAndGetCount().then();
  }, []);

  return (
    <AuthContext.Provider value={auth}>
      <Router>
        {auth.isAdmin && (
          <header>
            <Link to="/admin">管理员页面</Link>
          </header>
        )}
        <div>
          <header>访问量：{count}</header>

          <AuthButton />

          <Switch>
            <PrivateRoute exact path="/">
              <Todo />
            </PrivateRoute>
            <Route path="/login">
              <Login />
            </Route>
            <AdminRoute path="/admin">
              <Admin />
            </AdminRoute>
          </Switch>
        </div>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;
