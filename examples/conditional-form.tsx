import React, { useState } from 'react';
import TailwindJsonForms from '../src/index-light';
import { UISchemaElement } from '@jsonforms/core';

const conditionalSchema = {
  type: 'object',
  title: 'Conditional Registration Form',
  properties: {
    accountType: {
      type: 'string',
      title: 'Account Type',
      description: 'Select the type of account you want to create',
      enum: ['personal', 'business', 'enterprise'],
      enumNames: ['Personal', 'Business', 'Enterprise']
    },
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
        ssn: {
          type: 'string',
          title: 'Social Security Number',
          pattern: '^[0-9]{3}-[0-9]{2}-[0-9]{4}$',
          description: 'Format: XXX-XX-XXXX'
        }
      },
      required: ['firstName', 'lastName', 'dateOfBirth']
    },
    businessInfo: {
      type: 'object',
      title: 'Business Information',
      properties: {
        businessName: { 
          type: 'string', 
          title: 'Business Name',
          minLength: 2,
          maxLength: 100
        },
        businessType: {
          type: 'string',
          title: 'Business Type',
          enum: ['corporation', 'llc', 'partnership', 'sole-proprietorship', 'nonprofit'],
          enumNames: ['Corporation', 'LLC', 'Partnership', 'Sole Proprietorship', 'Non-Profit']
        },
        taxId: { 
          type: 'string', 
          title: 'Tax ID (EIN)',
          pattern: '^[0-9]{2}-[0-9]{7}$',
          description: 'Format: XX-XXXXXXX'
        },
        industry: {
          type: 'string',
          title: 'Industry',
          enum: ['technology', 'healthcare', 'finance', 'retail', 'manufacturing', 'education', 'other'],
          enumNames: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Other']
        },
        employeeCount: {
          type: 'integer',
          title: 'Number of Employees',
          minimum: 1,
          maximum: 10000
        },
        annualRevenue: {
          type: 'string',
          title: 'Annual Revenue Range',
          enum: ['under-100k', '100k-500k', '500k-1m', '1m-5m', '5m-10m', 'over-10m'],
          enumNames: ['Under $100K', '$100K - $500K', '$500K - $1M', '$1M - $5M', '$5M - $10M', 'Over $10M']
        }
      },
      required: ['businessName', 'businessType', 'taxId', 'industry']
    },
    enterpriseInfo: {
      type: 'object',
      title: 'Enterprise Information',
      properties: {
        companyName: { 
          type: 'string', 
          title: 'Company Name',
          minLength: 2,
          maxLength: 100
        },
        parentCompany: {
          type: 'string',
          title: 'Parent Company (if applicable)',
          maxLength: 100
        },
        industry: {
          type: 'string',
          title: 'Primary Industry',
          enum: ['technology', 'healthcare', 'finance', 'retail', 'manufacturing', 'education', 'government', 'other'],
          enumNames: ['Technology', 'Healthcare', 'Finance', 'Retail', 'Manufacturing', 'Education', 'Government', 'Other']
        },
        employeeCount: {
          type: 'integer',
          title: 'Number of Employees',
          minimum: 1000,
          maximum: 100000
        },
        annualRevenue: {
          type: 'string',
          title: 'Annual Revenue Range',
          enum: ['10m-50m', '50m-100m', '100m-500m', '500m-1b', 'over-1b'],
          enumNames: ['$10M - $50M', '$50M - $100M', '$100M - $500M', '$500M - $1B', 'Over $1B']
        },
        compliance: {
          type: 'array',
          title: 'Compliance Requirements',
          description: 'Select all applicable compliance standards',
          items: {
            type: 'string',
            enum: ['sox', 'gdpr', 'hipaa', 'pci-dss', 'iso27001', 'fedramp'],
            enumNames: ['SOX', 'GDPR', 'HIPAA', 'PCI-DSS', 'ISO 27001', 'FedRAMP']
          }
        },
        customFields: {
          type: 'array',
          title: 'Custom Fields',
          description: 'Add any additional custom fields',
          items: {
            type: 'object',
            properties: {
              fieldName: { type: 'string', title: 'Field Name' },
              fieldValue: { type: 'string', title: 'Field Value' },
              fieldType: {
                type: 'string',
                title: 'Field Type',
                enum: ['text', 'number', 'boolean', 'date'],
                enumNames: ['Text', 'Number', 'Boolean', 'Date']
              }
            },
            required: ['fieldName', 'fieldValue', 'fieldType']
          }
        }
      },
      required: ['companyName', 'industry', 'employeeCount', 'annualRevenue']
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
        website: { 
          type: 'string', 
          format: 'url', 
          title: 'Website' 
        },
        address: {
          type: 'object',
          title: 'Business Address',
          properties: {
            street: { type: 'string', title: 'Street Address' },
            city: { type: 'string', title: 'City' },
            state: { type: 'string', title: 'State/Province' },
            zipCode: { type: 'string', title: 'ZIP/Postal Code' },
            country: { type: 'string', title: 'Country' }
          },
          required: ['street', 'city', 'state', 'zipCode', 'country']
        }
      },
      required: ['email', 'phone']
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
        support: { 
          type: 'boolean', 
          title: 'Support Communications',
          description: 'Receive important support and maintenance updates'
        },
        timezone: {
          type: 'string',
          title: 'Preferred Timezone',
          enum: ['UTC', 'EST', 'CST', 'MST', 'PST', 'GMT'],
          enumNames: ['UTC', 'Eastern Time', 'Central Time', 'Mountain Time', 'Pacific Time', 'Greenwich Mean Time']
        }
      }
    }
  },
  required: ['accountType', 'contactInfo']
};

const conditionalUischema: any = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Group',
      label: 'Account Selection',
      options: {
        description: 'Choose the type of account that best fits your needs'
      },
      elements: [
        { type: 'Control', scope: '#/properties/accountType' }
      ]
    },
    {
      type: 'Group',
      label: 'Personal Information',
      rule: {
        effect: 'SHOW' as const,
        condition: {
          scope: '#/properties/accountType',
          schema: { const: 'personal' }
        }
      },
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/personalInfo/properties/firstName' },
            { type: 'Control', scope: '#/properties/personalInfo/properties/lastName' }
          ]
        },
        { type: 'Control', scope: '#/properties/personalInfo/properties/dateOfBirth' },
        { type: 'Control', scope: '#/properties/personalInfo/properties/ssn' }
      ]
    },
    {
      type: 'Group',
      label: 'Business Information',
      rule: {
        effect: 'SHOW' as const,
        condition: {
          scope: '#/properties/accountType',
          schema: { enum: ['business', 'enterprise'] }
        }
      },
      elements: [
        { type: 'Control', scope: '#/properties/businessInfo/properties/businessName' },
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/businessInfo/properties/businessType' },
            { type: 'Control', scope: '#/properties/businessInfo/properties/industry' }
          ]
        },
        { type: 'Control', scope: '#/properties/businessInfo/properties/taxId' },
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/businessInfo/properties/employeeCount' },
            { type: 'Control', scope: '#/properties/businessInfo/properties/annualRevenue' }
          ]
        }
      ]
    },
    {
      type: 'Group',
      label: 'Enterprise Information',
      rule: {
        effect: 'SHOW' as const,
        condition: {
          scope: '#/properties/accountType',
          schema: { const: 'enterprise' }
        }
      },
      elements: [
        { type: 'Control', scope: '#/properties/enterpriseInfo/properties/companyName' },
        { type: 'Control', scope: '#/properties/enterpriseInfo/properties/parentCompany' },
        {
          type: 'HorizontalLayout',
          elements: [
            { type: 'Control', scope: '#/properties/enterpriseInfo/properties/industry' },
            { type: 'Control', scope: '#/properties/enterpriseInfo/properties/employeeCount' },
            { type: 'Control', scope: '#/properties/enterpriseInfo/properties/annualRevenue' }
          ]
        },
        { type: 'Control', scope: '#/properties/enterpriseInfo/properties/compliance' },
        { type: 'Control', scope: '#/properties/enterpriseInfo/properties/customFields' }
      ]
    },
    {
      type: 'Group',
      label: 'Contact Information',
      elements: [
        { type: 'Control', scope: '#/properties/contactInfo/properties/email' },
        { type: 'Control', scope: '#/properties/contactInfo/properties/phone' },
        { type: 'Control', scope: '#/properties/contactInfo/properties/website' },
        { type: 'Control', scope: '#/properties/contactInfo/properties/address' }
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
            { type: 'Control', scope: '#/properties/preferences/properties/marketing' },
            { type: 'Control', scope: '#/properties/preferences/properties/support' }
          ]
        },
        { type: 'Control', scope: '#/properties/preferences/properties/timezone' }
      ]
    }
  ]
};

export const ConditionalFormExample: React.FC = () => {
  const [data, setData] = useState({});

  return (
    <div className="tw-min-h-screen tw-bg-gray-50 tw-py-8">
      <div className="tw-max-w-6xl tw-mx-auto tw-px-4">
        <div className="tw-text-center tw-mb-8">
          <h1 className="tw-text-3xl tw-font-bold tw-text-gray-900 tw-mb-2">
            Conditional Registration Form
          </h1>
          <p className="tw-text-gray-600">
            This example demonstrates conditional field visibility and dynamic form behavior
          </p>
        </div>
        
        <TailwindJsonForms
          schema={conditionalSchema}
          uischema={conditionalUischema}
          data={data}
          onChange={setData}
        />
        
        <div className="tw-mt-8 tw-p-4 tw-bg-white tw-rounded-lg tw-border tw-border-gray-200">
          <h3 className="tw-text-lg tw-font-medium tw-text-gray-900 tw-mb-2">Form Data:</h3>
          <pre className="tw-text-sm tw-text-gray-600 tw-overflow-auto tw-max-h-96">
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
};
