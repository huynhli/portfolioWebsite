import Phaser from "phaser"
import { useEffect, useRef } from "react"

type InputState = {
    move: Phaser.Math.Vector2   // length 0..1
    pausePressed: boolean       // true only on the frame it went down
    interactPressed: boolean
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
    }
    private escKey!: Phaser.Input.Keyboard.Key
    private eKey!: Phaser.Input.Keyboard.Key
    private prev = { pause: false, interact: false }

    constructor() {
        super("TopDownGame")
    }

    preload() {
        this.load.image("player", "/gameAssets/Player-32x32.png")
        this.load.image("grassAndStoneTiles", "/gameAssets/GrassAndStoneTileset.png")
        this.load.image("stoneTiles", "/gameAssets/StoneTileset.png")
        this.load.tilemapTiledJSON("tilemap", "/gameAssets/PortfolioMap.json")
    }

    create() {
        const { map, guideline } = this.createMap()
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)

        this.createPlayer(guideline)

        // input mapping
        this.cursors = this.input.keyboard!.createCursorKeys()
        this.wasd = this.input.keyboard!.addKeys("W,A,S,D") as any

        this.escKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.ESC)
        this.eKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.E)

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
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
        this.physics.add.collider(this.player, guideline)
    }

    update() {
        this.readInput()
        this.handleActions()
        this.move()
    }

    private readInput() {
        let dx = 0
        let dy = 0

        if (this.cursors.left.isDown || this.wasd.A.isDown) dx -= 1
        if (this.cursors.right.isDown || this.wasd.D.isDown) dx += 1
        if (this.cursors.up.isDown || this.wasd.W.isDown) dy -= 1
        if (this.cursors.down.isDown || this.wasd.S.isDown) dy += 1

        const pad = this.input.gamepad?.pad1
        if (pad) {
            const sx = pad.leftStick.x
            const sy = pad.leftStick.y
            if (Math.abs(sx) > 0.15 || Math.abs(sy) > 0.15) {
                dx = sx
                dy = sy
            }
        }

        this.inputState.move.set(dx, dy)
        if (this.inputState.move.length() > 1) this.inputState.move.normalize()

        // Edge detection: "just pressed" instead of "held"
        const pauseDown = this.escKey.isDown || !!pad?.buttons[9]?.pressed
        const interactDown = this.eKey.isDown || !!pad?.buttons[0]?.pressed

        this.inputState.pausePressed = pauseDown && !this.prev.pause
        this.inputState.interactPressed = interactDown && !this.prev.interact
        this.prev.pause = pauseDown
        this.prev.interact = interactDown
    }

    private handleActions() {
        if (this.inputState.pausePressed) this.togglePause()
        if (this.inputState.interactPressed) this.interact()
    }

    private togglePause() {
        this.scene.launch("PauseMenu")
        this.scene.pause() // freezes update() and physics for this scene
    }

    private toggleMap() {
        this.scene.launch("Overlay", {OverlayType})
    }

    private interact() {

    }

    private move() {
        const { move } = this.inputState
        this.player.setVelocity(move.x * this.speed, move.y * this.speed)
    }

    //     // normalize so diagonals aren't faster but keep partial stick tilt
    //     const vec = new Phaser.Math.Vector2(dx, dy)
    //     if (vec.length() > 1) vec.normalize()

    //     this.player.setVelocity(vec.x * this.speed, vec.y * this.speed)
    // }
}

class HUD extends Phaser.Scene {
    private fromScene!: string

    constructor() {
        super("HUD")
    }

    init(data: { fromScene: string; score?: number }) {
        this.fromScene = data.fromScene
        this.score = data.score ?? 0
    }

    private resume() {
        this.scene.stop()
        this.scene.resume(this.fromScene)
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

        // Keyboard: fires once per press (not on key repeat)
        this.input.keyboard!.once("keydown-ESC", this.resumeGame, this)

        // Gamepad: Start is button index 9
        this.input.gamepad?.on("down", this.onPadDown, this)

        // Clean up so listeners don't pile up across pauses
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

export const OverlayType = {
    Map: 'MAP',
    Resume: 'RESUME',
    Sidebar: 'SIDEBAR',
} as const
export type OverlayTypeValue = typeof OverlayType[keyof typeof OverlayType];

class Overlay extends Phaser.Scene {
    private fromScene!: string
    private overlayType = OverlayType.Map 

    constructor() {
        super("Overlay")
    }

    init(data: { fromScene: string; overlayType?: OverlayTypeValue, optionalParam?: number }) {
        this.fromScene = data.fromScene
        switch(data.overlayType) {
            
        }
    }

    private resume() {
        this.scene.stop()
        this.scene.resume(this.fromScene)
    }
}

export default function GamePage() {
    // Show on mount and don"t reload on updated React state
    const gameContainerRef = useRef<HTMLDivElement>(null)
    
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
            scene: [TopDownGame, HUD, PauseMenu, Overlay],
            physics: {
                default: "arcade",
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: true
                }
            },
            input: { gamepad: true }
        })

        // Cleanup
        return () => game.destroy(true)
    }, [])

    return (
        <div className="relative flex h-screen w-full flex-col">
            <div className="min-h-0 w-full flex-1" ref={gameContainerRef} />
        </div>
    )
}