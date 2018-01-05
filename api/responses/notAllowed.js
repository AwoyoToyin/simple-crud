/**
 * 405 (Not Allowed) Response
 *
 * The requested resource could not be found but may be available again in the future.
 * Subsequent requests by the client are permissible.
 * Used when the requested resource is not found, whether it doesn't exist.
 */

module.exports = function (data, code, message, root) {
    var response = _.assign({
        code: code || 'E_METHOD_NOT_ALLOWED',
        message: message || 'The request method not allowed',
        data: data || {}
    }, root);

    this.req._sails.log.silly('Sent (405 METHOD NOT ALLOWED)\n', response);

    this.res.status(405);
    this.res.jsonx(response);
};
