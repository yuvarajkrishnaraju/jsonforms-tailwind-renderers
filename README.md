# JSONForms Tailwind Renderers

A modern React component library that provides JSONForms renderers built with React, TypeScript, and Tailwind CSS. This library offers a clean, accessible, and customizable form rendering solution based on JSON Schema and UI Schema specifications.

## ✨ Features

- **Modern React Components**: Built with React 18+ and TypeScript
- **Tailwind CSS 4.1+**: Latest Tailwind CSS with custom class prefix `tw-`
- **Comprehensive Field Types**: Support for text, number, boolean, select, and array inputs
- **Flexible Layouts**: Vertical, horizontal, and group layout components
- **Form Validation**: Built-in validation with customizable error display
- **Accessibility**: ARIA-compliant components with keyboard navigation
- **Customizable**: Easy to extend and customize with Tailwind CSS
- **TypeScript**: Full type safety and IntelliSense support

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

Since this library uses Tailwind CSS with the `tw-` prefix, you need to configure your Tailwind CSS to include the prefix:

```javascript
// tailwind.config.js
module.exports = {
  prefix: 'tw-',
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/jsonforms-tailwind-renderers/**/*.{js,ts,jsx,tsx}"
  ],
  // ... rest of your config
}
```

**Important**: The `tw-` prefix is required for all Tailwind classes used in this library.

## 📖 Basic Usage

```tsx
import React, { useState } from 'react';
import { JsonForms } from 'jsonforms-tailwind-renderers';

const schema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Full Name',
      minLength: 2
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email Address'
    }
  },
  required: ['name', 'email']
};

const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/name'
    },
    {
      type: 'Control',
      scope: '#/properties/email'
    }
  ]
};

function MyForm() {
  const [data, setData] = useState({});

  return (
    <JsonForms
      schema={schema}
      uischema={uischema}
      data={data}
      onChange={setData}
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

### JsonForms Component

The main component for rendering forms.

```tsx
interface JsonFormsProps {
  schema: JsonSchema;                    // JSON Schema definition
  uischema?: UISchemaElement;            // UI Schema (optional)
  data?: any;                           // Initial form data
  onChange?: (data: any) => void;       // Data change handler
  onBlur?: (path: string, value: any) => void;    // Blur event handler
  onFocus?: (path: string, value: any) => void;   // Focus event handler
  readonly?: boolean;                    // Read-only mode
  disabled?: boolean;                    // Disabled mode
  validationMode?: 'ValidateAndShow' | 'ValidateAndHide' | 'NoValidation';
}
```

### Control Components

All control components accept the same props interface:

```tsx
interface ControlProps {
  schema: JsonSchema;                    // Field schema
  uischema: UISchemaElement;             // UI schema element
  path: string;                          // Data path
  data: any;                             // Form data
  onChange: (data: any) => void;         // Change handler
  onBlur?: (path: string, value: any) => void;    // Blur handler
  onFocus?: (path: string, value: any) => void;   // Focus handler
  errors?: Record<string, string[]>;     // Validation errors
  touched?: Record<string, boolean>;     // Touched state
  required?: boolean;                     // Required field
}
```

### Layout Components

Layout components accept:

```tsx
interface LayoutProps {
  schema: JsonSchema;                    // Schema definition
  uischema: UISchemaElement;             // UI schema element
  path: string;                          // Data path
  data: any;                             // Form data
  onChange: (data: any) => void;         // Change handler
  onBlur?: (path: string, value: any) => void;    // Blur handler
  onFocus?: (path: string, value: any) => void;   // Focus handler
}
```

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

## 📝 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📚 Dependencies

- **React**: ^18.0.0
- **React DOM**: ^18.0.0
- **Tailwind CSS**: ^4.1.12
- **React Icons**: ^5.0.0
- **TypeScript**: ^5.0.0

## 🔗 Related

- [JSONForms](https://jsonforms.io/) - The original JSONForms library
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
