import { VanillaData } from "../_import/vanilla_data/lib"

interface LootConversion {
    type_id: string,
    loot: string
}

export const LOOT_CONVERSIONS: LootConversion[] = [
    {
        type_id: VanillaData.MinecraftBlockTypes.IronOre,
        loot: VanillaData.MinecraftItemTypes.RawIron
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.GoldOre,
        loot: VanillaData.MinecraftItemTypes.RawGold
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.DiamondOre,
        loot: VanillaData.MinecraftItemTypes.Diamond
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.LapisOre,
        loot: VanillaData.MinecraftItemTypes.LapisLazuli
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.RedstoneOre,
        loot: VanillaData.MinecraftItemTypes.Redstone
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.CoalOre,
        loot: VanillaData.MinecraftItemTypes.Coal
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.CopperOre,
        loot: VanillaData.MinecraftItemTypes.RawCopper
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.EmeraldOre,
        loot: VanillaData.MinecraftItemTypes.Emerald
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.QuartzOre,
        loot: VanillaData.MinecraftItemTypes.Quartz
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.NetherGoldOre,
        loot: VanillaData.MinecraftItemTypes.GoldNugget
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.DeepslateIronOre,
        loot: VanillaData.MinecraftItemTypes.RawIron
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.DeepslateGoldOre,
        loot: VanillaData.MinecraftItemTypes.RawGold
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.DeepslateDiamondOre,
        loot: VanillaData.MinecraftItemTypes.Diamond
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.DeepslateLapisOre,
        loot: VanillaData.MinecraftItemTypes.LapisLazuli
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.DeepslateRedstoneOre,
        loot: VanillaData.MinecraftItemTypes.RawIron
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.DeepslateEmeraldOre,
        loot: VanillaData.MinecraftItemTypes.Emerald
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.DeepslateCoalOre,
        loot: VanillaData.MinecraftItemTypes.Coal
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.DeepslateCopperOre,
        loot: VanillaData.MinecraftItemTypes.RawCopper
    },
    {
        type_id: VanillaData.MinecraftBlockTypes.Gravel,
        loot: VanillaData.MinecraftItemTypes.Flint
    }
]