import type { FarmUnitsAmount, UnitsToDestroyWall } from '$types/game';
import type { UserAlias } from '$types/electron';
import type { PlunderGroupType } from '$types/plunder/group';
import type { PlunderPageListType } from '$types/plunder/page';

export type PlunderCacheType = {
    /** Páginas do assistente de saque referentes à aldeia atual. */
    readonly pages: PlunderPageListType | null;
    /** Informações sobre o grupo de saque. */
    readonly plunderGroup: PlunderGroupType | null;
    /** Modelos usados no assistente de saque para demolição de muralhas. */
    readonly demolitionTroops: DemolitionTemplateType | null;
};

export type PlunderTableButtons = {
    /** Botão A do assistente de saque. */
    a: HTMLAnchorElement | null;
    /** Botão B do assistente de saque. */
    b: HTMLAnchorElement | null;
    /** Botão C do assistente de saque. */
    c: HTMLAnchorElement | null;
    /** Botão para abrir a janela de comandos no assistente de saque. */
    place: HTMLAnchorElement | null;
};

export type PlunderTableResources = {
    /** Estimativa da quantidade de madeira disponível na aldeia. */
    wood: number;
    /** Estimativa da quantidade de argila disponível na aldeia. */
    stone: number;
    /** Estimativa da quantidade de ferro disponível na aldeia. */
    iron: number;
    /** Total de recursos que se espera ter na aldeia. */
    total: number;
};

export type CustomPlunderTemplateType = {
    /** Alias do usuário. */
    alias: UserAlias;
    /** Nome do modelo. */
    type: string;
    /** Descrição do modelo. */
    description: string | null;
    /** Quantidade de unidades de cada tipo. */
    readonly units: Omit<FarmUnitsAmount, 'knight'>;
};

export type DemolitionTemplateType = {
    /** Alias do usuário. */
    alias: UserAlias;
    /** Modelos. */
    units: UnitsToDestroyWall;
};