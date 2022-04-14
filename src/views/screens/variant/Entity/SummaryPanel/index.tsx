import React from 'react';
import cx from 'classnames';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Card, Typography, Space, Tooltip, Spin } from 'antd';
import intl from 'react-intl-universal';
import capitalize from 'lodash/capitalize';
import {
  ConsequenceEntity,
  GeneEntity,
  Impact,
  VariantEntity,
} from 'graphql/variants/models';
import SummaryCard from 'views/screens/variant/Entity/SummaryPanel/Summary';
import { ArrangerResultsTree } from 'graphql/models';
import Consequecenses from './Consequences'

import styles from './index.module.scss';
import ACMGCriteria from './AcmgCriteria';

interface OwnProps {
  className?: string;
  data: {
    loading: boolean;
    variantData: VariantEntity | null;
  };
}

export const shortToLongPrediction: Record<string, string> = {
  'sift.d': 'damaging',
  'sift.t': 'tolerated',
  'polyphen2.p': 'possibly damaging',
  'polyphen2.d': 'probably damaging',
  'polyphen2.b': 'benign',
  'fathmm.d': 'damaging',
  'fathmm.t': 'tolerated',
  'lrt.d': 'deleterious',
  'lrt.n': 'neutral',
  'lrt.u': 'unknown',
};

const ResumePanel = ({ data, className = '' }: OwnProps) => {
  const variantData = data.variantData;
  const genes = (variantData?.genes as ArrangerResultsTree<GeneEntity>)?.hits.edges;

  return (
    <StackLayout className={cx(styles.resumePanel, className)} vertical>
      <Space direction="vertical" size={16}>
        <SummaryCard loading={data.loading} variant={variantData} genes={genes} />
        <Consequecenses data={data} />
        <ACMGCriteria data={data}/>
      </Space>
    </StackLayout>
  );
};

export default ResumePanel;
