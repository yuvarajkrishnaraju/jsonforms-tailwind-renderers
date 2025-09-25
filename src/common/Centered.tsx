export const Centered = ({ children, className = '', ...rest }: any) => (
  <div
    className={`tw-flex tw-h-full tw-grow tw-select-none tw-flex-col tw-items-center tw-justify-center ${className}`}
    {...rest}
  >
    {children}
  </div>
);
