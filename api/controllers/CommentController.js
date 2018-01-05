/**
 * CommentController
 *
 * @description :: Server-side logic for managing comments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
const actionUtil = require('sails/lib/hooks/blueprints/actionUtil');

module.exports = {

    /**
     * Handles adding a comment to a blog post
     */
    create: function (req, res) {
        // validate incoming data
        req.validate({
            content: 'text',
            post: 'string'
        });

        // parse the post data
        const data = actionUtil.parseValues(req);

        // ensure the post exists since we can't comment on a non-existing post
        Post.findOne({ id: data.post }).then((post) => {
            if (!post) {
                return res.notFound(null, null, 'Cannot add comment for a non-existing post');
            }

            // add the comment
            return Comment.create(data).then((comment) => {
                post.comments.add(comment.id);
                post.save();
                res.created(comment); // return the created comment
            });
        }).catch((error) => res.negotiate(error));
    },
    
    /**
     * Handles updating a comment for a blog post
     */
    update: function (req, res) {
        // validate incoming data
        req.validate({
            content: 'text'
        });

        // require the comment id
        const pk = actionUtil.requirePk(req);
        // parse the post data
        const data = actionUtil.parseValues(req);

        // update the comment with the new content
        Comment.update(pk, data).then((comment) => {
            // if no comment was returned from the update, comment was not found
            if (!comment) {
                return res.notFound();
            }

            return res.ok(comment); // return the updated comment
        }).catch((error) => res.negotiate(error));
    }
	
};
