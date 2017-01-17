'use strict';

var md = require('markdown-it')({
  linkify: true
});

function render(text, markdownOptions) {
  if (markdownOptions && markdownOptions.linkRenderer) {
    var defaultLinkRenderer = md.renderer.rules.link_open || function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
      var token = tokens[idx];
      var attrs = markdownOptions.linkRenderer({
        href: token.attrs[token.attrIndex('href')][1]
      });

      // This allows overriding of the href attribute.
      // What else should be allowed for overwriting?

      token.attrSet('href', attrs.href);
      return defaultLinkRenderer(tokens, idx, options, env, self);
    };
  }

  if (markdownOptions && markdownOptions.imageRenderer) {
    var defaultImageRenderer = md.renderer.rules.image || function (tokens, idx, options, env, self) {
      return self.renderToken(tokens, idx, options);
    };

    md.renderer.rules.image = function(tokens, idx, options, env, self) {
      var token = tokens[idx];
      var attrs = markdownOptions.imageRenderer({
        src: token.attrs[token.attrIndex('src')][1]
      });

      // This allows overriding of the src attribute.
      // What else should be allowed for overwriting?

      token.attrSet('src', attrs.src);
      return defaultImageRenderer(tokens, idx, options, env, self);
    };
  }
  return md.render(text);
}

function descriptionToHTML(source, options) {
  var definitions = source.feature.children,
    background,
    definition,
    examples,
    example;

  if (source.feature.description) {
    source.feature.description = render(source.feature.description, options);
  }

  for (var s = 0; s < definitions.length; s++) {
    definition = definitions[s];
    examples = definition.examples;

    if (definition.type === 'Background' && definition.description) {
      definition.description = render(definition.description, options);
    }

    if (definition.type === 'Scenario' && definition.description) {
      definition.description = render(definition.description, options);
    }

    if (definition.type === 'ScenarioOutline' && definition.description) {
      definition.description = render(definition.description, options);
    }

    if (examples) {
      for (var e = 0; e < examples.length; e++) {
        example = examples[e];
        if (example.description) {
          example.description = render(example.description, options);
        }
      }
    }
  }
  return source;
}

module.exports = {
  render: render,
  descriptionToHTML: descriptionToHTML,
  MATERIAL_URL_SCHEMA: 'material://',
  FEATURE_URL_SCHEMA: 'feature://'
};
