import "./GameTutorialHud.css"

export type ControlDevice = "keyboard" | "gamepad"

type GameTutorialHudProps = {
    device: ControlDevice
    onGoToWebsite: () => void
}

export function GameTutorialHud({ device, onGoToWebsite }: GameTutorialHudProps) {
    const controls = device === "gamepad"
        ? [
            { id: "use", key: "A", action: "Use" },
            { id: "move", key: "LEFT STICK / D-PAD", action: "Move" },
            { id: "website", key: "Y", action: "Go to website" },
        ]
        : [
            { id: "use", key: "E", action: "Use" },
            { id: "move", key: "WASD", action: "Move" },
            { id: "website", key: "G", action: "Go to website" },
        ]

    return (
        <aside className="game-tutorial-hud" aria-label="Game controls">
            {controls.map(({ id, key, action }) => id === "website" ? (
                <button
                    className="game-tutorial-card game-tutorial-card--website"
                    key={id}
                    type="button"
                    aria-label="Go to website"
                    onClick={onGoToWebsite}
                >
                    <kbd className="game-tutorial-key">{key}</kbd>
                    <span className="game-tutorial-action">{action}</span>
                </button>
            ) : (
                <div className="game-tutorial-card" key={id}>
                    <kbd className="game-tutorial-key">{key}</kbd>
                    <span className="game-tutorial-action">{action}</span>
                </div>
            ))}
        </aside>
    )
}
