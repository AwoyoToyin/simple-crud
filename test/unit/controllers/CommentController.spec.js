// Here is were we init our 'sails' environment and application

const supertest = require('supertest');
const _ = require('lodash');

describe('CommentController', () => {

    let createdCommentId = 0;
    let createdPostId = 0;

    it('should fail to create a comment when no authorization header sent', (done) => {
        const agent = supertest.agent(sails.hooks.http.app);

        agent.post('/api/comment')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(401)
            .end((err, result) => {
                if (err) {
                    return done(err);
                }

                result.body.should.be.have.property('code', 'E_UNAUTHORIZED');
                result.body.should.be.have.property('message', 'You must provide a valid application token');
                done();
            });
    });

    it('should fail to create a comment when 1 or more required params are missing', (done) => {
        const agent = supertest.agent(sails.hooks.http.app);

        agent.post('/api/comment')
            .set('Accept', 'application/json')
            .set('authorization', 'JWT jwttoken')
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, result) => {
                if (err) {
                    return done(err);
                }

                result.body.should.be.have.property('code', 'E_BAD_REQUEST');
                done();
            });
    });

    it('should create a post for testing comments', (done) => {
        const agent = supertest.agent(sails.hooks.http.app);

        agent.post('/api/post')
            .set('Accept', 'application/json')
            .set('authorization', 'JWT jwttoken')
            .send({ 'title': 'a post', 'body': 'some body' })
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, result) => {
                if (err) {
                    return done(err);
                }

                result.body.data.should.be.an('object');
                result.body.data.should.have.property('id');
                result.body.data.should.have.property('title', 'a post');
                result.body.data.should.have.property('body', 'some body');
                result.body.data.should.have.property('slug', 'a_post');
                result.body.data.should.have.property('status', 'visible');
                createdPostId = result.body.data.id;
                done();
            });
    });

    it('should create a comment', (done) => {
        const agent = supertest.agent(sails.hooks.http.app);

        agent.post('/api/comment')
            .set('Accept', 'application/json')
            .set('authorization', 'JWT jwttoken')
            .send({ 'content': 'my first comment', post: _.toString(createdPostId) })
            .expect('Content-Type', /json/)
            .expect(201)
            .end((err, result) => {
                if (err) {
                    return done(err);
                }

                result.body.data.should.be.an('object');
                result.body.data.should.have.property('id');
                result.body.data.should.have.property('content', 'my first comment');
                createdCommentId = result.body.data.id;
                done();
            });
    });

    it('should get all comments', (done) => {
        const agent = supertest.agent(sails.hooks.http.app);

        agent.get('/api/comment')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                if (err) {
                    return done(err);
                }

                result.body.data.should.be.an('array');
                result.body.data.should.have.length(1);
                done();
            });
    });

    it('should delete created comment', (done) => {
        const agent = supertest.agent(sails.hooks.http.app);

        agent.delete('/api/comment/' + createdCommentId)
            .set('Accept', 'application/json')
            .set('authorization', 'JWT jwttoken')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                if (err) {
                    return done(err);
                }

                return done(null, result.text);
            });
    });

    it('should delete created post for testing comments', (done) => {
        const agent = supertest.agent(sails.hooks.http.app);

        agent.delete('/api/post/' + createdPostId)
            .set('Accept', 'application/json')
            .set('authorization', 'JWT jwttoken')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, result) => {
                if (err) {
                    return done(err);
                }

                return done(null, result.text);
            });
    });

});