import { VanillaData } from "../_import/vanilla_data/lib"

export interface LightingItem {
    type_id: string,
    block_light_level: number
}

export const LIGHTING_ITEMS: LightingItem[] = [
    {
        type_id: VanillaData.MinecraftItemTypes.Torch,
        block_light_level: 15
    },
    {
        type_id: VanillaData.MinecraftItemTypes.Beacon,
        block_light_level: 15
    },
    {
        type_id: VanillaData.MinecraftItemTypes.LavaBucket,
        block_light_level: 15
    },
    {
        type_id: VanillaData.MinecraftItemTypes.Glowstone,
        block_light_level: 15
    },
    {
        type_id: VanillaData.MinecraftItemTypes.Campfire,
        block_light_level: 15
    },
    {
        type_id: VanillaData.MinecraftItemTypes.LitPumpkin,
        block_light_level: 15
    },
    {
        type_id: VanillaData.MinecraftItemTypes.Lantern,
        block_light_level: 15
    },
    {
        type_id: VanillaData.MinecraftItemTypes.VerdantFroglight,
        block_light_level: 15
    },
    {
        type_id: VanillaData.MinecraftItemTypes.OchreFroglight,
        block_light_level: 15
    },
    {
        type_id: VanillaData.MinecraftItemTypes.PearlescentFroglight,
        block_light_level: 15
    },
    {
        type_id: VanillaData.MinecraftItemTypes.SeaLantern,
        block_light_level: 15
    },
    {
        type_id: VanillaData.MinecraftItemTypes.Shroomlight,
        block_light_level: 15
    },
    {
        type_id: VanillaData.MinecraftItemTypes.GlowBerries,
        block_light_level: 10
    },
    {
        type_id: VanillaData.MinecraftItemTypes.EndRod,
        block_light_level: 10
    },
    {
        type_id: VanillaData.MinecraftItemTypes.CryingObsidian,
        block_light_level: 8
    },
    {
        type_id: VanillaData.MinecraftItemTypes.SoulCampfire,
        block_light_level: 8
    },
    {
        type_id: VanillaData.MinecraftItemTypes.SoulLantern,
        block_light_level: 8
    },
    {
        type_id: VanillaData.MinecraftItemTypes.SoulTorch,
        block_light_level: 8
    },
    {
        type_id: VanillaData.MinecraftItemTypes.EnchantingTable,
        block_light_level: 7
    },
    {
        type_id: VanillaData.MinecraftItemTypes.EnderChest,
        block_light_level: 7
    },
    {
        type_id: VanillaData.MinecraftItemTypes.GlowLichen,
        block_light_level: 7
    },
    {
        type_id: VanillaData.MinecraftItemTypes.RedstoneTorch,
        block_light_level: 7
    },
    {
        type_id: VanillaData.MinecraftItemTypes.SculkCatalyst,
        block_light_level: 6
    },
    {
        type_id: VanillaData.MinecraftItemTypes.AmethystCluster,
        block_light_level: 5
    },
    {
        type_id: VanillaData.MinecraftItemTypes.LargeAmethystBud,
        block_light_level: 4
    },
    {
        type_id: VanillaData.MinecraftItemTypes.Magma,
        block_light_level: 4
    },
    {
        type_id: VanillaData.MinecraftItemTypes.MediumAmethystBud,
        block_light_level: 2
    },
    {
        type_id: VanillaData.MinecraftItemTypes.BrewingStand,
        block_light_level: 1
    },
    {
        type_id: VanillaData.MinecraftItemTypes.SmallAmethystBud,
        block_light_level: 1
    },
    {
        type_id: VanillaData.MinecraftItemTypes.DragonEgg,
        block_light_level: 1
    },
    {
        type_id: VanillaData.MinecraftItemTypes.SculkSensor,
        block_light_level: 1
    }
]