export const ReactSelectCustomStyles = ({ enabled }: { enabled: boolean }) => ({
  control: (base: any, state: any) => ({
    ...base,
    minHeight: '36px',
    border: state.isFocused ? '2px solid #3b82f6' : '1px solid #d1d5db',
    borderRadius: '6px',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none',
    '&:hover': {
      border: '1px solid #9ca3af'
    },
    transition: 'all 0.2s ease-in-out',
    opacity: !enabled ? 0.6 : 1,
    backgroundColor: !enabled ? '#f3f4f6' : 'white',
    cursor: !enabled ? 'not-allowed' : 'pointer'
  }),
  option: (base: any, state: any) => {
    let backgroundColor = 'transparent';
    if (state.isSelected) {
      backgroundColor = '#3b82f6';
    } else if (state.isFocused) {
      backgroundColor = '#f3f4f6';
    }

    return {
      ...base,
      backgroundColor,
      color: state.isSelected ? 'white' : '#374151',
      fontWeight: state.isSelected ? '600' : '400',
      cursor: 'pointer',
      padding: '8px 12px',
      '&:active': {
        backgroundColor: '#3b82f6'
      }
    };
  },
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),

  menu: (base: any) => ({
    ...base,
    borderRadius: '6px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    width: 'auto',
    minWidth: '40%',
    border: '1px solid #e5e7eb',
    zIndex: 9999
  }),
  placeholder: (base: any) => ({
    ...base,
    color: '#9ca3af',
    fontSize: '14px'
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#374151',
    fontSize: '14px'
  }),
  input: (base: any) => ({
    ...base,
    color: '#374151',
    fontSize: '14px'
  })
});
