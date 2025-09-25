import React, { useEffect, useState } from 'react';

export interface SuggestItem {
  key: string;
  value: string;
}

export interface OverlayKeysProps {
  suggest?: SuggestItem[] | null;
  onSelect: (item: SuggestItem) => void;
}

export const OverlayKeys: React.FC<OverlayKeysProps> = ({ suggest, onSelect }) => {
  if (suggest == null || !Array.isArray(suggest)) return <></>;
  const [selected, setSelected] = useState<SuggestItem | undefined>(suggest && suggest[0]);
  const [list, setList] = useState<SuggestItem[]>([]);

  useEffect(() => {
    setList(suggest);
  }, [suggest]);

  return (
    <div className="tw-grid tw-max-h-52 tw-min-h-52 tw-w-96 tw-grid-cols-2 tw-overflow-hidden tw-rounded tw-border tw-bg-slate-100 tw-p-1 tw-shadow-lg">
      <div className="tw-custom-scrollbar tw-mx-1 tw-flex tw-max-h-52 tw-flex-col tw-overflow-y-auto tw-overflow-x-hidden tw-bg-white">
        {list.map((s, index) => (
          <div
            key={index}
            className="tw-inline-flex tw-cursor-pointer tw-items-center tw-border-b tw-p-1 tw-text-xs tw-text-color-0600 hover:tw-shadow"
            onClick={() => onSelect(s)}
            onMouseOver={() => setSelected(s)}
          >
            <div className="tw-mr-2 tw-bg-green-500 tw-p-0.5 tw-px-1.5 tw-text-white">E</div>
            <label className="tw-cursor-pointer">{s.key}</label>
          </div>
        ))}
      </div>
      <div className="tw-mx-1 tw-flex tw-flex-col tw-border-l-2 tw-px-1 tw-text-[10px]">
        <label className="tw-font-semibold">Current Value:</label>
        <label className="tw-custom-scrollbar tw-mx-1 tw-max-h-52 tw-select-all tw-overflow-y-auto tw-overflow-x-hidden tw-break-all">
          {selected?.key?.toLowerCase().includes('password')
            ? selected?.value?.replace(/./gi, '*')
            : selected?.value}
        </label>
      </div>
    </div>
  );
};
