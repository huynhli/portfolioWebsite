import { useEffect, useRef, useState } from "react"
import type Phaser from "phaser"
import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist"
import pdfWorkerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url"
import { GAME_EVENTS } from "./gameEvents"
import type { ResumeDocument } from "../../config/resumeDocuments"
import "./ResumePdfPanel.css"

type ResumePdfPanelProps = {
    game: Phaser.Game
    onClose: () => void
    resume: ResumeDocument
}

export function ResumePdfPanel({ game, onClose, resume }: ResumePdfPanelProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [popupBlocked, setPopupBlocked] = useState(false)
    const [pdf, setPdf] = useState<PDFDocumentProxy | null>(null)
    const [pdfError, setPdfError] = useState(false)
    const [viewerWidth, setViewerWidth] = useState(0)
    const selectedIndexRef = useRef(selectedIndex)
    const popupBlockedRef = useRef(popupBlocked)
    const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
    const pageContainerRef = useRef<HTMLDivElement | null>(null)
    const canvasRefs = useRef<Array<HTMLCanvasElement | null>>([])
    const actionsRef = useRef({ onClose, openInNewTab: () => {}, openHereInstead: () => {} })

    selectedIndexRef.current = selectedIndex
    popupBlockedRef.current = popupBlocked

    const openInNewTab = () => {
        const openedWindow = window.open(resume.url, "_blank")
        if (openedWindow) {
            openedWindow.opener = null
            setPopupBlocked(false)
            return
        }

        setPopupBlocked(true)
        setSelectedIndex(2)
    }

    const openHereInstead = () => window.location.assign(resume.url)

    actionsRef.current = { onClose, openInNewTab, openHereInstead }

    useEffect(() => {
        let cancelled = false
        let destroyLoadingTask: (() => void) | undefined

        setPdf(null)
        setPdfError(false)

        void import("pdfjs-dist").then(({ getDocument, GlobalWorkerOptions }) => {
            if (cancelled) return

            GlobalWorkerOptions.workerSrc = pdfWorkerUrl
            const loadingTask = getDocument({ url: resume.url })
            destroyLoadingTask = () => { void loadingTask.destroy() }

            return loadingTask.promise.then((document) => {
                if (!cancelled) setPdf(document)
            })
        }).catch(() => {
            if (!cancelled) setPdfError(true)
        })

        return () => {
            cancelled = true
            destroyLoadingTask?.()
        }
    }, [resume.url])

    useEffect(() => {
        const container = pageContainerRef.current
        if (!container) return

        const updateWidth = () => setViewerWidth(container.clientWidth)
        updateWidth()

        if (typeof ResizeObserver === "undefined") {
            window.addEventListener("resize", updateWidth)
            return () => window.removeEventListener("resize", updateWidth)
        }

        const observer = new ResizeObserver(updateWidth)
        observer.observe(container)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!pdf || viewerWidth <= 0) return

        let cancelled = false
        const renderTasks: RenderTask[] = []
        const outputScale = Math.min(window.devicePixelRatio || 1, 2)

        const renderPages = async () => {
            for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
                const canvas = canvasRefs.current[pageNumber - 1]
                if (!canvas) continue

                const page = await pdf.getPage(pageNumber)
                if (cancelled) return

                const baseViewport = page.getViewport({ scale: 1 })
                const scale = Math.min(Math.max(viewerWidth - 32, 1) / baseViewport.width, 1.6)
                const viewport = page.getViewport({ scale })
                const context = canvas.getContext("2d")
                if (!context) continue

                canvas.width = Math.floor(viewport.width * outputScale)
                canvas.height = Math.floor(viewport.height * outputScale)
                canvas.style.width = `${Math.floor(viewport.width)}px`
                canvas.style.height = `${Math.floor(viewport.height)}px`

                const task = page.render({
                    canvasContext: context,
                    canvas,
                    viewport,
                    transform: outputScale === 1 ? undefined : [outputScale, 0, 0, outputScale, 0, 0],
                })
                renderTasks.push(task)
                try {
                    await task.promise
                } catch (error) {
                    if (!cancelled && !(error instanceof Error && error.name === "RenderingCancelledException")) {
                        setPdfError(true)
                    }
                    return
                }
                if (cancelled) return
            }
        }

        void renderPages().catch(() => {
            if (!cancelled) setPdfError(true)
        })
        return () => {
            cancelled = true
            renderTasks.forEach((task) => task.cancel())
        }
    }, [pdf, viewerWidth])

    useEffect(() => {
        const navigate = (direction: number) => {
            const optionCount = popupBlockedRef.current ? 3 : 2
            setSelectedIndex((current) => (current + direction + optionCount) % optionCount)
        }
        const select = () => {
            const selected = selectedIndexRef.current
            if (selected === 0) actionsRef.current.onClose()
            else if (selected === 1) actionsRef.current.openInNewTab()
            else if (popupBlockedRef.current) actionsRef.current.openHereInstead()
        }
        const back = () => actionsRef.current.onClose()

        game.events.on(GAME_EVENTS.RESUME_NAVIGATE, navigate)
        game.events.on(GAME_EVENTS.RESUME_SELECT, select)
        game.events.on(GAME_EVENTS.RESUME_BACK, back)
        return () => {
            game.events.off(GAME_EVENTS.RESUME_NAVIGATE, navigate)
            game.events.off(GAME_EVENTS.RESUME_SELECT, select)
            game.events.off(GAME_EVENTS.RESUME_BACK, back)
        }
    }, [game])

    useEffect(() => {
        buttonRefs.current[selectedIndex]?.focus()
    }, [selectedIndex, popupBlocked])

    return (
        <div className="resume-panel" role="dialog" aria-modal="true" aria-labelledby="resume-panel-title">
            <section className="resume-panel__window">
                <header className="resume-panel__header">
                    <h1 id="resume-panel-title">{resume.title} Resume</h1>
                    <p>Choose with A / D, arrows, left stick, or D-pad; select with E / controller A</p>
                </header>

                <div className="resume-panel__document" ref={pageContainerRef}>
                    {pdfError ? (
                        <div className="resume-panel__message" role="status">
                            <p>The resume preview could not be loaded.</p>
                            <a href={resume.url} target="_blank" rel="noreferrer">Open the PDF in a new tab</a>
                        </div>
                    ) : !pdf ? (
                        <div className="resume-panel__message" role="status">Loading resume...</div>
                    ) : (
                        <div className="resume-panel__pages">
                            {Array.from({ length: pdf.numPages }, (_, index) => (
                                <canvas
                                    key={`${resume.url}-${index + 1}`}
                                    ref={(element) => { canvasRefs.current[index] = element }}
                                    className="resume-panel__page"
                                    aria-label={`${resume.title} resume, page ${index + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                <nav className="resume-panel__actions" aria-label="Resume actions">
                    <button
                        ref={(element) => { buttonRefs.current[0] = element }}
                        className={selectedIndex === 0 ? "resume-panel__action is-selected" : "resume-panel__action"}
                        type="button"
                        aria-pressed={selectedIndex === 0}
                        onFocus={() => setSelectedIndex(0)}
                        onClick={onClose}
                    >
                        Back
                    </button>
                    <button
                        ref={(element) => { buttonRefs.current[1] = element }}
                        className={selectedIndex === 1 ? "resume-panel__action is-selected" : "resume-panel__action"}
                        type="button"
                        aria-pressed={selectedIndex === 1}
                        onFocus={() => setSelectedIndex(1)}
                        onClick={openInNewTab}
                    >
                        Open in new tab
                    </button>
                    {popupBlocked && (
                        <button
                            ref={(element) => { buttonRefs.current[2] = element }}
                            className={selectedIndex === 2 ? "resume-panel__action is-selected" : "resume-panel__action"}
                            type="button"
                            aria-pressed={selectedIndex === 2}
                            onFocus={() => setSelectedIndex(2)}
                            onClick={openHereInstead}
                        >
                            Open here instead
                        </button>
                    )}
                </nav>
            </section>
        </div>
    )
}
