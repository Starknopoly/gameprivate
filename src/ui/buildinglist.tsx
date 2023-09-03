// SelectList.tsx
import React, { FC, ChangeEvent } from 'react';
// import { OptionType } from './types';

export interface OptionType {
    value: string;
    label: string;
}

interface SelectListProps {
  options: OptionType[];
  onChange: (value: string) => void;
  defaultValue?: string;
}

export const BuildingList: FC<SelectListProps> = ({ options, onChange, defaultValue }) => {
  const handleOnChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  return (
    <select defaultValue={defaultValue} onChange={handleOnChange}>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

