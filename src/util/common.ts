import { Block, BlockPermutation, Enchantment, ItemComponentTypes, ItemDurabilityComponent, ItemEnchantableComponent, ItemStack, Player, system } from "@minecraft/server";
import { Vector3 } from "../_import/spec/cls/vector";
import { cls } from "../_import/spec/lib";
import { VanillaData } from "../_import/vanilla_data/lib";
import { LOOT_CONVERSIONS } from "../db/loot_conversion";

interface EnchantmentValues {
    fortune_level: number, 
    silk_touch_level:number
}

export interface StateOptions{
    state: string, 
    equals: string | boolean | number
}

export class CommonUtil {

    public static on_break(block:Block, item_stack: ItemStack, player: Player, search_depth: number,  get_corners: boolean = false, state_options: StateOptions | undefined = undefined): void {
        
        let neighbors: Block[] = []
        if (get_corners === true) neighbors = CommonUtil.get_matching_neighbors(block, search_depth, state_options, get_corners);
        else  neighbors = CommonUtil.get_matching_neighbors(block, search_depth, state_options);
        neighbors.push(block);
        const destroy: number = system.run(()=>{
            const result = CommonUtil.process_item_stack(item_stack, neighbors, player)
            const can_break: boolean = result.successful;
            const enchantment_values: EnchantmentValues = {fortune_level:result.fortune_level, silk_touch_level:result.silk_touch_level};
            if (can_break) {
                CommonUtil.break_blocks(neighbors, enchantment_values);
            }
            else {
                player.onScreenDisplay.setActionBar('Item durability to low.')
            }
            system.clearRun(destroy);
        })
    }

    public static break_blocks(blocks: Block[], enchantment_values: EnchantmentValues){
        const fortune_level: number = enchantment_values.fortune_level;
        const silk_touch_level: number = enchantment_values.silk_touch_level;
        let block_id: string  = blocks[0].typeId;
        for (const block of blocks) {
            const pos: Vector3 = block.location;
            for (const conversion of LOOT_CONVERSIONS) {
                if (conversion.type_id === block.typeId) {
                    if (fortune_level === 0 || silk_touch_level > 0) break;
                    for (let i = 0; i < fortune_level; i++) {
                        if (Math.random() < 0.33) {
                            cls.Item.spawn(cls.Item.new(conversion.loot), block.dimension, block.location);
                        }
                    }
                }
            }
            if (silk_touch_level) {
                cls.Item.spawn(cls.Item.new(block.typeId), block.dimension, block.location);
                block.dimension.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} air replace`);
            } else if (fortune_level > 0 && block_id === VanillaData.MinecraftBlockTypes.Gravel) {
                block.dimension.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} air replace`);
            } else {
                block.dimension.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} air destroy`);
            }
            
        }
    }
    
    public static process_item_stack(item_stack: ItemStack, blocks: Block[], player: Player): {successful: boolean, fortune_level: number, silk_touch_level: number} {
        const durability: ItemDurabilityComponent | undefined = item_stack.getComponent(ItemComponentTypes.Durability);
        const enchantable: ItemEnchantableComponent | undefined = item_stack.getComponent(ItemComponentTypes.Enchantable);

        const blocks_to_break: number = blocks.length;
        const max_durability: number = durability?.maxDurability || 0;
        const current_damage: number = durability?.damage || 0;

        const unbreaking_enchantment: Enchantment | undefined = enchantable?.getEnchantment(VanillaData.MinecraftEnchantmentTypes.Unbreaking);
        const unbreaking_level: number = unbreaking_enchantment?.level || 0;

        const fortune_enchantment: Enchantment | undefined = enchantable?.getEnchantment(VanillaData.MinecraftEnchantmentTypes.Fortune);
        const fortune_level: number = fortune_enchantment?.level || 0;

        const silk_touch_enchantment: Enchantment | undefined = enchantable?.getEnchantment(VanillaData.MinecraftEnchantmentTypes.SilkTouch);
        const silk_touch_level: number = silk_touch_enchantment?.level || 0;

        if (unbreaking_level > 0) {
            if ((blocks_to_break + current_damage / unbreaking_level) < max_durability) {
                if(durability) durability.damage += (blocks_to_break / unbreaking_level);
                cls.PlayerManager.set_equipment(player,item_stack);
                return {successful: true, fortune_level: fortune_level, silk_touch_level: silk_touch_level};
            }
        } else {
            if ((blocks_to_break + current_damage) < max_durability) {
                if(durability) durability.damage += blocks_to_break;
                cls.PlayerManager.set_equipment(player,item_stack);
                return {successful: true, fortune_level: fortune_level, silk_touch_level: silk_touch_level};
            }
        }
        
        return {successful: false, fortune_level: fortune_level, silk_touch_level: silk_touch_level};
    }

    public static get_matching_neighbors(block: Block, search_depth: number, state_options: StateOptions | undefined = undefined, get_corners: boolean = false): Block[] {
        const matching_neighbors: Block[] = [];
        const visited: Set<string> = new Set();
        const type_id: string = block.typeId;
    
        function recursive_search(current_block: Block, depth: number) {
            if (depth > search_depth) return;
    
            let parent_state: string | number | boolean | undefined = undefined;
            if (state_options?.state !== undefined) {
                const permutation: BlockPermutation = current_block.permutation;
                const state = permutation.getState(state_options.state) as string | number | boolean | undefined;
                if (state !== undefined) {
                    parent_state = state;
                }
            }
    
            let neighbors: Block[] = get_corners ? CommonUtil.get_neighbors_with_corners(current_block) : CommonUtil.get_neighbors(current_block);
    
            for (const neighbor of neighbors) {
                const neighbor_id = `${neighbor.x},${neighbor.y},${neighbor.z}`;
                const child_permutation = neighbor.permutation;
                let child_state: string | number | boolean | undefined = undefined;
    
                if (state_options?.state !== undefined) {
                    const state = child_permutation.getState(state_options.state) as string | number | boolean | undefined;
                    if (state !== undefined) {
                        child_state = state;
                    } 
                }
    
                if (parent_state === undefined) {
                    let cleaned_type_id: string = type_id;
                    let cleaned_neighbor_type_id: string = neighbor.typeId;

                    if (type_id.includes(`lit_`)) cleaned_type_id = type_id.replace('lit_','');
                    if (neighbor.typeId.includes(`lit_`)) cleaned_neighbor_type_id = neighbor.typeId.replace('lit_','');
                    
                    if (cleaned_neighbor_type_id === cleaned_type_id && !visited.has(neighbor_id)) {
                        matching_neighbors.push(neighbor);
                        visited.add(neighbor_id);
                        recursive_search(neighbor, depth + 1);
                    }
                } else {
                    if (child_state === undefined || child_state !== state_options?.equals) continue;
                    if (parent_state === state_options?.equals && neighbor.typeId === type_id && !visited.has(neighbor_id)) {
                        matching_neighbors.push(neighbor);
                        visited.add(neighbor_id);
                        recursive_search(neighbor, depth + 1);
                    }
                }
            }
        }
    
        const initial_block_id = `${block.x},${block.y},${block.z}`;
        visited.add(initial_block_id);
        recursive_search(block, 0);
    
        return matching_neighbors;
    }
    
    
    private static get_neighbors(block: Block): Block[] {
        const neighbors: Block[] = [];
        if (block.above()) neighbors.push(block.above() as Block);
        if (block.below()) neighbors.push(block.below() as Block);
        if (block.north()) neighbors.push(block.north() as Block);
        if (block.south()) neighbors.push(block.south() as Block);
        if (block.east()) neighbors.push(block.east() as Block);
        if (block.west()) neighbors.push(block.west() as Block);
        return neighbors;
    }

    private static get_neighbors_with_corners(block: Block): Block[] {
        const neighbors: Block[] = [];
        const offsets = [
            new Vector3(1,  0,  0), new Vector3(-1,  0,  0), 
            new Vector3(0,  1,  0), new Vector3( 0, -1,  0), 
            new Vector3(0,  0,  1), new Vector3( 0,  0, -1), 
            new Vector3(1,  1,  0), new Vector3(-1,  1,  0), 
            new Vector3(1, -1,  0), new Vector3(-1, -1,  0), 
            new Vector3(1,  0,  1), new Vector3(-1,  0,  1),
            new Vector3(1,  0, -1), new Vector3(-1,  0, -1),
            new Vector3(0,  1,  1), new Vector3( 0, -1,  1), 
            new Vector3(0,  1, -1), new Vector3( 0, -1, -1),
            new Vector3(1,  1,  1), new Vector3(-1,  1,  1), 
            new Vector3(1,  1, -1), new Vector3(-1,  1, -1),
            new Vector3(1, -1,  1), new Vector3(-1, -1,  1),
            new Vector3(1, -1, -1), new Vector3(-1, -1, -1),
        ];
        
        for (const offset of offsets) {
            const neighbor = block.offset(offset);
            if (neighbor) neighbors.push(neighbor as Block);
        }
    
        return neighbors;
    }
    
    
}