import * as fs from 'node:fs/promises';
import { ipcMain } from 'electron';
import { storeToRefs } from 'mechanus';
import { useCacheStore, usePlunderCacheStore } from '$electron/stores';
import { sequelize } from '$electron/database';
import { PlunderDemolitionTemplate } from '$electron/database/models';
import { DatabaseError, MainProcessError } from '$electron/error';
import { json } from '$electron/utils/files';
import { isUserAlias } from '$common/guards';

export function setPlunderDemolitionEvents() {
    const cacheStore = useCacheStore();
    const { userAlias } = storeToRefs(cacheStore);

    const plunderCacheStore = usePlunderCacheStore();
    const { demolitionTemplate } = storeToRefs(plunderCacheStore);

    ipcMain.handle('plunder:default-demolition-template', async (_e, alias: UserAlias | null = null) => {
        const defaultTemplate = await getDefaultDemolitionTemplate(alias);
        if (!demolitionTemplate.value) demolitionTemplate.value = defaultTemplate;
        return defaultTemplate;
    });

    ipcMain.handle('plunder:get-demolition-template', async (_e, id: number) => {
        try {
            if (id === demolitionTemplate.value?.id) {
                return demolitionTemplate.value;
            } else if (id === -1) {
                const defaultTemplate = await getDefaultDemolitionTemplate();
                if (!demolitionTemplate.value) demolitionTemplate.value = defaultTemplate;
                return defaultTemplate;
            }

            const alias = userAlias.value;
            const template = (await PlunderDemolitionTemplate.findByPk(id))?.toJSON();
            if (
                template &&
                template.alias === alias &&
                (!demolitionTemplate.value || demolitionTemplate.value.alias !== alias)
            ) {
                demolitionTemplate.value = template;
            }

            return template ?? null;

        } catch (err) {
            MainProcessError.catch(err);
            return null;
        }
    });

    ipcMain.handle('plunder:get-demolition-templates-by-alias', async (_e, alias: UserAlias | null = null) => {
        try {
            alias ??= userAlias.value;
            if (!isUserAlias(alias)) return null;

            const templates = await PlunderDemolitionTemplate.findAll({ where: { alias } });
            return templates.map((template) => template.toJSON());

        } catch (err) {
            MainProcessError.catch(err);
            return null;
        }
    });

    ipcMain.handle('plunder:save-demolition-template', async (_e, template: PartialKeys<PlunderDemolitionTemplateType, 'id'>) => {
        try {
            if (template.id === -1) {
                throw new DatabaseError('Cannot save a default demolition template.');
            }

            await sequelize.transaction(async () => {
                await PlunderDemolitionTemplate.upsert({ ...template });
            });

            if (typeof template.id === 'number' && template.id === demolitionTemplate.value?.id) {
                demolitionTemplate.value = template as PlunderDemolitionTemplateType;
            }

            return true;

        } catch (err) {
            MainProcessError.catch(err);
            return false;
        }
    });

    ipcMain.handle('plunder:delete-demolition-template', async (_e, id: number) => {
        try {
            if (id === -1) {
                throw new DatabaseError('Cannot delete a default demolition template.');
            }

            await sequelize.transaction(async () => {
                await PlunderDemolitionTemplate.destroy({ where: { id } });
            });

            if (demolitionTemplate.value?.id === id) {
                demolitionTemplate.value = null;
            }

            return true;
            
        } catch (err) {
            MainProcessError.catch(err);
            return false;
        }
    });
}

async function getDefaultDemolitionTemplate(alias: UserAlias | null = null): Promise<PlunderDemolitionTemplateType> {
    if (!alias) {
        const cacheStore = useCacheStore();
        alias = cacheStore.userAlias;
    }

    const jsonFile = await fs.readFile(json.plunderDemolitionTemplate, 'utf-8');
    const template = JSON.parse(jsonFile) as PlunderDemolitionTemplateType;
    if (isUserAlias(alias)) template.alias = alias;
    return template;
}