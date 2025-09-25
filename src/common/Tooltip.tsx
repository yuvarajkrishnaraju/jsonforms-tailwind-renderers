import { useState } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';

interface TooltipProps extends React.HTMLAttributes<HTMLDivElement> {
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'auto'
    | 'auto-start'
    | 'auto-end';
  title?: string;
  content?: string;
  children: React.ReactNode;
  backgroundColor?: string;
  className?: string;
  offset?: [number, number];
  interactive?: boolean;
  delayShow?: number;
  delayHide?: number;
}

export const Tooltip = ({
  placement = 'auto',
  title,
  content,
  children,
  backgroundColor,
  className = '',
  offset = [0, 8],
  interactive = false,
  delayShow = 0,
  delayHide = 0
}: TooltipProps) => {
  const [controlledVisible, setControlledVisible] = useState(false);

  const { getArrowProps, getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      placement,
      trigger: 'hover',
      closeOnOutsideClick: false,
      visible: controlledVisible,
      onVisibleChange: setControlledVisible,
      offset,
      interactive,
      delayShow,
      delayHide
    });

  if (title == null && content == null) {
    return <>{children}</>;
  }

  const toolProps: any = {
    className: `tooltip-container tw-px-3 tw-py-2 tw-rounded-lg tw-shadow-lg tw-border-0 ${className}`,
    style: {
      zIndex: 9999,
      maxWidth: '300px',
      ...(backgroundColor && {
        color: '#ffffff',
        backgroundColor,
        '--tooltipBackground': backgroundColor,
        '--tooltipBorder': backgroundColor
      })
    }
  };

  return (
    <>
      <div className="tw-flex tw-h-fit tw-w-fit" ref={setTriggerRef}>
        {children}
      </div>
      {visible && (
        <div ref={setTooltipRef} {...getTooltipProps(toolProps)}>
          {title && (
            <div
              className={`tw-text-sm tw-font-medium tw-break-words tw-leading-tight ${
                content === undefined ? 'tw-leading-5' : 'tw-mb-1'
              }`}
            >
              {title}
            </div>
          )}
          {content && (
            <div className="tw-break-words tw-text-xs tw-leading-4 tw-text-gray-100">{content}</div>
          )}
          <div
            {...getArrowProps({
              className: 'tooltip-arrow',
              style: {
                position: 'absolute',
                width: '8px',
                height: '8px',
                pointerEvents: 'none'
              }
            })}
          />
        </div>
      )}
    </>
  );
};
