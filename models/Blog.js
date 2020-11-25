const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const dompurify = createDomPurify(new JSDOM().window);

const Blog = new mongoose.Schema({
    blogTitle: {
        type: String,
        required: true,
        text: true
    },
    createdAt: {
        type: Date,
        default: new Date
    },
    snippet: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
        text: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    markedContent: {
        type: String,
        required: true
    }

});

Blog.pre('validate', function(next) {
    if (this.blogTitle) {
      this.slug = slugify(this.blogTitle, { lower: true, strict: true });
    }
  
    if (this.content) {
      this.markedContent = dompurify.sanitize(marked(this.content));
    }
  
    next();
})

module.exports = mongoose.model('Blog', Blog);