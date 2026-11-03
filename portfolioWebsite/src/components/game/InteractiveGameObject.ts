import Phaser from "phaser"

export type InteractiveGameIconConfig = {
    textureKey: string
    x?: number
    y?: number
    width?: number
    height?: number
    fit?: "contain"
}

export type InteractiveGameObjectConfig = {
    id: string
    x: number
    y: number
    interactionRadius?: number
    pedestalTextureKey?: string
    pedestalWidth?: number
    pedestalHeight?: number
    pedestalOffsetY?: number
    icons: InteractiveGameIconConfig[]
    label: string
    action: () => void
    bobDistance?: number
    bobDuration?: number
}

export class InteractiveGameObject extends Phaser.GameObjects.Container {
    readonly id: string
    readonly interactionRadius: number
    private readonly action: () => void

    constructor(scene: Phaser.Scene, config: InteractiveGameObjectConfig) {
        super(scene, config.x, config.y)

        this.id = config.id
        this.interactionRadius = config.interactionRadius ?? 96
        this.action = config.action

        if (config.pedestalTextureKey) {
            const pedestal = scene.add.image(0, config.pedestalOffsetY ?? 16, config.pedestalTextureKey)
                .setDisplaySize(config.pedestalWidth ?? 64, config.pedestalHeight ?? 64)
            this.add(pedestal)
        }

        const floatingGroup = scene.add.container(0, -38)
        const iconBottom = Math.max(0, ...config.icons.map((icon) => {
            const height = icon.height ?? 28
            return (icon.y ?? 0) + height / 2
        }))

        for (const iconConfig of config.icons) {
            const icon = scene.add.image(iconConfig.x ?? 0, iconConfig.y ?? 0, iconConfig.textureKey)
            const width = iconConfig.width ?? 28
            const height = iconConfig.height ?? 28
            if (iconConfig.fit === "contain") {
                icon.setScale(Math.min(width / icon.width, height / icon.height))
            } else {
                icon.setDisplaySize(width, height)
            }
            floatingGroup.add(icon)
        }

        const labelY = iconBottom + 12
        const label = scene.add.text(0, labelY, config.label, {
            fontFamily: "monospace",
            fontSize: "10px",
            color: "#f4f1e8",
        }).setOrigin(0.5)
        const labelBox = scene.add.rectangle(0, labelY, label.width + 12, label.height + 6, 0x181a16, 0.94)
            .setStrokeStyle(1, 0xc6c0a9, 0.95)

        floatingGroup.add([labelBox, label])
        this.add(floatingGroup)
        scene.add.existing(this)
        this.setDepth(config.y)

        scene.tweens.add({
            targets: floatingGroup,
            y: floatingGroup.y - (config.bobDistance ?? 5),
            duration: config.bobDuration ?? 1100,
            ease: "Sine.InOut",
            yoyo: true,
            repeat: -1,
        })
    }

    activate() {
        this.action()
    }
}
