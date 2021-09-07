import {IExtension} from 'superdesk-api';

// Set superdesk API on a global, so it can be used in this repo, outside the extension
import './superdesk';

// Demo on how retrieve values from superdesk API(within this extension):

// import {superdesk} from './superdesk';
// const {gettext} = superdesk.localization;
// const str = gettext('Hello world');

/**
 * Extension is not doing anything at the moment.
 * It is only used for getting the API instance and setting the global variable.
 */
const extension: IExtension = {
    activate: () => {

        return Promise.resolve({});
    },
};

export default extension;
