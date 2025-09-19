import { motion } from 'framer-motion'
import StarBg from '../components/StarBg'
import '../main.css'
import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAllBlogPosts } from '../tanstackHelper'
import { useNavigate } from 'react-router-dom'

type article = {
    id: string
    title: string
    date: string
    cover: string
}

export default function ProjectsPage() {
    const navigate = useNavigate()
    const goToArticle = (article_id: String) => {
        navigate(`/projects/gameDesignBlog/Article?artid=${article_id}`)
    }

    // const [allArticles, setAllArticles] = useState<{
    //     id: string
    //     title: string
    //     date: string
    //     cover: string
    // }[]>([])
    // const [isLoading, setIsLoading] = useState(true)
    // const [error, setError] = useState<string | null>(null)
    
    // const getArticles = async () => {
    //     try {
    //         setIsLoading(true)
    //         const responseObj = await fetch('https://liamportfolioweb.onrender.com/api/v1/articles')
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
    

    // useEffect(() => {
    //     getArticles()
    // }, [])

    // // useQuery for GET, useMutation + queryClient for others

    const { data: allArticles = [], error, isLoading } = useQuery({
        queryKey: ["allPosts"],
        queryFn: () => getAllBlogPosts(),
    })

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
        <div className='text-white min-h-[200vh]'>
            <StarBg/>

            {/* description section */}
            <motion.div 
                className="flex justify-center"
                initial={{opacity: 0, y: -300}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 1, ease: "easeInOut"}}    
            >
                    <div className='flex flex-col items-center justify-center my-30 text-3xl h-auto mx-10 2xl:mx-[30%] bg-zinc-900 py-[2%] border-white border-1 rounded-lg'>
                        <h2 className="flex items-center justify-center text-6xl text-center mb-2 font-semibold">Blog</h2>
                        <p className='flex items-center justify-center text-3xl mx-15 text-center font-medium'>Here you'll find articles I write on games, features, and implementations that pique my interest.</p>
                    </div>
            </motion.div>

            {/* article section */}
            <div className="flex justify-center p-4">
                {/* responsive grid container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl">
                    {isLoading ? ( 
                        <div className="col-span-full text-center py-8 mb-5 text-3xl font-bold">
                            <p>{loadingText} <br/>If nothing loads for a while, please load <a href='https://liamportfolioweb.onrender.com/' className='text-blue-400 hover:text-blue-500 underline'>this page</a> and come back! Also maybe shoot me an email because then something is wrong lol</p>
                        </div>
                        ) : error ? (
                        <div className="col-span-full text-center py-8 mb-5 text-3xl font-bold">
                        <p>Error while fetching articles.</p>
                        </div>
                        ) : allArticles.length > 0 ? (
                            // Map through all articles
                            allArticles.map((article : article, i : number) => (
                                <motion.div
                                    tabIndex={i}
                                    role="button"
                                    onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault(); // prevent scrolling for space
                                        goToArticle(article.id);
                                        }
                                    }}
                                    key={i} 
                                    onClick={() => goToArticle(article.id)} 
                                    className="
                                        relative flex flex-col items-center justify-center
                                        bg-zinc-900 border-white border-1 p-4 min-h-20 mb-30 rounded-md
                                        font-bold shadow-md  
                                        hover:cursor-pointer
                                    "
                                    initial={{opacity: 0, y: 100}}
                                    whileHover={{ scale: 1.04}}
                                    animate={{ scale: 1, opacity: 1, y: 0 }}
                                    transition={{ scale: { duration: 0.2 }, y: {duration: 3+(i/20)}, opacity: {duration: 3.5+(i/20), ease:"easeInOut"}}}
                                >
                                    <div className="absolute inset-0 bg-white opacity-0 active:opacity-30 transition-opacity duration-200 z-20 rounded-md"></div>
                                    <div className='overflow-hidden w-full rounded-md mb-3'>
                                        <img src={article.cover} className='w-full h-80 object-cover'/>
                                    </div>
                                    <p>{article.title}</p>
                                    <p>{article.date}</p>
                                </motion.div>
                            ))
                        ) : (
                        <div className="col-span-full text-center py-8 mb-5">No articles found</div>
                    )}
                </div>
            </div>
        </div>

    )
}