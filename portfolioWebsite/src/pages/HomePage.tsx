import { useState, useEffect } from "react"

export default function HomePage() {
    const [allArticles, setAllArticles] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [loadingText, setLoadingText] = useState<string>("Loading main page.")

    const getArticleBanners = async () => {
        try {
            setIsLoading(true)
            const responseObj = await fetch('https://liamportfolioweb.onrender.com/api/articleBanners')
            const articleBanners = await responseObj.json()
            setAllArticles(articleBanners)
            setAllArticles(["Hey there's no articles rn"])
        } catch(error) {
            console.error('Error fetching: ', error)
            setAllArticles(["Hey!", "Something", "is", "wrong", "with", "this!"])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        getArticleBanners()
    }, [])

    useEffect(() => {
        if (!isLoading) return
        const loadingTextArray = ["Loading main page.", "Loading main page..", "Loading main page..."]
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
                    <h2 className="self-center my-30 text-3xl w-170 mx-5 bg-purple-300 text-white rounded-lg p-5">
                        Hi, I'm Liam - a game developer and designer as well as a full-stack web developer passionate about creating engaging experiences and bringing ideas to life.
                    </h2>
            </div>

            {/* article section */}
            <div className="flex justify-center p-4">
                {/* responsive grid container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {isLoading ? ( 
                        <div className="col-span-full text-center py-8 mb-5 text-3xl font-bold">{loadingText}</div>
                        ) : allArticles.length > 0 ? (
                            // Map through all articles
                            allArticles.map((article, i) => (
                                <div key={i} className="bg-blue-400 p-4 h-20 mb-30 flex items-center justify-center text-white font-bold rounded-md shadow-md hover:bg-blue-500 transition-colors">
                                    <p>{article}</p>
                                </div>
                            ))
                        ) : (
                        <div className="col-span-full text-center py-8 mb-5 text-3xl font-bold">No articles found</div>
                    )}
                </div>
            </div>
        </div>
    )
}