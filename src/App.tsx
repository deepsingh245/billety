import { Suspense } from 'react'
import { routes } from "./routes";
import './App.css'
import { HashRouter, useRoutes } from 'react-router-dom';

function RoutesWrapper() {
  const element = useRoutes(routes);
  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;
}

function App() {

    return (
    <HashRouter>
      <RoutesWrapper />
    </HashRouter>
  );

}

export default App
