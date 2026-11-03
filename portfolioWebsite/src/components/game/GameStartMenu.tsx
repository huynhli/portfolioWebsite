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
                <h1 className="game-start-menu__title" id="game-start-menu-title">Portfolio</h1>
                <div className="game-start-menu__options" aria-label="Choose where to go">
                    <div className="game-start-menu__option-wrap">
                        {selectedIndex === 0 && (
                            <p className="game-start-menu__prompt">Click, press A on controller, or press E on keyboard</p>
                        )}
                        <button
                            ref={(element) => { buttonRefs.current[0] = element }}
                            className={`game-start-menu__button${selectedIndex === 0 ? " is-selected" : ""}`}
                            type="button"
                            aria-pressed={selectedIndex === 0}
                            onMouseEnter={() => selectOption(0)}
                            onFocus={() => selectOption(0)}
                            onClick={() => actionsRef.current.onPlay()}
                        >
                            Play game
                        </button>
                    </div>
                    <div className="game-start-menu__option-wrap">
                        {selectedIndex === 1 && (
                            <p className="game-start-menu__prompt">Click, press A on controller, or press E on keyboard</p>
                        )}
                        <button
                            ref={(element) => { buttonRefs.current[1] = element }}
                            className={`game-start-menu__button${selectedIndex === 1 ? " is-selected" : ""}`}
                            type="button"
                            aria-pressed={selectedIndex === 1}
                            onMouseEnter={() => selectOption(1)}
                            onFocus={() => selectOption(1)}
                            onClick={() => actionsRef.current.onWebsite()}
                        >
                            Go to website
                        </button>
                    </div>
                </div>
            </section>
        </div>
    )
}
