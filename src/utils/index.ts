import { Coord } from "@latticexyz/utils";
import { Direction } from "../dojo/createSystemCalls";
import { MAP_WIDTH } from "../phaser/constants";
import { Tileset } from "../artTypes/world";
import { BANK_ID, BOMB_ID, HOTEL_ID, STARKBUCKS_ID } from "../config";
import { ToastContainer, toast } from 'react-toastify';
import * as scure from "@scure/starknet"

export function isValidArray(input: any): input is any[] {
    return Array.isArray(input) && input != null;
}

export const getTimestamp = () => {
    let timestamp = Math.floor(Date.now());
    // console.log(timestampInSeconds);
    return timestamp;
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
    const y = ycount * 3 + 1
    return { x: x, y: y };
}

export function positionToBuildingCoorp(position: number): Coord {
    const size = MAP_WIDTH
    position = position - 1
    const ycount = Math.floor(position / size)
    var x = position % size
    if (ycount % 2 == 0) {
        x = position % size;
    }
    if (ycount % 2 == 1) {
        x = size - position % size - 1
    }
    const y = ycount * 3

    return { x: x, y: y }
}

export function buildingCoorpToPosition(coord: Coord): number {
    var position = -1
    const size = MAP_WIDTH
    const x = coord.x
    const y = coord.y

    if (y % 3 != 0) {
        return position
    }
    if (x >= size) {
        return position
    }
    if(x<0){
        return position
    }

    const ycount = Math.floor(y / 3)
    if (ycount % 2 == 0) {
        position = ycount * size + x
    }
    if (ycount % 2 == 1) {
        position = ycount * size - x - 1 + size
    }
    position = position + 1;
    return position
}

export function mapIdToBuildingId(mapid: number): number {
    var buildingId = 1
    switch (mapid) {
        case Tileset.Bank: buildingId = BANK_ID; break;
        case Tileset.Hotel: buildingId = HOTEL_ID; break;
        case Tileset.Starkbucks: buildingId = STARKBUCKS_ID; break;
    }
    return buildingId;
}

export function buildingIdToMapid(buildingId: number): number {
    var mapid = 0
    switch (buildingId) {
        case BOMB_ID: mapid = Tileset.Bomb; break;
        case BANK_ID: mapid = Tileset.Bank; break;
        case HOTEL_ID: mapid = Tileset.Hotel; break;
        case STARKBUCKS_ID: mapid = Tileset.Starkbucks; break;
    }
    return mapid
}


export function truncateString(str: string, frontLen: number, endLen: number) {
    return str.slice(0, frontLen) + '..' + str.slice(-endLen);
}

export function stringToHex(str: string): string {
    return Array.from(encodeURI(str)).map(char => {
        return char.charCodeAt(0).toString(16);
    }).join('');
}

export function hexToString(hex: string | undefined): string {
    if (!hex) {
        return ''
    }
    try {
        let str = '';
        for (let i = 0; i < hex.length; i += 2) {
            str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
        }
        const result = decodeURI(str);
        return result
    } catch (error) {
        console.error(error);
    }
    return ''
}

export function toastError(msg: string) {
    toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
    });
}

export function toastWarning(msg: string) {
    toast.warning(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
    });
}

export function toastInfo(msg: string) {
    toast.info(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
    });
}

export function toastSuccess(msg: string) {
    toast.success(msg, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
        progress: undefined,
        theme: "light",
    });
}

export const landCanBuild = (position: number) => {
    let hashStr = scure.poseidonHashMany([BigInt(position + 1), 2023n, 1024n])
    let hex = BigInt(hashStr.toString(10))
    return hex % 2n == 0n
}