export const RESUME_DOCUMENTS = {
    fullStack: {
        title: "Full Stack Engineer",
        url: "/LiamHuynh_Resume_Full-StackEngineer.pdf",
    },
    devOps: {
        title: "DevOps",
        url: "/LiamHuynh_Resume_DevOps.pdf",
    },
} as const

export type ResumeDocument = (typeof RESUME_DOCUMENTS)[keyof typeof RESUME_DOCUMENTS]
