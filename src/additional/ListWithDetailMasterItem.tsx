import React from 'react';
import { withJsonFormsMasterListItemProps } from '@jsonforms/react';
import { MdDelete } from 'react-icons/md';

interface ListWithDetailMasterItemProps {
  index: number;
  childLabel: string;
  selected: boolean;
  handleSelect: (index: number) => () => void;
  removeItem: (path: string, index: number) => () => void;
  path: string;
}

const ListWithDetailMasterItem: React.FC<ListWithDetailMasterItemProps> = ({
  index,
  childLabel,
  selected,
  handleSelect,
  removeItem,
  path
}) => {
  return (
    <div
      className={`tw-flex tw-items-center tw-w-full tw-px-4 tw-py-3 tw-border-b tw-border-gray-200 tw-cursor-pointer tw-transition-all tw-duration-200 hover:tw-bg-gray-50 ${
        selected ? 'tw-bg-blue-50 tw-border-blue-200' : 'tw-bg-white'
      }`}
      onClick={handleSelect(index)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleSelect(index)();
        }
      }}
      tabIndex={0}
      role="button"
    >
      {/* Avatar */}
      <div className="tw-flex-shrink-0 tw-mr-3">
        <div className="tw-w-8 tw-h-8 tw-rounded-full tw-bg-blue-600 tw-flex tw-items-center tw-justify-center tw-text-white tw-text-sm tw-font-medium">
          {index + 1}
        </div>
      </div>

      {/* Content */}
      <div className="tw-flex-1 tw-min-w-0">
        <p className="tw-text-sm tw-font-medium tw-text-gray-900 tw-truncate">{childLabel}</p>
      </div>

      {/* Delete Button */}
      <div className="tw-flex-shrink-0 tw-ml-3">
        <button
          aria-label="Delete"
          onClick={(e) => {
            e.stopPropagation();
            removeItem(path, index)();
          }}
          className="tw-p-2 tw-rounded-full tw-text-gray-400 hover:tw-text-red-600 hover:tw-bg-red-50 tw-transition-all tw-duration-200 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-500 focus:tw-ring-offset-1"
        >
          <MdDelete />
        </button>
      </div>
    </div>
  );
};

export default withJsonFormsMasterListItemProps(ListWithDetailMasterItem);
