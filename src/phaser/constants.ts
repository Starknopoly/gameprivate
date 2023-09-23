export enum Scenes {
    Main = "Main",
}

export enum Maps {
    Main = "Main",
}

export enum Animations {
    SwordsmanIdle = "SwordsmanIdle",
    SwordsmanIdleReverse = "SwordsmanIdleReverse",
}
export enum Sprites {
    Soldier,
}

export enum Assets {
    MainAtlas = "MainAtlas",
    Tileset = "Tileset"
}

export enum Direction {
    Unknown,
    Up,
    Down,
    Left,
    Right
}

export const TILE_HEIGHT = 32;
export const TILE_WIDTH = 32;

// contract offset so we don't overflow
export const POSITION_OFFSET = 1000;

export const MAP_WIDTH = 30
export const MAP_HEIGHT = 30