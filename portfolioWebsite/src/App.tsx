import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import Header from './Header.tsx'
import Footer from './Footer.tsx'
import HomePage from './HomePage.tsx'

export default function App() {
  // defining default layout
  const Layout = () => {
    return (
      <div>
        <Header/>
        <Outlet/>
        <Footer/>
      </div>
    )
  }

  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
            <Route path="/" element={<HomePage />} />
        </Route>
      </Routes>
    </div>
  );
}