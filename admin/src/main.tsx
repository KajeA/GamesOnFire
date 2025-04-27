import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout, Table, Spin } from 'antd';
import { Game } from '../../functions/src/interfaces/Game';

const { Header, Content } = Layout;

const AdminPage: React.FC = () => {
  const [dataSource, setDataSource] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://127.0.0.1:5004/demo-project/europe-west3/api/v1/games')
        .then(response => response.json())
        .then(data => {
          setDataSource(data.map((item: Game) => ({ ...item, key: item.id })));
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          import('../../games.json').then(staticData => {
            setDataSource(staticData.default.map((item: Game) => ({ ...item, key: item.id })));
            setLoading(false);
          });
        });
  }, []);

  const tableColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Year', dataIndex: 'releaseYear', key: 'releaseYear' },
    { title: 'Publisher', dataIndex: 'publisher', key: 'publisher' },
  ];

  return (
      <Layout>
        <Header style={{ color: 'white', fontSize: '20px' }}>Admin</Header>
        <Content>
          {loading ? (
              <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />
          ) : (
              <Table dataSource={dataSource} columns={tableColumns} />
          )}
        </Content>
      </Layout>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('No root element found to mount the app');
}

const root = createRoot(rootElement);

root.render(
    <React.StrictMode>
      <AdminPage />
    </React.StrictMode>
);
