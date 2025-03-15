import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ExploreGallery from "@/features/exlore-gallery/ExploreGallery";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/explore/gallery" />} />
          <Route path="/explore/gallery" element={<ExploreGallery />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
