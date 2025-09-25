export interface ErrorMessageProps {
  id?: string;
  path?: string;
  errors?: string[];
}

export const ErrorMessage = ({ id, path, errors }: ErrorMessageProps): JSX.Element => {
  let errorMessage = (errors?.length ?? 0) > 0 ? errors : null;
  if (
    typeof errors?.some === 'function' &&
    errors.some((error) => error.includes('must match pattern "^[a-zA-Z0-9-]*$"'))
  ) {
    errorMessage = errors.map((error) =>
      error.replace('must match pattern "^[a-zA-Z0-9-]*$"', 'must match alphabets, numeric and -')
    );
  }
  return (
    <>
      {errorMessage && (
        <div className="tw-mt-1 tw-flex tw-items-start tw-space-x-2 tw-rounded-md tw-bg-red-50 tw-px-2 tw-py-1.5 tw-border-l-4 tw-border-l-red-400">
          <div className="tw-flex-shrink-0">
            <svg className="tw-h-4 tw-w-4 tw-text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="tw-flex-1">
            <label
              id={id + '-error-msg'}
              htmlFor={path}
              className="tw-block tw-w-full tw-select-none tw-whitespace-pre-wrap tw-text-left tw-text-xs tw-font-medium tw-text-red-800"
            >
              {errorMessage}
            </label>
          </div>
        </div>
      )}
    </>
  );
}
