import React, { useEffect, useState } from 'react';
import { Admin, CustomRoutes, defaultTheme, Resource } from 'react-admin';
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
import { Route } from 'react-router-dom';
import i18nProvider from './i18nProvider';

const theme = {
  ...defaultTheme,
  // palette: {
  //   mode: 'dark', // Switching the dark mode on is a single property value change.
  // },
};

const AdminEntryPoint = () => {
  const [dataProvider, setDataProvider] = useState(null);

  useEffect(() => {
    buildGraphQLProvider().then((graphQlDataProvider) =>
      setDataProvider(() => graphQlDataProvider),
    );
  }, []);

  if (!dataProvider) {
    return <div>Loading</div>;
  }

  return (
    <Admin
      theme={theme}
      i18nProvider={i18nProvider}
      dataProvider={dataProvider}
      layout={MyLayout}
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
        {/* <Route path='/user-codes' element={<Settings />} /> */}
        <Route path='/user-codes' element={<UserCodeList />} />
        <Route path='/code-settings' element={<CodeSettings />} />
        {/* <Resource
          name='user-codes'
          list={UserCodeList}
          edit={CodeEdit}
          create={CodeCreate}
          icon={CodeIcon}
        /> */}
      </CustomRoutes>
    </Admin>
  );
};

export default AdminEntryPoint;
