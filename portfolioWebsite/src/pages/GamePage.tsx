import Phaser from "phaser"
import { useEffect, useRef, useState } from "react"
import { InteractiveGameObject, type InteractiveGameObjectConfig } from "../components/game/InteractiveGameObject"
import { ResumePdfPanel } from "../components/game/ResumePdfPanel"
import { GAME_EVENTS } from "../components/game/gameEvents"

type ControlDevice = "keyboard" | "gamepad"

type InputState = {
    move: Phaser.Math.Vector2
    pausePressed: boolean
    interactPressed: boolean
    panelNavigate: -1 | 0 | 1
}

class TopDownGame extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private wasd!: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>
    private speed = 400
    private inputState: InputState = {
        move: new Phaser.Math.Vector2(),
        pausePressed: false,
        interactPressed: false,
        panelNavigate: 0,
    }
    private escKey!: Phaser.Input.Keyboard.Key
    private eKey!: Phaser.Input.Keyboard.Key
    private previous = { pause: false, interact: false, panelDirection: 0 }
    private lastInputDevice: ControlDevice = "keyboard"
    private interactiveObjects: InteractiveGameObject[] = []
    private activeObject: InteractiveGameObject | null = null
    private interactionPrompt!: Phaser.GameObjects.Text
    private resumePanelOpen = false

    constructor() {
        super("TopDownGame")
    }

    preload() {
        this.load.image("player", "/gameAssets/Player-32x32.png")
        this.load.image("grassAndStoneTiles", "/gameAssets/GrassAndStoneTileset.png")
        this.load.image("stoneTiles", "/gameAssets/StoneTileset.png")
        this.load.image("resumePedestal", "/gameAssets/resume-pedestal.png")
        this.load.image("resumePaper", "/gameAssets/resume-paper.png")
        this.load.tilemapTiledJSON("tilemap", "/gameAssets/PortfolioMap.json")
    }

    create() {
        const { map, guideline } = this.createMap()
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        this.createPlayer(guideline)
        this.createInput()
        this.createInteractiveObjects()
        this.createInteractionPrompt()

        this.game.events.on(GAME_EVENTS.RESUME_CLOSE, this.closeResumePanel, this)
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.game.events.off(GAME_EVENTS.RESUME_CLOSE, this.closeResumePanel, this)
            this.interactionPrompt?.destroy()
        })

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
    }

    update() {
        this.readInput()

        if (this.resumePanelOpen) {
            this.player.setVelocity(0, 0)
            this.handleResumePanelInput()
            return
        }

        this.updateActiveObject()
        if (this.handleActions()) {
            this.player.setVelocity(0, 0)
            return
        }
        this.move()
    }

    private createMap() {
        const map = this.make.tilemap({ key: "tilemap" })
        const stone = map.addTilesetImage("Stone", "stoneTiles")
        const grassAndStone = map.addTilesetImage("GrassAndStonePath", "grassAndStoneTiles")
        const tilesets = [grassAndStone!, stone!]

        map.createLayer("Ground", tilesets)
        const guideline = map.createLayer("guideline", tilesets)!
        guideline.setCollisionByProperty({ collides: true })

        return { map, guideline }
    }

    private createPlayer(guideline: Phaser.Tilemaps.TilemapLayer | Phaser.Tilemaps.TilemapGPULayer): void {
        this.player = this.physics.add.sprite(1200, 900, "player")
        this.player.setScale(2)
        this.player.setCollideWorldBounds(true)
        this.player.setDepth(this.player.y)
        this.physics.add.collider(this.player, guideline)
    }

    private createInput() {
        this.cursors = this.input.keyboard!.createCursorKeys()
        this.wasd = this.input.keyboard!.addKeys("W,A,S,D") as typeof this.wasd
        this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        this.eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    }

    private createInteractiveObjects() {
        this.addInteractiveObject({
            id: "resume-swe",
            x: 1328,
            y: 900,
            interactionRadius: 96,
            pedestalTextureKey: "resumePedestal",
            pedestalWidth: 64,
            pedestalHeight: 64,
            pedestalOffsetY: 16,
            icons: [
                {
                    textureKey: "resumePaper",
                    width: 32,
                    height: 32,
                },
            ],
            label: "RESUME - SWE",
            action: () => {
                this.resumePanelOpen = true
                this.previous.panelDirection = Math.sign(this.inputState.move.x)
                this.player.setVelocity(0, 0)
                this.game.events.emit(GAME_EVENTS.RESUME_OPEN)
            },
        })
    }

    private addInteractiveObject(config: InteractiveGameObjectConfig) {
        this.interactiveObjects.push(new InteractiveGameObject(this, config))
    }

    private createInteractionPrompt() {
        this.interactionPrompt = this.add.text(0, 0, "", {
            fontFamily: "monospace",
            fontSize: "14px",
            color: "#ffffff",
            backgroundColor: "rgba(18, 18, 18, 0.9)",
            padding: { left: 8, right: 8, top: 5, bottom: 5 },
        }).setOrigin(0.5).setDepth(10000).setVisible(false)
    }

    private readInput() {
        const keyboardLeft = this.cursors.left.isDown || this.wasd.A.isDown
        const keyboardRight = this.cursors.right.isDown || this.wasd.D.isDown
        const keyboardUp = this.cursors.up.isDown || this.wasd.W.isDown
        const keyboardDown = this.cursors.down.isDown || this.wasd.S.isDown

        let dx = Number(keyboardRight) - Number(keyboardLeft)
        let dy = Number(keyboardDown) - Number(keyboardUp)

        const pad = this.input.gamepad?.pad1
        // Standard Gamepad mapping: D-pad up/down/left/right are buttons 12/13/14/15.
        const dpadLeft = !!pad?.buttons[14]?.pressed
        const dpadRight = !!pad?.buttons[15]?.pressed
        const dpadUp = !!pad?.buttons[12]?.pressed
        const dpadDown = !!pad?.buttons[13]?.pressed
        const dpadActive = dpadLeft || dpadRight || dpadUp || dpadDown
        const dpadX = Number(dpadRight) - Number(dpadLeft)
        const dpadY = Number(dpadDown) - Number(dpadUp)
        const stickX = pad?.leftStick.x ?? 0
        const stickY = pad?.leftStick.y ?? 0
        const stickActive = Math.abs(stickX) > 0.15 || Math.abs(stickY) > 0.15

        if (dpadActive) {
            dx = dpadX
            dy = dpadY
        } else if (stickActive) {
            dx = stickX
            dy = stickY
        }

        this.inputState.move.set(dx, dy)
        if (this.inputState.move.length() > 1) this.inputState.move.normalize()

        const keyboardPause = this.escKey.isDown
        const keyboardInteract = this.eKey.isDown
        const gamepadPause = !!pad?.buttons[9]?.pressed
        const gamepadInteract = !!pad?.buttons[0]?.pressed
        const pauseDown = keyboardPause || gamepadPause
        const interactDown = keyboardInteract || gamepadInteract

        this.inputState.pausePressed = pauseDown && !this.previous.pause
        this.inputState.interactPressed = interactDown && !this.previous.interact
        this.previous.pause = pauseDown
        this.previous.interact = interactDown

        const keyboardUsed = keyboardLeft || keyboardRight || keyboardUp || keyboardDown || keyboardPause || keyboardInteract
        const gamepadUsed = dpadActive || stickActive || gamepadPause || gamepadInteract
        if (gamepadUsed) this.lastInputDevice = "gamepad"
        else if (keyboardUsed) this.lastInputDevice = "keyboard"

        const keyboardMenuDirection = Number(this.wasd.D.isDown || this.cursors.right.isDown)
            - Number(this.wasd.A.isDown || this.cursors.left.isDown)
        const gamepadMenuDirection = dpadX !== 0
            ? dpadX
            : Math.abs(stickX) > 0.45 ? Math.sign(stickX) : 0
        const menuDirection = gamepadUsed && gamepadMenuDirection !== 0
            ? gamepadMenuDirection
            : keyboardMenuDirection

        this.inputState.panelNavigate = this.resumePanelOpen
            && menuDirection !== 0
            && menuDirection !== this.previous.panelDirection
            ? menuDirection as -1 | 1
            : 0
        this.previous.panelDirection = menuDirection
    }

    private updateActiveObject() {
        let closestObject: InteractiveGameObject | null = null
        let closestDistance = Number.POSITIVE_INFINITY

        for (const object of this.interactiveObjects) {
            const distance = Phaser.Math.Distance.Between(this.player.x, this.player.y, object.x, object.y)
            if (distance <= object.interactionRadius && distance < closestDistance) {
                closestObject = object
                closestDistance = distance
            }
        }

        this.activeObject = closestObject
        if (!this.activeObject) {
            this.interactionPrompt.setVisible(false)
            return
        }

        const key = this.lastInputDevice === "gamepad" ? "A" : "E"
        this.interactionPrompt
            .setText(`${key}   Use`)
            .setPosition(this.activeObject.x, this.activeObject.y - 80)
            .setVisible(true)
    }

    private handleActions(): boolean {
        if (this.inputState.pausePressed) {
            this.togglePause()
            return true
        }

        if (this.inputState.interactPressed) this.activeObject?.activate()
        return this.resumePanelOpen
    }

    private handleResumePanelInput() {
        if (this.inputState.panelNavigate !== 0) {
            this.game.events.emit(GAME_EVENTS.RESUME_NAVIGATE, this.inputState.panelNavigate)
        }

        if (this.inputState.pausePressed) {
            this.game.events.emit(GAME_EVENTS.RESUME_BACK)
        } else if (this.inputState.interactPressed) {
            this.game.events.emit(GAME_EVENTS.RESUME_SELECT)
        }
    }

    private togglePause() {
        this.scene.launch("PauseMenu")
        this.scene.pause()
    }

    private move() {
        const { move } = this.inputState
        this.player.setVelocity(move.x * this.speed, move.y * this.speed)
        this.player.setDepth(this.player.y)
    }

    private closeResumePanel = () => {
        this.resumePanelOpen = false
        this.previous.panelDirection = 0
    }
}

class PauseMenu extends Phaser.Scene {
    constructor() {
        super("PauseMenu")
    }

    create() {
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.6).setOrigin(0)
        this.add.text(this.scale.width / 2, this.scale.height / 2, "Paused", {
            fontSize: "48px",
            color: "#ffffff",
        }).setOrigin(0.5)

        this.input.keyboard!.once("keydown-ESC", this.resumeGame, this)
        this.input.gamepad?.on("down", this.onPadDown, this)
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.input.keyboard?.off("keydown-ESC", this.resumeGame, this)
            this.input.gamepad?.off("down", this.onPadDown, this)
        })
    }

    private onPadDown(_: Phaser.Input.Gamepad.Gamepad, button: Phaser.Input.Gamepad.Button) {
        if (button.index === 9) this.resumeGame()
    }

    private resumeGame() {
        this.scene.stop()
        this.scene.resume("TopDownGame")
    }
}

export default function GamePage() {
    const gameContainerRef = useRef<HTMLDivElement>(null)
    const gameRef = useRef<Phaser.Game | null>(null)
    const [gameInstance, setGameInstance] = useState<Phaser.Game | null>(null)
    const [resumePanelOpen, setResumePanelOpen] = useState(false)

    useEffect(() => {
        const game = new Phaser.Game({
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            parent: gameContainerRef.current!,
            scene: [TopDownGame, PauseMenu],
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: true,
                },
            },
            input: { gamepad: true },
        })

        const openResumePanel = () => setResumePanelOpen(true)
        game.events.on(GAME_EVENTS.RESUME_OPEN, openResumePanel)
        gameRef.current = game
        setGameInstance(game)

        return () => {
            game.events.off(GAME_EVENTS.RESUME_OPEN, openResumePanel)
            game.destroy(true)
            gameRef.current = null
        }
    }, [])

    const closeResumePanel = () => {
        gameRef.current?.events.emit(GAME_EVENTS.RESUME_CLOSE)
        setResumePanelOpen(false)
    }

    return (
        <div className="relative flex h-screen w-full flex-col">
            <div className="min-h-0 w-full flex-1" ref={gameContainerRef} />
            {resumePanelOpen && gameInstance && (
                <ResumePdfPanel game={gameInstance} onClose={closeResumePanel} />
            )}
        </div>
    )
}
