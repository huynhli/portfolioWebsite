import { Routes, Route, Outlet } from 'react-router-dom';
import Header from './Header.tsx'
import Footer from './Footer.tsx'
import HomePage from './HomePage.tsx'
import ProjectsPage from './ProjectsPage.tsx'
import BlogPage from './BlogPage.tsx';
import AboutPage from './AboutPage.tsx';

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
            <Route path="/Projects" element={<ProjectsPage />} />
            <Route path="/Blog" element={<BlogPage />} />
            <Route path="/About" element={<AboutPage />} />
        </Route>
      </Routes>
    </div>
  );
}