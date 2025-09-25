import React from 'react';

import merge from 'lodash/merge';
import { MdOpenInNew, MdHelpOutline, MdInfo } from 'react-icons/md';
import { TailwindButton } from './TailwindButton';

export interface LabelRendererProps {
  path?: string;
  label?: string;
  fontSize?: string;
  description?: string;
  enabled?: boolean;
  config?: any;
  uischema?: any;
  required?: boolean;
  onActionClick?: () => void;
  actionTooltip?: string;
}

export const LabelRenderer = React.memo<LabelRendererProps>(
  ({ path = '', label, fontSize, description, enabled, ...props }) => {
    const { config, uischema } = props;
    const appliedUiSchemaOptions = merge({}, config, uischema?.options);
    const { url, tooltip } = appliedUiSchemaOptions;

    function openInNewTab(): void {
      if (!url) return;
      const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
      if (newWindow) newWindow.opener = null;
    }

    return (
      <div className="tw-mr-0.5 tw-mt-0.5 tw-flex tw-select-none tw-flex-row tw-items-center tw-justify-between tw-text-sm tw-font-medium tw-text-color-label">
        <div className="tw-inline-flex tw-items-center tw-space-x-0.5">
          <div>{label}</div>
          {showAsRequired(props) && <div className="tw-text-red-600">*</div>}
        </div>
        <div className="tw-inline-flex tw-items-center tw-space-x-1">
          {url && (
            <TailwindButton
              id={`open-${path}-btn`}
              type="button"
              variant="primary"
              size="sm"
              onClick={openInNewTab}
              title={tooltip}
              icon={<MdOpenInNew className="tw-h-3 tw-w-3" />}
            >
              Open
            </TailwindButton>
          )}
          {description && (
            <button
              type="button"
              title={description}
              className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-gray-100 tw-p-1 tw-text-gray-600 hover:tw-bg-gray-200 hover:tw-text-gray-800 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-500 focus:tw-ring-offset-1 tw-transition-all tw-duration-200"
            >
              <MdHelpOutline className="tw-h-3 tw-w-3" />
            </button>
          )}
          {props.onActionClick && (
            <button
              type="button"
              onClick={props.onActionClick}
              title={props.actionTooltip}
              className="tw-inline-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-gray-100 tw-p-1 tw-text-gray-600 hover:tw-bg-gray-200 hover:tw-text-gray-800 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-gray-500 focus:tw-ring-offset-1 tw-transition-all tw-duration-200"
            >
              <MdInfo className="tw-h-3 tw-w-3" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

LabelRenderer.displayName = 'LabelRenderer';

function showAsRequired(props: LabelRendererProps): boolean {
  return Boolean(props?.required && !(props?.config?.hideRequiredAsterisk ?? false));
}
