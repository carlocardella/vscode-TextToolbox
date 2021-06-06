import { resolve } from 'path';
import { getActiveEditor } from './helpers';

export function copyTextWithMetadata(): Promise<string | undefined | void> {
    const editor = getActiveEditor();
    if (!editor) { return Promise.reject(); }


    return Promise.resolve();
}