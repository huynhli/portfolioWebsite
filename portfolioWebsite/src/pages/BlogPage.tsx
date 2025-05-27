import '../main.css'
import { useState, useEffect } from 'react'

export default function ProjectsPage() {
    // const goToArticle = (pageNum) => {
    const goToArticle = (article_id: String) => {
        // string windowToGoTo = backendcall(pagenum)
        return () => {
            window.location.href = `/BlogArticle/Article?artid=${article_id}` 
        }
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

    const [loadingText, setLoadingText] = useState<string>("Loading articles.")
    useEffect(() => {
        if (!isLoading) return
        const loadingTextArray = ["Loading articles.", "Loading articles..", "Loading articles..."]
        let index = 0

        const interval = setInterval(() => {
            index = (index + 1) % loadingTextArray.length
            setLoadingText(loadingTextArray[index])
        }, 500)

        return () => clearInterval(interval)
    }, [isLoading])


    return (
        <div className='min-h-screen'>
            {/* description section */}
            <div className="flex justify-center">
                    <div className='flex flex-col items-center justify-center my-30 text-3xl h-40 w-160 mx-5 bg-purple-300 rounded-lg'>
                        <h2 className="flex items-center justify-center text-3xl text-center mb-2 font-semibold text-white">Welcome to my blog!</h2>
                        <p className='flex items-center justify-center text-2xl mx-15 text-center font-medium text-white'>Here you'll find articles on games and features that catch my interest.</p>
                    </div>
            </div>

            {/* article section */}
            <div className="flex justify-center p-4">
                {/* responsive grid container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {isLoading ? ( 
                        <div className="col-span-full py-8 mb-5">
                            <p className='text-center '>{loadingText}</p>
                            <p className='text-center '>If this page has trouble loading, please wait up to a minute or opt to load my backend <a href='https://liamportfolioweb.onrender.com/' className='text-blue-400 hover:text-blue-500'>here</a></p>
                        </div>
                        ) : allArticles.length > 0 ? (
                            // Map through all articles
                            allArticles.map((article, i) => (
                                <button key={i} onClick={goToArticle(article.id)} className="flex flex-col bg-blue-400 p-4 h-20 mb-30 flex items-center justify-center text-white font-bold rounded-md shadow-md hover:bg-blue-500 transition-colors cursor-pointer">
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