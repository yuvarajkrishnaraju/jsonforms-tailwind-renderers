import React from 'react';
import {ErrorMessage, LabelRenderer} from '../common';
import { SqlEditor } from '../common/SqlEditor';

interface TailwindInputSqlProps {
  id: string;
  enabled?: boolean;
  path: string;
  errors?: any[];
  label?: string;
  description?: string;
  handleChange: (path: string, value: string) => void;
  data?: string;
}

const TailwindInputSql = React.memo<TailwindInputSqlProps>((props) => {
  const { id, enabled = true, path, errors, label, description = '', handleChange, data } = props;
  const onChange = (value: string) => handleChange(path, value);

  return (
    <div className="tw-grow">
      {label && label.length > 0 && <LabelRenderer {...props} />}
      <SqlEditor
        initialValue={data}
        onChange={onChange}
        width="100%"
        placeholder={description}
        readOnly={!enabled}
      />
      <ErrorMessage id={id} path={path} errors={errors} />
    </div>
  );
});

TailwindInputSql.displayName = 'TailwindInputSql';

export default TailwindInputSql;
