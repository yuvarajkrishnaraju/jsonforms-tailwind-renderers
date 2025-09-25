import React, { useState } from 'react';
import TailwindJsonForms from '../src/index';

const basicSchema = {
  type: 'object',
  title: 'Basic Information Form',
  properties: {
    firstName: {
      type: 'string',
      title: 'First Name',
      description: 'Enter your first name',
      minLength: 2,
      maxLength: 50
    },
    lastName: {
      type: 'string',
      title: 'Last Name',
      description: 'Enter your last name',
      minLength: 2,
      maxLength: 50
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email Address',
      description: 'Enter your email address'
    },
    phone: {
      type: 'string',
      format: 'tel',
      title: 'Phone Number',
      description: 'Enter your phone number'
    },
    age: {
      type: 'integer',
      title: 'Age',
      description: 'Enter your age',
      minimum: 13,
      maximum: 120
    },
    newsletter: {
      type: 'boolean',
      title: 'Subscribe to Newsletter',
      description: 'Receive updates about our products and services'
    },
    interests: {
      type: 'string',
      title: 'Interests',
      description: 'What are you interested in?',
      enum: ['technology', 'design', 'business', 'health', 'education'],
      enumNames: ['Technology', 'Design', 'Business', 'Health & Wellness', 'Education']
    }
  },
  required: ['firstName', 'lastName', 'email']
};

const basicUischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      label: 'Personal Information',
      options: {
        description: 'Please provide your basic personal information'
      },
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/firstName' },
            { type: 'Control', scope: '#/properties/lastName' }
          ]
        },
        { type: 'Control', scope: '#/properties/email' },
        { type: 'Control', scope: '#/properties/phone' },
        { type: 'Control', scope: '#/properties/age' }
      ]
    },
    {
      type: 'Group',
      label: 'Preferences',
      elements: [
        { type: 'Control', scope: '#/properties/newsletter' },
        { type: 'Control', scope: '#/properties/interests' }
      ]
    }
  ]
};

export const BasicFormExample: React.FC = () => {
  const [data, setData] = useState({});

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Basic Information Form
          </h1>
          <p className="text-gray-600">
            This example demonstrates basic field types with validation
          </p>
        </div>
        
        <TailwindJsonForms
          schema={basicSchema}
          uischema={basicUischema}
          data={data}
          onChange={setData}
        />
        
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Form Data:</h3>
          <pre className="text-sm text-gray-600 overflow-auto">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
