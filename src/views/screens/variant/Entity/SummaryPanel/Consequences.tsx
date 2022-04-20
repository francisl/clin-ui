import React from 'react';
import StackLayout from '@ferlab/ui/core/layout/StackLayout';
import { Typography, Space, Tooltip, Spin } from 'antd';
import intl from 'react-intl-universal';
import capitalize from 'lodash/capitalize';
import { DISPLAY_WHEN_EMPTY_DATUM } from 'views/screens/variant/constants';
import ExpandableTable from 'components/table/ExpandableTable';
import ExpandableCell from 'components/table/ExpandableCell';
import NoData from 'views/screens/variant/Entity/NoData';
import CanonicalIcon from 'components/icons/CanonicalIcon';
import {
  ConsequenceEntity,
  GeneEntity,
  Impact,
  VariantEntity,
} from 'graphql/variants/models';
import { getVepImpactTag } from 'views/screens/variant/Entity/index';
import { ArrangerEdge, ArrangerResultsTree } from 'graphql/models';
import CollapsePanel from 'components/containers/collapse';

import styles from './index.module.scss';

interface OwnProps {
  className?: string;
  data: {
    loading: boolean;
    variantData: VariantEntity | null;
  };
}

type TableGroup = {
  consequences: ArrangerEdge<ConsequenceEntity>[];
  omim: string;
  symbol: string;
  biotype: string;
  ensembleGeneId: string;
};

type SymbolToConsequences = {
  [key: string]: TableGroup;
};

const { Text, Title } = Typography;
const INDEX_IMPACT_PREDICTION_FIELD = 0;
const INDEX_IMPACT_PREDICTION_SHORT_LABEL = 1;
const INDEX_IMPACT_SCORE = 2;

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

const getLongPredictionLabelIfKnown = (predictionField: string, predictionShortLabel: string) => {
  if (!predictionField || !predictionShortLabel) {
    return null;
  }
  const dictionaryPath = `${predictionField.toLowerCase()}.${predictionShortLabel.toLowerCase()}`;
  const longPrediction = shortToLongPrediction[dictionaryPath];
  return longPrediction || null;
};

const groupConsequencesBySymbol = (
  consequences: ArrangerEdge<ConsequenceEntity>[],
  genes: ArrangerEdge<GeneEntity>[],
) => {
  if (consequences.length === 0) {
    return {};
  }
  return consequences.reduce(
    (acc: SymbolToConsequences, consequence: ArrangerEdge<ConsequenceEntity>) => {
      const symbol = consequence.node.symbol;
      if (!symbol) {
        return acc;
      }
      const gene = genes.find((g) => g.node.symbol === symbol);
      const omim = gene ? gene.node.omim_gene_id : '';
      const biotype = gene ? gene.node.biotype : '';
      const ensembleGeneId = consequence.node.ensembl_gene_id || '';
      const oldConsequences = acc[symbol]?.consequences || [];

      return {
        ...acc,
        [symbol]: {
          consequences: [...oldConsequences, { ...consequence }],
          omim,
          symbol,
          ensembleGeneId,
          biotype,
        },
      };
    },
    {},
  );
};

const orderGenes = (mSymbolToConsequences: SymbolToConsequences) => {
  if (!mSymbolToConsequences || Object.keys(mSymbolToConsequences).length === 0) {
    return [];
  }
  return Object.entries(mSymbolToConsequences).map(([, values]) => ({
    ...values,
  }));
};

const orderConsequencesForTable = (tableGroups: TableGroup[]) => {
  if (!tableGroups || tableGroups.length === 0) {
    return [];
  }

  return tableGroups.map((tableGroup: TableGroup) => {
    const consequences = tableGroup.consequences;
    return {
      ...tableGroup,
      consequences: consequences,
    };
  });
};

const makeTables = (
  rawConsequences: ArrangerEdge<ConsequenceEntity>[],
  rawGenes: ArrangerEdge<GeneEntity>[],
) => {
  if (!rawConsequences || rawConsequences.length === 0) {
    return [];
  }
  const symbolToConsequences = groupConsequencesBySymbol(rawConsequences, rawGenes);
  const orderedGenes = orderGenes(symbolToConsequences);
  return orderConsequencesForTable(orderedGenes);
};

const makeRows = (consequences: ArrangerEdge<ConsequenceEntity>[]) =>
  consequences.map((consequence: ArrangerEdge<ConsequenceEntity>, index: number) => ({
    key: `${index + 1}`,
    aa: consequence.node.aa_change,
    consequences: consequence.node.consequences.filter((c) => c || c.length > 0),
    codingDna: consequence.node.coding_dna_change,
    strand: consequence.node.strand,
    vep: consequence.node.vep_impact,
    impact: [
      [
        'Sift',
        consequence.node.predictions?.sift_pred,
        consequence.node.predictions?.sift_converted_rank_score,
      ],
      [
        'Polyphen2',
        consequence.node.predictions?.polyphen2_hvar_pred,
        consequence.node.predictions?.sift_converted_rank_score,
      ],
      [
        'Fathmm',
        consequence.node.predictions?.fathmm_pred,
        consequence.node.predictions?.FATHMM_converted_rankscore,
      ],
      ['Cadd', null, consequence.node.predictions?.cadd_score],
      ['Dann', null, consequence.node.predictions?.dann_score],
      [
        'Lrt',
        consequence.node.predictions?.lrt_pred,
        consequence.node.predictions?.lrt_converted_rankscore,
      ],
      ['Revel', null, consequence.node.predictions?.revel_rankscore],
    ].filter(([, , score]) => score),
    conservation: consequence.node.conservations?.phylo_p17way_primate_rankscore,
    transcript: {
      ids: consequence.node.refseq_mrna_id?.filter((i) => i?.length > 0),
      isCanonical: consequence.node.canonical,
    },
  }));

const columns = [
  {
    title: () => intl.get('screen.variantDetails.summaryTab.consequencesTable.AAColumn'),
    dataIndex: 'aa',
    render: (aa: string) => (
      <Tooltip placement="topLeft" title={aa || DISPLAY_WHEN_EMPTY_DATUM}>
        <div className={styles.longValue}>{aa || DISPLAY_WHEN_EMPTY_DATUM}</div>
      </Tooltip>
    ),
    className: `${styles.longValue}`,
    width: '10%',
  },
  {
    title: () => intl.get('screen.variantDetails.summaryTab.consequencesTable.ConsequenceColumn'),
    dataIndex: 'consequences',
    render: (consequences: string[]) => {
      if (consequences.length === 0) {
        return <></>;
      }
      return (
        <ExpandableCell
          dataSource={consequences}
          renderItem={(item: any, id): React.ReactNode => (
            <StackLayout key={id} horizontal className={styles.cellList}>
              <Text>{item}</Text>
            </StackLayout>
          )}
        />
      );
    },
    width: '15%',
  },
  {
    title: () => intl.get('screen.variantDetails.summaryTab.consequencesTable.CDNAChangeColumn'),
    dataIndex: 'codingDna',
    render: (codingDna: string) => (
      <Tooltip placement="topLeft" title={codingDna || DISPLAY_WHEN_EMPTY_DATUM}>
        <div className={styles.longValue}>{codingDna || DISPLAY_WHEN_EMPTY_DATUM}</div>
      </Tooltip>
    ),
    width: '12%',
  },
  {
    title: () => intl.get('screen.variantDetails.summaryTab.consequencesTable.VEP'),
    dataIndex: 'vep',
    render: (vep: Impact) => {
      return getVepImpactTag(vep.toLowerCase());
    },
    width: '10%',
  },
  {
    title: () => intl.get('prediction'),
    dataIndex: 'impact',
    render: (impacts: string[][]) => {
      if (impacts.length === 0) {
        return DISPLAY_WHEN_EMPTY_DATUM;
      }

      return (
        <ExpandableCell
          nOfElementsWhenCollapsed={2}
          dataSource={impacts}
          renderItem={(item: any, id): React.ReactNode => {
            const predictionField = item[INDEX_IMPACT_PREDICTION_FIELD];
            const score = item[INDEX_IMPACT_SCORE];
            const predictionShortLabel = item[INDEX_IMPACT_PREDICTION_SHORT_LABEL];

            const predictionLongLabel = getLongPredictionLabelIfKnown(
              predictionField,
              predictionShortLabel,
            );

            const label = predictionLongLabel || predictionShortLabel;

            const description = label ? `${capitalize(label)} - ${score}` : score;
            return (
              <StackLayout key={id} horizontal className={styles.cellList}>
                <Text type={'secondary'}>{predictionField}:</Text>
                <Text>{description}</Text>
              </StackLayout>
            );
          }}
        />
      );
    },
    width: '15%',
  },
  {
    title: () => intl.get('screen.variantDetails.summaryTab.consequencesTable.ConservationColumn'),
    dataIndex: 'conservation',
    render: (conservation: number) =>
      conservation == null ? DISPLAY_WHEN_EMPTY_DATUM : conservation,
  },
  {
    title: () => intl.get('refSeq'),
    dataIndex: 'transcript',
    render: (transcript: { ids: string[]; isCanonical?: boolean }) => {

      if (!transcript.ids || transcript.ids.length === 0) {
        return DISPLAY_WHEN_EMPTY_DATUM;
      }

      return (
        transcript.ids.map(id => (
          <a
            key={id}
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.ncbi.nlm.nih.gov/nuccore/${id}.3?report=graph`}
            className={styles.transcriptLink}
          >
            {id}
            {transcript.isCanonical && (
              <CanonicalIcon className={styles.canonicalIcon} height="14" width="14" />
            )}
          </a>
        ))
      );
    },
    width: '20%',
  },
];

const sortConsequences = (data: ArrangerEdge<ConsequenceEntity>[]) =>
  data
    .sort((a, b) => b.node.impact_score! - a.node.impact_score!)
    .sort((a, b) => (a.node.canonical === b.node.canonical ? 0 : a.node.canonical ? -1 : 1));

const ResumePanel = ({ data, className = '' }: OwnProps) => {
  const variantData = data.variantData;
  const consequences = (variantData?.consequences as ArrangerResultsTree<ConsequenceEntity>)?.hits
    .edges;
  const genes = (variantData?.genes as ArrangerResultsTree<GeneEntity>)?.hits.edges;
  const tables = makeTables(consequences, genes);
  const hasTables = tables.length > 0;

  return (
    <CollapsePanel header={intl.get('screen.variantDetails.summaryTab.consequencesTitle')}>
      <StackLayout className={styles.consequenceCards} vertical>
        <Spin spinning={data.loading}>
          {hasTables ? (
            tables.map((tableData: TableGroup, index: number) => {
              const symbol = tableData.symbol;
              const omim = tableData.omim;
              const biotype = tableData.biotype;
              const orderedConsequences = sortConsequences(tableData.consequences);

              return (
                <>
                  <Space size={12}>
                    <Space size={4}>
                      <span>
                        <a
                          href={`https://useast.ensembl.org/Homo_sapiens/Gene/Summary?g=${symbol}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {symbol}
                        </a>
                      </span>
                    </Space>
                    <Space size={4}>
                      {omim && (
                        <>
                          <span>Omim</span>
                          <span>
                            <a
                              href={`https://omim.org/entry/${omim}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {omim}
                            </a>
                          </span>
                        </>
                      )}
                    </Space>
                    <span className="bold value">{biotype}</span>
                  </Space>
                  <ExpandableTable
                    bordered={true}
                    nOfElementsWhenCollapsed={1}
                    buttonText={(showAll, hiddenNum) =>
                      showAll
                        ? intl.get('screen.variant.entity.table.hidetranscript')
                        : `${intl.get(
                            'screen.variant.entity.table.showtranscript',
                          )} (${hiddenNum})`
                    }
                    key={index}
                    dataSource={makeRows(orderedConsequences)}
                    columns={columns}
                    pagination={false}
                    size="small"
                  />
                </>
              );
            })
          ) : (
            <NoData />
          )}
        </Spin>
      </StackLayout>
    </CollapsePanel>
  );
};

export default ResumePanel;
