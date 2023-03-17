import type { WebContents } from 'electron';
import type { World } from '$types/game';

export type WindowOpenHandler = ReturnType<Parameters<WebContents['setWindowOpenHandler']>[0]>;
export type UserAlias = `${World}__USERID__${string}`;