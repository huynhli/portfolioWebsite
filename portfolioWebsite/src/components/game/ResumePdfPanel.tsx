import { useEffect, useRef, useState } from "react"
import type Phaser from "phaser"
import { GAME_EVENTS } from "./gameEvents"
import "./ResumePdfPanel.css"

const RESUME_PDF_URL = "/LiamHuynh_Resume_SWE-portfolio.pdf"

type ResumePdfPanelProps = {
    game: Phaser.Game
    onClose: () => void
}

export function ResumePdfPanel({ game, onClose }: ResumePdfPanelProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const [popupBlocked, setPopupBlocked] = useState(false)
    const selectedIndexRef = useRef(selectedIndex)
    const popupBlockedRef = useRef(popupBlocked)
    const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
    const actionsRef = useRef({ onClose, openInNewTab: () => {}, openHereInstead: () => {} })

    selectedIndexRef.current = selectedIndex
    popupBlockedRef.current = popupBlocked

    const openInNewTab = () => {
        const openedWindow = window.open(RESUME_PDF_URL, "_blank")
        if (openedWindow) {
            openedWindow.opener = null
            setPopupBlocked(false)
            return
        }

        setPopupBlocked(true)
        setSelectedIndex(2)
    }

    const openHereInstead = () => window.location.assign(RESUME_PDF_URL)

    actionsRef.current = { onClose, openInNewTab, openHereInstead }

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
                    <h1 id="resume-panel-title">Resume</h1>
                    <p>Choose with A / D, arrows, left stick, or D-pad; select with E / controller A</p>
                </header>

                <div className="resume-panel__document">
                    <iframe
                        title="Software engineering resume"
                        src={RESUME_PDF_URL}
                    />
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
