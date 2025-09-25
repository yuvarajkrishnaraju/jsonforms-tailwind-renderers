import React from 'react';
import { JsonFormsDispatch } from '@jsonforms/react';

export interface TabProps {
  id: number;
  label?: string;
  selected: number;
  handleChange: (id: number) => void;
}

export interface TabListProps {
  selected: number;
  handleChange: (id: number) => void;
  infos: any[];
  isVertical?: boolean;
}

export interface TabPanelsProps {
  selected: number;
  infos: any[];
  path: string;
  renderers: any[];
  cells: any[];
}

export interface TabRendererProps {
  selected: number;
  onChange: (id: number) => void;
  infos: any[];
  path: string;
  renderers: any[];
  cells: any[];
}

export const Tab: React.FC<TabProps> = ({ id, label, selected, handleChange }) => (
  <li className="tw-flex-auto tw-cursor-pointer tw-text-center">
    <div
      className={`tw-block tw-select-none tw-rounded tw-py-1 tw-text-[10px] tw-font-semibold tw-uppercase tw-leading-normal tw-shadow hover:tw-shadow-lg ${
        selected === id
          ? 'tw-bg-color-0600 tw-text-white'
          : 'tw-border tw-bg-white tw-text-color-0600'
      }`}
      onClick={(e) => {
        e.preventDefault();
        handleChange(id);
      }}
      data-toggle="tab"
      role="tablist"
    >
      {label}
    </div>
  </li>
);

export const TabList: React.FC<TabListProps> = ({
  selected,
  handleChange,
  infos,
  isVertical = false
}) => (
  <ul
    className={`tw-m-0 tw-flex tw-flex-wrap ${isVertical ? 'tw-h-full tw-w-24 tw-flex-col tw-justify-center tw-space-y-2 tw-rounded-md tw-border tw-p-2' : 'tw-w-full tw-flex-row tw-space-x-2'}`}
    role="tablist"
  >
    {Array.isArray(infos) &&
      infos.map((info, index) => (
        <Tab
          key={`tab-list-${index}`}
          id={index}
          label={info?.label}
          selected={selected}
          handleChange={handleChange}
        />
      ))}
  </ul>
);

export const TabPanels: React.FC<TabPanelsProps> = ({ selected, infos, path, renderers, cells }) => (
  <div className="tw-mb-2 tw-flex tw-w-full tw-min-w-0 tw-flex-col tw-break-words tw-rounded tw-bg-white tw-shadow">
    <div className="tw-flex-auto tw-px-1.5 tw-py-0.5">
      <div className="tab-content tab-space">
        {Array.isArray(infos) &&
          infos.map((info, index) => (
            <div
              key={`tab-panel-${index}`}
              className={selected === index ? 'tw-block' : 'tw-hidden'}
              id={`tab-panel-${index}`}
            >
              <JsonFormsDispatch
                key={index}
                schema={info.schema}
                uischema={info.uischema}
                path={path}
                renderers={renderers}
                cells={cells}
              />
            </div>
          ))}
      </div>
    </div>
  </div>
);

export const TabRenderer: React.FC<TabRendererProps> = ({ selected, onChange, infos, ...otherProps }) => {
  if (!Array.isArray(infos)) return <></>;
  return (
    <div className="tw-flex tw-flex-wrap tw-px-2 tw-pb-1">
      <div className="tw-w-full">
        <TabList selected={selected} handleChange={onChange} infos={infos} />
        <TabPanels selected={selected} infos={infos} {...otherProps} />
      </div>
    </div>
  );
};
