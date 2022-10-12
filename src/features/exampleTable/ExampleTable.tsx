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

const exampleData: IExampleData = //[] = [
  {
    dessert: 'Frozen yoghurt',
    calories: '159',
    fat: '6',
    carbs: '24',
    protein: '4',
  }/*,
  {
    dessert: 'Ice cream sandwich',
    calories: '159',
    fat: '6',
    carbs: '24',
    protein: '4',
  },
  {
    dessert: 'Eclair',
    calories: '159',
    fat: '6',
    carbs: '24',
    protein: '4',
  },
  {
    dessert: 'Cupcake',
    calories: '159',
    fat: '6',
    carbs: '24',
    protein: '4',
  },
  {
    dessert: 'Gingerbread',
    calories: '159',
    fat: '6',
    carbs: '24',
    protein: '4',
  },
];*/

const ExampleTable = () => {

  const exampleColumns: TableColumn<IExampleData>[] = [
    {
      columnDisplayName: 'Dessert(100g serving)',
      component: () => null,
      //valueIdentifier: (item: IExampleData) => item.dessert,
      fieldName: 'dessert',
    },
    {
      columnDisplayName: 'Calories',
      component: () => null,
      //valueIdentifier: (item: IExampleData) => item.calories,
      fieldName: 'calories',
    },
    {
      columnDisplayName: 'Fat(g)',
      component: () => null,
      //Uncomment this if you need to check columns visibility by permission
      //permissionsRequired: ['ui:view:admin'],
      //valueIdentifier: (item: IExampleData) => item.fat,
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
      //valueIdentifier: (item: IExampleData) => item.carbs,
      fieldName: 'carbs',
    },
    {
      columnDisplayName: 'Protein(g)',
      component: () => null,
      //Uncomment this if you need to check columns visibility by profileTypes
      //profileType: ['Principal'],
      //valueIdentifier: (item: IExampleData) => item.protein,
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
