import React, { useState, useCallback } from 'react';
import { RiAddLine, RiDeleteBin6Line, RiArrowDownSLine, RiArrowRightSLine } from 'react-icons/ri';
import { ControlProps } from '../types';
import { getData, setData, getLabel, getDescription, isRequired, validateField } from '../utils';
import { JsonFormsRenderer } from '../JsonFormsRenderer';

export const ArrayControl: React.FC<ControlProps> = ({
  schema,
  uischema,
  path,
  data,
  onChange,
  onBlur,
  onFocus,
  errors,
  touched,
  required
}) => {
  const [collapsedItems, setCollapsedItems] = useState<Set<number>>(new Set());
  
  const value = getData(data, path) || [];
  const fieldErrors = errors?.[path] || [];
  const isTouched = touched?.[path] || false;
  const isFieldRequired = required || isRequired(schema, uischema);
  
  const handleAddItem = useCallback(() => {
    const newItem = schema.items?.default !== undefined ? schema.items.default : {};
    const newArray = [...value, newItem];
    const newData = setData(data, path, newArray);
    onChange(newData);
  }, [data, path, onChange, schema.items, value]);
  
  const handleRemoveItem = useCallback((index: number) => {
    const newArray = value.filter((_: any, i: number) => i !== index);
    const newData = setData(data, path, newArray);
    onChange(newData);
    
    // Remove from collapsed items
    const newCollapsed = new Set(collapsedItems);
    newCollapsed.delete(index);
    setCollapsedItems(newCollapsed);
  }, [data, path, onChange, value, collapsedItems]);
  
  const handleItemChange = useCallback((index: number, itemData: any) => {
    const newArray = [...value];
    newArray[index] = itemData;
    const newData = setData(data, path, newArray);
    onChange(newData);
  }, [data, path, onChange, value]);
  
  const toggleCollapsed = useCallback((index: number) => {
    const newCollapsed = new Set(collapsedItems);
    if (newCollapsed.has(index)) {
      newCollapsed.delete(index);
    } else {
      newCollapsed.add(index);
    }
    setCollapsedItems(newCollapsed);
  }, [collapsedItems]);
  
  const isCollapsed = (index: number) => collapsedItems.has(index);
  
  return (
    <div className="tw-mb-4">
      <div className="tw-flex tw-items-center tw-justify-between tw-mb-3">
        <div>
          <label className="tw-block tw-text-sm tw-font-medium tw-text-gray-700">
            {getLabel(uischema, schema)}
            {isFieldRequired && <span className="tw-text-red-500 tw-ml-1">*</span>}
          </label>
          
          {getDescription(uischema, schema) && (
            <p className="tw-text-sm tw-text-gray-500 tw-mt-1">
              {getDescription(uischema, schema)}
            </p>
          )}
        </div>
        
        <button
          type="button"
          onClick={handleAddItem}
          className="tw-inline-flex tw-items-center tw-px-3 tw-py-2 tw-border tw-border-transparent tw-text-sm tw-leading-4 
                   tw-font-medium tw-rounded-md tw-text-white tw-bg-primary-600 hover:tw-bg-primary-700 
                   focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-offset-2 focus:tw-ring-primary-500 
                   tw-transition-colors tw-duration-200"
        >
          <RiAddLine className="tw-w-4 tw-h-4 tw-mr-1" />
          Add Item
        </button>
      </div>
      
      {value.length === 0 ? (
        <div className="tw-text-center tw-py-8 tw-px-4 tw-border-2 tw-border-dashed tw-border-gray-300 tw-rounded-md">
          <p className="tw-text-sm tw-text-gray-500">No items added yet. Click "Add Item" to get started.</p>
        </div>
      ) : (
        <div className="tw-space-y-3">
          {value.map((item: any, index: number) => (
            <div key={index} className="tw-border tw-border-gray-200 tw-rounded-lg tw-overflow-hidden">
              <div className="tw-bg-gray-50 tw-px-4 tw-py-3 tw-border-b tw-border-gray-200">
                <div className="tw-flex tw-items-center tw-justify-between">
                  <div className="tw-flex tw-items-center">
                    <button
                      type="button"
                      onClick={() => toggleCollapsed(index)}
                      className="tw-p-1 tw-rounded tw-text-gray-400 hover:tw-text-gray-600 tw-transition-colors"
                    >
                      {isCollapsed(index) ? (
                        <RiArrowRightSLine className="tw-w-4 tw-h-4" />
                      ) : (
                        <RiArrowDownSLine className="tw-w-4 tw-h-4" />
                      )}
                    </button>
                    <span className="tw-ml-2 tw-text-sm tw-font-medium tw-text-gray-700">
                      Item {index + 1}
                    </span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="tw-p-1 tw-rounded tw-text-gray-400 hover:tw-text-red-600 hover:tw-bg-red-50 
                             tw-transition-colors"
                    title="Remove item"
                  >
                    <RiDeleteBin6Line className="tw-w-4 tw-h-4" />
                  </button>
                </div>
              </div>
              
              {!isCollapsed(index) && (
                <div className="tw-p-4">
                  <JsonFormsRenderer
                    schema={schema.items || {}}
                    uischema={uischema.elements?.[0] || { type: 'Control' }}
                    path={`${path}/${index}`}
                    data={item}
                    onChange={(itemData) => handleItemChange(index, itemData)}
                    onBlur={onBlur}
                    onFocus={onFocus}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {fieldErrors.length > 0 && isTouched && (
        <div className="tw-mt-2">
          {fieldErrors.map((error, index) => (
            <p key={index} className="tw-text-sm tw-text-red-600">
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};
