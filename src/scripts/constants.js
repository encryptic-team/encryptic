/**
 * Configs that don't change.
 *
 * @module constants
 * @license MPL-2.0
 */
import _ from 'underscore';

/**
 * @namespace constants
 * @prop {String} version - current version of the app
 * @prop {String} url - the URL where the app is accessed from
 * @prop {Array} defaultHosts - hosts that Dropbox auth server accepts
 * @prop {String} dropboxKey - dropbox API key
 * @prop {String} dropboxSecret - dropbox secret key (not necessary)
 * @prop {Boolean} dropboxKeyNeed - true if the default Dropbox API key will
 * not work and a user needs to provid their own
 */
const constants = {
    version       : '0.0.3',
    url           : location.origin + location.pathname.replace('index.html', ''),
    defaultHosts  : [
        'Encryptic.io',
        'localhost',
        'localhost:9000',
        'localhost:9100',
    ],
    dropboxKey    : 'hlicys9cs8rj3ep',
    dropboxSecret : null,
    dropboxKeyNeed: false,

    singleUserMode: false,
    singleUserProfile : "",
    singleUserPassword: "",
};

// The default Dropbox API key will not work
if (!_.contains(constants.defaultHosts, location.host) && !window.electron) {
    constants.dropboxKeyNeed = true;
}

export default constants;
