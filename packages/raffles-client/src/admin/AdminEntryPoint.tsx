import React, { useEffect, useState } from 'react';
import { Admin, CustomRoutes, Loading, Resource } from 'react-admin';
import {
  AuctionEdit,
  AuctionIcon,
  AuctionList,
  AuctionCreate,
} from './auctions';
import { UserList, UserIcon } from './users';
import {
  CodeCreate,
  CodeEdit,
  CodeList,
  CodeIcon,
  UserCodeList,
  CodeSettings,
} from './codes';
import buildGraphQLProvider from './dataProvider';
import MyLayout from './Layout';
import { Route, useNavigate } from 'react-router-dom';
import i18nProvider from './i18nProvider';
import { SettingsPage } from './settings';
import { getToken } from 'util/token';

const AdminEntryPoint = () => {
  const [dataProvider, setDataProvider] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    if (!getToken()) {
      return navigate('/');
    }
    buildGraphQLProvider().then((graphQlDataProvider) =>
      setDataProvider(() => graphQlDataProvider),
    );
  }, []);

  if (!dataProvider) {
    return <Loading />;
  }

  return (
    <Admin
      i18nProvider={i18nProvider}
      dataProvider={dataProvider}
      layout={MyLayout}
      basename='/admin'
    >
      <Resource
        name='Auction'
        list={AuctionList}
        edit={AuctionEdit}
        create={AuctionCreate}
        icon={AuctionIcon}
      />
      <Resource name='User' list={UserList} icon={UserIcon} />
      <Resource
        name='Code'
        list={CodeList}
        edit={CodeEdit}
        create={CodeCreate}
        icon={CodeIcon}
      />
      <CustomRoutes>
        <Route path='/admin/user-codes' element={<UserCodeList />} />
        <Route path='/admin/code-settings' element={<CodeSettings />} />
        <Route path='/admin/settings' element={<SettingsPage />} />
      </CustomRoutes>
    </Admin>
  );
};

export default AdminEntryPoint;
