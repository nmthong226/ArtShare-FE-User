import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ExploreGallery from "@/features/exlore-gallery/ExploreGallery";
import PostDetails from "./features/post-details/PostDetails";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to="/explore/gallery" />} />
          <Route path="/explore/gallery" element={<ExploreGallery />} />
          <Route path="posts/:post-id" element={<PostDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
