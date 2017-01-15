'use strict';

var chai = require('chai');
var expect = chai.expect;
var markdown = require('../../lib/scribal-markdown');

describe('scribal markdown', function() {
  describe('rendering', function() {
    it('parses emphasized text', function() {
      expect(markdown.render('This is __emphasized__.'))
        .to.equal('<p>This is <strong>emphasized</strong>.</p>\n');
    });

    it('parses an inline-style link to another feature', function() {
      expect(markdown.render('[other feature](feature://other.feature)'))
        .to.equal('<p><a href="feature://other.feature">other feature</a></p>\n');
    });

    it('parses an inline-style link to another feature with custom linkRenderer', function() {
      function linkRenderer(attrs) {
        attrs.href = 'path/dir/' + attrs.href;
        return attrs;
      }

      expect(markdown.render('[other feature](feature://other.feature)', {linkRenderer: linkRenderer}))
        .to.equal('<p><a href="path/dir/feature://other.feature">other feature</a></p>\n');
    });

    it('parses an inline-style image relative to the materials directory', function() {
      expect(markdown.render('![Logo](material://materials/images/logo.png)'))
        .to.equal('<p><img src="material://materials/images/logo.png" alt="Logo"></p>\n');
    });

    it('parses an inline-style image relative to the materials directory with custom imageRenderer', function() {
      function imageRenderer(attrs) {
        attrs.src = 'path/dir/' + attrs.src;
        return attrs;
      }

      expect(markdown.render('![Logo](material://materials/images/logo.png)', {imageRenderer: imageRenderer}))
        .to.equal('<p><img src="path/dir/material://materials/images/logo.png" alt="Logo"></p>\n');
    });
  });
});
