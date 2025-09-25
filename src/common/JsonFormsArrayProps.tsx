import React from 'react';
import { withJsonFormsArrayLayoutProps, withJsonFormsContext } from '@jsonforms/react';

export interface ContextToArrayPropsProps {
  ctx: any;
  props: any;
}

export interface ComponentWithArrayProps {
  ctx: any;
  [key: string]: any;
}

export const withContextToArrayProps =
  <P extends ComponentWithArrayProps>(Component: React.ComponentType<P>) =>
  ({ ctx, props }: ContextToArrayPropsProps) => {
    return <Component {...props} ctx={ctx} />;
  };

export const withJsonFormsArrayProps = <P extends ComponentWithArrayProps>(
  Component: React.ComponentType<P>
) => withJsonFormsArrayLayoutProps(withJsonFormsContext(withContextToArrayProps(Component)));
