import { Transition } from '@headlessui/react';
import { useEffect, useState } from 'react';

import { IconButton } from './IconButton';
import { FaChevronRight } from 'react-icons/fa';

export interface IAccordionProps {
  visible?: boolean;
  title: string;
  defaultOpen?: boolean;
  onDelete?: () => void;
  onChange?: any;
  children: React.ReactNode;
  pid: string;
};

export const Accordion = ({
  visible = true,
  title,
  defaultOpen = false,
  onDelete,
  onChange,
  children,
  pid
}: IAccordionProps) => {
  const [defaultOpened, setDefaultOpened] = useState(defaultOpen);
  const [open, setOpen] = useState(defaultOpened);

  useEffect(() => {
    setDefaultOpened(defaultOpen);
  }, [defaultOpen]);

  const show = open || defaultOpened;
  return (
    <>
      {visible && (
        <div className="tw-mt-0.5 tw-flex tw-w-full tw-flex-col">
          <div
            id={pid}
            onClick={(e) => {
              if (typeof onChange === 'function') onChange(e);
              setDefaultOpened(!defaultOpened);
              setOpen(!open);
            }}
            className={`tw-sticky tw-top-0 tw-z-40 tw-flex tw-w-full tw-items-center tw-justify-between tw-bg-color-0200 tw-px-1.5 tw-py-0.5 hover:tw-bg-color-0300 ${
              show ? 'tw-rounded-t tw-bg-color-0100' : 'tw-rounded'
            } tw-select-none tw-text-left tw-text-[10px] tw-font-medium tw-text-color-primary focus:tw-outline-none focus-visible:tw-ring focus-visible:tw-ring-color-0500 focus-visible:tw-ring-opacity-75`}
          >
            <span>{title}</span>
            <div className="tw-inline-flex">
              {onDelete && (
                <IconButton
                  id={`delete-accord-${title}`}
                  icon="Delete"
                  ariaLabel="Delete"
                  onClick={onDelete}
                  className="tw-text-color-0600 hover:tw-text-cds-red-0800"
                  showShadow={false}
                  iconSize={14}
                />
              )}
              <FaChevronRight
                className={`${show ? '-tw-rotate-90 tw-transform' : 'tw-rotate-90'} tw-size-5 tw-text-color-primary`}
                style={{ fontSize: 14 }}
              />
            </div>
          </div>
          <Transition
            show={show}
            enter="tw-transition tw-duration-[300ms] tw-ease-in-out"
            enterFrom="tw-transform tw-scale-95 tw-opacity-0"
            enterTo="tw-transform tw-scale-100 tw-opacity-100"
            leave="tw-transition tw-duration-105 tw-ease-in-out"
            leaveFrom="tw-transform tw-scale-100 tw-opacity-100"
            leaveTo="tw-transform tw-scale-95 tw-opacity-0"
          >
            <div className="tw-mb-0.5 tw-w-full tw-items-center tw-rounded-b tw-border tw-bg-slate-50 tw-p-1">
              {children}
            </div>
          </Transition>
        </div>
      )}
    </>
  );
};
