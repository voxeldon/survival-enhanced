import { EquipmentSlot, ItemStack, Player } from "@minecraft/server";
import { Vector3 } from "../_import/spec/cls/vector";
import { VanillaData } from "../_import/vanilla_data/lib";
import { PlayerManager } from "../_import/spec/cls/player_manager";
import { LightingItem } from "../db/default_lighting_items";
import { EventManager } from "./events";

const light_block_id: string = VanillaData.MinecraftBlockTypes.LightBlock

type LightingData = { has_item: boolean, lighting_item: LightingItem | undefined };

export class DynamicLighting {
    private static last_placed_block: Map<string, Vector3> = new Map<string, Vector3>();
    public static process_player(player: Player){
        if (this.last_placed_block.has(player.id)) {
            const last_known_pos = this.last_placed_block.get(player.id) as Vector3;
            if (JSON.stringify(player.location) === JSON.stringify(last_known_pos)) return;
            player.dimension.runCommand(`fill ${last_known_pos.x} ${last_known_pos.y} ${last_known_pos.z} ${last_known_pos.x} ${last_known_pos.y} ${last_known_pos.z} air replace ${light_block_id}`);
            this.last_placed_block.delete(player.id);
        } 
        const data: LightingData = this.has_lighting_item(player, EventManager.CONFIG_CASHE.dynamic_lighting.exceptions )
        if (!this.last_placed_block.has(player.id) && data.has_item) {
            const pos: Vector3 = new Vector3(player.location.x,player.location.y + 1,player.location.z);
            player.dimension.runCommand(`fill ${pos.x} ${pos.y} ${pos.z} ${pos.x} ${pos.y} ${pos.z} ${light_block_id}["block_light_level" = ${data.lighting_item?.block_light_level || 15}] replace air`)
            this.last_placed_block.set(player.id, pos);
        }
    }
    public static has_lighting_item(player: Player, lighting_items: LightingItem[], equipment_slot: EquipmentSlot = EquipmentSlot.Mainhand): LightingData {
        const equipment: ItemStack | undefined = PlayerManager.get_equipment(player, equipment_slot);
        for (const item of lighting_items) {
            if (equipment?.typeId === item.type_id) {
                return { has_item: true, lighting_item: item };
            }
        }
        return { has_item: false, lighting_item: undefined }
        
    }
}