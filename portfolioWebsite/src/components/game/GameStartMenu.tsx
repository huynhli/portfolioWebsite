import { useEffect, useRef, useState } from "react"
import type Phaser from "phaser"
import { GAME_EVENTS } from "./gameEvents"
import "./GameStartMenu.css"

type GameStartMenuProps = {
    game: Phaser.Game
    onPlay: () => void
    onWebsite: () => void
}

const OPTIONS = ["play", "website"] as const

function GameStartPrompt() {
    return (
        <div className="game-start-menu__prompt" id="game-start-menu-select-prompt" role="note">
            <span className="game-start-menu__sr-only">
                Click the left mouse button, press A on a controller, or press E on the keyboard to select.
            </span>
            <svg className="game-start-menu__mouse" viewBox="0 0 32 40" aria-hidden="true">
                <path className="game-start-menu__mouse-left" d="M16 3C9.4 3 4 8.4 4 15v5h12V3Z" />
                <path className="game-start-menu__mouse-outline" d="M16 2.5C8.5 2.5 3 8 3 15v11a13 13 0 0 0 26 0V15c0-7-5.5-12.5-13-12.5Z" />
                <path className="game-start-menu__mouse-divider" d="M16 3v17M4 20h24" />
                <path className="game-start-menu__mouse-click" d="M3 8 1 6M8 4 7 1M2 13H0" />
            </svg>
            <span className="game-start-menu__controller-button" aria-hidden="true">A</span>
            <kbd className="game-start-menu__keycap" aria-hidden="true">E</kbd>
        </div>
    )
}

export function GameStartMenu({ game, onPlay, onWebsite }: GameStartMenuProps) {
    const [selectedIndex, setSelectedIndex] = useState(0)
    const selectedIndexRef = useRef(selectedIndex)
    const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])
    const actionsRef = useRef({ onPlay, onWebsite })

    selectedIndexRef.current = selectedIndex
    actionsRef.current = { onPlay, onWebsite }

    const selectOption = (index: number) => {
        selectedIndexRef.current = index
        setSelectedIndex(index)
    }

    const moveSelection = (direction: number) => {
        selectOption((selectedIndexRef.current + direction + OPTIONS.length) % OPTIONS.length)
    }

    const activateSelection = () => {
        if (selectedIndexRef.current === 0) actionsRef.current.onPlay()
        else actionsRef.current.onWebsite()
    }

    useEffect(() => {
        const navigate = (direction: number) => moveSelection(Math.sign(direction))
        const select = () => activateSelection()

        game.events.on(GAME_EVENTS.START_MENU_NAVIGATE, navigate)
        game.events.on(GAME_EVENTS.START_MENU_SELECT, select)
        return () => {
            game.events.off(GAME_EVENTS.START_MENU_NAVIGATE, navigate)
            game.events.off(GAME_EVENTS.START_MENU_SELECT, select)
        }
    }, [game])

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            const code = event.code
            const direction = ["ArrowLeft", "ArrowUp", "KeyA", "KeyW"].includes(code)
                ? -1
                : ["ArrowRight", "ArrowDown", "KeyD", "KeyS"].includes(code)
                    ? 1
                    : 0

            if (direction !== 0) {
                event.preventDefault()
                if (!event.repeat) {
                    moveSelection(direction)
                    game.events.emit(GAME_EVENTS.INPUT_DEVICE_CHANGED, "keyboard")
                }
                return
            }

            if (code === "KeyE") {
                event.preventDefault()
                if (!event.repeat) {
                    game.events.emit(GAME_EVENTS.INPUT_DEVICE_CHANGED, "keyboard")
                    activateSelection()
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [game])

    useEffect(() => {
        buttonRefs.current[selectedIndex]?.focus()
    }, [selectedIndex])

    return (
        <div className="game-start-menu" role="dialog" aria-modal="true" aria-labelledby="game-start-menu-title">
            <section className="game-start-menu__panel">
                <h1 className="game-start-menu__title" id="game-start-menu-title">Liam's Portfolio</h1>
                <div className="game-start-menu__options" aria-label="Choose where to go">
                    <div className="game-start-menu__option-wrap">
                        <button
                            ref={(element) => { buttonRefs.current[0] = element }}
                            className={`game-start-menu__button${selectedIndex === 0 ? " is-selected" : ""}`}
                            type="button"
                            aria-pressed={selectedIndex === 0}
                            aria-describedby={selectedIndex === 0 ? "game-start-menu-select-prompt" : undefined}
                            onMouseEnter={() => selectOption(0)}
                            onFocus={() => selectOption(0)}
                            onClick={() => actionsRef.current.onPlay()}
                        >
                            Play game
                        </button>
                        {selectedIndex === 0 && <GameStartPrompt />}
                    </div>
                    <div className="game-start-menu__option-wrap">
                        <button
                            ref={(element) => { buttonRefs.current[1] = element }}
                            className={`game-start-menu__button${selectedIndex === 1 ? " is-selected" : ""}`}
                            type="button"
                            aria-pressed={selectedIndex === 1}
                            aria-describedby={selectedIndex === 1 ? "game-start-menu-select-prompt" : undefined}
                            onMouseEnter={() => selectOption(1)}
                            onFocus={() => selectOption(1)}
                            onClick={() => actionsRef.current.onWebsite()}
                        >
                            Go to website
                        </button>
                        {selectedIndex === 1 && <GameStartPrompt />}
                    </div>
                </div>
            </section>
        </div>
    )
}
