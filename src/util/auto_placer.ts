import { Block, Dimension, ItemStack, ItemUseOnBeforeEvent } from "@minecraft/server";
import { VanillaData } from "../_import/vanilla_data/lib";
import { CommonUtil } from "./common";
import { Vector3 } from "../_import/spec/cls/vector";
import { cls } from "../_import/spec/lib";

const VALID_CROPS: string[] = [
    VanillaData.MinecraftItemTypes.Potato,
    VanillaData.MinecraftItemTypes.Carrot,
    VanillaData.MinecraftItemTypes.WheatSeeds,
    VanillaData.MinecraftItemTypes.BeetrootSeeds
]

const block_conversions = new Map<string, string>([
    [VanillaData.MinecraftItemTypes.Potato, VanillaData.MinecraftBlockTypes.Potatoes],
    [VanillaData.MinecraftItemTypes.Carrot, VanillaData.MinecraftBlockTypes.Carrots],
    [VanillaData.MinecraftItemTypes.WheatSeeds, VanillaData.MinecraftBlockTypes.Wheat],
    [VanillaData.MinecraftItemTypes.BeetrootSeeds, VanillaData.MinecraftBlockTypes.Beetroot]
]);

export class AutoPlacer {
    public static on_ready(event: ItemUseOnBeforeEvent): void {
        const block: Block = event.block;
        let item_stack: ItemStack = event.itemStack;
        if (block.typeId === VanillaData.MinecraftBlockTypes.Farmland && VALID_CROPS.includes(item_stack.typeId)) {
            const positions: Vector3[] = AutoPlacer.search_for_available_space(block, item_stack.amount);
            AutoPlacer.set_blocks(block.dimension,positions,block_conversions.get(item_stack.typeId) as string);
            if ((item_stack.amount - positions.length) > 0) item_stack.amount -= positions.length;
            else item_stack = cls.Item.new('air');
            cls.PlayerManager.set_equipment(event.source, item_stack);
        }
    }

    private static search_for_available_space(block: Block, search_depth: number): Vector3[] {
        const neighbors: Block[] = CommonUtil.get_matching_neighbors(block, search_depth);
        let return_total: number = 1;
        const available_space: Vector3[] = [];
        available_space.push(new Vector3(block.location.x,block.location.y + 1,block.location.z));
        for (const neighbor of neighbors) {
            if (return_total >= search_depth) break;
            const above: Block | undefined = neighbor.above();
            if (above && above.isAir) {
                available_space.push(above.location);
                return_total++;
            }
        }
        return available_space;
    }

    private static set_blocks(dimension: Dimension,positions: Vector3[], type_id: string){
        for (const pos of positions) {
            dimension.runCommand(`setblock ${pos.x} ${pos.y} ${pos.z} ${type_id} replace`);
        }
    }
}