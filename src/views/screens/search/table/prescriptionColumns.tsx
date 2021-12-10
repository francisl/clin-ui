import React from 'react';
import intl from 'react-intl-universal';
import { ISyntheticSqon } from '@ferlab/ui/core/data/sqon/types';
import { Badge } from 'antd';
import Status, { StatusOptions } from '@ferlab/ui/core/components/labels/Status';

import { TColumn } from './columns';
import { PatientIdCell, PrescriptionIdCell } from './cell/LinkCell';

import './tableColumn.scss';

const statusColors: Record<string, Record<string, string>> = {
  active: {
    color: '#1D8BC6',
    key: 'screen.patientsearch.status.active',
  },
  completed: {
    color: '#389E0D',
    key: 'screen.patientsearch.status.completed',
  },
  draft: {
    color: '#D2DBE4',
    key: 'screen.patientsearch.status.draft',
  },

  incomplete: {
    color: '#EB2F96',
    key: 'screen.patientsearch.status.incomplete',
  },

  'on-hold': {
    color: '#D46B08',
    key: 'screen.patientsearch.status.on-hold',
  },

  revoked: {
    color: '#CF1322',
    key: 'screen.patientsearch.status.revoked',
  },
};

export const prescriptionsColumns = (
  sqons: ISyntheticSqon[],
  onLinkClick?: (sqons: ISyntheticSqon[]) => void,
): TColumn[] => {
  const statusTranslation = {
    [StatusOptions.Active]: intl.get('screen.patientsearch.status.active'),
    [StatusOptions.Completed]: intl.get('screen.patientsearch.status.completed'),
    [StatusOptions.Draft]: intl.get('screen.patientsearch.status.draft'),
    [StatusOptions.Revoked]: intl.get('screen.patientsearch.status.revoked'),
    [StatusOptions.Submitted]: intl.get('screen.patientsearch.status.submitted'),
    [StatusOptions.Incomplete]: intl.get('screen.patientsearch.status.incomplete'),
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
      render: (value: string) => <Status dictionary={statusTranslation} status={value} />,
      summary: false,
      title: intl.get('screen.patientsearch.table.status'),
    },
    {
      name: 'timestamp',
      render: (date: string) => Intl.DateTimeFormat(navigator.language).format(new Date(date)),
      summary: false,
      title: intl.get('screen.patientsearch.table.date'),
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
      render: (p: Record<string, string>) => `${p.lastName}, ${p.firstName}`,
      summary: true,
      title: intl.get('screen.patientsearch.table.prescriber'),
    },
  ].map((c) => ({
    ...c,
    dataIndex: c.name,
    key: Array.isArray(c.name) ? c.name.join('.') : c.name,
  }));
};
