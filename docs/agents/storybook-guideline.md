# Storybook File Guideline

When implementing a React component, you must create a corresponding Storybook file following these guidelines:

## File Structure
- Name your file `ComponentName.stories.tsx`
- Place it in the same directory as your component (colocation)

## Basic Structure
Create a minimal yet comprehensive story that demonstrates your component:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';

import ComponentName from './ComponentName';

const meta: Meta<typeof ComponentName> = {
  component: ComponentName,
  title: 'Components/ComponentName', // Follow your project's hierarchy pattern
  // Add a component description as JSDoc comment above the meta object
  /**
   * Brief description of what the component does and when to use it
   */
  parameters: {
    docs: {
      description: {
        component: 'Detailed description of the component purpose and usage guidelines.',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof ComponentName>;

/**
 * The default state of the component with minimum required props
 */
export const Default: Story = {
  args: {
    // Add only essential props with meaningful values
    // Example: label: 'Button Text',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/...',  // Add your Figma design URL
    },
  },
};

/**
 * Add only one additional story if needed to show an important variant
 */
export const Variant: Story = {
  args: {
    // Only change props that differ from Default
  },
};
```

## Best Practices
1. Include JSDoc comments to describe your component and each story
2. Only create stories for key component states (default + 1-2 important variants)
3. Use `args` for component props to enable controls in Storybook
4. Add a design reference if available
5. Document prop descriptions using the component's PropTypes or TypeScript types

## Example
For a Button component:

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './Button';

/**
 * A standard button component for user interactions
 */
const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Components/Button',
  parameters: {
    docs: {
      description: {
        component: 'Primary user interaction component that supports different variants and sizes.',
      },
    },
  },
  argTypes: {
    onClick: { action: 'clicked' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

/**
 * Default button with primary styling
 */
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Button Text',
  },
};

/**
 * Secondary button with outline styling
 */
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Button Text',
  },
};
```
