import React from 'react';
import { Collapse, Spin, Table } from 'antd';
import intl from 'react-intl-universal';
import {
    VariantEntity,
  } from 'graphql/variants/models';
const { Panel } = Collapse;

const columns = [
    {
        title: () => intl.get('screen.variantDetails.summaryTab.acmgCriteriaTable.criteriaColumn'),
        dataIndex: 'name',
        className: ``,
        width: '18%',
    },
    {
        title: () => intl.get('screen.variantDetails.summaryTab.acmgCriteriaTable.explanationColumn'),
        dataIndex: 'user_explain',
        className: ``,
    },
]

const formatData = (data: VariantEntity | null) => {
    if (!data) return [];

    return data.varsome?.acmg.classifications?.hits.edges.map((c) => {
        const node = c.node;
        return {
            key: node.name,
            name: node.name,
            criteria: node.met_criteria,
            user_explain: node.user_explain
        }
    })
}

type Props = {
    isOpen?: boolean,
    data: {
        loading: boolean;
        variantData: VariantEntity | null;
    };
}

const ACMGCriteria = ({data, isOpen = true}: Props) => (
    <Collapse
        bordered={false}
        defaultActiveKey='1'
    >
        <Panel
            header="Critère ACMG"
            key={`1`}
        >
            <Spin spinning={data.loading}>
                <Table
                    bordered={true}
                    dataSource={formatData(data.variantData) || []}
                    columns={columns}
                    pagination={false}
                    size="small"
                />
            </Spin>
        </Panel>
    </Collapse>
);

export default ACMGCriteria;
