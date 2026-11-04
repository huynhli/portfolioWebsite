import Phaser from "phaser"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { InteractiveGameObject, type InteractiveGameObjectConfig } from "../components/game/InteractiveGameObject"
import { GameTutorialHud, type ControlDevice } from "../components/game/GameTutorialHud"
import { GameMapButton, GameMapOverlay } from "../components/game/GameMapOverlay"
import { GameStartMenu } from "../components/game/GameStartMenu"
import { ResumePdfPanel } from "../components/game/ResumePdfPanel"
import { RESUME_DOCUMENTS, type ResumeDocument } from "../config/resumeDocuments"
import { GAME_EVENTS } from "../components/game/gameEvents"
import { getGameRoomLabel, type GameRoomLocation } from "../components/game/gameRooms"

type InputState = {
    move: Phaser.Math.Vector2
    backPressed: boolean
    interactPressed: boolean
    websitePressed: boolean
    mapPressed: boolean
    panelNavigate: -1 | 0 | 1
}

type DoorDirection = "up" | "down" | "left" | "right"

type RoomDoorway = {
    roomColumn: number
    roomRow: number
    direction: DoorDirection
    bounds: Phaser.Geom.Rectangle
    centerX: number
    centerY: number
}

type DoorwayGroup = Omit<RoomDoorway, "bounds" | "centerX" | "centerY"> & {
    tiles: Array<{ x: number; y: number }>
}

const ROOM_WIDTH_TILES = 25
const ROOM_HEIGHT_TILES = 20
const HORIZONTAL_DOOR_HEIGHT_TILES = 4
const DIRECTION_VECTORS: Record<DoorDirection, Phaser.Math.Vector2> = {
    up: new Phaser.Math.Vector2(0, -1),
    down: new Phaser.Math.Vector2(0, 1),
    left: new Phaser.Math.Vector2(-1, 0),
    right: new Phaser.Math.Vector2(1, 0),
}
const OPPOSITE_DIRECTIONS: Record<DoorDirection, DoorDirection> = {
    up: "down",
    down: "up",
    left: "right",
    right: "left",
}
const DOOR_ARROWS: Record<DoorDirection, string> = {
    up: "↑",
    down: "↓",
    left: "←",
    right: "→",
}

class TopDownGame extends Phaser.Scene {
    private player!: Phaser.Physics.Arcade.Sprite
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
    private wasd!: Record<"W" | "A" | "S" | "D", Phaser.Input.Keyboard.Key>
    private speed = 400
    private inputState: InputState = {
        move: new Phaser.Math.Vector2(),
        backPressed: false,
        interactPressed: false,
        websitePressed: false,
        mapPressed: false,
        panelNavigate: 0,
    }
    private escKey!: Phaser.Input.Keyboard.Key
    private eKey!: Phaser.Input.Keyboard.Key
    private gKey!: Phaser.Input.Keyboard.Key
    private mKey!: Phaser.Input.Keyboard.Key
    private previous = { back: false, interact: false, website: false, map: false, panelDirection: 0 }
    private lastInputDevice: ControlDevice = "keyboard"
    private notifiedInputDevice: ControlDevice = "keyboard"
    private interactiveObjects: InteractiveGameObject[] = []
    private doorways: RoomDoorway[] = []
    private currentRoom = { column: 0, row: 0 }
    private roomWidth = ROOM_WIDTH_TILES * 32
    private roomHeight = ROOM_HEIGHT_TILES * 32
    private tileWidth = 32
    private tileHeight = 32
    private roomColumns = 3
    private roomRows = 3
    private activeObject: InteractiveGameObject | null = null
    private interactionPrompt!: Phaser.GameObjects.Text
    private resumePanelOpen = false
    private mapOpen = false
    private gameStarted = false
    private startMenuSelectDown = false
    private startMenuDirection = 0

    constructor() {
        super("TopDownGame")
    }

    preload() {
        this.load.image("player", "/gameAssets/Player-32x32.png")
        this.load.image("grassAndStoneTiles", "/gameAssets/GrassAndStoneTileset.png")
        this.load.image("stoneTiles", "/gameAssets/StoneTileset.png")
        this.load.image("resumePedestal", "/gameAssets/resume-pedestal.png")
        this.load.image("resumePaper", "/gameAssets/gameIcons/resume-paper-white.png")
        this.load.image("linkedinIcon", "/gameAssets/gameIcons/linkedin-logo-white.png")
        this.load.image("githubIcon", "/gameAssets/gameIcons/github-logo-white.png")
        this.load.image("itchIcon", "/gameAssets/gameIcons/itch-logo-white.png")
        this.load.image("tbspGamesProfile", "/gameAssets/gameIcons/tbsp-games-profile-white.png")
        this.load.image("geotabProfile", "/gameAssets/gameIcons/geotab-profile-white.png")
        this.load.image("barelProfile", "/gameAssets/gameIcons/barel-profile-white.png")
        this.load.tilemapTiledJSON("tilemap", "/gameAssets/PortfolioMap.json")
    }

    create() {
        const { map, guideline, doorways } = this.createMap()
        this.doorways = doorways
        this.tileWidth = map.tileWidth
        this.tileHeight = map.tileHeight
        this.roomWidth = ROOM_WIDTH_TILES * this.tileWidth
        this.roomHeight = ROOM_HEIGHT_TILES * this.tileHeight
        this.roomColumns = Math.floor(map.widthInPixels / this.roomWidth)
        this.roomRows = Math.floor(map.heightInPixels / this.roomHeight)
        this.physics.world.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.createDoorIndicators()

        this.createPlayer(guideline)
        this.currentRoom = this.roomAt(this.player.x, this.player.y)
        this.game.events.emit(GAME_EVENTS.MAP_ROOM_CHANGED, this.currentRoom)
        this.setCameraRoom(this.currentRoom.column, this.currentRoom.row)
        this.cameras.main.centerOn(this.player.x, this.player.y)
        this.createInput()
        this.createInteractiveObjects()
        this.createInteractionPrompt()

        this.game.events.on(GAME_EVENTS.RESUME_CLOSE, this.closeResumePanel, this)
        this.game.events.on(GAME_EVENTS.START_GAME, this.startGame, this)
        this.game.events.on(GAME_EVENTS.MAP_TOGGLE, this.toggleMap, this)
        this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
            this.game.events.off(GAME_EVENTS.RESUME_CLOSE, this.closeResumePanel, this)
            this.game.events.off(GAME_EVENTS.START_GAME, this.startGame, this)
            this.game.events.off(GAME_EVENTS.MAP_TOGGLE, this.toggleMap, this)
            this.interactionPrompt?.destroy()
        })

        this.cameras.main.startFollow(this.player, true, 0.1, 0.1)
        this.game.events.emit(GAME_EVENTS.GAME_READY)
    }

    update() {
        if (!this.gameStarted) {
            this.readStartMenuInput()
            this.player.setVelocity(0, 0)
            return
        }

        this.readInput()

        if (this.resumePanelOpen) {
            this.player.setVelocity(0, 0)
            this.handleResumePanelInput()
            return
        }

        if (this.inputState.mapPressed) {
            this.toggleMap()
            this.player.setVelocity(0, 0)
            return
        }
        if (this.mapOpen) {
            this.player.setVelocity(0, 0)
            return
        }

        this.updateActiveObject()
        if (this.handleActions()) {
            this.player.setVelocity(0, 0)
            return
        }
        if (this.updateDoorTransitions()) return
        this.move()
    }

    private createMap() {
        const map = this.make.tilemap({ key: "tilemap" })
        const stone = map.addTilesetImage("Stone", "stoneTiles")
        const grassAndStone = map.addTilesetImage("GrassAndStonePath", "grassAndStoneTiles")
        const tilesets = [grassAndStone!, stone!]

        map.createLayer("Ground", tilesets)
        // Keep these as regular, mutable TilemapLayers for collision and door edits.
        // Phaser's createLayer type is a union even when the GPU option is explicitly false.
        const guideline = map.createLayer("guideline", tilesets, undefined, undefined, false)! as Phaser.Tilemaps.TilemapLayer
        const doorLayer = map.createLayer("doors", tilesets, undefined, undefined, false)! as Phaser.Tilemaps.TilemapLayer
        const doorways = this.createRoomDoorways(map, guideline, doorLayer)
        guideline.setCollisionByProperty({ collides: true })

        return { map, guideline, doorways }
    }

    private createRoomDoorways(
        map: Phaser.Tilemaps.Tilemap,
        guideline: Phaser.Tilemaps.TilemapLayer,
        doorLayer: Phaser.Tilemaps.TilemapLayer,
    ): RoomDoorway[] {
        const roomColumns = Math.floor(map.width / ROOM_WIDTH_TILES)
        const roomRows = Math.floor(map.height / ROOM_HEIGHT_TILES)
        const groups = new Map<string, DoorwayGroup>()

        for (let tileY = 0; tileY < map.height; tileY++) {
            for (let tileX = 0; tileX < map.width; tileX++) {
                const tile = doorLayer.getTileAt(tileX, tileY)
                if (!tile || tile.index < 0) continue

                const roomColumn = Math.floor(tileX / ROOM_WIDTH_TILES)
                const roomRow = Math.floor(tileY / ROOM_HEIGHT_TILES)
                const localX = tileX % ROOM_WIDTH_TILES
                const localY = tileY % ROOM_HEIGHT_TILES
                let direction: DoorDirection | null = null

                if (localX === ROOM_WIDTH_TILES - 1) direction = "right"
                else if (localX === 0) direction = "left"
                else if (localY === ROOM_HEIGHT_TILES - 1) direction = "down"
                else if (localY === 0) direction = "up"
                if (!direction) continue

                const directionVector = DIRECTION_VECTORS[direction]
                const neighborColumn = roomColumn + directionVector.x
                const neighborRow = roomRow + directionVector.y
                if (neighborColumn < 0 || neighborColumn >= roomColumns || neighborRow < 0 || neighborRow >= roomRows) {
                    doorLayer.removeTileAt(tileX, tileY, false, true)
                    continue
                }

                guideline.removeTileAt(tileX, tileY, false, true)
                const key = `${roomColumn},${roomRow},${direction}`
                const group = groups.get(key) ?? { roomColumn, roomRow, direction, tiles: [] }
                group.tiles.push({ x: tileX, y: tileY })
                groups.set(key, group)
            }
        }

        return [...groups.values()].map(({ tiles, ...group }) => {
            const minTileX = Math.min(...tiles.map(({ x }) => x))
            const maxTileX = Math.max(...tiles.map(({ x }) => x))
            let minTileY = Math.min(...tiles.map(({ y }) => y))
            let maxTileY = Math.max(...tiles.map(({ y }) => y))

            if (group.direction === "left" || group.direction === "right") {
                const markerHeight = maxTileY - minTileY + 1
                const extraRows = Math.max(0, HORIZONTAL_DOOR_HEIGHT_TILES - markerHeight)
                minTileY -= Math.floor(extraRows / 2)
                maxTileY += Math.ceil(extraRows / 2)

                for (let tileY = minTileY; tileY <= maxTileY; tileY++) {
                    for (let tileX = minTileX; tileX <= maxTileX; tileX++) {
                        if (tileY >= 0 && tileY < map.height) {
                            guideline.removeTileAt(tileX, tileY, false, true)
                        }
                    }
                }
            }

            const minX = minTileX * map.tileWidth
            const minY = minTileY * map.tileHeight
            const maxX = (maxTileX + 1) * map.tileWidth
            const maxY = (maxTileY + 1) * map.tileHeight
            return {
                ...group,
                bounds: new Phaser.Geom.Rectangle(minX, minY, maxX - minX, maxY - minY),
                centerX: (minX + maxX) / 2,
                centerY: (minY + maxY) / 2,
            }
        })
    }

    private createDoorIndicators() {
        for (const doorway of this.doorways) {
            const direction = DIRECTION_VECTORS[doorway.direction]
            const destinationColumn = doorway.roomColumn + direction.x
            const destinationRow = doorway.roomRow + direction.y
            const hasDestinationDoor = this.doorways.some((candidate) =>
                candidate.roomColumn === destinationColumn
                && candidate.roomRow === destinationRow
                && candidate.direction === OPPOSITE_DIRECTIONS[doorway.direction],
            )
            if (!hasDestinationDoor) continue

            const roomLabel = getGameRoomLabel(destinationColumn, destinationRow)
            const labelText = this.add.text(0, 0, `TO: ${roomLabel}`, {
                fontFamily: "monospace",
                fontSize: "11px",
                color: "#f5f1e5",
            }).setOrigin(0.5)
            const labelBox = this.add.rectangle(0, 0, labelText.width + 14, labelText.height + 8, 0x181a16, 0.94)
                .setStrokeStyle(1, 0xc6c0a9, 0.95)
            const inwardX = -direction.x * this.tileWidth * 1.5
            const inwardY = -direction.y * this.tileHeight * 1.5
            const signX = doorway.centerX + inwardX
            const signY = doorway.centerY + inwardY
            const signRotation = doorway.direction === "left" || doorway.direction === "right"
                ? Math.PI / 2
                : 0
            this.add.container(signX, signY, [labelBox, labelText])
                .setRotation(signRotation)
                .setDepth(signY + 1000)

            const arrow = this.add.text(
                doorway.centerX - direction.x * this.tileWidth * 0.75,
                doorway.centerY - direction.y * this.tileHeight * 0.75,
                DOOR_ARROWS[doorway.direction],
                {
                    fontFamily: "monospace",
                    fontSize: "24px",
                    color: "#f5d88b",
                    stroke: "#181a16",
                    strokeThickness: 4,
                },
            ).setOrigin(0.5).setDepth(9000)

            this.tweens.add({
                targets: arrow,
                x: arrow.x + direction.x * 7,
                y: arrow.y + direction.y * 7,
                duration: 720,
                ease: "Sine.InOut",
                yoyo: true,
                repeat: -1,
            })
        }
    }

    private createPlayer(guideline: Phaser.Tilemaps.TilemapLayer): void {
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
        this.gKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.G)
        this.mKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.M)
    }

    private createInteractiveObjects() {
        this.addInteractiveObject({
            id: "resume-full-stack",
            x: 1140,
            y: 800,
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
            label: "RESUME - FULL STACK",
            action: () => {
                this.resumePanelOpen = true
                this.previous.panelDirection = Math.sign(this.inputState.move.x)
                this.player.setVelocity(0, 0)
                this.game.events.emit(GAME_EVENTS.RESUME_OPEN, RESUME_DOCUMENTS.fullStack)
            },
        })
        this.addInteractiveObject({
            id: "resume-devops",
            x: 1260,
            y: 800,
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
            label: "RESUME - DEVOPS",
            action: () => {
                this.resumePanelOpen = true
                this.previous.panelDirection = Math.sign(this.inputState.move.x)
                this.player.setVelocity(0, 0)
                this.game.events.emit(GAME_EVENTS.RESUME_OPEN, RESUME_DOCUMENTS.devOps)
            },
        })

        this.addSocialPedestal(
            "social-linkedin",
            "LINKEDIN",
            "linkedinIcon",
            "https://www.linkedin.com/in/liam-huynh-91aa1a1a1/",
            1000,
            1080,
        )
        this.addSocialPedestal(
            "social-github",
            "GITHUB",
            "githubIcon",
            "https://github.com/huynhli",
            1200,
            1080,
        )
        this.addSocialPedestal(
            "social-itch",
            "ITCH.IO",
            "itchIcon",
            "https://trachscor.itch.io/",
            1400,
            1080,
        )

        // The room map contains two TBSP rooms, so both point to the same company site.
        this.addCompanyPedestal(
            "company-tbsp-west",
            "TBSP GAMES",
            "tbspGamesProfile",
            "https://tablespoongames.pages.dev/",
            400,
            960,
        )
        this.addCompanyPedestal(
            "company-tbsp-east",
            "TBSP GAMES",
            "tbspGamesProfile",
            "https://tablespoongames.pages.dev/",
            2000,
            960,
        )
        this.addCompanyPedestal(
            "company-geotab",
            "GEOTAB",
            "geotabProfile",
            "https://www.geotab.com/",
            2000,
            1600,
            80,
        )
        this.addCompanyPedestal(
            "company-barel",
            "BAREL",
            "barelProfile",
            "https://bareltec.com/",
            1200,
            1600,
        )
    }

    private addInteractiveObject(config: InteractiveGameObjectConfig) {
        this.interactiveObjects.push(new InteractiveGameObject(this, config))
    }

    private addSocialPedestal(id: string, label: string, textureKey: string, url: string, x: number, y: number) {
        this.addInteractiveObject({
            id,
            x,
            y,
            interactionRadius: 96,
            pedestalTextureKey: "resumePedestal",
            pedestalWidth: 64,
            pedestalHeight: 64,
            pedestalOffsetY: 16,
            icons: [{ textureKey, width: 32, height: 32, fit: "contain" }],
            label,
            action: () => window.open(url, "_blank", "noopener,noreferrer"),
        })
    }

    private addCompanyPedestal(
        id: string,
        label: string,
        textureKey: string,
        url: string,
        x: number,
        y: number,
        iconWidth = 48,
        iconHeight = 48,
    ) {
        this.addInteractiveObject({
            id,
            x,
            y,
            interactionRadius: 112,
            pedestalTextureKey: "resumePedestal",
            pedestalWidth: 88,
            pedestalHeight: 88,
            pedestalOffsetY: 18,
            icons: [{ textureKey, width: iconWidth, height: iconHeight, fit: "contain" }],
            label,
            action: () => window.open(url, "_blank", "noopener,noreferrer"),
        })
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

        const keyboardBack = this.escKey.isDown
        const keyboardInteract = this.eKey.isDown
        const keyboardWebsite = this.gKey.isDown
        const keyboardMap = this.mKey.isDown
        const gamepadBack = !!pad?.buttons[9]?.pressed
        const gamepadInteract = !!pad?.buttons[0]?.pressed
        const gamepadWebsite = !!pad?.buttons[3]?.pressed
        const gamepadMap = !!pad?.buttons[8]?.pressed
        const backDown = keyboardBack || gamepadBack
        const interactDown = keyboardInteract || gamepadInteract
        const websiteDown = keyboardWebsite || gamepadWebsite
        const mapDown = keyboardMap || gamepadMap

        this.inputState.backPressed = backDown && !this.previous.back
        this.inputState.interactPressed = interactDown && !this.previous.interact
        this.inputState.websitePressed = websiteDown && !this.previous.website
        this.inputState.mapPressed = mapDown && !this.previous.map
        this.previous.back = backDown
        this.previous.interact = interactDown
        this.previous.website = websiteDown
        this.previous.map = mapDown

        const keyboardUsed = keyboardLeft || keyboardRight || keyboardUp || keyboardDown || keyboardBack || keyboardInteract || keyboardWebsite || keyboardMap
        const gamepadUsed = dpadActive || stickActive || gamepadBack || gamepadInteract || gamepadWebsite || gamepadMap
        if (gamepadUsed) this.lastInputDevice = "gamepad"
        else if (keyboardUsed) this.lastInputDevice = "keyboard"
        if (this.lastInputDevice !== this.notifiedInputDevice) {
            this.notifiedInputDevice = this.lastInputDevice
            this.game.events.emit(GAME_EVENTS.INPUT_DEVICE_CHANGED, this.lastInputDevice)
        }

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

    private readStartMenuInput() {
        const pad = this.input.gamepad?.pad1
        const dpadLeft = !!pad?.buttons[14]?.pressed
        const dpadRight = !!pad?.buttons[15]?.pressed
        const dpadUp = !!pad?.buttons[12]?.pressed
        const dpadDown = !!pad?.buttons[13]?.pressed
        const stickX = pad?.leftStick.x ?? 0
        const stickY = pad?.leftStick.y ?? 0
        const direction = dpadLeft || dpadUp
            ? -1
            : dpadRight || dpadDown
                ? 1
                : Math.max(Math.abs(stickX), Math.abs(stickY)) > 0.45
                    ? Math.abs(stickX) > Math.abs(stickY) ? Math.sign(stickX) : Math.sign(stickY)
                    : 0

        if (direction !== 0 && direction !== this.startMenuDirection) {
            this.game.events.emit(GAME_EVENTS.START_MENU_NAVIGATE, direction)
            this.game.events.emit(GAME_EVENTS.INPUT_DEVICE_CHANGED, "gamepad")
            this.notifiedInputDevice = "gamepad"
            this.lastInputDevice = "gamepad"
        }
        this.startMenuDirection = direction

        const selectDown = !!pad?.buttons[0]?.pressed
        if (selectDown && !this.startMenuSelectDown) {
            this.game.events.emit(GAME_EVENTS.START_MENU_SELECT)
            this.game.events.emit(GAME_EVENTS.INPUT_DEVICE_CHANGED, "gamepad")
            this.notifiedInputDevice = "gamepad"
            this.lastInputDevice = "gamepad"
        }
        this.startMenuSelectDown = selectDown
    }

    private startGame = () => {
        this.gameStarted = true
        // Don't let the menu's confirm button activate a nearby game object.
        this.previous.interact = true
    }

    private toggleMap = () => {
        if (this.resumePanelOpen) return

        this.mapOpen = !this.mapOpen
        this.player.setVelocity(0, 0)
        this.game.events.emit(this.mapOpen ? GAME_EVENTS.MAP_OPEN : GAME_EVENTS.MAP_CLOSE)
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
        if (this.inputState.websitePressed) {
            this.game.events.emit(GAME_EVENTS.NAVIGATE_WEBSITE)
            return true
        }

        if (this.inputState.interactPressed) this.activeObject?.activate()
        return this.resumePanelOpen
    }

    private handleResumePanelInput() {
        if (this.inputState.panelNavigate !== 0) {
            this.game.events.emit(GAME_EVENTS.RESUME_NAVIGATE, this.inputState.panelNavigate)
        }

        if (this.inputState.websitePressed) {
            this.game.events.emit(GAME_EVENTS.NAVIGATE_WEBSITE)
        } else if (this.inputState.backPressed) {
            this.game.events.emit(GAME_EVENTS.RESUME_BACK)
        } else if (this.inputState.interactPressed) {
            this.game.events.emit(GAME_EVENTS.RESUME_SELECT)
        }
    }

    private updateDoorTransitions(): boolean {
        const doorway = this.doorways.find((candidate) =>
            candidate.roomColumn === this.currentRoom.column
            && candidate.roomRow === this.currentRoom.row
            && candidate.bounds.contains(this.player.x, this.player.y),
        )
        if (!doorway) return false

        const direction = DIRECTION_VECTORS[doorway.direction]
        const destinationColumn = doorway.roomColumn + direction.x
        const destinationRow = doorway.roomRow + direction.y
        const destinationDoor = this.doorways.find((candidate) =>
            candidate.roomColumn === destinationColumn
            && candidate.roomRow === destinationRow
            && candidate.direction === OPPOSITE_DIRECTIONS[doorway.direction],
        )
        if (!destinationDoor) return false

        const destinationFacing = DIRECTION_VECTORS[destinationDoor.direction]
        this.player.setPosition(
            destinationDoor.centerX - destinationFacing.x * this.tileWidth,
            destinationDoor.centerY - destinationFacing.y * this.tileHeight,
        )
        this.player.setVelocity(0, 0)
        this.player.setDepth(this.player.y)
        this.currentRoom = { column: destinationColumn, row: destinationRow }
        this.game.events.emit(GAME_EVENTS.MAP_ROOM_CHANGED, this.currentRoom)
        this.setCameraRoom(destinationColumn, destinationRow)
        this.cameras.main.centerOn(this.player.x, this.player.y)
        return true
    }

    private roomAt(x: number, y: number) {
        return {
            column: Phaser.Math.Clamp(Math.floor(x / this.roomWidth), 0, this.roomColumns - 1),
            row: Phaser.Math.Clamp(Math.floor(y / this.roomHeight), 0, this.roomRows - 1),
        }
    }

    private setCameraRoom(column: number, row: number) {
        this.cameras.main.setBounds(column * this.roomWidth, row * this.roomHeight, this.roomWidth, this.roomHeight)
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

export default function GamePage() {
    const gameContainerRef = useRef<HTMLDivElement>(null)
    const gameRef = useRef<Phaser.Game | null>(null)
    const pendingStartRef = useRef(false)
    const navigate = useNavigate()
    const [gameInstance, setGameInstance] = useState<Phaser.Game | null>(null)
    const [resumePanelOpen, setResumePanelOpen] = useState(false)
    const [resumeDocument, setResumeDocument] = useState<ResumeDocument>(RESUME_DOCUMENTS.fullStack)
    const [inputDevice, setInputDevice] = useState<ControlDevice>("keyboard")
    const [gameReady, setGameReady] = useState(false)
    const [startMenuOpen, setStartMenuOpen] = useState(true)
    const [homeIntroVisible, setHomeIntroVisible] = useState(false)
    const [mapOpen, setMapOpen] = useState(false)
    const [currentRoom, setCurrentRoom] = useState<GameRoomLocation>({ column: 1, row: 1 })

    const beginPlayTransition = () => {
        setStartMenuOpen(false)
        setHomeIntroVisible(true)
    }

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
                    debug: false,
                },
            },
            input: { gamepad: true },
        })

        const openResumePanel = (resume: ResumeDocument) => {
            setResumeDocument(resume)
            setResumePanelOpen(true)
        }
        const changeInputDevice = (device: ControlDevice) => setInputDevice(device)
        const navigateToWebsite = () => navigate("/notGame")
        const showMap = () => setMapOpen(true)
        const hideMap = () => setMapOpen(false)
        const changeRoom = (room: GameRoomLocation) => setCurrentRoom(room)
        const markGameReady = () => {
            setGameReady(true)
            if (pendingStartRef.current) {
                pendingStartRef.current = false
                beginPlayTransition()
            }
        }
        game.events.on(GAME_EVENTS.RESUME_OPEN, openResumePanel)
        game.events.on(GAME_EVENTS.INPUT_DEVICE_CHANGED, changeInputDevice)
        game.events.on(GAME_EVENTS.NAVIGATE_WEBSITE, navigateToWebsite)
        game.events.on(GAME_EVENTS.GAME_READY, markGameReady)
        game.events.on(GAME_EVENTS.MAP_OPEN, showMap)
        game.events.on(GAME_EVENTS.MAP_CLOSE, hideMap)
        game.events.on(GAME_EVENTS.MAP_ROOM_CHANGED, changeRoom)
        gameRef.current = game
        setGameInstance(game)

        return () => {
            game.events.off(GAME_EVENTS.RESUME_OPEN, openResumePanel)
            game.events.off(GAME_EVENTS.INPUT_DEVICE_CHANGED, changeInputDevice)
            game.events.off(GAME_EVENTS.NAVIGATE_WEBSITE, navigateToWebsite)
            game.events.off(GAME_EVENTS.GAME_READY, markGameReady)
            game.events.off(GAME_EVENTS.MAP_OPEN, showMap)
            game.events.off(GAME_EVENTS.MAP_CLOSE, hideMap)
            game.events.off(GAME_EVENTS.MAP_ROOM_CHANGED, changeRoom)
            game.destroy(true)
            gameRef.current = null
        }
    }, [navigate])

    const closeResumePanel = () => {
        gameRef.current?.events.emit(GAME_EVENTS.RESUME_CLOSE)
        setResumePanelOpen(false)
    }

    const startGame = () => {
        if (!gameReady) {
            pendingStartRef.current = true
            return
        }
        beginPlayTransition()
    }

    return (
        <div className="relative flex h-screen w-full flex-col">
            <div className="min-h-0 w-full flex-1" ref={gameContainerRef} />
            {!startMenuOpen && (
                <GameTutorialHud device={inputDevice} onGoToWebsite={() => navigate("/notGame")} />
            )}
            {!startMenuOpen && !homeIntroVisible && !mapOpen && gameInstance && (
                <GameMapButton
                    device={inputDevice}
                    onClick={() => gameInstance.events.emit(GAME_EVENTS.MAP_TOGGLE)}
                />
            )}
            {mapOpen && <GameMapOverlay currentRoom={currentRoom} />}
            {startMenuOpen && gameInstance && (
                <GameStartMenu
                    game={gameInstance}
                    onPlay={startGame}
                    onWebsite={() => navigate("/notGame")}
                />
            )}
            {homeIntroVisible && (
                <div
                    className="game-home-intro"
                    role="status"
                    onAnimationEnd={() => {
                        gameRef.current?.events.emit(GAME_EVENTS.START_GAME)
                        setHomeIntroVisible(false)
                    }}
                >
                    <span>Home</span>
                </div>
            )}
            {resumePanelOpen && gameInstance && (
                <ResumePdfPanel game={gameInstance} onClose={closeResumePanel} resume={resumeDocument} />
            )}
        </div>
    )
}
