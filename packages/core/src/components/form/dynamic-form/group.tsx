import { Card, CardHeader, Grid, Stack, Typography } from '@mui/material';
import { Forms_FormFieldGroup, Forms_FormFieldItem } from '@tyro/api';
import { Control, FieldValues } from 'react-hook-form';
import { Field } from './fields';

type GridWidth = {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
};

const FieldSubgroup = <Fields extends FieldValues>({
  header,
  fields,
  control,
  gridWidth,
}: {
  header: string;
  fields: Forms_FormFieldItem[];
  control: Control<Fields, any>;
  gridWidth?: GridWidth;
}) => {
  <Grid container spacing={2}>
    <Grid item xs={12}>
      <Typography component="h3" variant="subtitle1" color="text.secondary">
        {header}
      </Typography>
    </Grid>
    <Grid container item xs={12} {...gridWidth}>
      {fields.map((field) => (
        <Field {...field} control={control} />
      ))}
    </Grid>
  </Grid>;
};

export const FieldGroup = <Fields extends FieldValues>({
  group,
  control,
}: {
  group: Forms_FormFieldGroup;
  control: Control<Fields, any>;
}) => (
  <Card variant="outlined">
    <CardHeader component="h2" title={group.header} />
    <Stack direction="column" gap={3} p={3}>
      {group.fields?.map((field) =>
        field?.__typename === 'Forms_FormFieldSubGroup' ? (
          <FieldSubgroup
            header={field.header}
            fields={field.fields}
            gridWidth={field.gridWidth}
            control={control}
          />
        ) : (
          <Grid key={field.id} container>
            <Field field={field} control={control} />
          </Grid>
        )
      )}
    </Stack>
  </Card>
);
