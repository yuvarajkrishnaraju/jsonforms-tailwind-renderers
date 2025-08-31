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
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                JSONForms Tailwind Renderers
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://github.com/eclipsesource/jsonforms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                JSONForms
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Example Selector */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => setSelectedExample(example.id as ExampleType)}
                className={`
                  py-4 px-1 border-b-2 font-medium text-sm
                  ${selectedExample === example.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <p className="text-gray-600">
            {examples.find(ex => ex.id === selectedExample)?.description}
          </p>
        </div>
      </div>

      {/* Example Content */}
      <div className="py-8">
        <SelectedComponent />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Built with React, TypeScript, and Tailwind CSS
            </p>
            <p className="text-gray-400 text-xs mt-2">
              Inspired by the{' '}
              <a
                href="https://github.com/eclipsesource/jsonforms"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary-600 hover:text-primary-500"
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
