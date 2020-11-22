const express = require('express');
const { isValidObjectId } = require('mongoose');
const router = express.Router();
const BlogSchema = require('../models/Blog');

router.get('/', (req, res) => {
    res.redirect('/blog');
});

router.get('/:slug', async (req, res) => {
    const blog = await BlogSchema.findOne({ slug: req.params.slug });
    if(blog == null) res.redirect('/');
    res.render('display', { Title: 'Blog', blog: blog });
});

router.post('/', async (req, res) => {
    let blog = new BlogSchema({
        blogTitle: req.body.blogTitle,
        snippet: req.body.snippet,
        content: req.body.content
    });
    // Promise
    try {
        blog = await blog.save();
        res.redirect(`/blogs/${blog.slug}`);
    } catch (err) {
        res.redirect('/dashboard');
        console.log(err);
    }
});
router.post('/delPost', (req, res) => {
    let id = req.body.postID;
    BlogSchema.findOneAndRemove( { _id: id}, (err) => {
        if(err) {
            console.log(err);
            res.render('dashboard', {
                Title: 'Admin panel',
                noBlog: 'Nie znaleziono bloga o podanym ID'
            });
            return res.status(500).send();
        }

        res.render('dashboard', {
            Title: 'Admin panel',
            noBlog: ''
        });
        return res.status(200).send();
    });
})

module.exports = router;
