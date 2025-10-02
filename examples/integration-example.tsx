import React, { useState } from 'react';
import TailwindJsonForms  from '../src/index';

// Type definition for form data
interface UserFormData {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  profile?: {
    firstName?: string;
    lastName?: string;
    age?: number;
    interests?: string[];
  };
  terms?: boolean;
}

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
  const [formData, setFormData] = useState<UserFormData>({});
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
      <div className="tw-min-h-screen tw-bg-gray-50 tw-py-8">
        <div className="tw-max-w-2xl tw-mx-auto tw-px-4">
          <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-border-gray-200 tw-p-8 tw-text-center">
            <div className="tw-w-16 tw-h-16 tw-bg-green-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-mx-auto tw-mb-4">
              <svg className="tw-w-8 tw-h-8 tw-text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="tw-text-2xl tw-font-bold tw-text-gray-900 tw-mb-2">Registration Successful!</h2>
            <p className="tw-text-gray-600 tw-mb-6">
              Thank you for registering. Your account has been created successfully.
            </p>
            <div className="tw-space-y-4">
              <h3 className="tw-text-lg tw-font-medium tw-text-gray-900">Submitted Data:</h3>
              <pre className="tw-text-sm tw-text-gray-600 tw-bg-gray-50 tw-p-4 tw-rounded-md tw-overflow-auto tw-text-left">
                {JSON.stringify(formData, null, 2)}
              </pre>
            </div>
            <button
              onClick={handleReset}
              className="tw-mt-6 tw-px-6 tw-py-2 tw-bg-primary-600 tw-text-white tw-rounded-md hover:tw-bg-primary-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-primary-500"
            >
              Create Another Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tw-min-h-screen tw-bg-gray-50 tw-py-8">
      <div className="tw-max-w-4xl tw-mx-auto tw-px-4">
        <div className="tw-text-center tw-mb-8">
          <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900 tw-mb-2">
            User Registration Form
          </h1>
          <p className="tw-text-gray-600">
            This example shows how to integrate JSONForms Tailwind Renderers in a React application
          </p>
        </div>
        
        <div className="tw-bg-white tw-rounded-lg tw-shadow-sm tw-border tw-border-gray-200 tw-p-6">
          <TailwindJsonForms
            schema={userSchema}
            uischema={userUischema}
            data={formData}
            onChange={(state) => setFormData(state.data as UserFormData)}
          />
          
          <div className="tw-mt-8 tw-flex tw-justify-end tw-space-x-3">
            <button
              onClick={handleReset}
              className="tw-px-4 tw-py-2 tw-text-sm tw-font-medium tw-text-gray-700 tw-bg-white tw-border tw-border-gray-300 tw-rounded-md hover:tw-bg-gray-50 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-primary-500"
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
        
        <div className="tw-mt-8 tw-p-4 tw-bg-white tw-rounded-lg tw-border tw-border-gray-200">
          <h3 className="tw-text-lg tw-font-medium tw-text-gray-900 tw-mb-2">Form Data (Live Preview):</h3>
          <pre className="tw-text-sm tw-text-gray-600 tw-overflow-auto tw-max-h-64">
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
