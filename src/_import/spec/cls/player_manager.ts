import { world, system, PlayerJoinAfterEvent, Player, PlayerLeaveAfterEvent, TicksPerSecond, EquipmentSlot, ItemStack, EntityEquippableComponent } from "@minecraft/server";
type PlayerEventCallback = (player: Player) => void;

class PlayerInstanceManager {
    private static playerCache = new Map<string, Player>(); // Static player cache
    private static onJoinCallbacks: PlayerEventCallback[] = [];
    private static onLeaveCallbacks: PlayerEventCallback[] = [];

    constructor() {
        PlayerInstanceManager.handleSubscriptions();
    }

    public forEachPlayer(callback: (player: Player) => void, delay: number = 0): void {
        system.runInterval(() => {
            PlayerInstanceManager.playerCache.forEach(player => {
                if (player && player.isValid()) callback(player);
            });
        }, TicksPerSecond * delay);
    }

    public connect(eventType: 'OnJoin' | 'OnLeave'): (callback: PlayerEventCallback) => void {
        return (callback: PlayerEventCallback) => {
            if (eventType === 'OnJoin') {
                PlayerInstanceManager.onJoinCallbacks.push(callback);
            } else if (eventType === 'OnLeave') {
                PlayerInstanceManager.onLeaveCallbacks.push(callback);
            }
        };
    }
    
    private static handleSubscriptions(): void {
        if (PlayerInstanceManager.playerCache.size === 0) {
            PlayerInstanceManager.repopulatePlayerCache();
            world.afterEvents.playerJoin.subscribe(PlayerInstanceManager.onPlayerJoin);
            world.afterEvents.playerLeave.subscribe(PlayerInstanceManager.onPlayerLeave);
        }
    }

    private static repopulatePlayerCache(): void {
        const allFoundPlayers = world.getAllPlayers();
        if (allFoundPlayers.length === 0) return;
        allFoundPlayers.forEach(player => {
            PlayerInstanceManager.playerCache.set(player.id, player);
        });
    }

    private static onPlayerJoin(event: PlayerJoinAfterEvent): void {
        system.runTimeout(() => {
            const playerId: string = event.playerId;
            const player: Player = world.getEntity(playerId) as Player;
            PlayerInstanceManager.playerCache.set(playerId, player);
            PlayerInstanceManager.onJoinCallbacks.forEach(callback => callback(player));
        }, TicksPerSecond * 5);
    }

    private static onPlayerLeave(event: PlayerLeaveAfterEvent): void {
        const playerId: string = event.playerId;
        const player: Player = world.getEntity(playerId) as Player;
        PlayerInstanceManager.playerCache.delete(playerId);
        PlayerInstanceManager.onLeaveCallbacks.forEach(callback => callback(player));
    }

    // Static method to access the player cache from outside the class
    public static getPlayerCache(): Map<string, Player> {
        return PlayerInstanceManager.playerCache;
    }

    // Static method to get an array of player objects
    public static getPlayers(): Player[] {
        return Array.from(PlayerInstanceManager.playerCache.values());
    }
}

class PlayerManager {
    public static get_equipment(player: Player, equipment_slot: EquipmentSlot = EquipmentSlot.Mainhand): ItemStack | undefined {
        const equipment: EntityEquippableComponent = player.getComponent('equippable') as EntityEquippableComponent;
        return equipment.getEquipment(equipment_slot);
        
    }
    public static has_equipment(player: Player,type_id: string, equipment_slot: EquipmentSlot = EquipmentSlot.Mainhand): { has_item: boolean, item_stack: ItemStack | undefined } {
        const equipment: ItemStack | undefined = PlayerManager.get_equipment(player, equipment_slot);
        if (equipment?.typeId === type_id) return { has_item: true, item_stack: equipment }
        else return { has_item: false, item_stack: equipment }
        
    }
    public static set_equipment(player: Player, item_stack: ItemStack, equipment_slot: EquipmentSlot = EquipmentSlot.Mainhand): boolean {
        const equipment: EntityEquippableComponent = player.getComponent('equippable') as EntityEquippableComponent;
        if (equipment && item_stack.amount > 0) return equipment.setEquipment(equipment_slot, item_stack);
        return false;
        
    }

}

export { PlayerInstanceManager, PlayerManager };
