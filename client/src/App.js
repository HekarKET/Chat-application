import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import OnBoarding from './Component/OnBoarding';
import './Component.css'
import Dashboard from './Component/Dashboard';

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path='/' element={<OnBoarding/>} />
        <Route path={`/:name&:roomId`} element={<Dashboard/>} />

      </Routes>
    </Router>
    
    
    
    </>
  );
}

export default App;
