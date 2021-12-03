import React from 'react';
import { Layout } from 'antd';

import { GraphqlBackend } from 'store/providers';
import ApolloProvider from 'store/providers/apollo';

import PatientsPrescriptions from './PatientsPrescriptions';
import useQueryString from 'utils/useQueryString';

const { Content } = Layout;

const SearchScreen = (): React.ReactElement => {
  const { token } = useQueryString();

  return (
    <Layout>
      <Content>
        <ApolloProvider backend={GraphqlBackend.ARRANGER} token={token as string}>
          <PatientsPrescriptions />
        </ApolloProvider>
      </Content>
    </Layout>
  );
};

export default SearchScreen;
