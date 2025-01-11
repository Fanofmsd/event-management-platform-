import Main from './Components/Main';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import LoginPage from './Components/LoginPage';

function App() {
  return (
    <Router>
	 <Routes><Route  path="/"   element={<LoginPage />}/>
	<Route path="/Main/" element={<Main/>}/>
 </Routes>
    </Router>
  );
}

export default App;
