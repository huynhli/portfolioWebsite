import { useScroll, useTransform } from "framer-motion"
import Landing from "../components/Landing" 
import Roadmap from "../components/Roadmap"

export default function HomePage() {
    
    

    const { scrollYProgress } = useScroll()
    const page2Slide = useTransform(scrollYProgress, [0, 0.6], [window.innerHeight, 0])

    return (
        <div className='relative flex flex-col'>
            {/* landing */}
            <Landing/>

            {/* Roadmap-y section */}
            <Roadmap slideTransform={page2Slide}/>
            
            
        </div>
    )
}
        {/* 
            <div className="flex justify-center p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {isLoading ? ( 
                        <div className="col-span-full text-center py-8 mb-5 text-3xl font-bold"><p>{loadingText} If nothing loads for a while, please load <a href='https://liamportfolioweb.onrender.com/' className='text-blue-400 hover:text-blue-500 underline'>this page</a> and come back.</p></div>
                        ) : allArticles.length > 0 ? (
                            allArticles.map((article, i) => (
                                <div key={i} onClick={goToArticle(article.id)} className="group relative hover:cursor-pointer transition-transform duration-300 hover:scale-104 flex flex-col bg-purple-400 p-4 min-h-20 mb-30 items-center justify-center font-bold rounded-md shadow-md">
          
                                    <div className="absolute inset-0 bg-white bg-opacity-40 opacity-0 active:opacity-30 transition-opacity duration-200 z-20 rounded-md"></div>

     
                                    <div className="relative overflow-hidden w-full rounded-md mb-3">
                                        <img src={article.cover} className="w-full h-80 object-cover z-10" />
                                    </div>
                                    <p className="z-10 relative">{article.title}</p>
                                    <p className="z-10 relative">{article.date}</p>
                                </div>
                            ))
                        ) : (
                        <div className="col-span-full text-center py-8 mb-5 text-3xl font-bold">No articles found</div>
                    )}
                </div>
            </div> */}

     // const bottomWavesSpring = useSpring(bottomWavesY, { stiffness: 100, damping: 10})
    // stiffness = spring force, damping = resistance 

    // const [allArticles, setAllArticles] = useState<{
    //     id: string
    //     title: string
    //     date: string
    //     cover: string
    // }[]>([])
    // const [isLoading, setIsLoading] = useState(true)
    // const [loadingText, setLoadingText] = useState<string>("Loading main page.")

    // const getArticleBanners = async () => {
    //     try {
    //         setIsLoading(true)  
    //         const responseObj = await fetch('https://liamportfolioweb.onrender.com/api/articleBanners')
    //         const articleBanners = await responseObj.json()
    //         setAllArticles(articleBanners)
    //     } catch(error) {
    //         console.error('Error fetching: ', error)
    //         setAllArticles([
    //         {
    //             id: "error",
    //             title: "Something went wrong",
    //             date: new Date().toISOString().split('T')[0],
    //             cover: ''
    //         }
    //         ])
    //     } finally {
    //         setIsLoading(false)
    //     }
    // }
    
    // const goToArticle = (article_id: String) => {
    //     // string windowToGoTo = backendcall(pagenum)
    //     return () => {
    //         window.location.href = `/BlogArticle/Article?artid=${article_id}` 
    //     }
    // }

    // useEffect(() => {
    //     getArticleBanners()
    // }, [])

    // useEffect(() => {
    //     if (!isLoading) return
    //     const loadingTextArray = ["Loading main page.", "Loading main page..", "Loading main page..."]
    //     let index = 0

    //     const interval = setInterval(() => {
    //         index = (index + 1) % loadingTextArray.length
    //         setLoadingText(loadingTextArray[index])
    //     }, 500)

    //     return () => clearInterval(interval)
    // }, [isLoading])
