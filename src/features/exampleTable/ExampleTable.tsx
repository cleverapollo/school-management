import React, { useMemo } from 'react';
import Table from '../../components/table/Table';
import { TableColumn, TitleOverride } from '../../components/table/types';

interface IExampleData {
  dessert: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
}

const createData = (value: IExampleData): IExampleData[] => {
  const result: IExampleData[] = [];
  for(let i = 0; i <= 100; i++) {
    result.push(value);
  }
  return result;
}

const exampleData: IExampleData = 
  {
    dessert: 'Frozen yoghurt',
    calories: '159',
    fat: '6',
    carbs: '24',
    protein: '4',
  };

const ExampleTable = () => {

  const exampleColumns: TableColumn<IExampleData>[] = [
    {
      columnDisplayName: 'Dessert(100g serving)',
      component: () => null,
      fieldName: 'dessert',
    },
    {
      columnDisplayName: 'Calories',
      component: () => null,
      fieldName: 'calories',
    },
    {
      columnDisplayName: 'Fat(g)',
      component: () => null,
      //Uncomment this if you need to check columns visibility by permission
      //permissionsRequired: ['ui:view:admin'],
      fieldName: 'fat',
    },
    {
      columnDisplayName: 'Carbs(g)',
      component: () => null,
      // Uncomment this if you need to check custom render of Cell 
      // component: (value) => (
      //   <div>
      //     <a href="https://google.com">
      //       {value}
      //     </a>
      //   </div>
      // ),
      fieldName: 'carbs',
    },
    {
      columnDisplayName: 'Protein(g)',
      component: () => null,
      //Uncomment this if you need to check columns visibility by profileTypes
      //profileType: ['Principal'],
      fieldName: 'protein',
    },
  ];

  const data = useMemo(() => createData(exampleData), []);

  return (
    <Table
      title="Example table"
      titleOverride={[{ Teacher: 'Example table for teacher' }]}
      data={data}
      columns={exampleColumns}
    />
  )
}

export default ExampleTable;
