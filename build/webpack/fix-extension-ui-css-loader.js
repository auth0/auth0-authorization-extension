'use strict';

// @a0/auth0-extension-ui@1.0.1 ships dist/index.css with two uncompiled Stylus
// fragments in its (unused) CodeMirror theme block, which css-loader cannot
// parse: `darken(#263238,5%)` and a `transition` declaration missing its colon.
// This loader repairs just those tokens so the rest of the stylesheet (sidebar,
// entity-header, react-multiselect styles the app DOES use) can compile.
// The replacements no-op if a future package release fixes the CSS upstream.
module.exports = function fixExtensionUiCss(source) {
  return source
    .replace('background-color:darken(#263238,5%)', 'background-color:#1e282c')
    .replace('transition background-color: .3s', 'transition:background-color .3s');
};
