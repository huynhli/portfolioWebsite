import { useLocation } from 'react-router-dom'
import '../main.css'
import { useEffect, useState, type FormEvent } from 'react'

export default function ImageUpload() {
    // oauth logic
    const location = useLocation()
    const [token, setToken] = useState<string | null>(localStorage.getItem("jwt"))

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const jwt = params.get("token")
        if (jwt) {
            localStorage.setItem("jwt", jwt)
            setToken(jwt)
            window.history.replaceState({}, "", "/imageUpload") // clean URL
        }
    }, [location.search])

    const logout = () => {
        localStorage.removeItem("jwt")
        setToken(null)
    }

    // images logic
    const [imgData, setImgData] = useState<File | null>(null)
    const [publicIdToDelete, setPublicIdToDelete] = useState<string>("")
    const [uploadResult, setUploadResult] = useState<{
        url?: string
        public_id?: string
        format?: string
        width?: number
        height?: number
        error?: string
    } | null>(null)
    const [imageArrayIndex, setImageArrayIndex] = useState<number | undefined>(undefined)
    const [imagesInDBCloud, setImagesInDBCloud] = useState<{
        url?: string
        public_id?: string
        format?: string
        width?: number
        height?: number
        error?: string
    }[]>([])

    const uploadFileButtonClick = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log("Upload submit triggered")
        if (!imgData) {
            setUploadResult({ error: "No image selected." });
            return;
        }
        if (!token) {
            setUploadResult({ error: "You must be logged in to upload." });
            return;
        }
        if (!imgData) {
            setUploadResult({error: "No file uploaded"})
            return
        }

        const formData = new FormData()
        formData.append("image", imgData)
        console.log("Uploading file:", imgData);
        try {
            const res = await fetch("https://liamportfolioweb.onrender.com/api/uploadImage", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await res.json();

            if (res.ok) {
                setUploadResult({
                    url: data.url,
                    public_id: data.public_id,
                    format: data.format,
                    width: data.width,
                    height: data.height
                });
            } else {
                setUploadResult({ error: data.message || "Unknown error" });
            }
        } catch (error: any) {
            setUploadResult({ error: "Upload failed: " + error.message });
        }
    }

    const deleteFileButtonClick = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        if (!publicIdToDelete.trim() || !token) return

        if (!publicIdToDelete.trim()) {
            alert("Please enter a public ID to delete")
            return
        }

        try {
            const res = await fetch("https://liamportfolioweb.onrender.com/api/deleteImage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ public_id: publicIdToDelete }),
            })

            const data = await res.json()
            if (res.ok) {
                alert("Deleted successfully")
                setPublicIdToDelete("")
                setImagesInDBCloud((prev) => {
                    const updated = prev.filter(img => img.public_id !== publicIdToDelete);

                    if (imageArrayIndex !== undefined && imageArrayIndex >= updated.length) {
                        setImageArrayIndex(updated.length === 0 ? undefined : updated.length - 1);
                    }

                    return updated;
                });
            } else {
                alert("Error: " + data.message)
            }
        } catch (error: any) {
            alert("Delete failed: " + error.message)
        }
    }

    const getImagesFromDBCloud = async() => {
        console.log("getting images");
        try {
            const res = await fetch("https://liamportfolioweb.onrender.com/api/getImageMetaDatas", {
                method: "GET",
            });
            const data = await res.json();
            if (res.ok && Array.isArray(data)) {
                setImagesInDBCloud(data);
            } else {
                setImagesInDBCloud([]);
            }
        } catch (error: any) {
            setImagesInDBCloud([]);
        }
        
    }

    useEffect(() => {
        getImagesFromDBCloud()
    }, [])

    useEffect(() => {
        if (imagesInDBCloud.length > 0) {
            setImageArrayIndex(0)
        }
    }, [imagesInDBCloud])

    // article logic
    const [articleToSubmit, setArticleToSubmit] = useState({
        title: "",
        date: "",
        content: [] as { type: string; data: string }[],
    });
    const [articleUploadResult, setArticleUploadResult] = useState<string>("")
    const [articleIdToDelete, setArticleIdToDelete] = useState<string>("")

    const addContentBlock = () => {
        setArticleToSubmit(prev => ({
            ...prev,
            content: [...prev.content, { type: "Text", data: "" }],
        }));
    };

    const updateContentBlock = (index: number, field: "type" | "data", value: string) => {
        const updated = [...articleToSubmit.content];
        updated[index][field] = value;
        setArticleToSubmit(prev => ({ ...prev, content: updated }));
    };

    const submitArticle = async(event: FormEvent <HTMLFormElement>) =>  {
        console.log("submitting article")
        event.preventDefault();
        try {
            const res = await fetch("https://liamportfolioweb.onrender.com/api/addArticle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(articleToSubmit),
            });
            const data = await res.json();
            console.log("trying")
            setArticleUploadResult(data)
            if (res.ok) {
                alert("Uploaded article successfully")
                console.log(articleUploadResult)
                // reset article var
                // reset content blocks
                setArticleToSubmit({"title": "", "date": "", "content": []})
            } else {
                    alert("Error: " + data.message)
                    console.log(articleToSubmit)
            }
        } catch(error: any) {
            alert("Article upload failed: " + error.message)    
        }
    }

    const deleteArticle = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log("deleting article")
        if (!articleIdToDelete.trim() || !token) {
            alert("no token?")
            return
        }
        if (!articleIdToDelete.trim()) {
            alert("Please enter an article ID to delete")
            return
        }

        try {
            const res = await fetch("https://liamportfolioweb.onrender.com/api/deleteArticle", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ article_id: articleIdToDelete }),
            })

            const data = await res.json()
            if (res.ok) {
                alert("Deleted successfully")
                setArticleIdToDelete("")
            } else {
                alert("Error: " + data.message)
            }
        } catch (error: any) {
            alert("Delete failed: " + error.message)
        }
    }

    return (
        <div className='min-h-screen'>
            <div className='flex flex-col bg-green-400'>

                {/* Login section */}
                <div className="flex justify-center mb-2">
                    {!token ? (
                        <a href="https://liamportfolioweb.onrender.com/api/auth/github/login">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                                Login with GitHub
                            </button>
                        </a>
                    ) : (
                        <button onClick={logout} className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-900">
                            Logout
                        </button>
                    )}
                </div>

                {/* Upload */}
                <h2 className='flex justify-center text-lg font-semibold text-center bg-purple-300'>Upload an Image</h2>
                <form className='flex justify-center' onSubmit={uploadFileButtonClick}>
                    <input className='bg-gray-200 hover:bg-gray-400 active:bg-gray-600 px-2'
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setImgData(e.target.files ? e.target.files[0] : null)
                        }
                        required
                    />
                    <button className='bg-gray-200 hover:bg-gray-400 active:bg-gray-600 px-2' type="submit">Upload</button>
                </form>

                <div id="result" style={{ marginTop: "1rem" }}>
                    {uploadResult?.url && (
                        <div className="text-center">
                            <p className="font-bold">Upload successful!</p>
                            <img src={uploadResult.url} alt="Uploaded" className="max-w-xs mx-auto rounded" />
                            <p>URL: <a href={uploadResult.url} target="_blank" rel="noopener noreferrer" className="underline">{uploadResult.url}</a></p>
                            <p>Public ID: <code className="bg-gray-200 px-2 py-1 rounded">{uploadResult.public_id}</code></p>
                            <p>Format: {uploadResult.format}</p>
                            <p>Dimensions: {uploadResult.width} × {uploadResult.height}</p>
                        </div>
                    )}
                </div>

                 {/* Delete */}
                <h2 className='flex justify-center text-lg font-semibold text-center bg-purple-300'>Delete an Image</h2>
                <form className='flex flex-col items-center space-y-2' onSubmit={deleteFileButtonClick}>
                    <input
                        className='px-2 py-1 bg-gray-200 rounded w-full max-w-sm text-center'
                        type="text"
                        placeholder="Enter public_id to delete"
                        value={publicIdToDelete}
                        onChange={(e) => setPublicIdToDelete(e.target.value)}
                        required
                    />
                    <button className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600' type="submit">
                        Delete Image
                    </button>
                </form>
                
                {/* display images slideshow with two buttons */}
                {/* get images button */}
                <div className='my-4 flex flex-col items-center bg-red-400'>
                    <button className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600' onClick={getImagesFromDBCloud}>Get Images</button>
                
                    {/* current image */}
                    <div className='mt-1'>
                        {imagesInDBCloud.length > 0 && imageArrayIndex !== undefined ? (
                            <div>
                                <img src={imagesInDBCloud[imageArrayIndex].url} alt="Here" className="max-w-xs mx-auto rounded" />
                                <p>Public ID: <code className="bg-gray-200 px-2 py-1 rounded">{imagesInDBCloud[imageArrayIndex].public_id}</code></p>
                                <p>This is index: {imageArrayIndex}</p>
                            </div>
                        ) : (
                            <div>No images to show</div>
                        )}
                    </div>

                    {/* left and right button */}
                    <div>
                        <button className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600' onClick={() => setImageArrayIndex((prev) => (prev! - 1 + imagesInDBCloud.length) % imagesInDBCloud.length)}>Left</button>
                        <button className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600' onClick={() => setImageArrayIndex((prev) => (prev! + 1) % imagesInDBCloud.length)}>Right</button>
                    </div>
                </div>

                {/* upload/delete article */}
                <div className='flex flex-col bg-yellow-300 items-center mt-3'>
                    <form onSubmit={submitArticle}>
                        <div>
                            <input
                                type="text"
                                placeholder="Title"
                                value={articleToSubmit.title}
                                onChange={(e) => setArticleToSubmit(prev => ({ ...prev, title: e.target.value }))}
                            />
                            <input
                                type="text"
                                placeholder="Date"
                                value={articleToSubmit.date}
                                onChange={(e) => setArticleToSubmit(prev => ({ ...prev, date: e.target.value }))}
                            />
                        </div>

                        <div>
                        {articleToSubmit.content.map((block, index) => (
                            <div key={index} className="my-2">
                            <select
                                value={block.type}
                                onChange={(e) => updateContentBlock(index, "type", e.target.value)}
                            >
                                <option value="Heading">Heading</option>
                                <option value="Subheading">Subheading</option>
                                <option value="Text">Text</option>
                                <option value="Image">Image</option>
                            </select>
                            <input
                                className='w-full mb-4 bg-white'
                                type="text"
                                placeholder="Content"
                                value={block.data}
                                onChange={(e) => updateContentBlock(index, "data", e.target.value)}
                            />
                            </div>
                        ))}

                        <button type="button" className='ml-10 bg-blue-400 rounded-lg p-2 my-2 hover:bg-blue-500 active:bg-blue-600' onClick={addContentBlock}>Add Block</button>
                        <button type="submit" className='ml-10 bg-blue-400 rounded-lg p-2 my-2 hover:bg-blue-500 active:bg-blue-600'>Post Article</button>
                        </div>
                    </form>

                </div>
                {/* <div className='flex flex-col bg-yellow-300 items-center mt-3'> */}
                    <h2 className='flex justify-center text-lg font-semibold text-center bg-purple-300'>Delete an article</h2>
                    <form className='flex flex-col items-center space-y-2' onSubmit={deleteArticle}>
                        <input
                            className='px-2 py-1 bg-gray-200 rounded w-full max-w-sm text-center'
                            type="text"
                            placeholder="Enter article id to delete"
                            value={articleIdToDelete}
                            onChange={(e) => setArticleIdToDelete(e.target.value)}
                            required
                        />
                        <button className='px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600' type="submit">
                            Delete Article
                        </button>
                    </form>
                {/* </div> */}

                {/* upload/delete project */}
                <div className='flex flex-col bg-yellow-300 items-center'>
                    <button className='bg-blue-400 rounded-lg p-2 my-2 hover:bg-blue-500 active:bg-blue-600'>Post Project</button>
                </div>
            </div>
        </div>
    );
}