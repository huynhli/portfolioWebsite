import '../main.css'
import { useState, type FormEvent } from 'react'

export default function ImageUpload() {
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

    const uploadFileButtonClick = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        if (!imgData) {
            setUploadResult({error: "No file uploaded"})
            return
        }

        const formData = new FormData()
        formData.append("image", imgData)

        try {
            const res = await fetch("http://localhost:8080/api/uploadImage", {
                method: "POST",
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

        if (!publicIdToDelete.trim()) {
            alert("Please enter a public ID to delete")
            return
        }

        try {
            const res = await fetch("http://localhost:8080/api/deleteImage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ public_id: publicIdToDelete }),
            })

            const data = await res.json()
            if (res.ok) {
                alert("Deleted successfully")
                setPublicIdToDelete("")
            } else {
                alert("Error: " + data.message)
            }
        } catch (error: any) {
            alert("Delete failed: " + error.message)
        }
    }


    return (
        <div className=''>
            <div className='flex flex-col bg-green-400'>
                <h2 className='flex justify-center bg-purple-400'>Upload an Image</h2>
                <form className='flex justify-center' onSubmit={uploadFileButtonClick}>
                    <input className='bg-gray-200 hover:bg-gray-400 active:bg-gray-600'
                        type="file"
                        accept="image/*"
                        onChange={(e) =>
                            setImgData(e.target.files ? e.target.files[0] : null)
                        }
                        required
                    />
                    <button className='bg-gray-200 hover:bg-gray-400 active:bg-gray-600' type="submit">Upload</button>
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
                <h2 className='text-lg font-semibold text-center bg-purple-400'>Delete an Image</h2>
                <form className='flex flex-col items-center space-y-2' onSubmit={deleteFileButtonClick}>
                    <input
                        className='px-2 py-1 bg-gray-200 rounded w-full max-w-sm'
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
            </div>
        </div>
    );
}