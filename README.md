# JSONForms Tailwind Renderers

A modern React component library that provides JSONForms renderers built with React, TypeScript, and Tailwind CSS. This library offers a clean, accessible, and customizable form rendering solution based on JSON Schema and UI Schema specifications.

## ✨ Features

- **Modern React Components**: Built with React 18+ and TypeScript
- **Tailwind CSS 3.x**: Uses a custom Tailwind prefix `tw-`
- **Comprehensive Field Types**: Text, number, integer, boolean, enum/select, arrays, objects, combinators
- **Flexible Layouts**: Vertical, horizontal, group, categorization
- **Validation**: AJV-based validation with custom formats and middleware hook
- **Accessibility**: ARIA-friendly, keyboard navigable
- **TypeScript**: Full type safety and IntelliSense

## 🚀 Installation

```bash
npm install jsonforms-tailwind-renderers
```

### Peer Dependencies

This library requires React 18+ and React DOM 18+ as peer dependencies:

```bash
npm install react react-dom
```

### Tailwind CSS Setup

This library relies on your app's TailwindCSS. It uses the `tw-` prefix to avoid class collisions. Configure your Tailwind like this:

```javascript
// tailwind.config.js
module.exports = {
  prefix: 'tw-',
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    // Include library files so Tailwind can see used class names
    './node_modules/jsonforms-tailwind-renderers/dist/**/*.{js,jsx,ts,tsx}'
  ],
  // ... rest of your config
}
```

**Important**: The `tw-` prefix is required. Ensure your app and any custom styles use `tw-` prefixed utilities.

## 📖 Basic Usage

```tsx
import React, { useState } from 'react';
import TailwindJsonForms from 'jsonforms-tailwind-renderers';

const schema = {
  type: 'object',
  properties: {
    name: { type: 'string', title: 'Full Name', minLength: 2 },
    email: { type: 'string', format: 'email', title: 'Email Address' }
  },
  required: ['name', 'email']
};

const uischema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/name' },
    { type: 'Control', scope: '#/properties/email' }
  ]
};

function MyForm() {
  const [data, setData] = useState({});

  return (
    <TailwindJsonForms
      schema={schema}
      uischema={uischema}
      data={data}
      onChange={({ data }) => setData(data)}
    />
  );
}
```

## 🎯 Supported Field Types

### Text Inputs

- **Text**: Basic text input
- **Email**: Email validation
- **Password**: Password with visibility toggle
- **URL**: URL validation
- **Tel**: Telephone number
- **Date**: Date picker
- **Time**: Time picker
- **DateTime**: Date and time picker

### Number Inputs

- **Number**: Floating-point numbers
- **Integer**: Whole numbers
- **Range**: Min/max constraints with step controls

### Boolean Inputs

- **Checkbox**: Custom styled checkbox with label

### Selection Inputs

- **Select**: Dropdown with enum values
- **Multi-select**: Multiple choice selection

### Complex Types

- **Array**: Dynamic arrays with add/remove functionality
- **Object**: Nested object rendering

## 🎨 Layout Types

### VerticalLayout

Renders form elements in a vertical stack with consistent spacing.

```tsx
{
  type: 'VerticalLayout',
  elements: [
    // form controls
  ]
}
```

### HorizontalLayout

Renders form elements in a responsive grid (1, 2, or 3 columns).

```tsx
{
  type: 'HorizontalLayout',
  options: {
    columns: 2 // 1, 2, or 3 columns
  },
  elements: [
    // form controls
  ]
}
```

### Group

Groups related form elements in a bordered container.

```tsx
{
  type: 'Group',
  label: 'Personal Information',
  elements: [
    // form controls
  ]
}
```

## 🔧 Advanced Examples

### Complex Form with Nested Objects

```tsx
const complexSchema = {
  type: 'object',
  properties: {
    personalInfo: {
      type: 'object',
      properties: {
        firstName: { type: 'string', title: 'First Name' },
        lastName: { type: 'string', title: 'Last Name' },
        email: { type: 'string', format: 'email', title: 'Email' }
      },
      required: ['firstName', 'lastName', 'email']
    },
    addresses: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          street: { type: 'string', title: 'Street Address' },
          city: { type: 'string', title: 'City' },
          zipCode: { type: 'string', title: 'ZIP Code' }
        }
      }
    }
  }
};

const complexUischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      label: 'Personal Information',
      elements: [
        {
          type: 'HorizontalLayout',
          options: { columns: 2 },
          elements: [
            { type: 'Control', scope: '#/properties/personalInfo/properties/firstName' },
            { type: 'Control', scope: '#/properties/personalInfo/properties/lastName' }
          ]
        },
        { type: 'Control', scope: '#/properties/personalInfo/properties/email' }
      ]
    },
    {
      type: 'Control',
      scope: '#/properties/addresses'
    }
  ]
};
```

### Conditional Fields

```tsx
const conditionalSchema = {
  type: 'object',
  properties: {
    accountType: {
      type: 'string',
      enum: ['personal', 'business'],
      title: 'Account Type'
    },
    businessName: {
      type: 'string',
      title: 'Business Name'
    },
    taxId: {
      type: 'string',
      title: 'Tax ID'
    }
  },
  required: ['accountType']
};

const conditionalUischema = {
  type: 'VerticalLayout',
  elements: [
    { type: 'Control', scope: '#/properties/accountType' },
    {
      type: 'Group',
      label: 'Business Information',
      rule: {
        effect: 'SHOW',
        condition: {
          scope: '#/properties/accountType',
          schema: { const: 'business' }
        }
      },
      elements: [
        { type: 'Control', scope: '#/properties/businessName' },
        { type: 'Control', scope: '#/properties/taxId' }
      ]
    }
  ]
};
```

## 🎨 Customization

### Custom Colors

The library uses a custom primary color palette that you can override:

```css
/* Custom CSS */
.tw-bg-primary-600 {
  background-color: #your-custom-color;
}
```

### Custom Animations

Custom fade-in and slide-up animations are included:

```css
.tw-animate-fade-in {
  animation: tw-fadeIn 0.3s ease-in-out;
}

.tw-animate-slide-up {
  animation: tw-slideUp 0.3s ease-out;
}
```

### Custom Styling

All components use Tailwind CSS classes with the `tw-` prefix, making them easy to customize:

```tsx
// You can override styles by targeting the specific classes
<TextControl
  className="tw-border-red-500 tw-bg-red-50"
  // ... other props
/>
```

## 🔌 API Reference

### Default export: `TailwindJsonForms`

Wrapper around `@jsonforms/react` that wires in Tailwind renderers and validation middleware.

```ts
type TailwindJsonFormsProps = {
  data: any;
  schema?: JsonSchema;
  uischema?: UISchemaElement;
  readonly?: boolean;
  transformData?: (value: any) => any;
  isValid?: (arg: { isValid: boolean; errors?: ErrorObject[] | null; errorsText: string }) => any;
  onChange?: (state: { data: any; errors: any }) => void;
  patternErrorMessageMap?: Record<string, string>;
}
```

- **onChange** receives `{ data, errors }`. Update your local state with `state.data`.
- **transformData** lets you normalize data on each update.
- **isValid** receives AJV validation results after each update.

### Named exports

- `TailwindRenderers`: JSONForms renderers and testers array
- `isValidData(schema, data)`: Helper to validate data against a schema using the same AJV instance

## 🚀 Development

### Prerequisites

- Node.js 18+
- npm or yarn

### Setup

```bash
git clone <repository-url>
cd jsonforms-tailwind-renderers
npm install
```

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Clean

```bash
npm run clean
```

### Run the examples locally

```bash
npm run examples:dev
```

Open `http://localhost:8080` and explore the examples in `examples/`.

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Dependencies

- **React**: ^18.0.0
- **React DOM**: ^18.0.0
- **Tailwind CSS**: ^3.4.x (consumer app)
- **TypeScript**: ^5.0.0

## 🔗 Related

- [JSONForms](https://jsonforms.io/) - The original JSONForms library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
