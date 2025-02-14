import React from 'react';
import { Layout } from 'antd';

import { GraphqlBackend } from 'store/providers';
import ApolloProvider from 'store/providers/apollo';

import PatientsPrescriptions from 'views/screens/search/PatientsPrescriptions';

const { Content } = Layout;

const SearchScreen = (): React.ReactElement => (
  <Layout>
    <Content>
      <ApolloProvider backend={GraphqlBackend.ARRANGER}>
        <PatientsPrescriptions />
      </ApolloProvider>
    </Content>
  </Layout>
);

export default SearchScreen;
