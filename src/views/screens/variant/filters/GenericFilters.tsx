import React, { FunctionComponent } from "react";
import {
  getQueryBuilderCache,
  useFilters,
} from "@ferlab/ui/core/data/filters/utils";
import { resolveSyntheticSqon } from "@ferlab/ui/core/data/sqon/utils";
import { Layout, Spin } from "antd";
import { cloneDeep } from "lodash";
import { useParams } from "react-router";

import { generateFilters } from "views/screens/variant/tmp/utils";
import {
  VARIANT_INDEX,
  VARIANT_REPO_CACHE_KEY,
} from "views/screens/variant/constants";
import {
  MappingResults,
  useGetFilterBuckets,
} from "store/graphql/utils/actions";
import { VARIANT_AGGREGATION_QUERY } from "store/graphql/variants/queries";

import styles from "./Filters.module.scss";

type OwnProps = {
  field: string;
  mappingResults: MappingResults;
};

const GenericFilters: FunctionComponent<OwnProps> = ({
  field,
  mappingResults,
}) => {
  const { filters } = useFilters();
  const { patientid } = useParams<{ patientid: string }>();
  const allSqons = getQueryBuilderCache(VARIANT_REPO_CACHE_KEY).state;
  let resolvedSqon = cloneDeep(resolveSyntheticSqon(allSqons, filters));
  resolvedSqon.content.push({
    content: { field: "donors.patient_id", value: [patientid] },
    op: "in",
  });

  let results = useGetFilterBuckets(
    {
      sqon: resolvedSqon,
    },
    VARIANT_AGGREGATION_QUERY([field], mappingResults),
    VARIANT_INDEX
  );

  return (
    <Spin size="large" spinning={results.loading}>
      <Layout
        className={`${styles.variantFilterWrapper} ${styles.genericFilterWrapper}`}
      >
        {generateFilters(
          results,
          mappingResults,
          styles.variantFilterContainer,
          true,
          true,
          true,
          true
        )}
      </Layout>
    </Spin>
  );
};

export default GenericFilters;