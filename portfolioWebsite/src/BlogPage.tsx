import './main.css'
import './Header.css'
import { useState, useEffect } from 'react'

export default function ProjectsPage() {
    // const goToArticle = (pageNum) => {
    const goToArticle = () => {
        // string windowToGoTo = backendcall(pagenum)
        const windowToGoTo = '/'
        window.location.href = windowToGoTo
    }

    const [allArticles, setAllArticles] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    const getArticles = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('backendlinkhere')
            const allArticlesData = await response.json()
            setAllArticles(allArticlesData)
        } catch(error) {    
            console.error('Error fetching: ', error)
            setError('Failed to load articles')
            setAllArticles(["Article 1", "Article 2", "Article 3", "Article 4", "Article 5", "Article 6"])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getArticles()
    }, [])

    return (
        <div className='min-h-screen'>
            {/* description section */}
            <div className="flex justify-center">
                    <div className='flex flex-col items-center justify-center my-30 text-3xl h-50 w-200 mx-5 bg-green-400'>
                        <h2 className="flex items-center justify-center text-3xl text-center">
                            Welcome to my blog!
                        </h2>
                        <p className='flex items-center justify-center text-2xl mx-15 text-center'>
                            Here you'll find articles on games and features that catch my interest.
                        </p>
                    </div>
                    
            </div>

            {/* article section */}
            <div className="flex justify-center p-4">
                {/* responsive grid container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {isLoading ? ( 
                        <div className="col-span-full text-center py-8 mb-5">Loading articles...</div>
                        ) : allArticles.length > 0 ? (
                            // Map through all articles
                            allArticles.map((article, i) => (
                                <button key={i} onClick={goToArticle} className="bg-blue-400 p-4 h-20 mb-30 flex items-center justify-center text-white font-bold rounded-md shadow-md hover:bg-blue-500 transition-colors cursor-pointer">
                                    {article}
                                </button>
                            ))
                        ) : (
                        <div className="col-span-full text-center py-8 mb-5">No articles found</div>
                    )}
                </div>
            </div>
        </div>

    )
}