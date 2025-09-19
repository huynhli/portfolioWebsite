import { Routes, Route, Outlet } from 'react-router-dom'
// import Header from './components/Header.tsx'
// import Footer from './components/Footer.tsx'
import HomePage from './pages/HomePage.tsx'
// import ProjectsPage from './pages/ProjectsPage.tsx'
import BlogPage from './pages/BlogPage.tsx'
import ProjectsPage from './pages/ProjectsPage.tsx'
import Header from './components/Header.tsx'
import AboutPage from './pages/AboutPage.tsx'
import useScrollToTop from './hooks/useScrollToTop.tsx'
import ArticleTemplatePage from './pages/ArticleTemplatePage.tsx'
import ArticleFooter from './components/ArticleFooter.tsx'
import ImageUpload from './pages/ImageUpload.tsx'
// import AboutPage from './pages/AboutPage.tsx'
// import ImageUpload from './pages/ImageUpload.tsx'
// import ArticleFooter from './components/ArticleFooter.tsx'
// import ArticleTemplatePage from './pages/ArticleTemplatePage.tsx'

export default function App() {
  // defining default layout
  const Layout = () => {
    return (
      <div>
        <Header/>
        <Outlet/>
        {/* <Footer/> */}
      </div>  
    )
  }

  useScrollToTop()

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
        <Route index element={<HomePage />} />
        <Route path="/" element={<Layout />}>
          <Route path="projects" element={<div><Outlet /></div>}>
            <Route index element={<ProjectsPage />} />
            <Route path="gameDesignBlog" element={<BlogPage />} />
            <Route path="gameDesignBlog/article" element={<ArticleLayout />}>
              <Route index element={<ArticleTemplatePage />} />
            </Route>
          </Route>
          <Route path="about" element={<AboutPage />} />
          <Route path="imageUpload" element={<ImageUpload />} />
        </Route>
      </Routes>
    </div>
  );
}