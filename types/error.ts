import type { EnvironmentInfo } from '$types/ares';
import type { World } from '$types/game';

export type ErrorLogBase = {
    readonly id: number;
    readonly pending: boolean;
    readonly name: string;
    readonly message: string;
    readonly stack: string | null;
};

export interface ErrorLogType extends EnvironmentInfo, ErrorLogBase {
    readonly world: World | null;
    readonly url: string;
};

export type ElectronErrorLogType = EnvironmentInfo & ErrorLogBase;

export type OmitOptionalErrorLogProps<T> = Omit<T, 'id' | 'pending'>;
export type AllErrorLogTypes = OmitOptionalErrorLogProps<ElectronErrorLogType> | OmitOptionalErrorLogProps<ErrorLogType>;