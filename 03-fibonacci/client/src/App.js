import {
  BrowserRouter as Router, Link, Route
} from 'react-router-dom';
import './App.css';
import Fib from './Fib';
import OtherPage from './OtherPage';

function App() {
  return (
    <Router>
      <div className="App">
        <div className="Header">
          <h2>Fib Calculator</h2>
          <nav className="NavBar">
            <Link to="/" className="App-Link">Home</Link>
            <Link to="/otherpage" className="App-Link">Other Page</Link>
          </nav>
        </div>
        <div>
          <Route exact path="/" component={Fib} />
          <Route path="/otherpage" component={OtherPage} />
        </div>
      </div>
    </Router>
  );
}

export default App;
