import React from 'react';
import { useLocation } from 'react-router';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Typography, Tag, Tabs, Skeleton, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons'
import intl from 'react-intl-universal';
import LibraryIcon from 'components/icons/LibraryIcon';
import TeamIcon from 'components/icons/TeamIcon';
import ServerError from 'components/Results/ServerError';
import NotFound from 'components/Results/NotFound';

import ResumePanel from './SummaryPanel';
import { GraphqlBackend } from 'providers/';
import ApolloProvider from 'providers//apollo';
import { useTabSummaryData } from 'graphql/variants/tabActions';
import FrequencyPanel from 'views/screens/variant/Entity/FrequencyPanel';
import ClinicalPanel from 'views/screens/variant/Entity/ClinicalPanel';
import PatientPanel from 'views/screens/variant/Entity/PatientPanel';

import styles from './index.module.scss';
import history from 'utils/history';
import { navigateTo } from 'utils/helper';
import { BarChartOutlined, StockOutlined } from '@ant-design/icons';

export const getVepImpactTag = (score: number | string) => {
  switch (score) {
    case 1:
    case 'modifier':
      return <Tag>MODIFIER</Tag>;
    case 2:
    case 'low':
      return <Tag color="green">LOW</Tag>;
    case 3:
    case 'moderate':
      return <Tag color="gold">MODERATE</Tag>;
    case 4:
    case 'high':
      return <Tag color="red">HIGH</Tag>;

    default:
      return true;
  }
};

export enum TAB_ID {
  SUMMARY = 'summary',
  PATIENTS = 'patients',
  FREQUENCY = 'frequency',
  CLINICAL = 'clinical',
}

interface OwnProps {
  hash: string;
  tabid: string;
}

const VariantEntityPage = ({ hash, tabid }: OwnProps) => {
  const { loading, data, error } = useTabSummaryData(hash);
  const location = useLocation();
  const patientId = new URLSearchParams(location.search).get('patientid');

  if (error) {
    return <ServerError />;
  }

  if (!data && !loading) {
    return <NotFound />;
  }

  return (
    <StackLayout className={styles.variantEntity} vertical>
      <div className={styles.entityHeader}>
        <Skeleton
          title={{ width: 200 }}
          paragraph={false}
          loading={loading}
          className={styles.titleSkeleton}
          active
        >
          {patientId &&
            <Button className={styles.previous} size='small' type='text' icon={<ArrowLeftOutlined />} onClick={() => navigateTo(`/patient/${patientId}/#variant`)}></Button>
          }
          <Typography.Title className={styles.title}>{data?.hgvsg}</Typography.Title>
          <Tag color="purple">{data?.variant_type.toLocaleUpperCase()}</Tag>
          {getVepImpactTag(data?.max_impact_score)}
        </Skeleton>
      </div>
      <Tabs
        className={styles.entitySections}
        activeKey={tabid}
        onChange={(key) => {
          if (history.location.hash !== key) {
            history.push(`/variant/entity/${hash}/${key}?patientid=${patientId || ''}`);
          }
        }}
      >
        <Tabs.TabPane
          tab={
            <span>
              <BarChartOutlined height="16" width="16" />
              {intl.get('screen.variantdetails.tab.summary')}
            </span>
          }
          key={TAB_ID.SUMMARY}
        >
          <ResumePanel
            className={styles.pageContainer}
            data={{
              loading: loading,
              variantData: data,
            }}
          />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <StockOutlined height="16" width="16" />
              {intl.get('screen.variantdetails.tab.frequencies')}
            </span>
          }
          key={TAB_ID.FREQUENCY}
        >
          <FrequencyPanel className={styles.pageContainer} hash={hash} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <LibraryIcon height="16" width="16" />
              {intl.get('screen.variantdetails.tab.clinicalAssociations')}
            </span>
          }
          key={TAB_ID.CLINICAL}
        >
          <ClinicalPanel className={styles.pageContainer} hash={hash} />
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span>
              <TeamIcon height="16" width="16" />
              {intl.get('screen.variantdetails.tab.patients')}
            </span>
          }
          key={TAB_ID.PATIENTS}
        >
          <PatientPanel className={styles.pageContainer} hash={hash} />
        </Tabs.TabPane>
      </Tabs>
    </StackLayout>
  );
};

const EntityPage = (props: OwnProps) => (
  <ApolloProvider backend={GraphqlBackend.ARRANGER}>
    <VariantEntityPage {...props} />
  </ApolloProvider>
);

export default EntityPage;
