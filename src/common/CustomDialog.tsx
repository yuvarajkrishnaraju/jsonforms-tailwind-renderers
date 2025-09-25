import { Dialog, Transition, TransitionChild } from '@headlessui/react';
import { Fragment, useEffect } from 'react';
import { FaRegWindowClose, FaSave } from 'react-icons/fa';

import { CloseButton } from './CloseButton';
import { CustomButton } from './CustomButton';

type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

interface CustomDialogProps {
  open: boolean;
  size?: DialogSize;
  title?: string;
  onClose?: () => void;
  onSave?: () => void;
  saveTitle?: string;
  saveIcon?: React.ReactNode;
  buttonDisabled?: boolean;
  children?: React.ReactNode;
  additionalInfo?: React.ReactNode;
  showInProgress?: boolean;
}

// Calculate heights based on size with responsive behavior
const getHeightConfig = (dialogSize: DialogSize) => {
  const baseHeight = window.innerHeight;
  const isMobile = window.innerWidth < 640; // sm breakpoint

  // Define height configurations for different sizes
  const heightConfigs = {
    xs: {
      mobile: { maxHeight: baseHeight - 150, minHeight: 150 },
      desktop: { maxHeight: baseHeight - 200, minHeight: 200 }
    },
    sm: {
      mobile: { maxHeight: baseHeight - 180, minHeight: 180 },
      desktop: { maxHeight: baseHeight - 220, minHeight: 250 }
    },
    md: {
      mobile: { maxHeight: baseHeight - 200, minHeight: 200 },
      desktop: { maxHeight: baseHeight - 250, minHeight: 300 }
    },
    lg: {
      mobile: { maxHeight: baseHeight - 250, minHeight: 250 },
      desktop: { maxHeight: baseHeight - 300, minHeight: 400 }
    },
    xl: {
      mobile: { maxHeight: baseHeight - 300, minHeight: 300 },
      desktop: { maxHeight: baseHeight - 350, minHeight: 500 }
    },
    '2xl': {
      mobile: { maxHeight: baseHeight - 300, minHeight: 300 },
      desktop: { maxHeight: baseHeight - 350, minHeight: 500 }
    },
    '3xl': {
      mobile: { maxHeight: baseHeight - 50, minHeight: baseHeight - 100 },
      desktop: { maxHeight: baseHeight - 100, minHeight: baseHeight - 200 }
    },
    full: {
      mobile: { maxHeight: baseHeight - 50, minHeight: baseHeight - 100 },
      desktop: { maxHeight: baseHeight - 100, minHeight: baseHeight - 200 }
    }
  };

  const config = heightConfigs[dialogSize] || heightConfigs.md;
  return isMobile ? config.mobile : config.desktop;
};

// Size configuration mapping with responsive behavior
const getSizeClasses = (dialogSize: DialogSize) => {
  const sizeMap = {
    xs: 'tw-w-80 tw-max-w-sm sm:tw-w-96 sm:tw-max-w-md',
    sm: 'tw-w-96 tw-max-w-md sm:tw-w-[28rem] sm:tw-max-w-lg',
    md: 'tw-w-2xl tw-max-w-2xl sm:tw-w-3xl sm:tw-max-w-3xl',
    lg: 'tw-w-4xl tw-max-w-4xl sm:tw-w-5xl sm:tw-max-w-5xl',
    xl: 'tw-w-5xl tw-max-w-5xl sm:tw-w-6xl sm:tw-max-w-6xl',
    '2xl': 'tw-w-6xl tw-max-w-6xl sm:tw-w-7xl sm:tw-max-w-7xl',
    '3xl': 'tw-w-7xl tw-max-w-7xl sm:tw-w-[90vw] sm:tw-max-w-[90vw]',
    full: 'tw-w-[95vw] tw-max-w-[95vw] sm:tw-w-[98vw] sm:tw-max-w-[98vw]'
  };
  return sizeMap[dialogSize];
};

export const CustomDialog = ({
  open,
  size = 'md',
  title,
  onClose,
  onSave,
  saveTitle,
  saveIcon,
  buttonDisabled = false,
  children,
  additionalInfo = null,
  showInProgress = false
}: CustomDialogProps) => {
  const effectiveSize = size;
  const sizeClasses = getSizeClasses(effectiveSize);

  const heightConfig = getHeightConfig(effectiveSize);
  const maxHeight = heightConfig.maxHeight;
  const minHeight = heightConfig.minHeight;

  useEffect(() => {
    const keyDownHandler = (event: KeyboardEvent) => {
      if (open) {
        switch (event.key) {
          case 'Escape':
            event.preventDefault();
            onClose?.();
            break;
        }
      }
    };
    document.addEventListener('keydown', keyDownHandler);

    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, [open, onSave, onClose]);
  let bodyHeight = maxHeight;
  if (onSave || additionalInfo) {
    bodyHeight -= 70;
  }
  if (title) {
    bodyHeight -= 70;
  }

  console.log(bodyHeight, maxHeight, minHeight);

  return (
    <>
      {open && (
        <Transition appear={true} show={open === true} as={Fragment}>
          <Dialog
            as="div"
            className="tw-fixed tw-inset-0 tw-z-[2000] tw-bg-black/50 tw-backdrop-blur-sm tw-transition-all tw-duration-300"
            onClose={() => onClose?.()}
          >
            <TransitionChild
              as={Fragment}
              enter="tw-transform tw-transition tw-ease-out tw-duration-300"
              enterFrom="tw-opacity-0"
              enterTo="tw-opacity-100"
              leave="tw-transform tw-transition tw-ease-in tw-duration-200"
              leaveFrom="tw-opacity-100"
              leaveTo="tw-opacity-0"
            >
              <div className="tw-absolute tw-inset-0 tw-bg-black/20" />
            </TransitionChild>
            <div className="tw-flex tw-min-h-screen tw-items-center tw-justify-center tw-p-4 tw-text-center">
              <TransitionChild
                as={Fragment}
                enter="tw-transform tw-transition tw-ease-out tw-duration-300"
                enterFrom="tw-opacity-0 tw-scale-95 tw-translate-y-4"
                enterTo="tw-opacity-100 tw-scale-100 tw-translate-y-0"
                leave="tw-transform tw-transition tw-ease-in tw-duration-200"
                leaveFrom="tw-opacity-100 tw-scale-100 tw-translate-y-0"
                leaveTo="tw-opacity-0 tw-scale-95 tw-translate-y-4"
              >
                <div
                  className={`tw-relative tw-w-full tw-transform tw-overflow-hidden tw-rounded-2xl tw-bg-white tw-shadow-2xl tw-ring-1 tw-ring-black/5 tw-transition-all ${sizeClasses}`}
                  style={{
                    minHeight,
                    maxHeight
                  }}
                >
                  <div className="tw-flex tw-h-full tw-flex-col tw-overflow-hidden">
                    {title && (
                      <div className="tw-flex tw-items-center tw-justify-between tw-border-b tw-border-gray-200/60 tw-bg-gradient-to-r tw-from-gray-50 tw-to-white tw-px-4 sm:tw-px-6 tw-py-4 tw-flex-shrink-0">
                        <div className="tw-text-lg sm:tw-text-xl tw-font-semibold tw-leading-6 tw-text-gray-900 tw-tracking-tight">
                          {title}
                        </div>
                        <button
                          type="button"
                          onClick={onClose}
                          className="tw-rounded-full tw-p-2 tw-text-gray-400 hover:tw-text-red-600  hover:tw-bg-red-100 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-red-500 focus:tw-ring-offset-2 tw-transition-all tw-duration-200"
                        >
                          <FaRegWindowClose className="tw-h-5 tw-w-5" />
                        </button>
                      </div>
                    )}
                    <div
                      className="tw-flex tw-h-full tw-w-full tw-grow tw-flex-col tw-items-center tw-overflow-y-auto tw-overflow-x-hidden tw-px-4 sm:tw-px-6 tw-py-4 tw-scrollbar-thin tw-scrollbar-track-gray-100 tw-scrollbar-thumb-gray-300 hover:tw-scrollbar-thumb-gray-400"
                      style={{
                        minHeight: `${bodyHeight}px`,
                        maxHeight: `${bodyHeight}px`
                      }}
                    >
                      {children}
                    </div>
                    {(onSave || additionalInfo) && (
                      <div
                        className={`tw-flex tw-flex-row tw-items-center tw-border-t tw-border-gray-200/60 tw-bg-gradient-to-r tw-from-gray-50/80 tw-to-white tw-px-4 sm:tw-px-6 tw-py-4 tw-flex-shrink-0 ${
                          additionalInfo ? 'tw-justify-between' : 'tw-justify-end'
                        }`}
                      >
                        {additionalInfo}
                        {onSave && (
                          <div className="tw-flex tw-flex-row tw-items-center tw-justify-end tw-gap-3">
                            <CloseButton onClose={onClose} />
                            <CustomButton
                              id="form-submit-btn"
                              text={saveTitle || 'Save'}
                              icon={saveIcon || <FaSave className="tw-h-4 tw-w-4" />}
                              disabled={buttonDisabled}
                              onClick={onSave}
                              tooltip={saveTitle}
                              showInProgress={showInProgress}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </TransitionChild>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};
