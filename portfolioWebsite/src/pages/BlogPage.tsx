import '../main.css'
import { useState, useEffect } from 'react'

export default function ProjectsPage() {
    // const goToArticle = (pageNum) => {
    const goToArticle = () => {
        // string windowToGoTo = backendcall(pagenum)
        const windowToGoTo = '/'
        window.location.href = windowToGoTo
    }

    const [allArticles, setAllArticles] = useState<{
        id: string
        title: string
        date: string
    }[]>([])
    const [isLoading, setIsLoading] = useState(true)
    // const [error, setError] = useState<string | null>(null)
    
    const getArticles = async () => {
        try {
            setIsLoading(true)
            const responseObj = await fetch('https://liamportfolioweb.onrender.com/api/articleBanners')
            const articleBanners = await responseObj.json()
            setAllArticles(articleBanners)
        } catch(error) {
            console.error('Error fetching: ', error)
            setAllArticles([
            {
                id: "error",
                title: "Something went wrong",
                date: new Date().toISOString().split('T')[0]
            }
            ])
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
                    <div className='flex flex-col items-center justify-center my-30 text-3xl h-40 w-160 mx-5 bg-purple-300 rounded-lg'>
                        <h2 className="flex items-center justify-center text-3xl text-center mb-2 font-semibold">Welcome to my blog!</h2>
                        <p className='flex items-center justify-center text-2xl mx-15 text-center font-medium'>Here you'll find articles on games and features that catch my interest.</p>
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
                                <button key={i} onClick={goToArticle} className="flex flex-col bg-blue-400 p-4 h-20 mb-30 flex items-center justify-center text-white font-bold rounded-md shadow-md hover:bg-blue-500 transition-colors cursor-pointer">
                                    <p>{article.title}</p>
                                    <p>{article.date}</p>
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