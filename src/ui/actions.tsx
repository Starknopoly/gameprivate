import { useEffect, useMemo, useState } from "react";
import { BuildingList, OptionType } from "./buildinglist";
import { ClickWrapper } from "./clickWrapper";
import { Tileset } from "../artTypes/world";
import { store } from "../store/store";
import { tileCoordToPixelCoord } from "@latticexyz/phaserx";
import { MAP_WIDTH, TILE_HEIGHT, TILE_WIDTH } from "../phaser/constants";
import { mapIdToBuildingId, positionToBuildingCoorp, positionToCoorp, toastError, toastInfo, toastSuccess, toastWarning } from "../utils";
import { BANK_ID, BUILDING_PRICES, HOTEL_ID, STARKBUCKS_ID } from "../config";
import { Player } from "../dojo/createSystemCalls";
import { EntityIndex, getComponentValue, setComponent } from "@latticexyz/recs";
import { PlayerState } from "../types/playerState";
import { Building } from "../types";
import { playerStore } from "../store/playerStore";
import { actionStore } from "../store/actionstore";

export default function ActionsUI() {
    const { account, buildings, phaserLayer } = store();
    const {actions} = actionStore()
    const { player, playerState } = playerStore()

    const {
        scenes: {
            Main: {
                camera,
                maps: {
                    Main: { putTileAt },
                },
            },
        },
        networkLayer: {
            components,
            systemCalls: { buyBuilding, buyBack, explode },
        },
    } = phaserLayer!;

    useEffect(() => {
        const x = MAP_WIDTH / 2
        const y = x
        const pixelPosition = tileCoordToPixelCoord({ x, y }, TILE_WIDTH, TILE_HEIGHT);
        camera.centerOn(pixelPosition?.x!, pixelPosition?.y!);
    }, [])

    const [selectBuild, setSelectBuild] = useState("Hotel")
    const options: OptionType[] = [
        { value: 'Hotel', label: 'Hotel($100)' },
        { value: 'Bank', label: 'Bank($500)' },
        { value: 'Starkbucks', label: 'Starkbucks($500)' }
    ];

    const [selectBomb, setSelectBomb] = useState("10")
    const bomboptions: OptionType[] = [
        { value: '10', label: 'Lv1 : $10' },
        { value: '20', label: 'Lv2 : $20' },
        { value: '50', label: 'Lv3 : $50' },
        { value: '100', label: 'Lv4 : $100' },
        { value: '200', label: 'Lv5 : $200' },
        { value: '300', label: 'Lv6 : $300' },
        { value: '500', label: 'Lv7 : $500' },
        { value: '1000', label: 'Lv8 : $1000' },
    ];

    const handleSelectionChange = (value: string) => {
        console.log('Selected:', value);
        setSelectBuild(value)
    };

    const hasBuilding = (position: number) => {
        const build = buildings.get(position)
        if (build) {
            if (build.type == 0) {
                if (build.enable) {
                    return true
                }
            } else {
                return true
            }
        }
        return false
    }

    const placeBomb = async () => {
        if (!account) {
            toastError("Create burner wallet first.")
            return
        }
        if (!player) {
            toastError("Start game first.")
            return
        }
        if (playerState != PlayerState.IDLE && playerState != PlayerState.WALK_END) {
            return
        }
        if (player.position == 1) {
            toastInfo("First land is reserved.")
            return
        }
        const has = hasBuilding(player.position)
        if (has) {
            toastWarning("There is a building")
            return
        }
        if (player.gold < parseInt(selectBomb)) {
            toastWarning("Gold is not enough")
            return
        }
        const coord = positionToBuildingCoorp(player.position)

        const events = await explode(account, parseInt(selectBomb))
        if (events) {
            if (events.length != 0) {
                //TODO : check there is building
                const entityId = parseInt(account.address) as EntityIndex
                const player = events[0] as Player

                setComponent(components.Player, entityId, {
                    banks:player.banks,
                    position: player.position,
                    joined_time: player.joined_time,
                    direction: player.direction,
                    nick_name: player.nick_name,
                    gold: player.gold,
                    steps: player.steps,
                    last_point: player.last_point,
                    last_time: player.last_time,
                    total_steps:player.total_steps
                })
                putTileAt({ x: coord.x, y: coord.y }, Tileset.Bomb, "Foreground");
                actions.push("Place $" + selectBomb + " bomb at : " + player.position)
                toastSuccess("Place $" + selectBomb + " bomb success")
                return
            }
        }

        // alert("Something wrong")
        toastError("Something error. Please refresh page")
    }

    const buildClick = async () => {
        if (!account) {
            toastError("Create burner wallet first.")
            return
        }
        if (!player) {
            toastError("Start game first.")
            return
        }
        if (playerState != PlayerState.IDLE && playerState != PlayerState.WALK_END) {
            return
        }
        if (player.position == 1) {
            toastInfo("First land is reserved.")
            return
        }
        const has = hasBuilding(player.position)
        if (has) {
            toastWarning("There is a building")
            return
        }
        const coord = positionToBuildingCoorp(player.position)

        var id = Tileset.Bank
        var price = 0
        switch (selectBuild) {
            case "Bank": id = Tileset.Bank; price = BUILDING_PRICES['Bank']; break;
            case "Hotel": id = Tileset.Hotel; price = BUILDING_PRICES['Hotel']; break;
            case "Starkbucks": id = Tileset.Starkbucks; price = BUILDING_PRICES['Starkbucks']; break;
        }
        console.log("buildClick gold:" + player.gold + ",price:" + price);
        console.log(coord);
        var buildingId = mapIdToBuildingId(id)
        if (player.gold < price) {
            toastWarning("Gold is not enough")
            return
        }

        const events = await buyBuilding(account, buildingId)
        if (events.length == 0) {
            toastError("Build fail. Please refresh and retry.")
        } else {
            const playerEvent = events[0] as Player;
            const entity = parseInt(events[0].entity.toString()) as EntityIndex;
            setComponent(components.Player, entity, {
                banks:playerEvent.banks,
                nick_name: playerEvent.nick_name,
                position: playerEvent.position,
                joined_time: playerEvent.joined_time,
                direction: playerEvent.direction,
                gold: playerEvent.gold,
                steps: playerEvent.steps,
                last_point: playerEvent.last_point,
                last_time: playerEvent.last_time,
                total_steps:playerEvent.total_steps
            });

            putTileAt({ x: coord.x, y: coord.y }, id, "Foreground");
            putTileAt({ x: coord.x, y: coord.y }, Tileset.Heart, "Top");
            actions.push("Build " + selectBuild + " at : " + player.position)
            toastSuccess("Build " + selectBuild + " success")
        }

    }

    const buyBackClick = async () => {
        if (!account) {
            toastError("Create burner wallet first.")
            return
        }
        if (!player) {
            toastError("Start game first.")
            return
        }
        if (playerState != PlayerState.IDLE && playerState != PlayerState.WALK_END) {
            return
        }
        const postion = player.position
        const building = buildings.get(postion)
        if (building) {
            if (building.owner == account.address) {
                toastWarning("Can't buy your building")
                return
            }
            if (player.gold < building.price * 1.3) {
                toastWarning("Gold is not enough. Need $" + (building.price * 1.3).toFixed(0))
                return
            }
        } else {
            toastWarning("No building here")
            return
        }

        const events = await buyBack(account)
        if (events.length == 0) {
            toastError("Buy back fail. Please refresh and retry.")
        } else {
            const playerEvent = events[0] as Player;
            const entity = parseInt(events[0].entity.toString()) as EntityIndex;
            setComponent(components.Player, entity, {
                banks:playerEvent.banks,
                nick_name: playerEvent.nick_name,
                position: playerEvent.position,
                joined_time: playerEvent.joined_time,
                direction: playerEvent.direction,
                gold: playerEvent.gold,
                steps: playerEvent.steps,
                last_point: playerEvent.last_point,
                last_time: playerEvent.last_time,
                total_steps:playerEvent.total_steps
            });
            toastSuccess("Buy back success")
            actions.push("Buy back " + (building.getName()) + " at : " + player.position + ", spend $" + (building.price * 1.3).toFixed(2))
        }

    }

    const getBombLevel = useMemo(() => {
        let price = parseInt(selectBomb)
        for (let index = 0; index < Building.BombPrices.length; index++) {
            const element = Building.BombPrices[index];
            if (element == price) {
                var level = index + 1
                return "Lv" + level
            }
        }
        return "Lv1"
    }, [selectBomb])

    return (<ClickWrapper style={{ display: "flex", flexDirection: "column" }}>

        <BuildingList options={options} onChange={handleSelectionChange} defaultValue="Hotel" />
        <button onClick={() => buildClick()}>Build {selectBuild}</button>

        <div style={{ marginTop: 15 }}></div>
        <BuildingList options={bomboptions} onChange={(value) => setSelectBomb(value)} defaultValue="10" />
        <button onClick={() => placeBomb()} >Place Bomb {getBombLevel}</button>

        <button onClick={() => buyBackClick()} style={{ marginTop: 15 }}>Buy Back Building</button>
    </ClickWrapper>)
}