import React, { Suspense, lazy } from 'react';
import { EditorProps } from '@monaco-editor/react';

// Lazy load Monaco Editor
const Editor = lazy(() => import('@monaco-editor/react'));

export interface ICustomEditor extends EditorProps {
  enabled?: boolean;
  isError?: boolean;
}

const EditorFallback = () => (
  <div className="tw-flex tw-items-center tw-justify-center tw-h-32 tw-bg-gray-100 tw-border tw-border-gray-300 tw-rounded tw-text-gray-500">
    Loading editor...
  </div>
);

export const CustomEditor = ({
  enabled = true,
  isError = false,
  className = '',
  ...props
}: ICustomEditor) => (
  <Suspense fallback={<EditorFallback />}>
    <Editor
      className={`group tw-my-1 tw-rounded tw-border tw-p-1 ${enabled ? 'tw-bg-white' : 'tw-bg-slate-100'} tw-text-color-label tw-placeholder-gray-300 ${
        isError
          ? 'tw-border-red-600 tw-ring-red-600 hover:tw-border-red-500'
          : 'tw-border-slate-300 tw-outline-color-0500 tw-ring-color-0500 hover:tw-border-color-0600 hover:tw-ring-color-0500 hover:tw-border-[1.5px]'
      } tw-w-full ${className}`}
      theme="light"
      options={{
        codeLens: true,
        fontSize: 14,
        folding: true,
        wordWrap: 'on',
        readOnly: !enabled,
        domReadOnly: !enabled,
        smoothScrolling: true,
        formatOnPaste: true,
        quickSuggestions: true,
        quickSuggestionsDelay: 100,
        wordWrapColumn: 80,
        scrollBeyondLastLine: false,
        padding: {
          bottom: 5,
          top: 5
        }
      }}
      {...props}
    />
  </Suspense>
);
