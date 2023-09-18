import RQBuilder, {
  RuleGroupType,
  Field as RQBField,
  QueryBuilderProps as RQBQueryBuilderProps,
} from 'react-querybuilder';
import { Control, FieldValues } from 'react-hook-form';
import { useCallback } from 'react';
import { AddRuleButton } from './add-rule-button';
import { Selector } from './selector';
import './styles.css';
import { Field, ValueEditor, ValueEditorProps } from './value-editor';
import { RemoveRuleButton } from './remove-rule-button';
import { FieldSelector } from './field-selector';
import { OperatorSelector } from './operator-selector';

type QueryBuilderProps<FV extends FieldValues> = Partial<
  Omit<RQBQueryBuilderProps<RuleGroupType>, 'fields' | 'defaultQuery'>
> & {
  fields?: Field[];
  control: Control<FV>;
};

export const QueryBuilder = <FV extends FieldValues>({
  control,
  fields,
  ...props
}: QueryBuilderProps<FV>) => {
  const ValueEditorWithControl = useCallback(
    (valueEditorProps: Omit<ValueEditorProps<FV>, 'control'>) => (
      <ValueEditor {...valueEditorProps} control={control} />
    ),
    [control]
  );

  return (
    // NOTE: uncomment this and install the following libraries to support drag and drop
    // @react-querybuilder/dnd react-dnd react-dnd-html5-backend
    // <QueryBuilderDnD dnd={{ ...ReactDnD, ...ReactDndHtml5Backend }}>
    <RQBuilder
      {...props}
      fields={fields as RQBField[]}
      controlClassnames={{
        // NOTE: uncomment when nested rules are supported
        // queryBuilder: 'queryBuilder-branches',
        header: 'ruleGroup-header',
        rule: 'ruleGroup-rule',
      }}
      controlElements={{
        // NOTE: we are not support complex queries for the first version
        // dragHandle: DragHandle,
        // combinatorSelector: Selector,
        // addGroupAction: AddGroupButton,
        // removeGroupAction: RemoveGroupButton,
        combinatorSelector: () => null,
        addGroupAction: () => null,
        removeGroupAction: () => null,
        addRuleAction: AddRuleButton,
        removeRuleAction: RemoveRuleButton,
        fieldSelector: FieldSelector,
        operatorSelector: OperatorSelector,
        valueSourceSelector: Selector,
        valueEditor: ValueEditorWithControl,
      }}
    />
    // </QueryBuilderDnD>
  );
};
