import { Suspense, useState } from 'react'
import { routes } from "@/routes";
import './App.css'
import { BrowserRouter, useRoutes } from 'react-router-dom';

function RoutesWrapper() {
  const element = useRoutes(routes);
  return <Suspense fallback={<div>Loading...</div>}>{element}</Suspense>;
}

function App() {
  const [count, setCount] = useState(0)

    return (
    <BrowserRouter>
      <RoutesWrapper />
    </BrowserRouter>
  );

}

export default App
