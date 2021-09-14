import {ISuperdesk} from 'superdesk-api';

// will be populated by `publisher-extension`
window['sd-publisher-api'] = {};

export const superdeskApi: ISuperdesk = window['sd-publisher-api'] as ISuperdesk;

/**
 * MUST BE CALLED ASYNCHRONOUSLY
 * 
 * Can not be called synchronously from top-level code.
 */
export function gettext(str) {
    if (typeof superdeskApi?.localization?.gettext !== 'function') {
        console.error('`superdeskApi` accessed synchronously. Translation WILL NOT work!');

        return str;
    } else {
        // Use a different name so translation string extractor doesn't try to process this.
        const alias = superdeskApi.localization.gettext;

        return alias(str);
    }
}