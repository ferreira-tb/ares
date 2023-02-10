import type { PlunderTemplate } from "$browser/farm/templates";

export type TemplateLoot = {
    /** Modelo de saque que será utilizado. */
    template: PlunderTemplate;
    /** Quantidade de recursos que serão saqueados. */
    loot: number;
};