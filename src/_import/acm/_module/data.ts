/*  
 Author: Donthedev <https://github.com/voxeldon> 
**************************************************
 Copyright (c) Voxel Media Co - Voxel Lab Studios
**************************************************
*/

import { Scoreboard, ScoreboardObjective, ScriptEventCommandMessageAfterEvent, ScriptEventCommandMessageAfterEventSignal, system, world } from "@minecraft/server";
import { AddonData, AddonSetting, SettingData} from "..";
import { VerifyData } from "./verify_data";

class AcmData {
    private callback?: (data: SettingData) => void;
    private script_event: ScriptEventCommandMessageAfterEventSignal
    private event_keys: string[]
    private scoreboard: Scoreboard
    constructor(){
        this.callback = undefined;
        this.script_event = system.afterEvents.scriptEventReceive;
        this.event_keys = [];
        this.scoreboard = world.scoreboard;
    }

    /**
     * Subscribes to addon data events.
     * @param addons - The addon data.
     * @param callback - The callback function to be called when addon data is received.
     * @returns Returns void.
     */
    public subscribe(addons: AddonData[], callback: (data: SettingData) => void): void {
        for (const addon_data of addons) {
            this.event_keys.push(`acm_data:${addon_data.team_id}.${addon_data.addon_id}`)
        }
        this.callback = callback;
        this.script_event.subscribe(this.handle_script_event.bind(this));
    }

    /**
     * Generates addon data.
     * @param addon_data - The addon data to be generated.
     */
    public generate_addon_data(addon_data: AddonData) {
        const input_settings = addon_data.settings;
        const input_information = addon_data.information;
        const input_event_callback = addon_data.event_callback;
        const icon_path = addon_data.icon_path;
    
        let export_settings: AddonSetting[] = [];
        const export_addon_data: Partial<AddonData> = {
            addon_id: addon_data.addon_id,
            team_id: addon_data.team_id,
            author: addon_data.author,
            description: addon_data.description
        };

        if (icon_path) {
            export_addon_data.icon_path = icon_path;
        }
    
        if (input_settings) {
            export_settings = this.parse_addon_data(input_settings);
            export_addon_data.settings = export_settings;
        }
    
        if (input_information) {
            export_addon_data.information = input_information;
        }

        if (input_event_callback) {
            export_addon_data.event_callback = {id:input_event_callback.id};
            if (input_event_callback.title) export_addon_data.event_callback.title = input_event_callback.title;
        }
    
        this.generate_database(export_addon_data as AddonData); 
    }
    
    private handle_script_event(event: ScriptEventCommandMessageAfterEvent): void {
        const event_id: string = event.id;
        const event_message: string = event.message
        if (this.event_keys.includes(event_id) && this.callback) {
            const event_data: SettingData = JSON.parse(event_message);
            this.callback(event_data);
        }
    }

    private parse_addon_data(settings_data: AddonSetting[]): AddonSetting[]{
        const export_settings: AddonSetting[] = [];
        for (const setting of settings_data) {
            if (new VerifyData().is_addon_setting(setting)) {
                export_settings.push(setting);
            } else {
                console.warn('ACM ERROR: Invalid addon setting')
            }
        }
        return export_settings
    }

    private generate_database(addon_data: AddonData): void {
        const db_id: string = `acm.${addon_data.team_id}.${addon_data.addon_id}`;
        var database: ScoreboardObjective | undefined = this.scoreboard.getObjective(db_id);
        if (database) return;
        this.scoreboard.addObjective(db_id);
        database = this.scoreboard.getObjective(db_id);
        if (!database) {
            console.warn(`ACM ERROR: Error generating database for ${addon_data.addon_id}`);
            return;
        }
        database.setScore(`aut:${addon_data.author}`, 0)
        database.setScore(`des:${JSON.stringify(addon_data.description)}`, 0)
        if (addon_data.icon_path) {
            database.setScore(`icon:${addon_data.icon_path}`, 0)
        }
        if (addon_data.information) {
            database.setScore(`info:${JSON.stringify(addon_data.information)}`, 0);
        }
        if (addon_data.event_callback) {
            if (addon_data.event_callback.id) {
                database.setScore(`event:${addon_data.event_callback.id}`, 0);
            }
            if (addon_data.event_callback.title) {
                database.setScore(`event_title:${addon_data.event_callback.title}`, 0);
            }
        }
        if (addon_data.settings) {
            addon_data.settings.forEach((setting, index) => {
                if (!database) return
                database.setScore(`set:${JSON.stringify(setting)}`, index +1);
            });
        }
    }
}
export { AcmData }