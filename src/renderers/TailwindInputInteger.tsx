import React from 'react';

import {TailwindNumeric} from '../common';

const TailwindInputInteger = React.memo((props: any) => {
  return <TailwindNumeric {...props} />;
});

export default TailwindInputInteger;
