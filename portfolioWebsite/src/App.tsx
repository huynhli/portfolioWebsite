import { Routes, Route, Outlet } from 'react-router-dom'
import Header from './components/Header.tsx'
import Footer from './components/Footer.tsx'
import HomePage from './pages/HomePage.tsx'
import ProjectsPage from './pages/ProjectsPage.tsx'
import BlogPage from './pages/BlogPage.tsx'
import AboutPage from './pages/AboutPage.tsx'
import ImageUpload from './pages/ImageUpload.tsx'
import ArticleFooter from './components/ArticleFooter.tsx'
import ArticleTemplatePage from './pages/ArticleTemplatePage.tsx'

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

  const ArticleLayout = () => {
    return (
      <div>
        <Outlet/>
        <ArticleFooter/>
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
          <Route path="/ImageUpload" element={<ImageUpload />} />
          <Route path="/BlogArticle" element={<ArticleLayout />} />
            <Route path="/Article" element={<ArticleTemplatePage />} />
        </Route>
      </Routes>
    </div>
  );
}