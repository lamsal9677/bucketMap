import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './homePage/homePage'; // Update the import
import MapPage from './mapPage/mapPage'; // Update the import
import './App.css'

function App() {

  return (
    <Router>
      <div className="hero min-h-screen bg-base-200 bg-neutral-focus">

        <Routes>
          <Route path="/" element={<div className="hero-content flex-col lg:flex-row">
            <img src="src\assets\bucketMascot.jpeg" className="max-w-sm rounded-lg shadow-2xl" />
            <div>
              <h1 className="text-5xl font-bold text-accent">Bucket Map</h1>
              <p className="py-6 text-accent">Scratch items off your bucket list with every trip!</p>
              <Link to="/homePage" role="button" className="btn btn-accent text-black">BEGIN</Link>
            </div>
          </div>} />
          <Route path="/homePage" element={<HomePage />} />
          <Route path="/mapPage" element={<MapPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
