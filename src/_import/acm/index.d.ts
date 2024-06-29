/*  
 Author: Donthedev <https://github.com/voxeldon> 
**************************************************
 Copyright (c) Voxel Media Co - Voxel Lab Studios
**************************************************
*/

/**
 * Represents the data structure for settings.
 */
export type SettingData = { [key: string]: any };

/**
 * Represents the data structure for an addon.
 */
export type AddonData = {
    addon_id: string,
    team_id: string,
    author: string,
    icon_path?: string,
    description: string[],
    information?: string[],
    settings?: any[],
    event_callback?: {
        id: string,
        title?: string
    }
};

/**
 * Represents the data structure for an addon setting.
 */
export type AddonSetting = TextField | DropDown | Slider | Toggle;

/**
 * Represents a text field setting.
 */
export type TextField = {
    label: string, 
    placeholder: string, 
    default_value?: string
};

/**
 * Represents a dropdown setting.
 */
export type DropDown = {
    label: string, 
    options: string[], 
    default_index_value?: number
};

/**
 * Represents a slider setting.
 */
export type Slider = {
    label: string, 
    min: number, 
    max: number, 
    step: number, 
    default_value?: number
};

/**
 * Represents a toggle setting.
 */
export type Toggle = {
    label: string, 
    default_value: boolean
};