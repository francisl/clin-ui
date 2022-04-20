import React from 'react';
import { Collapse } from 'antd';

import style from './index.module.scss';
const { Panel } = Collapse;

const HeaderWithStyle = (header: React.ReactNode | string) => (
    <div className={style.clinCollapsableHeader}>{header}</div>
);

type Props = {
    header: React.ReactNode | string;
    children: React.ReactNode;
}
const CollapsePanel = ({header, children }: Props) : React.ReactElement => (
    <Collapse bordered={false} defaultActiveKey='1'>
        <Panel header={HeaderWithStyle(header)} key={`1`} className={style.clinCollapsable}>
            {children}
        </Panel>
    </Collapse>
)

export default CollapsePanel;
