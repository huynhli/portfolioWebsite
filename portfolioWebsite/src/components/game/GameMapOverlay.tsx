import type { ControlDevice } from "./GameTutorialHud"
import { GAME_ROOM_LABELS, type GameRoomLocation } from "./gameRooms"
import "./GameMapOverlay.css"

type GameMapButtonProps = {
    device: ControlDevice
    onClick: () => void
}

type GameMapOverlayProps = {
    currentRoom: GameRoomLocation
}

export function GameMapButton({ device, onClick }: GameMapButtonProps) {
    return (
        <button className="game-map-button" type="button" onClick={onClick} aria-label="Open map" aria-haspopup="dialog">
            <span>Map</span>
            <kbd>{device === "gamepad" ? "SELECT" : "M"}</kbd>
        </button>
    )
}

export function GameMapOverlay({ currentRoom }: GameMapOverlayProps) {
    return (
        <div className="game-map-overlay" role="dialog" aria-modal="true" aria-labelledby="game-map-title">
            <section className="game-map-panel">
                <h2 id="game-map-title">Map</h2>
                <div className="game-map-grid" aria-label="Room map">
                    {GAME_ROOM_LABELS.flatMap((row, rowIndex) => row.map((label, columnIndex) => {
                        const isCurrent = currentRoom.column === columnIndex && currentRoom.row === rowIndex
                        return (
                            <div
                                className={`game-map-room${isCurrent ? " is-current" : ""}`}
                                key={`${rowIndex}-${columnIndex}`}
                                aria-current={isCurrent ? "true" : undefined}
                            >
                                <span>{label}</span>
                                {isCurrent && <small>Current room</small>}
                            </div>
                        )
                    }))}
                </div>
                <div className="game-map-close-hint">press 'M' to close</div>
            </section>
        </div>
    )
}
