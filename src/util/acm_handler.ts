import { AddonData, SettingData, Slider, TextField, Toggle } from "../_import/acm";
import { ACM } from "../_import/acm/lib";
import { Config, CONFIG } from "../config";
import { EventManager } from "./events";


export class AcmHandler{
    constructor(){
        this.on_ready();
    }

    private on_ready(){
        const acm_data = new ACM.AcmData();
        const tag_id: TextField = {
            label: 'tag_id',
            placeholder: String(CONFIG.tag_id),
            default_value: CONFIG.tag_id
        }
        const use_dy_light: Toggle = {
            label: 'use_dynamic_lighting',
            default_value: true
        }
        const use_faster_paths: Toggle = {
            label: 'use_faster_paths',
            default_value: true
        }
        const use_auto_placer: Toggle = {
            label: 'use_auto_placer',
            default_value: true
        }
        const use_axe: Toggle = {
            label: 'use_axe',
            default_value: true
        }
        const use_pickaxe: Toggle = {
            label: 'use_pickaxe',
            default_value: true
        }
        const use_hoe: Toggle = {
            label: 'use_hoe',
            default_value: true
        }
        const use_shovel: Toggle = {
            label: 'use_shovel',
            default_value: true
        }
        const wood_search_depth: Slider = {
            label: 'wood_search_depth',
            min: 0,
            max: 100,
            step: 2,
            default_value: CONFIG.wood.max_search_depth
        }
        const ore_search_depth: Slider = {
            label: 'ore_search_depth',
            min: 0,
            max: 100,
            step: 2,
            default_value: CONFIG.ore.max_search_depth
        }
        const crop_search_depth: Slider = {
            label: 'crop_search_depth',
            min: 0,
            max: 100,
            step: 2,
            default_value: CONFIG.crop.max_search_depth
        }
        const diggable_search_depth: Slider = {
            label: 'diggable_search_depth',
            min: 0,
            max: 100,
            step: 2,
            default_value: CONFIG.diggable.max_search_depth
        }
        
        const addon_data: AddonData = {
            addon_id: 'survival_tools',
            team_id: 'vxl_st',
            author: 'addon_author',
            icon_path: 'textures/vxl_st/pack_icon',
            description: ['description'],
            settings: [tag_id,use_dy_light,use_auto_placer,use_faster_paths,use_axe,use_pickaxe,use_hoe,use_shovel,wood_search_depth,ore_search_depth,crop_search_depth,diggable_search_depth],
            information: [
                'info_header',
                'info_author',
                'info_line0'
            ],
            event_callback: {
                id: 'vxl_st:advanced',
                title: 'advanced_settings'
            }
        }
        acm_data.generate_addon_data(addon_data);
        acm_data.subscribe([addon_data], this.on_data_changed);
    }

    public on_callback_triggered(){}

    public on_data_changed(data: SettingData){
        const updated_config: Config = {
            tag_id: data.tag_id,
            dynamic_lighting: {
                enabled: data.use_dynamic_lighting,
                exceptions: CONFIG.dynamic_lighting.exceptions 
            },
            faster_paths: {
                enabled: data.use_faster_paths,
                exceptions: CONFIG.faster_paths.exceptions 
            },
            auto_placer: {
                enabled: data.use_auto_placer
            },
            wood: {
                max_search_depth: data.wood_search_depth,
                enabled: data.use_axe,
                tag_id: CONFIG.wood.tag_id
            }, 
            ore: {
                max_search_depth: data.ore_search_depth,
                enabled: data.use_pickaxe,
                tag_id: CONFIG.ore.tag_id
            },
            crop: {
                max_search_depth: data.crop_search_depth,
                enabled: data.use_hoe,
                tag_id: CONFIG.crop.tag_id
            },
            diggable: {
                max_search_depth: data.diggable_search_depth,
                enabled: data.use_shovel,
                tag_id: CONFIG.diggable.tag_id
            }
        };

        if (CONFIG.wood.exceptions )     updated_config.wood.exceptions      = CONFIG.wood.exceptions ;
        if (CONFIG.ore.exceptions )      updated_config.ore.exceptions       = CONFIG.ore.exceptions ;
        if (CONFIG.crop.exceptions )     updated_config.crop.exceptions      = CONFIG.crop.exceptions ;
        if (CONFIG.diggable.exceptions ) updated_config.diggable.exceptions  = CONFIG.diggable.exceptions ;
        EventManager.update_config_cashe(updated_config);
    }
}