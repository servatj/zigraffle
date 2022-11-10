import React from 'react';
import {
  List,
  Datagrid,
  TextField,
  EmailField,
  SearchInput,
} from 'react-admin';
import { Person } from '@mui/icons-material';
import DateField from '../components/DateField';
export const UserIcon = Person;

const userFilters = [<SearchInput source='q' alwaysOn key={0} />];

export const UserList = () => (
  <List sort={{ field: 'id', order: 'desc' }} filters={userFilters}>
    <Datagrid bulkActionButtons={false}>
      <TextField source='id' />
      <TextField source='username' />
      <TextField source='discordName' />
      <EmailField source='email' />
      <DateField source='createdAt' />
      <TextField source='publicAddress' />
    </Datagrid>
  </List>
);
