// ProcurementPage.jsx
import { 
  Layout, 
  Menu, 
  Avatar, 
  Dropdown, 
  Button, 
  Card, 
  Table, 
  Tag,
  Statistic,
  notification,
  Upload,
  Spin,
  Result,
  Typography,
  Divider
} from "antd";
import { 
  UserOutlined,
  DashboardOutlined,
  LogoutOutlined,
  UploadOutlined,
  MedicineBoxOutlined,
  BellOutlined,
  CheckCircleOutlined,
  FileExcelOutlined
} from "@ant-design/icons";

import { useAuth } from "../../context/AuthContext";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

export default function ProcurementPage() {
  const { getRole, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [modelResponse, setModelResponse] = useState(null);

  // Verify procurement role
  useEffect(() => {
    if (getRole() !== "PROCUREMENT") {
      navigate('/');
    }
  }, [getRole, navigate]);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      notification.warning({
        message: 'No file selected',
        description: 'Please select a CSV file to upload'
      });
      return;
    }

    const formData = new FormData();
    formData.append('file', fileList[0].originFileObj);

    setUploading(true);
    try {
      const response = await fetch(
        'https://api.fabric.microsoft.com/v1/workspaces/32440df2-7c6f-443d-a5ca-050705991cf2/lakehouses/b1ff5252-0efb-4397-acf5-a6523c344db3/livyapi/versions/2023-12-01/batches',
        {
          method: 'POST',
          body: formData,
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to upload file');
      }

      const data = await response.json();
      setModelResponse(data);
      notification.success({
        message: 'File uploaded successfully',
        description: 'The model has processed your data'
      });
      setActiveTab('dashboard');
    } catch (error) {
      notification.error({
        message: 'Upload failed',
        description: error.message
      });
    } finally {
      setUploading(false);
      setFileList([]);
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      setFileList(fileList.filter(f => f.uid !== file.uid));
    },
    beforeUpload: (file) => {
      if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
        notification.error({
          message: 'Invalid file type',
          description: 'Please upload a CSV file'
        });
        return false;
      }
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
    accept: '.csv'
  };

  return (
    <Layout style={{ minHeight: "100vh", background: '#f0f2f5' }}>
      <Sider 
        theme="light"
        width={250}
        style={{ 
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
          borderRight: '1px solid #f0f0f0'
        }}
      >
        <div className="flex items-center justify-center p-4">
          <MedicineBoxOutlined className="text-purple-600 text-2xl mr-2" />
          <span className="text-xl font-bold text-purple-600">Sanusvelle</span>
        </div>
        
        <Menu 
          theme="light" 
          mode="inline"
          selectedKeys={[activeTab]}
          onSelect={({ key }) => setActiveTab(key)}
          items={[
            {
              key: 'dashboard',
              icon: <DashboardOutlined className="text-lg" />,
              label: 'Dashboard'
            },
            {
              key: 'upload',
              icon: <UploadOutlined className="text-lg" />,
              label: 'Upload CSV'
            }
          ]}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          background: "#fff", 
          padding: "0 24px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)'
        }}>
          <div className="flex items-center">
            <Avatar 
              src={getRole.avatar} 
              icon={<UserOutlined />} 
              className="bg-purple-500"
            />
            <span className="ml-3 font-medium">{getRole.name || 'Procurement Officer'}</span>
          </div>
          
          <Dropdown
            menu={{
              items: [
                {
                  key: 'logout',
                  icon: <LogoutOutlined />,
                  label: 'Logout',
                  onClick: logout
                }
              ]
            }}
            trigger={['click']}
          >
            <Button 
              icon={<BellOutlined />} 
              shape="circle" 
              className="border-none shadow-none hover:bg-gray-100"
            />
          </Dropdown>
        </Header>

        <Content className="m-6">
          {activeTab === 'dashboard' ? (
            <Card
              title="Model Predictions Dashboard"
              bordered={false}
              className="shadow-sm"
            >
              {modelResponse ? (
                <div className="p-6">
                  <Result
                    icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
                    title="Data Successfully Processed"
                    subTitle="Below are the predictions from the model"
                  />
                  
                  <Divider orientation="left">Prediction Summary</Divider>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <Card>
                      <Statistic
                        title="Predicted Demand"
                        value={modelResponse.predictedDemand || 'N/A'}
                        valueStyle={{ color: '#1890ff' }}
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Optimal Order Quantity"
                        value={modelResponse.optimalOrderQuantity || 'N/A'}
                        valueStyle={{ color: '#722ed1' }}
                      />
                    </Card>
                    <Card>
                      <Statistic
                        title="Confidence Level"
                        value={modelResponse.confidenceLevel ? `${modelResponse.confidenceLevel}%` : 'N/A'}
                        valueStyle={{ color: '#13c2c2' }}
                      />
                    </Card>
                  </div>

                  <Divider orientation="left">Detailed Predictions</Divider>
                  
                  {modelResponse.detailedPredictions ? (
                    <Table
                      columns={[
                        { title: 'Medication', dataIndex: 'medication', key: 'medication' },
                        { title: 'Current Stock', dataIndex: 'currentStock', key: 'currentStock' },
                        { title: 'Predicted Demand', dataIndex: 'predictedDemand', key: 'predictedDemand' },
                        { title: 'Recommended Order', dataIndex: 'recommendedOrder', key: 'recommendedOrder' },
                        { 
                          title: 'Status', 
                          dataIndex: 'status', 
                          key: 'status',
                          render: (status) => (
                            <Tag color={status === 'Critical' ? 'red' : status === 'Warning' ? 'orange' : 'green'}>
                              {status}
                            </Tag>
                          )
                        }
                      ]}
                      dataSource={modelResponse.detailedPredictions}
                      rowKey="medication"
                      pagination={false}
                    />
                  ) : (
                    <Text type="secondary">No detailed predictions available</Text>
                  )}
                </div>
              ) : (
                <div className="text-center p-8">
                  <FileExcelOutlined className="text-4xl text-gray-300 mb-4" />
                  <Title level={4} className="text-gray-500">No Model Data Available</Title>
                  <Text type="secondary">Upload a CSV file to get predictions</Text>
                  <Button 
                    type="primary" 
                    className="mt-4"
                    onClick={() => setActiveTab('upload')}
                  >
                    Go to Upload
                  </Button>
                </div>
              )}
            </Card>
          ) : (
            <Card
              title="Upload Medication Data"
              className="max-w-3xl mx-auto shadow-sm"
            >
              <div className="p-8 border-2 border-dashed border-gray-200 rounded-lg text-center">
                <Upload.Dragger {...uploadProps}>
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined className="text-4xl text-purple-500" />
                  </p>
                  <p className="ant-upload-text">Click or drag CSV file to this area</p>
                  <p className="ant-upload-hint">
                    Supports medication inventory files only
                  </p>
                </Upload.Dragger>

                <Button 
                  type="primary" 
                  className="mt-6"
                  icon={<UploadOutlined />}
                  onClick={handleUpload}
                  disabled={fileList.length === 0}
                  loading={uploading}
                >
                  {uploading ? 'Processing...' : 'Process File'}
                </Button>
                
                {uploading && (
                  <div className="mt-4">
                    <Spin tip="Processing file with model..." />
                    <Text type="secondary" className="block mt-2">
                      This may take a few moments
                    </Text>
                  </div>
                )}
              </div>
            </Card>
          )}
        </Content>
      </Layout>
    </Layout>
  );
}