import React, { useState } from 'react';
import { JsonForms } from '../src/JsonForms';

// Simple user registration schema
const userSchema = {
  type: 'object',
  title: 'User Registration',
  properties: {
    username: {
      type: 'string',
      title: 'Username',
      description: 'Choose a unique username',
      minLength: 3,
      maxLength: 20,
      pattern: '^[a-zA-Z0-9_]+$'
    },
    email: {
      type: 'string',
      format: 'email',
      title: 'Email Address',
      description: 'Enter your email address'
    },
    password: {
      type: 'string',
      format: 'password',
      title: 'Password',
      description: 'Create a strong password',
      minLength: 8
    },
    confirmPassword: {
      type: 'string',
      format: 'password',
      title: 'Confirm Password',
      description: 'Re-enter your password'
    },
    profile: {
      type: 'object',
      title: 'Profile Information',
      properties: {
        firstName: {
          type: 'string',
          title: 'First Name',
          minLength: 2
        },
        lastName: {
          type: 'string',
          title: 'Last Name',
          minLength: 2
        },
        age: {
          type: 'integer',
          title: 'Age',
          minimum: 13,
          maximum: 120
        },
        interests: {
          type: 'array',
          title: 'Interests',
          description: 'Select your interests',
          items: {
            type: 'string',
            enum: ['technology', 'sports', 'music', 'art', 'travel', 'cooking'],
            enumNames: ['Technology', 'Sports', 'Music', 'Art', 'Travel', 'Cooking']
          }
        }
      },
      required: ['firstName', 'lastName']
    },
    terms: {
      type: 'boolean',
      title: 'I agree to the Terms and Conditions',
      description: 'You must agree to continue'
    }
  },
  required: ['username', 'email', 'password', 'confirmPassword', 'terms']
};

// UI schema for the form layout
const userUischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      label: 'Account Details',
      options: {
        description: 'Create your account credentials'
      },
      elements: [
        { type: 'Control', scope: '#/properties/username' },
        { type: 'Control', scope: '#/properties/email' },
        { type: 'Control', scope: '#/properties/password' },
        { type: 'Control', scope: '#/properties/confirmPassword' }
      ]
    },
    {
      type: 'Group',
      label: 'Personal Information',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/profile/properties/firstName' },
            { type: 'Control', scope: '#/properties/profile/properties/lastName' }
          ]
        },
        { type: 'Control', scope: '#/properties/profile/properties/age' },
        { type: 'Control', scope: '#/properties/profile/properties/interests' }
      ]
    },
    {
      type: 'Group',
      label: 'Agreement',
      elements: [
        { type: 'Control', scope: '#/properties/terms' }
      ]
    }
  ]
};

export const IntegrationExample: React.FC = () => {
  const [formData, setFormData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    setIsSubmitted(true);
  };

  const handleReset = () => {
    setFormData({});
    setIsSubmitted(false);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Successful!</h2>
            <p className="text-gray-600 mb-6">
              Thank you for registering. Your account has been created successfully.
            </p>
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Submitted Data:</h3>
              <pre className="text-sm text-gray-600 bg-gray-50 p-4 rounded-md overflow-auto text-left">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
            <button
              onClick={handleReset}
              className="mt-6 px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create Another Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            User Registration Form
          </h1>
          <p className="text-gray-600">
            This example shows how to integrate JSONForms Tailwind Renderers in a React application
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <JsonForms
            schema={userSchema}
            uischema={userUischema}
            data={formData}
            onChange={setFormData}
          />
          
          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Reset Form
            </button>
            <button
              onClick={handleSubmit}
              disabled={!formData.terms}
              className={`
                px-6 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500
                ${formData.terms
                  ? 'bg-primary-600 text-white hover:bg-primary-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Create Account
            </button>
          </div>
        </div>
        
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Form Data (Live Preview):</h3>
          <pre className="text-sm text-gray-600 overflow-auto max-h-64">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
