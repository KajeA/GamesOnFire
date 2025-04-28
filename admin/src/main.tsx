import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Layout, Table, Button, Space, Form, Input, InputNumber, Modal, message, Popconfirm, Spin, Select } from 'antd';
import { Game } from '../../functions/src/interfaces/game.js';

const { Header, Content } = Layout;
const { Option } = Select;

type GameFormData = Omit<Game, 'id'>;

const AdminPage: React.FC = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const API_URL = 'http://127.0.0.1:5004/demo-project/europe-west3/api/v1/games';

  // Fetch games
  const fetchGames = () => {
    setLoading(true);
    fetch(API_URL)
      .then(response => response.json())
      .then(data => {
        setGames(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching games:', error);
        message.error('Failed to fetch games');
        setLoading(false);
      });
  }

  // Add game
  const handleAddGame = (values: GameFormData) => {
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add game');
          return response.json();
        }
        return response.json();
      })
      .then(() => {
        message.success('Game added successfully');
        setIsModalVisible(false);
        fetchGames();
      })
      .catch(error => {
        console.error('Error adding game:', error);
        message.error('Failed to add game');
      });
  };

  // Update game
  const handleUpdateGame = (id: string, values: GameFormData) => {
    fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    })
      .then(response => {
        if (!response.ok)
          throw new Error('Failed to update game');
        return response.json();
      })
      .then(() => {
        message.success('Game updated successfully');
        setIsModalVisible(false);
        fetchGames();
      })
      .catch(error => {
        console.error('Error updating game:', error);
        message.error('Failed to update game');
      });
  };

  // Delete game
  const handleDeleteGame = (id: string) => {
    fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok)
          throw new Error('Failed to delete game');
        return response.json();
      })
      .then(() => {
        message.success('Game deleted successfully');
        fetchGames();
      })
      .catch(error => {
        console.error('Error deleting game:', error);
        message.error('Failed to delete game');
      });
  };


  // Seed database
  const handleSeedDatabase = () => {
    fetch(`${API_URL}/seed`, {
      method: 'POST',
    })
      .then(response => response.json())
      .then(data => {
        message.success(`Database seeded with ${data.count} games`);
        fetchGames();
      })
      .catch(error => {
        console.error('Error seeding database:', error);
        message.error('Failed to seed database');
      });
  };

  // Form handlers
  const handleSubmit = () => {
    form.validateFields()
      .then(values => {
        if (editingGame) {
          handleUpdateGame(editingGame.id, values);
        } else {
          handleAddGame(values);
        }
      })
      .catch(info => {
        console.error('Validate Failed:', info);
      });
  };

  const showAddGameModal = () => {
    setEditingGame(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const showEditGameModal = (game: Game) => {
    setEditingGame(game);
    form.setFieldsValue({
      name: game.name,
      releaseYear: game.releaseYear,
      publisher: game.publisher,
      type: game.type,
      players: game.players,
      baseGame: game.baseGame,
      standalone: game.standalone
    });
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchGames()
  }, []);


  const tableColumns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Year', dataIndex: 'releaseYear', key: 'releaseYear' },
    { title: 'Publisher', dataIndex: 'publisher', key: 'publisher' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Game) => (
        <Space size="small">
          <Button type="primary" size="small" onClick={() => showEditGameModal(record)}>
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this game?"
            onConfirm={() => handleDeleteGame(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger size="small">
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Layout>
      <Header style={{
        color: 'white',
        fontSize: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 16px'
      }}>
        <span>Games Admin</span>
        <Space>
          <Button type="primary" onClick={showAddGameModal}>
            Add Game
          </Button>
          <Button onClick={handleSeedDatabase}>
            Seed Database
          </Button>
        </Space>
      </Header>
      <Content style={{ padding: '24px' }}>
        {loading ? (
          <Spin size="large" style={{ display: 'block', margin: '20px auto' }} />
        ) : (
          <Table
            dataSource={games.map(game => ({ ...game, key: game.id }))}
            columns={tableColumns}
            pagination={{ pageSize: 10 }}
          />
        )}

        <Modal
          title={editingGame ? 'Edit Game' : 'Add New Game'}
          open={isModalVisible}
          onOk={handleSubmit}
          onCancel={handleCancel}
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: 'Please enter the game name' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="releaseYear"
              label="Release Year"
            >
              <InputNumber min={1900} max={2100} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              name="publisher"
              label="Publisher"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="type"
              label="Type"
              rules={[{ required: true, message: 'Please select the game type' }]}
            >
              <Select>
                <Option value="BaseGame">Base Game</Option>
                <Option value="Expansion">Expansion</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Players">
              <Input.Group compact>
                <Form.Item
                  name={['players', 'min']}
                  noStyle
                  rules={[{ required: true, message: 'Min players required' }]}
                >
                  <InputNumber min={1} placeholder="Min" style={{ width: '50%' }} />
                </Form.Item>
                <Form.Item
                  name={['players', 'max']}
                  noStyle
                >
                  <InputNumber min={1} placeholder="Max" style={{ width: '50%' }} />
                </Form.Item>
              </Input.Group>
            </Form.Item>
            <Form.Item
              name="baseGame"
              label="Base Game (for expansions)"
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="standalone"
              label="Standalone"
              valuePropName="checked"
            >
              <Select>
                <Option value={true}>Yes</Option>
                <Option value={false}>No</Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
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
