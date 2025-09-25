import React, { useEffect, useState } from 'react';
import { and, isVisible, rankWith, uiTypeIs } from '@jsonforms/core';
import { withJsonFormsLayoutProps } from '@jsonforms/react';

import { TailwindLayoutRenderer, withAjvProps } from './layout';

interface TailwindCategorizationLayoutRendererProps {
  label: string;
  data: any;
  path: string;
  renderers: any[];
  cells: any[];
  schema: any;
  uischema: any;
  visible?: boolean;
  enabled?: boolean;
  selected?: number;
  onChange?: (value: number, activeCategory: number) => void;
  ajv?: any;
}

const TailwindCategorizationLayoutRenderer: React.FC<TailwindCategorizationLayoutRendererProps> = (
  props
) => {
  const {
    label,
    data,
    path,
    renderers,
    cells,
    schema,
    uischema,
    visible,
    enabled,
    selected,
    onChange,
    ajv
  } = props;
  const [activeCategory, setActiveCategory] = useState<number>(selected ?? 0);

  useEffect(() => {
    return () => {
      setActiveCategory(0);
    };
  }, []);

  if (!visible) return null;

  const categories = uischema.elements.filter((category: any) =>
    isVisible(category, data, '', ajv)
  );
  const childProps = {
    elements: categories[activeCategory].elements,
    schema,
    path,
    direction: 'column',
    enabled,
    visible,
    renderers,
    cells
  };
  const onTabChange = (_event: React.SyntheticEvent, value: number) => {
    if (onChange) {
      onChange(value, activeCategory);
    }
    setActiveCategory(value);
  };
  return (
    <>
      {label}
      <ul
        className="tw-mb-0 tw-flex tw-list-none tw-flex-row tw-flex-wrap tw-rounded-t-md tw-border tw-bg-color-0050 tw-p-2"
        role="tablist"
      >
        {Array.isArray(categories) &&
          categories.map(({ label }: any, idx: number) => (
            <li key={idx} className="-tw-mb-px tw-mr-2 tw-flex-auto tw-text-center last:tw-mr-0">
              <div
                id={`cat-${label.toLowerCase().split(' ').join('-')}`}
                className={`tw-block tw-cursor-pointer tw-select-none tw-rounded tw-py-1.5 tw-text-sm tw-font-semibold tw-uppercase tw-leading-normal tw-no-underline tw-shadow hover:tw-shadow-lg ${
                  activeCategory === idx
                    ? 'tw-bg-color-0600 tw-text-white'
                    : 'tw-bg-white tw-text-color-0600'
                }`}
                onClick={(e) => {
                  onTabChange(e, idx);
                }}
              >
                {label}
              </div>
            </li>
          ))}
      </ul>
      <div className="tw-rounded-b-md tw-border tw-pt-2">
        <TailwindLayoutRenderer layout="categorization" {...childProps} />
      </div>
    </>
  );
};

export const tailwindCategorizationControlTester = rankWith(
  1001,
  and(uiTypeIs('Categorization'), (uischema: any) =>
    uischema.elements?.reduce((acc: boolean, e: any) => acc && e.type === 'Category', true)
  )
);

export { TailwindCategorizationLayoutRenderer };

export const TailwindCategorizationControl = withJsonFormsLayoutProps(
  withAjvProps(TailwindCategorizationLayoutRenderer)
);
