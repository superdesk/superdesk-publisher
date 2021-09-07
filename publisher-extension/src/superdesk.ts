import {ISuperdesk} from 'superdesk-api';

// @ts-ignore
export const superdesk = window['extensionsApiInstances']['publisher-extension'] as ISuperdesk;

// for use outside this extension
Object.assign((window as any)['sd-publisher-api'], superdesk);
