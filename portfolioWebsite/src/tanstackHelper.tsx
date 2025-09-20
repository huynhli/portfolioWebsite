import axiosHelper from "./axiosHelper"

// articles
export const getAllBlogPosts = async () => {
    const res = await axiosHelper.get("/articles")
    return res.data // res.json's data obj
}

export const getBlogPost = async (blogID : string | null) => {
    const res = await axiosHelper.get(`/articles/${blogID}`)
    return res.data
}

// export const deleteBlogPostByID = async (blogID : number) => {
//     const res = await axiosHelper.delete(`/articles/${blogID}`)
//     return res.data
// }

// export const createPost = async (newPost: {title: string, body: string}) => {
//     const res = await axiosHelper.post(`/articles/${id}`)
//     return res.data
// }

