import React from 'react';
import intl from 'react-intl-universal';
import { Tooltip } from 'antd';
import Status, { StatusOptions } from '@ferlab/ui/core/components/labels/Status';

import { TColumn } from './columns';
import { PatientIdCell, PrescriptionIdCell } from './cell/LinkCell';

import { formatDate } from 'utils/date';

import './tableColumn.scss';

export const prescriptionsColumns = (
): TColumn[] => {
  const statusTranslation = {
    [StatusOptions.Active]: intl.get('filters.options.active'),
    [StatusOptions.Completed]: intl.get('filters.options.completed'),
    [StatusOptions.Draft]: intl.get('filters.options.draft'),
    [StatusOptions.Revoked]: intl.get('filters.options.revoked'),
    [StatusOptions.Submitted]: intl.get('filters.options.submitted'),
    [StatusOptions.Incomplete]: intl.get('filters.options.incomplete'),
  };

  return [
    {
      name: ['cid'],
      render: (cid: string, prescription: any) => {
        return <PrescriptionIdCell patientId={prescription.patientInfo?.cid || ''} text={cid} />;
      },
      summary: false,
      title: intl.get('screen.patientsearch.table.prescription'),
    },
    {
      name: ['patientInfo', 'cid'],
      render: (cid: string) => <PatientIdCell id={cid} />,
      summary: false,
      title: intl.get('screen.patientsearch.table.patientId'),
    },
    {
      name: 'state',
      render: (value: string) => !!value ? <Status dictionary={statusTranslation} status={value} /> : null,
      summary: false,
      title: intl.get('screen.patientsearch.table.status'),
    },
    {
      name: 'timestamp',
      render: (date: string) => formatDate(date),
      summary: false,
      title: (
        <Tooltip placement="topLeft" title={intl.get('standard.format.date')} arrowPointAtCenter>
          {intl.get('screen.patientsearch.table.date')}
        </Tooltip>
      ),
    },
    {
      name: ['analysis', 'code'],
      summary: true,
      title: intl.get('screen.patientsearch.table.test'),
    },
    {
      name: ['patientInfo', 'organization', 'cid'],
      summary: true,
      title: intl.get('screen.patientsearch.table.establishment'),
    },
    {
      name: 'prescriber',
      render: (p: Record<string, string>) => `${p.lastName.toUpperCase()}, ${p.firstName}`,
      summary: true,
      title: intl.get('screen.patientsearch.table.prescriber'),
    },
  ].map((c) => ({
    ...c,
    dataIndex: c.name,
    key: Array.isArray(c.name) ? c.name.join('.') : c.name,
  }));
};
