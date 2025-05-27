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
        cover: string
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
                date: new Date().toISOString().split('T')[0],
                cover: ''
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
                        <h2 className="flex items-center justify-center text-3xl text-center mb-2 font-semibold">Welcome to my blog!</h2>
                        <p className='flex items-center justify-center text-2xl mx-15 text-center font-medium'>Here you'll find articles on games and features that catch my interest.</p>
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
                                <div key={i} onClick={goToArticle(article.id)} className="relative hover:cursor-pointer transition-transform duration-300 hover:scale-104 flex flex-col bg-purple-400 p-4 min-h-20 mb-30 items-center justify-center  font-bold rounded-md shadow-md hover:bg-purple-400 transition-colors">
                                    <div className="absolute inset-0 bg-white opacity-0 active:opacity-30 transition-opacity duration-200 z-20 rounded-md"></div>
                                    <div className='overflow-hidden w-full rounded-md mb-3'>
                                        <img src={article.cover} className='w-full h-80 object-cover'/>
                                    </div>
                                    <p>{article.title}</p>
                                    <p>{article.date}</p>
                                </div>
                            ))
                        ) : (
                        <div className="col-span-full text-center py-8 mb-5">No articles found</div>
                    )}
                </div>
            </div>
        </div>

    )
}