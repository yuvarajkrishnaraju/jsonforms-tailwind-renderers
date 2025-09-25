import React, { useState } from 'react';
import TailwindJsonForms from '../src/index';

const complexSchema = {
  type: 'object',
  title: 'Complex Registration Form',
  properties: {
    personalInfo: {
      type: 'object',
      title: 'Personal Information',
      properties: {
        firstName: { 
          type: 'string', 
          title: 'First Name',
          minLength: 2,
          maxLength: 50
        },
        lastName: { 
          type: 'string', 
          title: 'Last Name',
          minLength: 2,
          maxLength: 50
        },
        dateOfBirth: { 
          type: 'string', 
          format: 'date', 
          title: 'Date of Birth' 
        },
        gender: {
          type: 'string',
          title: 'Gender',
          enum: ['male', 'female', 'other', 'prefer-not-to-say'],
          enumNames: ['Male', 'Female', 'Other', 'Prefer not to say']
        },
        profilePicture: {
          type: 'string',
          format: 'url',
          title: 'Profile Picture URL',
          description: 'Optional: Link to your profile picture'
        }
      },
      required: ['firstName', 'lastName', 'dateOfBirth']
    },
    contactInfo: {
      type: 'object',
      title: 'Contact Information',
      properties: {
        email: { 
          type: 'string', 
          format: 'email', 
          title: 'Primary Email' 
        },
        phone: { 
          type: 'string', 
          format: 'tel', 
          title: 'Phone Number' 
        },
        alternateEmail: { 
          type: 'string', 
          format: 'email', 
          title: 'Alternate Email' 
        }
      },
      required: ['email']
    },
    addresses: {
      type: 'array',
      title: 'Addresses',
      description: 'Add one or more addresses',
      items: {
        type: 'object',
        properties: {
          type: {
            type: 'string',
            title: 'Address Type',
            enum: ['home', 'work', 'other'],
            enumNames: ['Home', 'Work', 'Other']
          },
          street: { 
            type: 'string', 
            title: 'Street Address',
            minLength: 5
          },
          city: { 
            type: 'string', 
            title: 'City',
            minLength: 2
          },
          state: { 
            type: 'string', 
            title: 'State/Province',
            minLength: 2
          },
          zipCode: { 
            type: 'string', 
            title: 'ZIP/Postal Code',
            pattern: '^[0-9A-Za-z\\s-]+$'
          },
          country: {
            type: 'string',
            title: 'Country',
            enum: ['US', 'CA', 'UK', 'DE', 'FR', 'AU', 'JP', 'CN', 'IN', 'BR'],
            enumNames: ['United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Australia', 'Japan', 'China', 'India', 'Brazil']
          },
          isPrimary: {
            type: 'boolean',
            title: 'Primary Address',
            description: 'Mark as your primary address'
          }
        },
        required: ['type', 'street', 'city', 'state', 'zipCode', 'country']
      }
    },
    education: {
      type: 'array',
      title: 'Education History',
      description: 'Add your educational background',
      items: {
        type: 'object',
        properties: {
          institution: { 
            type: 'string', 
            title: 'Institution Name',
            minLength: 2
          },
          degree: { 
            type: 'string', 
            title: 'Degree/Certificate',
            minLength: 2
          },
          fieldOfStudy: { 
            type: 'string', 
            title: 'Field of Study',
            minLength: 2
          },
          startDate: { 
            type: 'string', 
            format: 'date', 
            title: 'Start Date' 
          },
          endDate: { 
            type: 'string', 
            format: 'date', 
            title: 'End Date' 
          },
          gpa: {
            type: 'number',
            title: 'GPA',
            minimum: 0,
            maximum: 4,
            description: 'Grade Point Average (0.0 - 4.0)'
          },
          description: {
            type: 'string',
            title: 'Description',
            description: 'Additional details about your education'
          }
        },
        required: ['institution', 'degree', 'fieldOfStudy', 'startDate']
      }
    },
    skills: {
      type: 'array',
      title: 'Skills & Expertise',
      description: 'List your skills and proficiency levels',
      items: {
        type: 'object',
        properties: {
          name: { 
            type: 'string', 
            title: 'Skill Name',
            minLength: 2
          },
          category: {
            type: 'string',
            title: 'Category',
            enum: ['technical', 'soft', 'language', 'other'],
            enumNames: ['Technical', 'Soft Skills', 'Language', 'Other']
          },
          proficiency: {
            type: 'string',
            title: 'Proficiency Level',
            enum: ['beginner', 'intermediate', 'advanced', 'expert'],
            enumNames: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
          },
          yearsOfExperience: {
            type: 'integer',
            title: 'Years of Experience',
            minimum: 0,
            maximum: 50
          }
        },
        required: ['name', 'category', 'proficiency']
      }
    },
    preferences: {
      type: 'object',
      title: 'Preferences & Settings',
      properties: {
        newsletter: { 
          type: 'boolean', 
          title: 'Subscribe to Newsletter',
          description: 'Receive updates about our products and services'
        },
        marketing: { 
          type: 'boolean', 
          title: 'Marketing Communications',
          description: 'Receive marketing and promotional emails'
        },
        theme: {
          type: 'string',
          title: 'Theme Preference',
          enum: ['light', 'dark', 'auto'],
          enumNames: ['Light', 'Dark', 'Auto'],
          description: 'Choose your preferred interface theme'
        },
        language: {
          type: 'string',
          title: 'Language Preference',
          enum: ['en', 'es', 'fr', 'de', 'zh', 'ja'],
          enumNames: ['English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese']
        },
        timezone: {
          type: 'string',
          title: 'Timezone',
          enum: ['UTC', 'EST', 'CST', 'MST', 'PST', 'GMT'],
          enumNames: ['UTC', 'Eastern Time', 'Central Time', 'Mountain Time', 'Pacific Time', 'Greenwich Mean Time']
        }
      }
    }
  },
  required: ['personalInfo', 'contactInfo']
};

const complexUischema = {
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
            { type: 'Control', scope: '#/properties/personalInfo/properties/firstName' },
            { type: 'Control', scope: '#/properties/personalInfo/properties/lastName' }
          ]
        },
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/personalInfo/properties/dateOfBirth' },
            { type: 'Control', scope: '#/properties/personalInfo/properties/gender' }
          ]
        },
        { type: 'Control', scope: '#/properties/personalInfo/properties/profilePicture' }
      ]
    },
    {
      type: 'Group',
      label: 'Contact Information',
      elements: [
        { type: 'Control', scope: '#/properties/contactInfo/properties/email' },
        { type: 'Control', scope: '#/properties/contactInfo/properties/phone' },
        { type: 'Control', scope: '#/properties/contactInfo/properties/alternateEmail' }
      ]
    },
    {
      type: 'Group',
      label: 'Addresses',
      elements: [
        { type: 'Control', scope: '#/properties/addresses' }
      ]
    },
    {
      type: 'Group',
      label: 'Education History',
      elements: [
        { type: 'Control', scope: '#/properties/education' }
      ]
    },
    {
      type: 'Group',
      label: 'Skills & Expertise',
      elements: [
        { type: 'Control', scope: '#/properties/skills' }
      ]
    },
    {
      type: 'Group',
      label: 'Preferences & Settings',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/preferences/properties/newsletter' },
            { type: 'Control', scope: '#/properties/preferences/properties/marketing' }
          ]
        },
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/preferences/properties/theme' },
            { type: 'Control', scope: '#/properties/preferences/properties/language' },
            { type: 'Control', scope: '#/properties/preferences/properties/timezone' }
          ]
        }
      ]
    }
  ]
};

export const ComplexFormExample: React.FC = () => {
  const [data, setData] = useState({});

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complex Registration Form
          </h1>
          <p className="text-gray-600">
            This example demonstrates complex field types including arrays, objects, and nested structures
          </p>
        </div>
        
        <TailwindJsonForms
          schema={complexSchema}
          uischema={complexUischema}
          data={data}
          onChange={setData}
        />
        
        <div className="mt-8 p-4 bg-white rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Form Data:</h3>
          <pre className="text-sm text-gray-600 overflow-auto max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
