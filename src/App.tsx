import { Suspense } from "react";
import { routes } from "./routes";
import "./App.css";
import { HashRouter, useRoutes } from "react-router-dom";
import { GlobalUIProvider } from "./context/globalUIContext";
import { DataProvider } from "./context/dataContext";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary";

function RoutesWrapper() {
  const element = useRoutes(routes);
  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;
}

function App() {
  return (
    <HashRouter>
      <GlobalUIProvider>
        <ErrorBoundary>
          <DataProvider>
            <RoutesWrapper />
          </DataProvider>
        </ErrorBoundary>
      </GlobalUIProvider>
    </HashRouter>
  );
}

export default App;
