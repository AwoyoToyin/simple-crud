/**
 * PostController
 *
 * @description :: Server-side logic for managing posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {

    /**
     * Handles deleting a blog post
     */
    destroy: function (req, res) {
        // require the post id
        const pk = actionUtil.requirePk(req);

        // lookup the post to ensure it exists
        Post.findOne({ id: pk }).then((post) => {
            // if no post was returned from the delete, post was not found
            if (!post || !post.id) {
                return res.notFound();
            }

            // destroy all comments belonging to the deleted post
            return Comment.destroy({ post: pk }).then((comments) => {
                console.log('comments: ', comments);

                // try deleting the post
                return Post.destroy({ id: pk }).then((destoyed) => res.ok(destoyed));
            });
        }).catch((error) => res.negotiate(error));
    }

};
