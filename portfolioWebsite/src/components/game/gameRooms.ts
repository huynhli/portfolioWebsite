export type GameRoomLocation = {
    column: number
    row: number
}

// Grid order, top-left to bottom-right.
export const GAME_ROOM_LABELS = [
    ["Next Up", "Beginning", "Web Intro"],
    ["TBSP", "Home", "TBSP"],
    ["Games Intro", "BAREL", "Geotab"],
] as const

export function getGameRoomLabel(column: number, row: number): string {
    return GAME_ROOM_LABELS[row]?.[column] ?? "Unknown"
}
