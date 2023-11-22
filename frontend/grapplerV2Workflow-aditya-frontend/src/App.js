import "./App.css";
import Stage from "./components/Stage/Stage";
import { Route, Routes, Outlet } from "react-router-dom";
import Project from "./components/Project/Project";
import NavBar from "./components/Project/NavBar";
import Header from "./components/Project/Header";
import { useEffect } from "react";
import YourReactComponent from "./Api/YourReactComponent";
import WebSocketComponent from "./Api/WebSocketService";
import ChatComponent from "./Api/WebSocketService";

function App() {

  return (
    <div className="App mainComponent">
      <WebSocketComponent/>
      <Routes>
        <Route>
          <Route path="projects/:projectId" element={<Project />} />
          <Route path="stages" element={<Stage />} />
        </Route>
      </Routes>
      <Header />
      <NavBar />
    </div>
  );
}

export default App;
