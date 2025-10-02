import React, { useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

// Types for validation results (kept minimal to avoid heavy static imports)
export interface ValidationError {
  message: string;
  severity: 'error' | 'warning' | 'info';
  startLine: number;
  startColumn: number;
  endLine: number;
  endColumn: number;
  suggestions?: string[];
}

export interface ValidationResult {
  timeTaken?: number;
  errors: ValidationError[];
}


interface SqlEditorProps {
  initialValue?: string;
  validate?: boolean;
  onChange?: (value: string) => void;
  onError?: (errors: ValidationError[]) => void;
  height?: string;
  width?: string;
  placeholder?: string;
  readOnly?: boolean;
}

/**
 * SQL Editor component with syntax highlighting, error detection, and suggestions
 * Uses Monaco Editor for a professional SQL editing experience
 */
export const SqlEditor: React.FC<SqlEditorProps> = ({
  initialValue = '',
  onChange,
  onError,
  validate = true,
  height = '300px',
  width = '100%',
  placeholder = 'Enter your SQL query here...\nExample Snowflake syntax:\nSELECT source.MEMBER:guid::string FROM your_table',
  readOnly = false,
}) => {

  const [sqlValue, setSqlValue] = useState(initialValue);
  const [isValidating, setIsValidating] = useState(false);
  const [result, setResult] = useState<ValidationResult>();
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [currentError, setCurrentError] = useState<ValidationError | null>(null);
  const [validationDebounceTimer, setValidationDebounceTimer] = useState<NodeJS.Timeout | null>(
    null
  );
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  useEffect(() => {
    handleEditorChange(initialValue);
    return () => {
      setSqlValue('');
      // Clear any pending validation timers
      if (validationDebounceTimer) {
        clearTimeout(validationDebounceTimer);
      }
    };
  }, [initialValue]);

  // Initialize Monaco Editor with SQL language support on mount to avoid bundling monaco directly
  const handleEditorDidMount = useCallback(
    (editor: any, monacoApi: any) => {
      editorRef.current = editor;
      monacoRef.current = monacoApi;

      // Configure SQL language features
      monacoApi.languages.register({ id: 'sql' });

      // Add SQL keywords for better syntax highlighting
      monacoApi.languages.setMonarchTokensProvider('sql', {
        keywords: [
          // Uppercase keywords
          'SELECT',
          'FROM',
          'WHERE',
          'INSERT',
          'UPDATE',
          'DELETE',
          'CREATE',
          'DROP',
          'TABLE',
          'INDEX',
          'VIEW',
          'PROCEDURE',
          'FUNCTION',
          'TRIGGER',
          'SCHEMA',
          'DATABASE',
          'ALTER',
          'ADD',
          'MODIFY',
          'COLUMN',
          'CONSTRAINT',
          'PRIMARY',
          'FOREIGN',
          'KEY',
          'REFERENCES',
          'UNIQUE',
          'NOT',
          'NULL',
          'DEFAULT',
          'CHECK',
          'CASCADE',
          'RESTRICT',
          'SET',
          'VALUES',
          'INTO',
          'JOIN',
          'LEFT',
          'RIGHT',
          'INNER',
          'OUTER',
          'ON',
          'GROUP',
          'BY',
          'HAVING',
          'ORDER',
          'ASC',
          'DESC',
          'LIMIT',
          'OFFSET',
          'UNION',
          'ALL',
          'DISTINCT',
          'AS',
          'CASE',
          'WHEN',
          'THEN',
          'ELSE',
          'END',
          'COUNT',
          'SUM',
          'AVG',
          'MIN',
          'MAX',
          'COALESCE',
          'ISNULL',
          'CAST',
          'CONVERT',
          'GETDATE',
          'GETUTCDATE',
          'SYSDATETIME',
          // Snowflake-specific keywords
          'CURRENT_TIMESTAMP',
          'CURRENT_TIME',
          'CURRENT_DATE',
          'CURRENT_USER',
          'CURRENT_ROLE',
          'CURRENT_ACCOUNT',
          'CURRENT_SESSION',
          'CURRENT_WAREHOUSE',
          'CURRENT_DATABASE',
          'CURRENT_SCHEMA',
          'GUID',
          'UUID',
          'STRING',
          'VARCHAR',
          'CHAR',
          'TEXT',
          'INTEGER',
          'INT',
          'BIGINT',
          'SMALLINT',
          'DECIMAL',
          'NUMERIC',
          'FLOAT',
          'DOUBLE',
          'BOOLEAN',
          'BOOL',
          'DATE',
          'TIME',
          'TIMESTAMP',
          'TIMESTAMP_LTZ',
          'TIMESTAMP_NTZ',
          'TIMESTAMP_TZ',
          'VARIANT',
          'OBJECT',
          'ARRAY',
          // Lowercase keywords
          'select',
          'from',
          'where',
          'insert',
          'update',
          'delete',
          'create',
          'drop',
          'table',
          'index',
          'view',
          'procedure',
          'function',
          'trigger',
          'schema',
          'database',
          'alter',
          'add',
          'modify',
          'column',
          'constraint',
          'primary',
          'foreign',
          'key',
          'references',
          'unique',
          'not',
          'null',
          'default',
          'check',
          'cascade',
          'restrict',
          'set',
          'values',
          'into',
          'join',
          'left',
          'right',
          'inner',
          'outer',
          'on',
          'group',
          'by',
          'having',
          'order',
          'asc',
          'desc',
          'limit',
          'offset',
          'union',
          'all',
          'distinct',
          'as',
          'case',
          'when',
          'then',
          'else',
          'end',
          'count',
          'sum',
          'avg',
          'min',
          'max',
          'coalesce',
          'isnull',
          'cast',
          'convert',
          'getdate',
          'getutcdate',
          'sysdatetime',
          // Snowflake-specific lowercase keywords
          'current_timestamp',
          'current_time',
          'current_date',
          'current_user',
          'current_role',
          'current_account',
          'current_session',
          'current_warehouse',
          'current_database',
          'current_schema',
          'guid',
          'uuid',
          'string',
          'varchar',
          'char',
          'text',
          'integer',
          'int',
          'bigint',
          'smallint',
          'decimal',
          'numeric',
          'float',
          'double',
          'boolean',
          'bool',
          'date',
          'time',
          'timestamp',
          'timestamp_ltz',
          'timestamp_ntz',
          'timestamp_tz',
          'variant',
          'object',
          'array'
        ],
        operators: [
          '=',
          '>',
          '<',
          '!',
          '~',
          '?',
          ':',
          '==',
          '<=',
          '>=',
          '!=',
          '<>',
          '**',
          '//',
          '&&',
          '||',
          '++',
          '--',
          '**=',
          '//=',
          '&&=',
          '||=',
          '+=',
          '-=',
          '*=',
          '/=',
          '%=',
          '^=',
          '|=',
          '<<=',
          '>>=',
          // Snowflake-specific operators
          '::',
          '->',
          '->>',
          '=>',
          '<=>',
          'IS DISTINCT FROM',
          'IS NOT DISTINCT FROM'
        ],
        symbols: /[=><!~?:&|+\-/*^%]+/,
        tokenizer: {
          root: [
            // Snowflake JSON path access (e.g., source.MEMBER:guid::string)
            [/[a-zA-Z_]\w*\.[a-zA-Z_]\w*:[a-zA-Z_]\w*::[a-zA-Z_]\w*/, 'json-path-type'],
            // JSON Path operators (e.g., .MEMBER)
            [/\.[a-zA-Z_]\w*/, 'json-member'],
            // Type casting and annotations (e.g., :guid, ::string)
            [/::[a-zA-Z_]\w*/, 'type'],
            [/:[a-zA-Z_]\w*/, 'type'],
            // Quoted identifiers (e.g., "DATA", "TYPE")
            [/"[^"]*"/, 'quoted-identifier'],
            // Single quoted strings
            [/'[^']*'/, 'string'],
            // Backtick quoted identifiers
            [/`[^`]*`/, 'quoted-identifier'],
            [
              /[a-zA-Z_]\w*/,
              {
                cases: {
                  '@keywords': 'keyword',
                  '@default': 'identifier'
                }
              }
            ],
            [/--.*$/, 'comment'],
            [/\/\*/, 'comment', '@comment'],
            [/\d+/, 'number'],
            [/;/, 'delimiter'],
            [/[=><!~?:&|+\-*/^%]+/, 'operator'],
            [/[{}()[\]\\]/, '@brackets'],
            [/[><](?!@symbols)/, '@brackets'],
            [
              /@symbols/,
              {
                cases: {
                  '@operators': 'operator',
                  '@default': ''
                }
              }
            ]
          ],
          comment: [
            [/[^/*]+/, 'comment'],
            [/\*\//, 'comment', '@pop'],
            [/[/*]/, 'comment']
          ]
        }
      });

      // Configure SQL language configuration
      monacoApi.languages.setLanguageConfiguration('sql', {
        comments: {
          lineComment: '--',
          blockComment: ['/*', '*/']
        },
        brackets: [
          ['{', '}'],
          ['[', ']'],
          ['(', ')']
        ],
        autoClosingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: '`', close: '`' }
        ],
        surroundingPairs: [
          { open: '{', close: '}' },
          { open: '[', close: ']' },
          { open: '(', close: ')' },
          { open: '"', close: '"' },
          { open: "'", close: "'" },
          { open: '`', close: '`' }
        ]
      });
      // Configure custom theme for modern scrollbars
      monacoApi.editor.defineTheme('modern-light', {
        base: 'vs',
        inherit: true,
        rules: [],
        colors: {
          'scrollbarSlider.background': '#d1d5db',
          'scrollbarSlider.hoverBackground': '#9ca3af',
          'scrollbarSlider.activeBackground': '#6b7280',
          'scrollbar.shadow': 'transparent',
          'editor.background': '#ffffff',
          'editor.foreground': '#1f2937',
          'editor.lineHighlightBackground': '#f9fafb',
          'editor.lineHighlightBorder': '#e5e7eb',
          'editorCursor.foreground': '#3b82f6',
          'editor.selectionBackground': '#dbeafe',
          'editor.inactiveSelectionBackground': '#f1f5f9'
        }
      });

      // Apply the custom theme
      monacoApi.editor.setTheme('modern-light');

      // Set initial value
      if (initialValue) {
        editor.setValue(initialValue);
      }

      // Add error markers
      updateErrorMarkers();
    },
    [initialValue, updateErrorMarkers]
  );

  // SQL validation function using new API
  const validateSQL = useCallback(
    async (sql: string): Promise<ValidationError[]> => {
      if (!sql.trim()) {
        return [];
      }

      try {
        setIsValidating(true);
        // Lazy-load the validator to keep it out of initial bundle
        const { validateSnowflakeSQL } = await import('snowflake-sql-validator');
        const res: ValidationResult = validateSnowflakeSQL(sql);
        setIsValidating(false);
        setResult(res);
        // Call onError callback if provided
        if (onError) {
          onError(res.errors);
        }

        return res.errors;
      } catch (validationError) {
        console.warn('SQL validation error:', validationError);
        const errorMessage =
          typeof validationError === 'string' ? validationError : 'SQL validation failed';

        return [
          {
            message: errorMessage,
            severity: 'warning',
            startLine: 1,
            startColumn: 1,
            endLine: 1,
            endColumn: 1,
            suggestions: []
          }
        ];
      }
    },
    [ onError]
  );

  // Debounced validation function
  const debouncedValidation = useCallback(
    (sql: string) => {
      // Clear existing timer
      if (validationDebounceTimer) {
        clearTimeout(validationDebounceTimer);
      }

      // Set new timer for validation
      const timer = setTimeout(async () => {
        if (validate && sql.trim()) {
          try {
            const newErrors = await validateSQL(sql);
            setErrors(newErrors);
          } catch (error) {
            console.error('Validation error:', error);
            setErrors([]);
          }
        } else {
          setErrors([]);
        }
      }, 500); // 500ms debounce delay

      setValidationDebounceTimer(timer);
    },
    [validate, validateSQL, validationDebounceTimer]
  );

  // Handle editor value changes - now only handles onChange, validation is separate
  const handleEditorChange = useCallback(
    (value: string | undefined) => {
      const newValue = value || '';
      setSqlValue(newValue);

      // Call onChange callback if provided
      if (onChange) {
        onChange(newValue);
      }

      // Trigger validation separately with debouncing
      if (validate) {
        debouncedValidation(newValue);
      }
    },
    [onChange, validate, debouncedValidation]
  );

  // (moved setup into the onMount above)

  // Update error markers in the editor
  const updateErrorMarkers = useCallback(() => {
    if (!editorRef.current || !monacoRef.current || !validate) return;

    const model = editorRef.current.getModel();
    if (!model) return;

    // Clear existing markers
    monacoRef.current.editor.setModelMarkers(model, 'sql-validator', []);

    // Add new error markers
    const markers = errors.map((error) => ({
      message: error.message,
      severity: (() => {
        if (error.severity === 'error') {
          return (
            monacoRef.current?.MarkerSeverity?.Error ||
            (global as any).mockMonaco?.editor?.MarkerSeverity?.Error ||
            8
          );
        } else if (error.severity === 'warning') {
          return (
            monacoRef.current?.MarkerSeverity?.Warning ||
            (global as any).mockMonaco?.editor?.MarkerSeverity?.Warning ||
            4
          );
        } else {
          return (
            monacoRef.current?.MarkerSeverity?.Info ||
            (global as any).mockMonaco?.editor?.MarkerSeverity?.Info ||
            2
          );
        }
      })(),
      startLineNumber: error.startLine,
      startColumn: error.startColumn,
      endLineNumber: error.endLine,
      endColumn: error.endColumn,
      tags: error.suggestions ? ['deprecated'] : undefined
    }));

    // Add current error highlight if one is selected
    if (currentError) {
      markers.push({
        message: 'Current error',
        severity:
          monacoRef.current?.MarkerSeverity?.Info ||
          (global as any).mockMonaco?.editor?.MarkerSeverity?.Info ||
          2,
        startLineNumber: currentError.startLine,
        startColumn: 1,
        endLineNumber: currentError.startLine,
        endColumn: 1,
        tags: ['unnecessary']
      });
    }

    monacoRef.current.editor.setModelMarkers(model, 'sql-validator', markers);
  }, [errors, currentError]);

  // Update error markers when errors change
  useEffect(() => {
    updateErrorMarkers();
  }, [errors, updateErrorMarkers]);

  // Handle error click to show suggestions
  const handleErrorClick = useCallback((error: ValidationError) => {
    setCurrentError(error);
    setShowSuggestions(true);

    // Scroll to the error line in the editor
    if (editorRef.current) {
      const editor = editorRef.current;
      editor.revealLineInCenter(error.startLine);
      editor.setPosition({
        lineNumber: error.startLine,
        column: error.startColumn
      });
      editor.focus();
    }
  }, []);

  // Apply suggestion
  const applySuggestion = useCallback(
    (suggestion: string) => {
      if (!currentError || !editorRef.current) return;

      const editor = editorRef.current;
      const model = editor.getModel();

      if (model) {
        const range = {
          startLine: currentError.startLine,
          startColumn: currentError.startColumn,
          endLine: currentError.endLine,
          endColumn: currentError.endColumn
        };

        // Replace the error with the suggestion
        editor.executeEdits('sql-suggestion', [
          {
            range,
            text: suggestion
          }
        ]);

        // Focus the editor
        editor.focus();
      }

      setShowSuggestions(false);
      setCurrentError(null);
    },
    [currentError]
  );

  // Close suggestions
  const closeSuggestions = useCallback(() => {
    setShowSuggestions(false);
    setCurrentError(null);
  }, []);

  // Helper function to format validation time
  const formatValidationTime = (time: number | undefined) => {
    if (!time) return '';
    if (time < 1) {
      return `${(time * 1000).toFixed(0)}μs`;
    } else if (time < 1000) {
      return `${time.toFixed(1)}ms`;
    } else {
      return `${(time / 1000).toFixed(2)}s`;
    }
  };

  // Helper function to get error severity color
  const getErrorSeverityColor = (severity: string) => {
    if (severity === 'error') {
      return 'tw-bg-red-500';
    } else if (severity === 'warning') {
      return 'tw-bg-yellow-500';
    } else {
      return 'tw-bg-blue-500';
    }
  };

  // Helper function to get validation status display
  const getValidationStatusDisplay = () => {
    if (isValidating) {
      return (
        <div className="tw-flex tw-items-center tw-gap-2">
          <div className="tw-w-4 tw-h-4 tw-border tw-border-blue-300 tw-border-t-blue-600 tw-rounded-full tw-animate-spin"></div>
          <span className="tw-text-xs tw-font-medium tw-text-blue-600">Validating...</span>
        </div>
      );
    } else if (errors.length > 0) {
      return (
        <div className="tw-flex tw-items-center tw-gap-2">
          <div className="tw-w-2 tw-h-2 tw-bg-red-500 tw-rounded-full"></div>
          <span className="tw-text-xs tw-font-medium tw-text-red-600">
            {errors.length} issue{errors.length > 1 ? 's' : ''}
          </span>
        </div>
      );
    } else {
      return (
        <div className="tw-flex tw-items-center tw-gap-2">
          <div className="tw-w-2 tw-h-2 tw-bg-green-500 tw-rounded-full"></div>
          <span className="tw-text-xs tw-font-medium tw-text-green-600">Valid</span>
        </div>
      );
    }
  };

  return (
    <div
      className={`tw-relative tw-w-full tw-group tw-my-2 tw-rounded-xl tw-border tw-shadow-lg tw-transition-all tw-duration-300 tw-ease-in-out ${
        !readOnly ? 'tw-bg-white hover:tw-shadow-xl' : 'tw-bg-slate-50 tw-opacity-90'
      } ${
        errors.length > 0
          ? 'tw-border-red-500 tw-ring-2 tw-ring-red-200 hover:tw-border-red-600 hover:tw-ring-red-300'
          : 'tw-border-slate-200 tw-ring-1 tw-ring-slate-200 hover:tw-border-blue-400 hover:tw-ring-blue-200'
      }`}
      style={{ width }}
      onClick={() => {
        // Clear current error when clicking outside
        if (currentError) {
          setCurrentError(null);
          setShowSuggestions(false);
        }
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          // Clear current error when pressing Enter or Space
          if (currentError) {
            setCurrentError(null);
            setShowSuggestions(false);
          }
        }
      }}
    >
      {/* Header with modern styling */}
      <div className="tw-flex tw-items-center tw-justify-between tw-px-4 tw-py-3 tw-bg-gradient-to-r tw-from-slate-50 tw-to-blue-50 tw-border-b tw-border-slate-200 tw-rounded-t-xl">
        <div className="tw-flex tw-items-center tw-gap-2">
          <div className="tw-w-2 tw-h-2 tw-bg-blue-500 tw-rounded-full tw-animate-pulse"></div>
          <span className="tw-text-sm tw-font-semibold tw-text-slate-700">SQL Editor</span>
          {readOnly && (
            <span className="tw-px-2 tw-py-1 tw-bg-slate-200 tw-text-slate-600 tw-text-xs tw-font-medium tw-rounded-full">
              Read Only
            </span>
          )}
        </div>
        <div className="tw-flex tw-items-center tw-gap-3">
          <span className="tw-text-xs tw-font-medium tw-text-slate-600">
            ({sqlValue.trim().length} characters)
          </span>
          {/* Validation Status Indicator */}
          {validate && (
            <div className="tw-flex tw-items-center tw-gap-2">
              {getValidationStatusDisplay()}

              {/* Validation Time Display */}
              {result?.timeTaken !== null && !isValidating && (
                <div className="tw-flex tw-items-center tw-gap-1 tw-px-2 tw-py-1 tw-bg-slate-100 tw-rounded-full">
                  <span className="tw-text-xs tw-font-medium tw-text-slate-600">
                    {formatValidationTime(result?.timeTaken)}
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* SQL Editor */}
      <div className="tw-p-1">
        <Editor
          height={height}
          width={width}
          defaultLanguage="sql"
          value={sqlValue}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            lineNumbers: 'on',
            roundedSelection: false,
            wordWrapColumn: 150,
            wordWrap: 'bounded',
            scrollbar: {
              vertical: 'visible',
              horizontal: 'visible',
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
              verticalSliderSize: 6,
              horizontalSliderSize: 6,
              useShadows: false,
              arrowSize: 0
            },
            readOnly,
            placeholder,
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            wordBasedSuggestions: 'currentDocument',
            parameterHints: {
              enabled: true
            },
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            renderLineHighlight: 'all'
          }}
          theme="modern-light"
        />
      </div>

      {/* Warning when no token provided */}
      {validate && (
        <div className="tw-bg-yellow-50 tw-border-t-2 tw-border-yellow-200 tw-p-4 tw-rounded-b-xl">
          <div className="tw-flex tw-items-center tw-gap-2">
            <div className="tw-w-4 tw-h-4 tw-bg-yellow-500 tw-rounded-full tw-flex tw-items-center tw-justify-center">
              <span className="tw-text-white tw-text-xs tw-font-bold">!</span>
            </div>
            <span className="tw-text-sm tw-font-medium tw-text-yellow-700">
              SQL validation requires authentication. Please provide an Okta token.
            </span>
          </div>
        </div>
      )}

      {/* Error Suggestions */}
      {validate && showSuggestions && currentError && (
        <div
          className="tw-absolute tw-bg-white tw-border tw-border-blue-300 tw-rounded-xl tw-shadow-2xl tw-p-4 tw-min-w-80 tw-z-50 tw-backdrop-blur-sm"
          style={{
            top: `${(currentError.startLine - 1) * 19 + 80}px`,
            left: `${(currentError.startColumn - 1) * 8 + 120}px`
          }}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
            }
          }}
        >
          {/* Suggestion Header */}
          <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
            <div className="tw-flex tw-items-center tw-gap-2">
              <div className="tw-w-3 tw-h-3 tw-bg-blue-500 tw-rounded-full"></div>
              <span className="tw-text-sm tw-font-bold tw-text-slate-800">Error Details</span>
            </div>
            <button
              onClick={closeSuggestions}
              className="tw-w-6 tw-h-6 tw-bg-slate-100 hover:tw-bg-slate-200 tw-border-none tw-text-slate-600 tw-cursor-pointer tw-text-sm tw-font-bold tw-rounded-full tw-transition-colors tw-flex tw-items-center tw-justify-center"
            >
              ×
            </button>
          </div>

          {/* Error Message */}
          <div className="tw-bg-red-50 tw-border-l-4 tw-border-red-400 tw-p-3 tw-rounded-r-lg tw-mb-3">
            <p className="tw-text-sm tw-text-red-800 tw-font-medium">{currentError.message}</p>
          </div>

          {/* Suggestions */}
          {currentError.suggestions && currentError.suggestions.length > 0 && (
            <div>
              <div className="tw-text-xs tw-font-semibold tw-text-slate-600 tw-mb-2 tw-uppercase tw-tracking-wide">
                💡 Suggestions
              </div>
              <div className="tw-space-y-2">
                {currentError.suggestions.map((suggestion, index) => (
                  <button
                    key={`suggestion-${currentError.startLine}-${currentError.startColumn}-${index}`}
                    onClick={() => applySuggestion(suggestion)}
                    className="tw-w-full tw-text-left tw-bg-blue-50 hover:tw-bg-blue-100 tw-border tw-border-blue-200 hover:tw-border-blue-300 tw-text-slate-700 tw-px-3 tw-py-2 tw-cursor-pointer tw-text-sm tw-rounded-lg tw-transition-all tw-duration-200 tw-font-mono"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Summary */}
      {validate && errors.length > 0 && (
        <div className="tw-bg-gradient-to-r tw-from-red-50 tw-to-orange-50 tw-border-t-2 tw-border-red-200 tw-p-4 tw-rounded-b-xl">
          <div className="tw-flex tw-justify-between tw-items-center tw-mb-3">
            <div className="tw-flex tw-items-center tw-gap-2">
              <div className="tw-w-4 tw-h-4 tw-bg-red-500 tw-rounded-full tw-flex tw-items-center tw-justify-center">
                <span className="tw-text-white tw-text-xs tw-font-bold">{errors.length}</span>
              </div>
              <span className="tw-text-sm tw-font-bold tw-text-red-700">
                {errors.length} issue{errors.length > 1 ? 's' : ''} found
              </span>
            </div>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="tw-px-3 tw-py-1.5 tw-bg-red-100 hover:tw-bg-red-200 tw-border tw-border-red-300 tw-text-red-700 tw-cursor-pointer tw-text-xs tw-font-medium tw-rounded-lg tw-transition-colors tw-flex tw-items-center tw-gap-2"
            >
              {showSuggestions ? (
                <>
                  <span>Hide</span>
                  <span className="tw-text-red-500">👁️</span>
                </>
              ) : (
                <>
                  <span>Show</span>
                  <span className="tw-text-red-500">💡</span>
                </>
              )}
            </button>
          </div>

          {/* Clickable Error List */}
          <div className="tw-max-h-24 tw-overflow-y-auto tw-space-y-2">
            {errors.map((error, index) => (
              <div
                key={`error-${error.startLine}-${error.startColumn}-${error.message.substring(0, 20)}`}
                onClick={() => handleErrorClick(error)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleErrorClick(error);
                  }
                }}
                className="tw-flex tw-items-center tw-gap-3 tw-p-2 tw-rounded-lg tw-cursor-pointer hover:tw-bg-red-100 tw-transition-all tw-duration-200 tw-border tw-border-transparent hover:tw-border-red-200"
              >
                <div
                  className={`tw-w-3 tw-h-3 tw-rounded-full tw-flex-shrink-0 ${getErrorSeverityColor(error.severity)}`}
                />
                <div className="tw-flex-1 tw-min-w-0">
                  <div className="tw-text-xs tw-font-semibold tw-text-slate-700 tw-mb-1">
                    Line {error.startLine}
                  </div>
                  <div className="tw-text-xs tw-text-slate-600 tw-truncate">{error.message}</div>
                </div>
                {error.suggestions && error.suggestions.length > 0 && (
                  <div className="tw-w-6 tw-h-6 tw-bg-blue-100 tw-rounded-full tw-flex tw-items-center tw-justify-center tw-flex-shrink-0">
                    <span className="tw-text-blue-600 tw-text-xs">💡</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

