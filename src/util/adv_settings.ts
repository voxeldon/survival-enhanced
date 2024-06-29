import { Player, ScriptEventCommandMessageAfterEvent, system } from "@minecraft/server";

export class AdvancedSettings {
    public static initalize_events(){
        system.afterEvents.scriptEventReceive.subscribe((event: ScriptEventCommandMessageAfterEvent)=> {this.on_callback_triggered(event)})
    }
    private static on_callback_triggered(event: ScriptEventCommandMessageAfterEvent) {
        if (event.id === 'vxl_st:advanced') this.on_ready(event.sourceEntity as Player);
    }
    private static on_ready(player: Player) {
        player.sendMessage('callback worked')
    }
}