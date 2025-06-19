import { Suspense } from "react";
import { routes } from "./routes";
import "./App.css";
import { HashRouter, useRoutes } from "react-router-dom";
import { GlobalUIProvider } from "./context/globalUIContext";

function RoutesWrapper() {
  const element = useRoutes(routes);
  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;
}

function App() {
  return (
    <HashRouter>
      <GlobalUIProvider>
        <RoutesWrapper />
      </GlobalUIProvider>
    </HashRouter>
  );
}

export default App;
