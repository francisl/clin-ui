import React, { FunctionComponent } from 'react';
import { getQueryBuilderCache, useFilters } from '@ferlab/ui/core/data/filters/utils';
import { resolveSyntheticSqon } from '@ferlab/ui/core/data/sqon/utils';
import { Layout, Spin } from 'antd';
import { cloneDeep } from 'lodash';
import { useParams } from 'react-router';

import { generateFilters } from 'store/graphql/utils/Filters';
import { VARIANT_REPO_CACHE_KEY } from 'views/screens/variant/constants';
import { MappingResults, useGetVariantAggregations } from 'store/graphql/variants/actions';
import { VARIANT_AGGREGATION_QUERY } from 'store/graphql/variants/queries';
import { wrapSqonWithDonorId } from '../utils';

import styles from './Filters.module.scss';

type OwnProps = {
  field: string;
  mappingResults: MappingResults;
};

const GenericFilters = ({ field, mappingResults }: OwnProps): React.ReactElement => {
  const { filters } = useFilters();
  const { patientid } = useParams<{ patientid: string }>();
  const allSqons = getQueryBuilderCache(VARIANT_REPO_CACHE_KEY).state;
  const resolvedSqon = cloneDeep(resolveSyntheticSqon(allSqons, filters, 'donors'));

  const results = useGetVariantAggregations(
    {
      sqon: wrapSqonWithDonorId(resolvedSqon, patientid),
    },
    VARIANT_AGGREGATION_QUERY([field], mappingResults),
  );

  return (
    <Spin size="large" spinning={results.loading}>
      <Layout className={`${styles.variantFilterWrapper} ${styles.genericFilterWrapper}`}>
        {generateFilters(
          results?.aggregations,
          {
            loading: mappingResults.loadingMapping,
            data: mappingResults.extendedMapping,
          },
          styles.variantFilterContainer,
          true,
          true,
          true,
          true,
        )}
      </Layout>
    </Spin>
  );
};

export default GenericFilters;
