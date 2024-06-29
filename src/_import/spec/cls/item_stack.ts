import { Dimension, ItemStack } from "@minecraft/server";
import { Vector3 } from "./vector";

class Item {
    static new(type_id: string, amount: number = 1): ItemStack {
        return new ItemStack(type_id, amount);
    }
    static spawn(item_stack: ItemStack, dimension: Dimension, location: Vector3): boolean {
        try {
            dimension.spawnItem(item_stack, location);
            return true;
        } catch (error) { return false };
    }
}

export {Item}
