import { useLocation } from 'react-router-dom'
import './main.css'
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
            const respObj = await fetch(`https://liamportfolioweb.onrender.com/api/getArticleWithID?artid=${article_id}`)
            const articleInfoFromDB = await respObj.json()
            setArticleInfo(articleInfoFromDB)
        } catch (error) {

        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        grabArticle
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
        <div>
            <div>
                { isLoading ? (
                    <div className="col-span-full text-center py-8 mb-5 text-3xl font-bold">{loadingText}</div>
                ) : (
                    <div>
                        <h1>{articleInfo.title}</h1>
                        <h2>{articleInfo.date}</h2>
                        {articleInfo.content.map((contentBlock, _) => (
                            contentBlock.type === "Text" ? (
                                <div>
                                    <p>{contentBlock.data}</p>
                                </div>
                            ) : contentBlock.type === "Image" ? (
                                <div>
                                    <img src={contentBlock.data} alt='img here' />
                                </div>
                            ) : contentBlock.type === "Subheading" ? (
                                <div>
                                    <h4>{contentBlock.data}</h4>
                                </div>
                            ) : (
                                <div>
                                    <h3>{contentBlock.data}</h3>
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