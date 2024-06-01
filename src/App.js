import { Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import './App.css';
import Header from './components/Header';
import Home from './components/Home';

function App() {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route path='/home' >
          <Home />
        </Route>
        <Route path='/' exact>
          <Login />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
