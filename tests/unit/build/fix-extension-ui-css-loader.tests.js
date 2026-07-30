import expect from 'expect';
import fixExtensionUiCss from '../../../build/webpack/fix-extension-ui-css-loader';

describe('fix-extension-ui-css-loader', () => {
  it('rewrites the uncompiled darken() Stylus token to a literal hex color', () => {
    const source = '.cm-s-theme{background-color:darken(#263238,5%)}';
    expect(fixExtensionUiCss(source)).toBe('.cm-s-theme{background-color:#1e282c}');
  });

  it('repairs the transition declaration missing its colon', () => {
    const source = 'a{transition background-color: .3s}';
    expect(fixExtensionUiCss(source)).toBe('a{transition:background-color .3s}');
  });

  it('repairs both tokens in a single stylesheet', () => {
    const source =
      '.cm-s-theme{background-color:darken(#263238,5%)}a{transition background-color: .3s}';
    expect(fixExtensionUiCss(source)).toBe(
      '.cm-s-theme{background-color:#1e282c}a{transition:background-color .3s}'
    );
  });

  it('leaves stylesheets without the broken tokens unchanged', () => {
    const source = '.sidebar{color:#fff}';
    expect(fixExtensionUiCss(source)).toBe(source);
  });
});
