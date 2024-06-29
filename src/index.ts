import { Block, Player } from "@minecraft/server";
import { cls } from "./_import/spec/lib";
import { VanillaData } from "./_import/vanilla_data/lib";
import { AcmHandler } from "./util/acm_handler";
import { EventManager } from "./util/events";
import { Vector3 } from "./_import/spec/cls/vector";
import { DynamicLighting } from "./util/dynamic_lighting";
import { AdvancedSettings } from "./util/adv_settings";
new AcmHandler();
EventManager.initalize_events();
AdvancedSettings.initalize_events();

const player_manager = new cls.PlayerInstanceManager();
player_manager.forEachPlayer(player => {
    if (EventManager.CONFIG_CASHE.dynamic_lighting.enabled === true) DynamicLighting.process_player(player);
    if (EventManager.CONFIG_CASHE.faster_paths.enabled     === true) handle_faster_paths(player);
    
});

function handle_faster_paths(player: Player){
    const block: Block | undefined = player.dimension.getBlock(new Vector3(player.location.x,player.location.y-0.9,player.location.z));
    if (block && block.typeId === VanillaData.MinecraftBlockTypes.GrassPath) {
        player.addEffect(VanillaData.MinecraftEffectTypes.Speed, 10, {
            amplifier: 0,
            showParticles: false
        })
    }
}