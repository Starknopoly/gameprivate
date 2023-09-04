import { Coord } from "@latticexyz/utils";
import { Direction } from "../dojo/createSystemCalls";
import { MAP_WIDTH } from "../phaser/constants";

export function isValidArray(input: any): input is any[] {
    return Array.isArray(input) && input != null;
}

export function getFirstComponentByType(entities: any[] | null | undefined, typename: string): any | null {
    if (!isValidArray(entities)) return null;

    for (let entity of entities) {
        if (isValidArray(entity?.node.components)) {
            const foundComponent = entity.node.components.find((comp: any) => comp.__typename === typename);
            if (foundComponent) return foundComponent;
        }
    }

    return null;
}

export function extractAndCleanKey(entities?: any[] | null | undefined): string | null {
    if (!isValidArray(entities) || !entities[0]?.keys) return null;

    return entities[0].keys.replace(/,/g, '');
}

export function updatePositionWithDirection(direction: Direction, value: { x: number, y: number }) {
    switch (direction) {
        case Direction.Left:
            value.x--;
            break;
        case Direction.Right:
            value.x++;
            break;
        case Direction.Up:
            value.y--;
            break;
        case Direction.Down:
            value.y++;
            break;
        default:
            throw new Error("Invalid direction provided");
    }
    return value;
}

export function getRandomIntBetween(m: number, n: number): number {
    return m + Math.floor(Math.random() * (n - m + 1));
}

export function positionToCoorp(position: number): Coord {
    const size = MAP_WIDTH
    const ycount = Math.floor(position / size)
    var x = position % size
    if (ycount % 2 == 0) {
        x = position % size;
    }
    if (ycount % 2 == 1) {
        x = size - position % size - 1
    }
    const y = ycount * 2 + 1
    return { x: x, y: y };
}

export function truncateString(str: string, frontLen: number, endLen: number) {
    return str.slice(0, frontLen) + '...' + str.slice(-endLen);
  }
  