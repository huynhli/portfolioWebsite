import { useLocation } from 'react-router-dom'
import '../main.css'
import { useEffect, useState } from 'react'

export default function ArticleTemplatePage() {
    const [isLoading, setIsLoading] = useState(true)
    const [loadingText, setLoadingText] = useState<string>("")
    const [articleInfo, setArticleInfo] = useState({
        title: "",
        date: "",
        content: [] as { type: string; data: string }[],
    })

    // get article id to call from query
    const query = useLocation()
    const pairedParams = new URLSearchParams(query.search)
    const article_id = pairedParams.get("artid")

    // call article from db by cloud
    const grabArticle = async () => {
        try {
            setIsLoading(true)
            console.log(article_id)
            const respObj = await fetch(`https://liamportfolioweb.onrender.com/api/getArticleWithID?artid=${article_id}`)
            const articleInfoFromDB = await respObj.json()
            setArticleInfo(articleInfoFromDB)
            console.log("hey")
            console.log(articleInfoFromDB)
        } catch (error) {
            console.error('Error fetching: ', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        grabArticle()
    }, [])
    

    useEffect(() => {
        if (!isLoading) return
        const textArray = ["Loading article page.", "Loading article page..", "Loading article page..."]
        let index = 0

        const interval = setInterval(() => {
            index = (index + 1) % textArray.length
            setLoadingText(textArray[index])
        }, 500)
        return () => clearInterval(interval)
    }, [isLoading])

    return (
        <div className='flex justify-center'>
            <div className='flex flex-col max-w-200 mx-10 my-10'>
                { isLoading ? ( 
                    <div className="col-span-full text-center py-8 mb-5 text-3xl font-bold">{loadingText} loading</div>
                ) : (
                    <div>
                        <p className='flex justify-center text-3xl font-bold'>{articleInfo.title}</p>
                        <p className='flex justify-center text-xl italic mt-3 mb-15'>{articleInfo.date}</p>
                        {articleInfo.content.map((contentBlock, _) => (
                            contentBlock.type === "Text" ? (
                                <div>
                                    <p className='text-lg my-2'>{contentBlock.data}</p>
                                </div>
                            ) : contentBlock.type === "Image" ? (
                                <div>
                                    <img src={contentBlock.data} alt='img here' />
                                </div>
                            ) : contentBlock.type === "Subheading" ? (
                                <div>
                                    <p className='text-xl font-bold mt-4'>{contentBlock.data}</p>
                                </div>
                            ) : (
                                <div>
                                    <p className='text-2xl font-bold mt-4'>{contentBlock.data}</p>
                                </div>
                            )
                        ))}
                        
                    </div>
                )

                }
            </div>
        </div>
    )
}