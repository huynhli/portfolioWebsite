import "./GameTutorialHud.css"

export type ControlDevice = "keyboard" | "gamepad"

type GameTutorialHudProps = {
    device: ControlDevice
}

export function GameTutorialHud({ device }: GameTutorialHudProps) {
    const controls = device === "gamepad"
        ? [
            { key: "A", action: "Use" },
            { key: "LEFT STICK / D-PAD", action: "Move" },
            { key: "START", action: "Pause" },
            { key: "Y", action: "Go to website" },
        ]
        : [
            { key: "E", action: "Use" },
            { key: "WASD", action: "Move" },
            { key: "ESC", action: "Pause" },
            { key: "G", action: "Go to website" },
        ]

    return (
        <aside className="game-tutorial-hud" aria-label="Game controls">
            {controls.map(({ key, action }) => (
                <div className="game-tutorial-card" key={action}>
                    <kbd className="game-tutorial-key">{key}</kbd>
                    <span className="game-tutorial-action">{action}</span>
                </div>
            ))}
        </aside>
    )
}
