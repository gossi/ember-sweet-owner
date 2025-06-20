import storybook from 'eslint-plugin-storybook';

import { configs } from '@gossi/config-eslint';

export default [
  ...configs.ember(import.meta.dirname),
  ...storybook.configs['flat/recommended'],
  ...storybook.configs['flat/csf']
];
