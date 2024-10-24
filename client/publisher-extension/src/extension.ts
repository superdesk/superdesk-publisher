import {IExtension} from 'superdesk-api';

const extension: IExtension = {
    activate: () => {
        return Promise.resolve({});
    },
};

export default extension;
