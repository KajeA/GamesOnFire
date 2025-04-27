import React from 'react';
import { createRoot } from 'react-dom/client';
import { Layout, Table } from 'antd';
import data from '../../games.json';

const { Header, Content } = Layout;

const dataSource = data.map((item) => ({ ...item, key: item.id }));

const tableColumns = [
  { title: 'Name', dataIndex: 'name', key: 'name' },
  { title: 'Year', dataIndex: 'releaseYear', key: 'releaseYear' },
  { title: 'Publisher', dataIndex: 'publisher', key: 'publisher' },
];

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No root element found to mount the app');
}

const root = createRoot(rootElement);

root.render(
  <React.StrictMode>
    <Layout>
      <Header style={{ color: 'white', fontSize: '20px' }}>Admin</Header>
      <Content>
        <Table dataSource={dataSource} columns={tableColumns} />
      </Content>
    </Layout>
  </React.StrictMode>,
);
