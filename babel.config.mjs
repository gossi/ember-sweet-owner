import { babelCompatSupport, templateCompatSupport } from '@embroider/compat/babel';
import { buildMacros } from '@embroider/macros/babel';

const macros = buildMacros();

// For scenario testing
const isCompat = Boolean(process.env.ENABLE_COMPAT_BUILD);

export default {
  plugins: [
    [
      '@babel/plugin-transform-typescript',
      {
        allExtensions: true,
        allowDeclareFields: true,
        onlyRemoveTypeImports: true
      }
    ],
    [
      'babel-plugin-ember-template-compilation',
      {
        transforms: [...(isCompat ? templateCompatSupport() : macros.templateMacros)]
      }
    ],
    ...(isCompat ? babelCompatSupport() : macros.babelMacros)
  ],

  generatorOpts: {
    compact: false
  }
};
