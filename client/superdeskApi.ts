import {ISuperdesk} from 'superdesk-api';

// will be populated by `publisher-extension`
window['sd-publisher-api'] = {};

export const superdeskApi: ISuperdesk = window['sd-publisher-api'] as ISuperdesk;

