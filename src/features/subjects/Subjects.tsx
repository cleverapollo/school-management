import { useEffect } from "react";
import { dispatch as storeDispatch, useTypedSelector } from "../../store/store";
import { SubjectGroup } from "../../app/api/generated";
import Table from '../../components/table/Table';
import { TableColumn } from '../../components/table/types';
import { Button } from "@mui/material";
import useLocales from "../../hooks/useLocales";
import { SUBJECT_GROUP_LEVEL } from "../../constants";
import { fetchSubjectGroups } from "../../store/slices/groups";
import ColoredBox from "../groups/components/ColoredBox";

interface SubjectsData extends Partial<SubjectGroup> {
  firstButton?: string;
  tech?: string;
}

// const ExampleSubjectsData: SubjectsData[] = [
//   {
//     subject: 'Maths',
//     level: SUBJECT_GROUP_LEVEL.HIGHER,
//     teacher: 'Rachel Downing',
//   },
//   {
//     subject: 'History',
//     level: SUBJECT_GROUP_LEVEL.COMMON,
//     teacher: 'Rachel Downing',
//   },
//   {
//     subject: 'Biology',
//     level: SUBJECT_GROUP_LEVEL.ORDINARY,
//     teacher: 'Rachel Downing',
//   }
// ];

const Subjects = () => {
  const { translate } = useLocales();
  const ExampleSubjectGroupData = useTypedSelector(state => state.groups.subjectGroups);

  useEffect(() => {
    storeDispatch(fetchSubjectGroups());
  }, []);

  const subjectGroupColumns: TableColumn<SubjectsData>[] = [
    {
      columnDisplayName: translate('subject'),
      fieldName: 'subject',
      filter: 'suggest',
      isMandatory: true,
    },
    {
      columnDisplayName: translate('level'),
      fieldName: 'level',
      filter: 'suggest',
      component: (columnProps) => <ColoredBox content={columnProps.row.original.level} />
    },
    {
      columnDisplayName: translate('teacher'),
      fieldName: 'teacher',
      filter: 'suggest',
    },
    {
      columnDisplayName: '',
      fieldName: 'firstButton',
      component: (columnProps) => {
        return (<Button onClick={() => {}}>
          {columnProps.row.original.firstButton}
        </Button>)
      }
    },
    {
      columnDisplayName: 'Tech Options',
      fieldName: 'tech',
    },
  ];

  const subjectsData: SubjectsData[] = ExampleSubjectGroupData?.map(group => {
    return { ...group,
      firstButton: translate('view'), 
      tech: ''
    } as SubjectsData || [] 
  }) || [];

  return (
    <Table
      title={translate('subjects')}
      data={subjectsData}
      columns={subjectGroupColumns}
    />
  );
}

export default Subjects;
