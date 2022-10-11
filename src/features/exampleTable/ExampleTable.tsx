import React from 'react';
import Table from '../../components/table/Table';
import { TableColumn } from '../../components/table/types';

interface IExampleData {
  dessert: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
}

const ExampleTable = () => {
  const exampleData: IExampleData[] = [
    {
      dessert: 'Frozen yoghurt',
      calories: '159',
      fat: '6',
      carbs: '24',
      protein: '4',
    },
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
  ];

  const exampleColumns: TableColumn<IExampleData>[] = [
    {
      columnDisplayName: 'Dessert(100g serving)',
      component: () => null,
      valueIdentifier: (item: IExampleData) => item.dessert,
    },
    {
      columnDisplayName: 'Calories',
      component: () => null,
      valueIdentifier: (item: IExampleData) => item.calories,
    },
    {
      columnDisplayName: 'Fat(g)',
      component: () => null,
      //Uncomment this if you need to check columns visibility by permission
      //permissionsRequired: ['ui:view:admin'],
      valueIdentifier: (item: IExampleData) => item.fat,
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
      valueIdentifier: (item: IExampleData) => item.carbs,
    },
    {
      columnDisplayName: 'Protein(g)',
      component: () => null,
      //Uncomment this if you need to check columns visibility by profileTypes
      //profileType: ['Principal'],
      valueIdentifier: (item: IExampleData) => item.protein,
    },
  ];

  return (
    <Table
      title="Example table"
      titleOverride={[{ Teacher: 'Example table for teacher' }]}
      data={exampleData}
      columns={exampleColumns}
    />
  )
}

export default ExampleTable;
