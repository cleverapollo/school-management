import React, { useMemo } from 'react';
import Table from '../../components/table/Table';
import { TableColumn, TitleOverride } from '../../components/table/types';

interface IExampleData {
  dessert: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
  created: string;
  tech: string;
}

const createData = (arr: IExampleData[]): IExampleData[] => {
  const result: IExampleData[] = [];
  for(let i = 0; i <= 30; i++) {
    arr.forEach((value) => {
      result.push(value)
    })
  }
  return result;
}

const exampleData: IExampleData[] = [
  {
    dessert: 'Frozen yoghurt',
    calories: '159',
    fat: '6',
    carbs: '24',
    protein: '4',
    created: '10.10.2022',
    tech: '',
  },
  {
    dessert: 'Ice cream sandwich',
    calories: '1591',
    fat: '61',
    carbs: '241',
    protein: '41',
    created: '11.10.2022',
    tech: '',
  },
  {
    dessert: 'Eclair',
    calories: '1592',
    fat: '62',
    carbs: '242',
    protein: '42',
    created: '10.11.2022',
    tech: '',
  },
  {
    dessert: 'Cupcake',
    calories: '1593',
    fat: '63',
    carbs: '243',
    protein: '43',
    created: '10.01.2022',
    tech: '',
  },
  {
    dessert: 'Gingerbread',
    calories: '1594',
    fat: '64',
    carbs: '244',
    protein: '44',
    created: '01.10.2022',
    tech: '',
  },
];

const ExampleTable = () => {

  const exampleColumns: TableColumn<IExampleData>[] = [
    {
      columnDisplayName: 'Dessert(100g serving)',
      fieldName: 'dessert',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: 'Calories',
      fieldName: 'calories',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: 'Fat(g)',
      //Uncomment this if you need to check columns visibility by permission
      //permissionsRequired: ['ui:view:admin'],
      fieldName: 'fat',
      filter: 'suggest',
    },
    {
      columnDisplayName: 'Carbs(g)',
      // Uncomment this if you need to check custom render of Cell 
      // component: (value) => (
      //   <div>
      //     <a href="https://google.com">
      //       {value}
      //     </a>
      //   </div>
      // ),
      fieldName: 'carbs',
      filter: 'suggest',
    },
    {
      columnDisplayName: 'Protein(g)',
      //Uncomment this if you need to check columns visibility by profileTypes
      //profileType: ['Principal'],
      fieldName: 'protein',
      filter: 'suggest',
    },
    {
      columnDisplayName: 'Date created',
      //Uncomment this if you need to check columns visibility by profileTypes
      //profileType: ['Principal'],
      fieldName: 'created',
      filter: 'date',
    },
    {
      columnDisplayName: 'Tech Options',
      //Uncomment this if you need to check columns visibility by profileTypes
      //profileType: ['Principal'],
      fieldName: 'tech',
    },
  ];

  const data = createData(exampleData);

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
