const express = require('express');
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
        console.log(err)
    }
});

module.exports = router;
