// Remove os métodos de um objeto.
type NonFunctionKeyNames<T> = Exclude<{
    [key in keyof T]: T[key] extends Function ? never : key;
}[keyof T], undefined>;

type RemoveMethods<T> = Pick<T, NonFunctionKeyNames<T>>;

/** Torna as chaves de um objeto opcionais. */
type PartialKeys<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** Opções do componente `NSelect` do Naive UI. */
type NSelectOptions<T> = {
    label: string;
    value: T;
    disabled?: boolean;
}[];