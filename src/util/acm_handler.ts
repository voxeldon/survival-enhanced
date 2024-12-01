import { world } from "@minecraft/server";
import { AcmApi, AcmEventData, AcmEventType, AddonConfiguration, SliderSetting, TextFieldSetting, ToggleSetting } from "../_import/acm_api";
import { Config, CONFIG } from "../config";
import { EventManager } from "./events";


export class AcmHandler {
    constructor() {
        this.on_ready();
    }

    private on_ready() {
        const tag_id: TextFieldSetting = {
            label: 'tag_id',
            placeholder: String(CONFIG.tag_id),
            defaultValue: CONFIG.tag_id
        }
        const use_dy_light: ToggleSetting = {
            label: 'use_dynamic_lighting',
            defaultValue: true
        }
        const use_faster_paths: ToggleSetting = {
            label: 'use_faster_paths',
            defaultValue: true
        }
        const use_auto_placer: ToggleSetting = {
            label: 'use_auto_placer',
            defaultValue: true
        }
        const use_axe: ToggleSetting = {
            label: 'use_axe',
            defaultValue: true
        }
        const use_pickaxe: ToggleSetting = {
            label: 'use_pickaxe',
            defaultValue: true
        }
        const use_hoe: ToggleSetting = {
            label: 'use_hoe',
            defaultValue: true
        }
        const use_shovel: ToggleSetting = {
            label: 'use_shovel',
            defaultValue: true
        }
        const wood_search_depth: SliderSetting = {
            label: 'wood_search_depth',
            min: 0,
            max: 100,
            step: 2,
            defaultValue: CONFIG.wood.max_search_depth
        }
        const ore_search_depth: SliderSetting = {
            label: 'ore_search_depth',
            min: 0,
            max: 100,
            step: 2,
            defaultValue: CONFIG.ore.max_search_depth
        }
        const crop_search_depth: SliderSetting = {
            label: 'crop_search_depth',
            min: 0,
            max: 100,
            step: 2,
            defaultValue: CONFIG.crop.max_search_depth
        }
        const diggable_search_depth: SliderSetting = {
            label: 'diggable_search_depth',
            min: 0,
            max: 100,
            step: 2,
            defaultValue: CONFIG.diggable.max_search_depth
        }

        const addon_data: AddonConfiguration = {
            packId: 'st',
            authorId: 'vxl',
            iconPath: 'voxel/vxl_st/pack_icon',
            addonSettings: [
                tag_id, 
                use_dy_light, 
                use_auto_placer, 
                use_faster_paths, 
                use_axe, 
                use_pickaxe, 
                use_hoe, 
                use_shovel, 
                wood_search_depth, 
                ore_search_depth, 
                crop_search_depth, 
                diggable_search_depth
            ]
        }
        AcmApi.generateAddonProfile(addon_data);
        AcmApi.subscribe((event: AcmEventData) => {
            if (event.type === AcmEventType.DataChanged && event.data) {
                this.on_data_changed(event.data);
            }
        })
        world.afterEvents.worldInitialize.subscribe(() => {
            const data = AcmApi.loadAddonData(addon_data);
            if (data) this.on_data_changed(data);
        })
    }

    public on_data_changed(data: Map<string, any>) {
        const updated_config: Config = {
            tag_id: data.get('tag_id') || CONFIG.tag_id,
            dynamic_lighting: {
                enabled: data.get('use_dynamic_lighting'),
                exceptions: CONFIG.dynamic_lighting.exceptions
            },
            faster_paths: {
                enabled: data.get('use_faster_paths'),
                exceptions: CONFIG.faster_paths.exceptions
            },
            auto_placer: {
                enabled: data.get('use_auto_placer')
            },
            wood: {
                max_search_depth: data.get('wood_search_depth'),
                enabled: data.get('use_axe'),
                tag_id: CONFIG.wood.tag_id
            },
            ore: {
                max_search_depth: data.get('ore_search_depth'),
                enabled: data.get('use_pickaxe'),
                tag_id: CONFIG.ore.tag_id
            },
            crop: {
                max_search_depth: data.get('crop_search_depth'),
                enabled: data.get('use_hoe'),
                tag_id: CONFIG.crop.tag_id
            },
            diggable: {
                max_search_depth: data.get('diggable_search_depth'),
                enabled: data.get('use_shovel'),
                tag_id: CONFIG.diggable.tag_id
            }
        };

        if (CONFIG.wood.exceptions) updated_config.wood.exceptions = CONFIG.wood.exceptions;
        if (CONFIG.ore.exceptions) updated_config.ore.exceptions = CONFIG.ore.exceptions;
        if (CONFIG.crop.exceptions) updated_config.crop.exceptions = CONFIG.crop.exceptions;
        if (CONFIG.diggable.exceptions) updated_config.diggable.exceptions = CONFIG.diggable.exceptions;
        EventManager.update_config_cashe(updated_config);
    }
}