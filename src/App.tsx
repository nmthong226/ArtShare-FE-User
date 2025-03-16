import "./App.css";
import { Routes, Route } from "react-router-dom";
import PostDetailsPage from "./pages/PostDetailsPage";

function App() {

  return (
    <>
      <Routes>
        <Route path="/post/:postId" element={<PostDetailsPage />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}

export default App;
