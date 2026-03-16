import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar/Navbar";
import "./App.css";

const App = () => {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <AppRoutes />
      </main>
    </div>
  );
};

export default App;
