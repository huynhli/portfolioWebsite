import { useState, useEffect } from "react"
export default function HomePage() {
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
                    <h2 className="self-center my-30 text-3xl w-170 mx-5 bg-green-400">
                        Hi, I'm Liam - a game developer and designer passionate about creating engaging experiences and bringing ideas to life.
                    </h2>
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
                                <div key={i} className="bg-blue-400 p-4 h-20 mb-30 flex items-center justify-center text-white font-bold rounded-md shadow-md hover:bg-blue-500 transition-colors">
                                    <p>{article}</p>
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