import { VanillaData } from "./_import/vanilla_data/lib"
import { LIGHTING_ITEMS, LightingItem } from "./db/default_lighting_items"

interface ConfigOptions {
    max_search_depth: number,
    enabled: boolean,
    tag_id: string,
    exceptions ?: string[]
}

interface DynamicLightingOptions {
    enabled: boolean,
    exceptions: LightingItem[]
}


interface FasterPathsOptions {
    enabled: boolean,
    exceptions: string[]
}

interface AutoPlacerOptions {
    enabled: boolean
}

export interface Config {
    tag_id: undefined,
    dynamic_lighting: DynamicLightingOptions,
    faster_paths: FasterPathsOptions,
    auto_placer: AutoPlacerOptions,
    wood: ConfigOptions,
    ore: ConfigOptions,
    crop: ConfigOptions,
    diggable: ConfigOptions
}

export const CONFIG: Config = {
    tag_id: undefined,
    dynamic_lighting: {
        enabled: true,
        exceptions: LIGHTING_ITEMS
    },
    faster_paths: {
        enabled: true,
        exceptions: [VanillaData.MinecraftBlockTypes.GrassPath]
    },
    auto_placer: {
        enabled: true
    },
    wood: {
        max_search_depth: 30,
        enabled: true,
        tag_id: "is_axe"
    }, 
    ore: {
        max_search_depth: 10,
        enabled: true,
        tag_id: "is_pickaxe",
        exceptions: [VanillaData.MinecraftBlockTypes.Glowstone]
    },
    crop: {
        max_search_depth: 5,
        enabled: true,
        tag_id: "is_hoe"
    },
    diggable: {
        max_search_depth: 3,
        enabled: true,
        tag_id: "is_shovel",
        exceptions: [
            VanillaData.MinecraftBlockTypes.Gravel,
            VanillaData.MinecraftBlockTypes.Sand,
            VanillaData.MinecraftBlockTypes.Clay 
        ]
    }
}