import type { Preview } from '@storybook/react'

/** Import the app's Tailwind entry so design tokens + utility classes are available in stories */
import '../src/index.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
  },
};

export default preview;