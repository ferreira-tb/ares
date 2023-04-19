import { sequelize } from '$electron/database';
import { DatabaseError } from '$electron/error';
import { getPanelWindow } from '$electron/utils/helpers';
import type { Rectangle } from 'electron';
import type { AppConfig as AppConfigTable } from '$database/config';

export function setPanelBounds(AppConfig: typeof AppConfigTable) {
    return async function() {
        try {
            const panelWindow = getPanelWindow();
            const bounds = (await AppConfig.findByPk('panel_bounds'))?.toJSON();
            if (!bounds?.json) return;
            panelWindow.setBounds(bounds.json as Rectangle);
    
        } catch (err) {
            DatabaseError.catch(err);
        };
    };
};

export function savePanelBounds(AppConfig: typeof AppConfigTable) {
    return async function(rectangle: Rectangle) {
        try {
            await sequelize.transaction(async (transaction) => {
                await AppConfig.upsert({ name: 'panel_bounds', json: rectangle }, { transaction });
            });
    
        } catch (err) {
            DatabaseError.catch(err);
        };
    };
};