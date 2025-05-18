import '../main.css'
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
    // const [error, setError] = useState<string | null>(null)
    
    const getArticles = async () => {
        try {
            setIsLoading(true)
            const response = await fetch('backendlinkhere')
            const allArticlesData = await response.json()
            setAllArticles(allArticlesData)
        } catch(error) {
            console.error('Error fetching: ', error)
            // setError('Failed to load articles')
            setAllArticles([])
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
                    <h2 className="flex items-center justify-center my-30 text-6xl h-40 w-160 mx-5 bg-purple-300 rounded-lg">
                        Projects
                    </h2>
            </div>

            {/* article section */}
            <div className="flex justify-center p-4">
                {/* responsive grid container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {isLoading ? ( 
                        <div className="col-span-full text-center py-8 mb-5 text-3xl font-bold">Loading articles...</div>
                        ) : allArticles.length > 0 ? (
                            // Map through all articles
                            allArticles.map((article, i) => (
                                <button key={i} onClick={goToArticle} className="bg-blue-400 p-4 h-20 mb-30 flex items-center justify-center text-white font-bold rounded-md shadow-md hover:bg-blue-500 transition-colors cursor-pointer">
                                    {article}
                                </button>
                            ))
                        ) : (
                        <div className="col-span-full text-center py-8 mb-5 text-3xl font-bold">No projects found. Please check back another time.</div>
                    )}
                </div>
            </div>
        </div>

    )
}