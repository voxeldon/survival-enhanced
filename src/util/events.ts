import { Block, ItemStack, ItemUseOnBeforeEvent, ItemUseOnBeforeEventSignal, Player, PlayerBreakBlockBeforeEvent, PlayerBreakBlockBeforeEventSignal, system, world } from "@minecraft/server";
import { CommonUtil } from "./common";
import { Config, CONFIG } from "../config";
import { AutoPlacer } from "./auto_placer";

export class EventManager {
    public  static CONFIG_CASHE: Config = CONFIG;
    private static block_break_event_signal: PlayerBreakBlockBeforeEventSignal = world.beforeEvents.playerBreakBlock;
    private static item_use_on_event_signal: ItemUseOnBeforeEventSignal = world.beforeEvents.itemUseOn;
    private static block_break_event: ((arg: PlayerBreakBlockBeforeEvent) => void) | undefined = undefined;
    private static item_use_on_event: ((arg: ItemUseOnBeforeEvent) => void) | undefined = undefined;
    private static item_use_index: Set<string> = new Set<string>();
    

    public static update_config_cashe(config: Config){
        EventManager.CONFIG_CASHE = config;
    }

    public static initalize_events(){
        EventManager.block_break_event = EventManager.block_break_event_signal.subscribe(EventManager.on_block_break);
        EventManager.item_use_on_event = EventManager.item_use_on_event_signal.subscribe(EventManager.on_item_use_on);
    }
    public static terminate_events(){
        if (EventManager.block_break_event) EventManager.block_break_event_signal.unsubscribe(EventManager.block_break_event);
        if (EventManager.item_use_on_event) EventManager.item_use_on_event_signal.unsubscribe(EventManager.item_use_on_event);
    }

    private static on_item_use_on(event: ItemUseOnBeforeEvent) {
        if (EventManager.CONFIG_CASHE.auto_placer.enabled) {
            const player: Player = event.source;
            if (player.isSneaking) {
                if (EventManager.item_use_index.has(player.id)) return;
                event.cancel = true;
                const run_callback: number = system.run(()=>{
                    AutoPlacer.on_ready(event)
                })
                const clear_index: number = system.runTimeout(()=>{
                    EventManager.item_use_index.delete(player.id);
                    system.clearRun(run_callback);
                    system.clearRun(clear_index);
                },20)
                EventManager.item_use_index.add(player.id);
            }
        }
    }

    private static on_block_break(event: PlayerBreakBlockBeforeEvent){
        const player: Player = event.player;
        if (player.isSneaking) {
            if (EventManager.CONFIG_CASHE.tag_id) if (!player.hasTag(EventManager.CONFIG_CASHE.tag_id)) return;
            const block: Block = event.block;
            const item_stack: ItemStack | undefined = event.itemStack;
            if (!item_stack) return;
            if (
                EventManager.CONFIG_CASHE.wood.enabled && 
                (block.typeId.endsWith('_log') || EventManager.CONFIG_CASHE.wood.exceptions ?.includes(block.typeId)) && 
                item_stack.hasTag(EventManager.CONFIG_CASHE.wood.tag_id)
            ) {
                CommonUtil.on_break(block, item_stack, player, EventManager.CONFIG_CASHE.wood.max_search_depth, true);
                event.cancel = true;
            }
            else if (
                EventManager.CONFIG_CASHE.ore.enabled && 
                (block.typeId.endsWith('_ore')  || EventManager.CONFIG_CASHE.ore.exceptions ?.includes(block.typeId) ) && 
                item_stack.hasTag(EventManager.CONFIG_CASHE.ore.tag_id)
            ) {
                CommonUtil.on_break(block, item_stack, player, EventManager.CONFIG_CASHE.ore.max_search_depth, true);
                event.cancel = true;
            }
            else if (
                EventManager.CONFIG_CASHE.crop.enabled && 
                (block.hasTag('minecraft:crop') || EventManager.CONFIG_CASHE.crop.exceptions ?.includes(block.typeId)) && 
                item_stack.hasTag(EventManager.CONFIG_CASHE.crop.tag_id)
            ) {
                CommonUtil.on_break(block, item_stack, player, EventManager.CONFIG_CASHE.crop.max_search_depth, true, {state:"growth", equals: 7});
                event.cancel = true;
            }
            else if (
                EventManager.CONFIG_CASHE.diggable.enabled && 
                EventManager.CONFIG_CASHE.diggable.exceptions ?.includes(block.typeId) &&
                item_stack.hasTag(EventManager.CONFIG_CASHE.diggable.tag_id) 
            ) {
                CommonUtil.on_break(block, item_stack, player, EventManager.CONFIG_CASHE.diggable.max_search_depth, false);
                event.cancel = true;
            }
        }
    }
}