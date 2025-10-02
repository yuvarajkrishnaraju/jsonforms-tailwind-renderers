import React, { useState } from 'react';
import { BasicFormExample } from './basic-form';
import { ComplexFormExample } from './complex-form';
import { ConditionalFormExample } from './conditional-form';

type ExampleType = 'basic' | 'complex' | 'conditional';

const examples = [
  {
    id: 'basic',
    name: 'Basic Form',
    description: 'Simple form with basic field types and validation',
    component: BasicFormExample
  },
  {
    id: 'complex',
    name: 'Complex Form',
    description: 'Advanced form with arrays, objects, and nested structures',
    component: ComplexFormExample
  },
  {
    id: 'conditional',
    name: 'Conditional Form',
    description: 'Dynamic form with conditional field visibility',
    component: ConditionalFormExample
  }
];

export const DemoApp: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<ExampleType>('basic');

  const SelectedComponent = examples.find(ex => ex.id === selectedExample)?.component || BasicFormExample;

  return (
    <div className="tw-min-h-screen tw-bg-gray-50">
      {/* Navigation Header */}
      <nav className="tw-bg-white tw-shadow-sm tw-border-b tw-border-gray-200">
        <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
          <div className="tw-flex tw-justify-between tw-h-16">
            <div className="tw-flex tw-items-center">
              <h1 className="tw-text-xl tw-font-semibold tw-text-gray-900">
                JSONForms Tailwind Renderers
              </h1>
            </div>
            <div className="tw-flex tw-items-center tw-space-x-4">
              <a
                href="https://github.com/eclipsesource/jsonforms"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-text-gray-500 hover:tw-text-gray-700 tw-px-3 tw-py-2 tw-rounded-md tw-text-sm tw-font-medium"
              >
                JSONForms
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Example Selector */}
      <div className="tw-bg-white tw-border-b tw-border-gray-200">
        <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8">
          <div className="tw-flex tw-space-x-8">
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => setSelectedExample(example.id as ExampleType)}
                className={`
                  tw-py-4 tw-px-1 tw-border-b-2 tw-font-medium tw-text-sm
                  ${selectedExample === example.id
                    ? 'tw-border-primary-500 tw-text-primary-600'
                    : 'tw-border-transparent tw-text-gray-500 hover:tw-text-gray-700 hover:tw-border-gray-300'
                  }
                `}
              >
                {example.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Example Description */}
      <div className="tw-bg-white tw-border-b tw-border-gray-200">
        <div className="tw-max-w-7xl tw-mx-auto tw-px-4 sm:tw-px-6 lg:tw-px-8 tw-py-4">
          <p className="tw-text-gray-600">
            {examples.find(ex => ex.id === selectedExample)?.description}
          </p>
        </div>
      </div>

      {/* Example Content */}
      <div className="tw-py-8">
        <SelectedComponent />
      </div>

      {/* Footer */}
      <footer className="tw-bg-white tw-border-t tw-border-gray-200 tw-mt-16">
        <div className="tw-max-w-7xl tw-mx-auto tw-py-8 tw-px-4 sm:tw-px-6 lg:tw-px-8">
          <div className="tw-text-center">
            <p className="tw-text-gray-500 tw-text-sm">
              Built with React, TypeScript, and Tailwind CSS
            </p>
            <p className="tw-text-gray-400 tw-text-xs tw-mt-2">
              Inspired by the{' '}
              <a
                href="https://github.com/eclipsesource/jsonforms"
                target="_blank"
                rel="noopener noreferrer"
                className="tw-text-primary-600 hover:tw-text-primary-500"
              >
                JSONForms project
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
