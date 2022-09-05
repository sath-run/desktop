import { PageContainer, ProColumns, ActionType, ProTable } from '@ant-design/pro-components';
import React, {useRef} from 'react';
import { integrals } from '@/services/task';
import {useTranslation} from "react-i18next";

const Job: React.FC = () => {
  const tableRef = useRef<ActionType>();
  const {t} = useTranslation();
  const query = useRef<API.JobsIntegralParams>({
    pageSize: 10,
    pageIndex: 1,
  })
  const columns: ProColumns<API.TaskIntegral>[] = [
    {
      title: 'JobId',
      width: 150,
      dataIndex: 'jobId',
    },
    {
      title: t('common.algoName'),
      dataIndex: 'algo',
    },
    {
      title: t('integral.score'),
      width: 180,
      dataIndex: 'score',
    },
    {
      title: t('common.completedAt'),
      width: 180,
      dataIndex: 'completedAt',
      valueType: 'dateTime',
    }
  ];
  return (
    <PageContainer header={{
      title: t('menu.integral'),
      breadcrumb: {},
    }}>
      <ProTable<API.TaskIntegral>
        columns={columns}
        rowKey='id'
        options={false}
        actionRef={tableRef}
        request={async () => {
          const result = await integrals(query.current);
          return {
            success: result.success,
            data: result.data.jobs || [],
            total: result.data.total
          }
        }}
        pagination={false}
        search={false}
      />
    </PageContainer>
  );
};

export default Job;
