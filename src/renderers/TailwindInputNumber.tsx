import React from 'react';
import {TailwindNumeric} from '../common';

interface TailwindInputNumberProps {
  handleChange: (path: string, value: number) => void;
  [key: string]: any;
}

const TailwindInputNumber = React.memo<TailwindInputNumberProps>((props) => {
  return <TailwindNumeric step={0.1} {...props} />;
});

TailwindInputNumber.displayName = 'TailwindInputNumber';

export default TailwindInputNumber;
