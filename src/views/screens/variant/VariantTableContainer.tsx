/* eslint-disable jsx-a11y/anchor-is-valid */

import React, { useState } from 'react';
import { Tooltip, Table } from 'antd';
import cx from 'classnames';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { VariantPageResults } from './VariantPageContainer';
import intl from 'react-intl-universal';
import UserAffected from 'components/icons/UserAffectedIcon';
import {
  VariantEntity,
  ClinVar,
  Consequence,
  ExternalFrequenciesEntity,
  DonorsEntity,
} from 'store/graphql/variants/models';
import { DISPLAY_WHEN_EMPTY_DATUM } from 'views/screens/variant/constants';
import ConsequencesCell from './ConsequencesCell';
import { ArrangerResultsTree, ArrangerEdge } from 'store/graphql/models';
import { navigateTo } from 'utils/helper';

import style from './VariantTableContainer.module.scss';
import OccurenceDrawer from './OccurenceDrawer';
import { ColumnType } from 'antd/lib/table';
import { ItemsCount } from 'components/table/ItemsCount';
import { Varsome, VarsomeClassifications } from 'store/graphql/variants/models';

const DEFAULT_PAGE_NUM = 1;
const DEFAULT_PAGE_SIZE = 10;

type OwnProps = {
  results: VariantPageResults;
  filters: ISyntheticSqon;
  setCurrentPageCb: (currentPage: number) => void;
  currentPageSize: number;
  setcurrentPageSize: (currentPage: number) => void;
  patientId: string;
};

const makeRows = (rows: ArrangerEdge<VariantEntity>[]) =>
  rows.map((row: ArrangerEdge<VariantEntity>, index: number) => ({
    ...row.node,
    key: `${index}`,
  }));

const findDonorById = (donors: ArrangerResultsTree<DonorsEntity>, patientId: string) => {
  return donors.hits?.edges.find((donor) => donor.node.patient_id === patientId);
};

const formatCalls = (calls: number[]) => (calls ? calls.join('/') : DISPLAY_WHEN_EMPTY_DATUM);

const VariantTableContainer = (props: OwnProps) => {
  const [drawerOpened, toggleDrawer] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState<VariantEntity | undefined>(undefined);
  const { results, setCurrentPageCb, currentPageSize, setcurrentPageSize } = props;
  const [currentPageNum, setCurrentPageNum] = useState(DEFAULT_PAGE_NUM);

  const variantsResults = results.data?.Variants as ArrangerResultsTree<VariantEntity>;
  const variants = variantsResults?.hits?.edges || [];
  const total = variantsResults?.hits?.total || 0;

  const columns: ColumnType<VariantEntity>[] = [
    {
      title: () => intl.get('screen.patientvariant.results.table.variant'),
      dataIndex: 'hgvsg',
      className: cx(style.variantTableCell, style.variantTableCellElipsis),
      render: (hgvsg: string, entity: VariantEntity) =>
        hgvsg ? (
          <Tooltip placement="topLeft" title={hgvsg}>
            <a onClick={() => navigateTo(`/variant/entity/${entity.hash}?patientid=${props.patientId}`)}>{hgvsg}</a>
          </Tooltip>
        ) : (
          DISPLAY_WHEN_EMPTY_DATUM
        ),
    },
    {
      title: () => intl.get('screen.patientvariant.results.table.type'),
      dataIndex: 'variant_class',
    },
    {
      title: () => intl.get('screen.patientvariant.results.table.dbsnp'),
      dataIndex: 'rsnumber',
      className: style.dbSnpTableCell,
      render: (rsNumber: string) =>
        rsNumber ? (
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={`https://www.ncbi.nlm.nih.gov/snp/${rsNumber}`}
          >
            {rsNumber}
          </a>
        ) : (
          DISPLAY_WHEN_EMPTY_DATUM
        ),
    },
    {
      title: () => intl.get('screen.patientvariant.results.table.consequence'),
      dataIndex: 'consequences',
      width: 300,
      render: (consequences: { hits: { edges: Consequence[] } }) => (
        <ConsequencesCell consequences={consequences?.hits?.edges || []} />
      ),
    },
    {
      title: () => intl.get('screen.patientvariant.results.table.clinvar'),
      dataIndex: 'clinvar',
      className: cx(style.variantTableCell, style.variantTableCellElipsis),
      render: (clinVar: ClinVar) =>
        clinVar?.clin_sig && clinVar.clinvar_id ? (
          <a
            href={`https://www.ncbi.nlm.nih.gov/clinvar/variation/${clinVar.clinvar_id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {clinVar.clin_sig.join(', ')}
          </a>
        ) : (
          DISPLAY_WHEN_EMPTY_DATUM
        ),
    },
    {
      title: () => intl.get('screen.patientvariant.results.table.varsome'),
      dataIndex: 'varsome',
      className: cx(style.variantTableCell, style.variantTableCellElipsis),
      render: (varsome: Varsome) =>
        (<a
          href={`https://varsome.com/variant/${varsome?.variant_id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          { varsome?.acmg.verdict.verdict ?
            varsome?.acmg.verdict.verdict :
            'No Verdict'
          }
        </a>)
    },
    {
      title: () => intl.get('screen.patientvariant.results.table.acmgRules'),
      dataIndex: 'varsome',
      className: cx(style.variantTableCell, style.variantTableCellElipsis),
      render: (varsome: Varsome) =>
        varsome?.acmg.classifications.hits.edges.map((e: ArrangerEdge<VarsomeClassifications>) => e.node.name)
        .reduce((prev, curr) => `${prev}, ${curr}`)
    },
    {
      title: () => intl.get('screen.variantsearch.table.gnomAd'),
      dataIndex: 'external_frequencies',
      render: (external_frequencies: ExternalFrequenciesEntity) =>
        external_frequencies.gnomad_exomes_2_1_1
          ? external_frequencies.gnomad_exomes_2_1_1.af.toPrecision(4)
          : DISPLAY_WHEN_EMPTY_DATUM,
    },
    {
      title: () => intl.get('screen.patientvariant.results.table.rqdm'),
      render: (record: VariantEntity) =>
        `${record.frequency_RQDM.total.pc} / ${record.frequency_RQDM.total.pn} (${(
          record.frequency_RQDM.total.pf * 100
        ).toPrecision(3)}%)`,
    },
    {
      title: () => intl.get('screen.patientvariant.results.table.zygosity'),
      dataIndex: 'donors',
      render: (record: ArrangerResultsTree<DonorsEntity>) => {
        const donor = findDonorById(record, props.patientId);
        return donor ? donor.node?.zygosity : DISPLAY_WHEN_EMPTY_DATUM;
      },
    },
    {
      title: () => intl.get('screen.patientvariant.results.table.genotype'),
      dataIndex: 'donors',
      render: (record: ArrangerResultsTree<DonorsEntity>) => {
        const donor = findDonorById(record, props.patientId);
        const motherCalls = formatCalls(donor?.node.mother_calls!);
        const fatherCalls = formatCalls(donor?.node.father_calls!);

        return `${motherCalls} : ${fatherCalls}`;
      },
    },
    {
      className: style.userAffectedBtnCell,
      render: (record: VariantEntity) => {
        return (
          <UserAffected
            onClick={() => {
              setSelectedVariant(record);
              toggleDrawer(true);
            }}
            width="16"
            height="16"
            className={style.affectedIcon}
          />
        );
      },
      align: 'center',
    },
  ];

  return (
    <>
      <ItemsCount page={currentPageNum} size={currentPageSize} total={total} />
      <Table
        size="small"
        loading={results.loading}
        columns={columns}
        dataSource={makeRows(variants)}
        className={style.variantSearchTable}
        pagination={{
          current: currentPageNum,
          showTotal: () => undefined,
          total: total,
          showTitle: false,
          showSizeChanger: true,
          showQuickJumper: false,
          defaultPageSize: currentPageSize,
          onChange: (page, pageSize) => {
            if (currentPageNum !== page || currentPageSize !== pageSize) {
              setCurrentPageNum(page);
              setCurrentPageCb(page);
              setcurrentPageSize(pageSize || DEFAULT_PAGE_SIZE);
            }
          },
          size: 'small',
        }}
      />
      <OccurenceDrawer
        patientId={props.patientId}
        data={selectedVariant!}
        opened={drawerOpened}
        toggle={toggleDrawer}
      />
    </>
  );
};

export default VariantTableContainer;
