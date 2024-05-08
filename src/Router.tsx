import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import SphereBox from "./SphereBox"; // Test1 컴포넌트 import

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/test" element={<SphereBox />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
