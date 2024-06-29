/*  
 Author: Donthedev <https://github.com/voxeldon> 
**************************************************
 Copyright (c) Voxel Media Co - Voxel Lab Studios
**************************************************
*/

import { ScoreboardObjective } from "@minecraft/server";

/**
 * Represents a class for verifying addon object data.
 */
class VerifyData {
    /**
     * Checks if the given setting is an addon setting.
     * @param setting - The setting to check.
     * @returns Returns boolean.
     */
    public is_addon_setting(setting: any): boolean {
        if (this.is_text_field(setting) ||
            this.is_drop_down(setting) ||
            this.is_slider(setting) ||
            this.is_toggle(setting)
        ) return true;
        else return false;
    }
    
    /**
     * Checks if the given setting is a text field.
     * @param setting - The setting to check.
     * @returns Returns boolean.
     */
    public is_text_field(setting: any): boolean {
        return 'label' in setting && 'placeholder' in setting;
    }
    
    /**
     * Checks if the given setting is a drop-down.
     * @param setting - The setting to check.
     * @returns Returns boolean.
     */
    public is_drop_down(setting: any): boolean {
        return 'label' in setting && Array.isArray(setting.options);
    }

    /**
     * Checks if the given setting is a slider.
     * @param setting - The setting to check.
     * @returns Returns boolean.
     */
    public is_slider(setting: any): boolean {
        return 'label' in setting && typeof setting.min === 'number' && typeof setting.max === 'number' && typeof setting.step === 'number';
    }
    
    /**
     * Checks if the given setting is a toggle.
     * @param setting - The setting to check.
     * @returns Returns boolean.
     */
    public is_toggle(setting: any): boolean {
        return 'label' in setting && typeof setting.default_value === 'boolean';
    }

    /**
     * Checks if the addon data has a specific type.
     * @param addon_data - The addon data to check.
     * @param type - The type to check for.
     * @returns Returns boolean.
     */
    public static has_type(addon_data: ScoreboardObjective, type: string): boolean{
        const participants = addon_data.getParticipants();
        for (const participant of participants) {
            if (participant.displayName.startsWith(`${type}:`)) return true;
            else continue;
        }
        return false;
    }
}

export { VerifyData }