import Phaser from "phaser"
import { useEffect, useRef } from "react"

class TopDownGame extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private wasd!: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>
    private speed = 200

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

        this.cursors = this.input.keyboard!.createCursorKeys()
        this.wasd = this.input.keyboard!.addKeys("W,A,S,D") as any

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
        this.player.setCollideWorldBounds(true)
        this.physics.add.collider(this.player, guideline)
    }

    update() {
        let dx = 0
        let dy = 0

        // Keyboard input
        if (this.cursors.left.isDown || this.wasd.A.isDown) dx -= 1
        if (this.cursors.right.isDown || this.wasd.D.isDown) dx += 1
        if (this.cursors.up.isDown || this.wasd.W.isDown) dy -= 1
        if (this.cursors.down.isDown || this.wasd.S.isDown) dy += 1

        // Gamepad input (overrides keyboard when the stick is pushed)
        const pad = this.input.gamepad?.pad1
        if (pad) {
            const sx = pad.leftStick.x
            const sy = pad.leftStick.y
            if (Math.abs(sx) > 0.15 || Math.abs(sy) > 0.15) {
            dx = sx
            dy = sy
            }
        }

        // Normalize so diagonals aren't faster, but keep partial stick tilt
        const vec = new Phaser.Math.Vector2(dx, dy)
        if (vec.length() > 1) vec.normalize()

        this.player.setVelocity(vec.x * this.speed, vec.y * this.speed)
    }
}

class HUD extends Phaser.Scene {

}

class PauseMenu extends Phaser.Scene {

}

class Overlay extends Phaser.Scene {

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
            scene: [TopDownGame],
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