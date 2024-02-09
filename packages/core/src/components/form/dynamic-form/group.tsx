import { Card, CardHeader, Grid, Stack, Typography } from '@mui/material';
import {
  Forms_FormFieldGridWidth,
  Forms_FormFieldGroup,
  Forms_FormFieldItem,
} from '@tyro/api';
import { Control, FieldValues, Path } from 'react-hook-form';
import { Field, getCheckedGridWidth } from './fields';

const FieldSubgroup = <Fields extends FieldValues>({
  header,
  fields,
  control,
  gridWidth,
  readOnly,
}: {
  header: string;
  fields: Forms_FormFieldItem[];
  control: Control<Fields, any>;
  gridWidth: Forms_FormFieldGridWidth;
  readOnly: boolean;
}) => {
  const checkedGridWidth = getCheckedGridWidth(gridWidth);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography component="h3" variant="subtitle1" color="text.secondary">
          {header}
        </Typography>
      </Grid>
      <Grid container item {...checkedGridWidth}>
        {fields.map((field) => (
          <Field
            {...field}
            id={field.id as Path<Fields>}
            control={control}
            readOnly={readOnly}
          />
        ))}
      </Grid>
    </Grid>
  );
};

export const FieldGroup = <Fields extends FieldValues>({
  group,
  control,
  readOnly,
}: {
  group: Forms_FormFieldGroup;
  control: Control<Fields, any>;
  readOnly: boolean;
}) => (
  <Card>
    <CardHeader component="h2" title={group.header} />
    <Stack direction="column" gap={3} p={3}>
      {group.fields?.map((field) => {
        if (field?.__typename === 'Forms_FormFieldSubGroup') {
          return (
            <FieldSubgroup
              header={field.header}
              fields={field.fields}
              gridWidth={field.gridWidth}
              control={control}
              readOnly={readOnly}
            />
          );
        }

        if (field?.__typename === 'Forms_FormFieldItem') {
          return (
            <Grid key={field.id} container>
              <Field
                {...field}
                id={field.id as Path<Fields>}
                control={control}
                readOnly={readOnly}
              />
            </Grid>
          );
        }

        return null;
      })}
    </Stack>
  </Card>
);
