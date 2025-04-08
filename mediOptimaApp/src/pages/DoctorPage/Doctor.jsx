import { 
  Layout, 
  Menu, 
  Avatar, 
  Dropdown, 
  Button, 
  Table, 
  Form, 
  Input, 
  Card, 
  notification, 
  Row, 
  Col, 
  Statistic, 
  Tag, 
  Spin, 
  Typography, 
  Modal,
  List,
  Space,
  Input as AntdInput 
} from "antd";
import { 
  UserOutlined,
  BellOutlined,
  DashboardOutlined,
  LogoutOutlined,
  MedicineBoxOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  FileTextOutlined,
  TeamOutlined,
  MessageOutlined,
  SendOutlined
} from "@ant-design/icons";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import * as signalR from "@microsoft/signalr";
import { chatApi, patientApi } from "../../services/api";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = AntdInput;

export default function DoctorDashboard() {
  // Authentication and navigation
  const { getRole, logout, getToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const chatEndRef = useRef(null);

  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [patients, setPatients] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [connection, setConnection] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [chatMessages, setChatMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Fetch doctor stats
  const { data: stats = { totalToday: 0, waiting: 0, completed: 0 }, isLoading } = useQuery({
    queryKey: ['doctorStats'],
    queryFn: () => patientApi.getDoctorStats(),
    staleTime: 10000,
    onError: (error) => {
      notification.error({
        message: 'Failed to load stats',
        description: error.message
      });
    }
  });

  // Fetch initial chat history
  useQuery({
    queryKey: ['chatHistory'],
    queryFn: () => chatApi.getHistory(),
    enabled: isChatOpen,
    onSuccess: (data) => {
      setChatMessages(data.messages);
    }
  });



  // SignalR connection for real-time updates
  useEffect(() => {
    const newConnection = new signalR.HubConnectionBuilder()
      .withUrl("/queueHub", {
        accessTokenFactory: () => getToken()
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Warning)
      .build();

    setConnection(newConnection);

    return () => {
      if (newConnection) newConnection.stop();
    };
  }, [getToken]);

  useEffect(() => {
    if (connection) {
      connection.start()
        .then(() => {
          connection.on("UpdateQueue", (updatedPatients) => {
            setPatients(updatedPatients);
            queryClient.invalidateQueries(['doctorStats']);
          });

          connection.on("PatientAssigned", (patient) => {
            notification.info({
              message: `New patient assigned: ${patient.fullName}`,
              description: 'Priority: ' + patient.priority.toUpperCase(),
              placement: 'topRight'
            });
          });

          fetchPatients();
        })
        .catch(err => console.error('SignalR Connection Error: ', err));
    }
  }, [connection, queryClient]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const fetchPatients = async () => {
    try {
      const data = await patientApi.getPatientQueue();
      setPatients(data);
    } catch (error) {
      notification.error({
        message: "Failed to fetch patients",
        description: error.message,
        placement: 'topRight'
      });
    }
  };

  // Chat API integration
  const { mutate: sendChatMessage, isLoading: isSendingMessage } = useMutation({
    mutationFn: (message) => chatApi.sendMessage({
      senderId: getRole.id,
      message: message,
      context: 'DOCTOR_DASHBOARD'
    }),
    onSuccess: (response) => {
      setChatMessages(prev => [...prev, {
        id: Date.now(),
        sender: 'MediBot',
        text: response.reply,
        timestamp: new Date().toLocaleTimeString()
      }]);
    },
    onError: (error) => {
      notification.error({
        message: 'Failed to get chatbot response',
        description: error.message
      });
    }
  });

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: 'You',
        text: messageInput,
        timestamp: new Date().toLocaleTimeString()
      };
      
      setChatMessages([...chatMessages, newMessage]);
      setMessageInput('');
      sendChatMessage(messageInput);
    }
  };

  const handleAttend = (patient) => {
    setCurrentPatient(patient);
    setActiveTab("dashboard");
    connection.invoke("AssignPatient", patient.id, getRole.id);
  };

  const handleNextPatient = () => {
    if (patients.length > 0) {
      handleAttend(patients[0]);
    } else {
      notification.info({ 
        message: "No patients in queue",
        placement: 'topRight'
      });
      setCurrentPatient(null);
      form.resetFields();
    }
  };

  const { mutate: saveDiagnosis, isLoading: isSaving } = useMutation({
    mutationFn: (diagnosis) => patientApi.saveDiagnosis({
      ...diagnosis,
      patientId: currentPatient.id,
      staffId: getRole.id
    }),
    onSuccess: () => {
      notification.success({ 
        message: "Diagnosis saved!",
        placement: 'topRight'
      });
      queryClient.invalidateQueries(['doctorStats']);
      handleNextPatient();
    },
    onError: (error) => {
      notification.error({
        message: "Failed to save diagnosis",
        description: error.message,
        placement: 'topRight'
      });
    }
  });

  const onFinish = (values) => {
    saveDiagnosis(values);
  };

  const handleLogout = async () => {
    Modal.confirm({
      title: 'Confirm Logout',
      content: 'Are you sure you want to logout?',
      okText: 'Logout',
      cancelText: 'Cancel',
      onOk: async () => {
        await logout();
        notification.success({
          message: 'Logged out successfully',
          placement: 'topRight'
        });
        navigate('/');
      }
    });
  };

  const showProfileModal = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const columns = [
    { 
      title: 'Patient', 
      dataIndex: 'fullName', 
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    { 
      title: 'Age', 
      dataIndex: 'age', 
      key: 'age',
      align: 'center'
    },
    { 
      title: 'Sex', 
      dataIndex: 'sex', 
      key: 'sex',
      align: 'center',
      render: (sex) => <Tag color={sex === 'male' ? 'blue' : 'pink'}>{sex.toUpperCase()}</Tag>
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: priority => (
        <Tag color={
          priority === 'urgent' ? 'red' : 
          priority === 'high' ? 'orange' : 
          'blue'
        }>
          {priority.toUpperCase()}
        </Tag>
      ),
      align: 'center'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button 
          type="primary" 
          onClick={() => handleAttend(record)}
          style={{ borderRadius: '6px' }}
          icon={<MedicineBoxOutlined />}
        >
          Attend
        </Button>
      ),
      align: 'center'
    },
  ];

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: '#f5f7fa' }}>
      <Sider 
        theme="light"
        width={280}
        style={{ 
          boxShadow: '2px 0 8px rgba(0, 0, 0, 0.05)',
          background: '#fff',
          position: 'fixed',
          height: '100vh',
          zIndex: 1
        }}
      >
        <div style={{ 
          padding: "24px 16px", 
          display: 'flex', 
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <MedicineBoxOutlined style={{ fontSize: '24px', color: '#6366F1', marginRight: '12px' }} />
          <Title level={4} style={{ margin: 0, color: '#6366F1' }}>MediCare</Title>
        </div>
        
        <div style={{ padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Avatar 
              size="large" 
              style={{ backgroundColor: '#6366F1' }} 
              icon={<UserOutlined />} 
            />
            <div style={{ marginLeft: '12px' }}>
              <Text strong>{getRole?.role === 'DOCTOR' ? 'Dr.' : ''} {getRole?.fullName?.split(' ')[0]}</Text>
              <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                {getRole?.role === 'DOCTOR' ? 'Doctor' : 'Clinician'}
              </Text>
            </div>
          </div>
        </div>

        <Menu 
          theme="light" 
          mode="inline"
          selectedKeys={[activeTab]}
          onSelect={({ key }) => setActiveTab(key)}
          style={{ borderRight: 0, padding: '8px' }}
        >
          <Menu.Item 
            key="dashboard" 
            icon={<DashboardOutlined style={{ fontSize: '18px' }} />}
            style={{ borderRadius: '8px', marginBottom: '8px' }}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item 
            key="queue" 
            icon={<ClockCircleOutlined style={{ fontSize: '18px' }} />}
            style={{ borderRadius: '8px', marginBottom: '8px' }}
          >
            Patient Queue
          </Menu.Item>
          <Menu.Item 
            key="history" 
            icon={<FileTextOutlined style={{ fontSize: '18px' }} />}
            style={{ borderRadius: '8px' }}
          >
            Patient History
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: 280 }}>
        <Header style={{ 
          background: "#fff", 
          padding: "0 24px", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.08)',
          position: 'sticky',
          top: 0,
          zIndex: 1,
          height: '64px'
        }}>
          <Title level={4} style={{ margin: 0 }}>
            {activeTab === 'dashboard' ? `${getRole?.role === 'DOCTOR' ? 'Doctor' : 'Clinician'} Dashboard` : 
             activeTab === 'queue' ? 'Patient Queue' : 'Patient History'}
          </Title>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Dropdown 
              menu={{
                items: [
                  {
                    key: 'profile',
                    label: 'My Profile',
                    icon: <UserOutlined />,
                    onClick: showProfileModal
                  },
                  {
                    type: 'divider'
                  },
                  {
                    key: 'logout',
                    label: 'Logout',
                    icon: <LogoutOutlined />,
                    danger: true,
                    onClick: handleLogout
                  }
                ]
              }}
              trigger={['click']}
              placement="bottomRight"
            >
              <Button 
                icon={<BellOutlined />} 
                shape="circle" 
                style={{ border: 'none', boxShadow: 'none' }}
              />
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: "24px", minHeight: 'calc(100vh - 112px)' }}>
          {activeTab === "queue" ? (
            <Card 
              title={<span style={{ fontWeight: 500 }}>Patients Waiting Queue</span>} 
              bordered={false}
              extra={
                <Button 
                  type="primary" 
                  onClick={handleNextPatient}
                  style={{ borderRadius: '6px' }}
                >
                  Attend Next Patient
                </Button>
              }
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
              }}
            >
              <Table 
                columns={columns} 
                dataSource={patients} 
                rowKey="id"
                pagination={false}
                style={{ marginTop: '16px' }}
                loading={isLoading}
              />
            </Card>
          ) : (
            <div>
              {currentPatient ? (
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Card 
                      title={<span style={{ fontWeight: 500 }}>Attending to {currentPatient.fullName}</span>}
                      style={{ borderRadius: '12px' }}
                    >
                      <Row gutter={24}>
                        <Col xs={24} md={8}>
                          <Card 
                            bordered={false}
                            style={{ borderRadius: '8px', background: '#fafafa' }}
                          >
                            <Title level={5} style={{ marginBottom: '16px' }}>Patient Information</Title>
                            <div style={{ marginBottom: '16px' }}>
                              <Text type="secondary" strong>Name:</Text>
                              <Text style={{ display: 'block', marginTop: '4px' }}>
                                {currentPatient.fullName}
                              </Text>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                              <Text type="secondary" strong>Age:</Text>
                              <Text style={{ display: 'block', marginTop: '4px' }}>
                                {currentPatient.age} years
                              </Text>
                            </div>
                            <div style={{ marginBottom: '16px' }}>
                              <Text type="secondary" strong>Sex:</Text>
                              <Text style={{ display: 'block', marginTop: '4px' }}>
                                <Tag 
                                  color={currentPatient.sex === 'male' ? 'blue' : 'pink'}
                                  style={{ marginLeft: 0 }}
                                >
                                  {currentPatient.sex.toUpperCase()}
                                </Tag>
                              </Text>
                            </div>
                            <div>
                              <Text type="secondary" strong>Priority:</Text>
                              <Text style={{ display: 'block', marginTop: '4px' }}>
                                <Tag 
                                  color={
                                    currentPatient.priority === 'urgent' ? 'red' : 
                                    currentPatient.priority === 'high' ? 'orange' : 'blue'
                                  }
                                  style={{ marginLeft: 0 }}
                                >
                                  {currentPatient.priority.toUpperCase()}
                                </Tag>
                              </Text>
                            </div>
                          </Card>
                        </Col>
                        <Col xs={24} md={16}>
                          <Form form={form} layout="vertical" onFinish={onFinish}>
                            <Card
                              title={<span style={{ fontWeight: 500 }}>Medical Examination</span>}
                              style={{ borderRadius: '8px', marginBottom: '24px' }}
                            >
                              <Form.Item 
                                label="Symptoms" 
                                name="symptoms" 
                                rules={[{ required: true, message: 'Please describe symptoms' }]}
                              >
                                <Input.TextArea 
                                  rows={3} 
                                  placeholder="Describe symptoms" 
                                  style={{ borderRadius: '6px' }}
                                />
                              </Form.Item>
                              <Form.Item 
                                label="Diagnosis" 
                                name="diagnosis" 
                                rules={[{ required: true, message: 'Please provide diagnosis' }]}
                              >
                                <Input.TextArea 
                                  rows={3} 
                                  placeholder="Diagnosed condition" 
                                  style={{ borderRadius: '6px' }}
                                />
                              </Form.Item>
                              <Form.Item 
                                label="Prescription" 
                                name="prescribedMedication" 
                                rules={[{ required: true, message: 'Please prescribe medication' }]}
                              >
                                <Input.TextArea 
                                  rows={3} 
                                  placeholder="Prescribed medication" 
                                  style={{ borderRadius: '6px' }}
                                />
                              </Form.Item>
                              <Form.Item 
                                label="Notes" 
                                name="notes"
                              >
                                <Input.TextArea 
                                  rows={2} 
                                  placeholder="Additional notes" 
                                  style={{ borderRadius: '6px' }}
                                />
                              </Form.Item>
                            </Card>
                            <Form.Item>
                              <Button 
                                type="primary" 
                                htmlType="submit"
                                size="large"
                                style={{ 
                                  borderRadius: '6px',
                                  marginRight: '12px',
                                  width: '200px'
                                }}
                                loading={isSaving}
                              >
                                Save & Next
                              </Button>
                              <Button 
                                size="large"
                                onClick={() => setActiveTab('queue')}
                                style={{ borderRadius: '6px' }}
                              >
                                Back to Queue
                              </Button>
                            </Form.Item>
                          </Form>
                        </Col>
                      </Row>
                    </Card>
                  </Col>
                </Row>
              ) : (
                <Row gutter={[24, 24]}>
                  <Col span={24}>
                    <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                      <Col xs={24} sm={12} lg={8}>
                        <Card 
                          bordered={false}
                          style={{ borderRadius: '12px' }}
                        >
                          <Statistic
                            title="Total Patients Today"
                            value={stats.totalToday}
                            prefix={<TeamOutlined />}
                            valueStyle={{ color: '#6366F1', fontSize: '28px' }}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} sm={12} lg={8}>
                        <Card 
                          bordered={false}
                          style={{ borderRadius: '12px' }}
                        >
                          <Statistic
                            title="Waiting"
                            value={stats.waiting}
                            prefix={<ClockCircleOutlined />}
                            valueStyle={{ color: '#F59E0B', fontSize: '28px' }}
                          />
                        </Card>
                      </Col>
                      <Col xs={24} sm={12} lg={8}>
                        <Card 
                          bordered={false}
                          style={{ borderRadius: '12px' }}
                        >
                          <Statistic
                            title="Completed"
                            value={stats.completed}
                            prefix={<CheckCircleOutlined />}
                            valueStyle={{ color: '#10B981', fontSize: '28px' }}
                          />
                        </Card>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24} style={{ textAlign: 'center', marginTop: '24px' }}>
                    <Button 
                      type="primary" 
                      size="large"
                      onClick={handleNextPatient}
                      style={{ 
                        width: '300px',
                        height: '48px',
                        borderRadius: '8px',
                        fontWeight: 500
                      }}
                    >
                      Get Next Patient
                    </Button>
                  </Col>
                </Row>
              )}
            </div>
          )}
        </Content>
      </Layout>

      {/* Chatbot UI */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        width: '350px',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {isChatOpen && (
          <Card
            title={
              <Space>
                <MessageOutlined />
                <span>MediBot Assistant</span>
                {isSendingMessage && (
                  <Spin size="small" />
                )}
              </Space>
            }
            headStyle={{ background: '#6366F1', color: 'white' }}
            bodyStyle={{ padding: 0 }}
            style={{
              borderRadius: '12px 12px 0 0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              height: '400px',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              background: '#f9fafb'
            }}>
              <List
                dataSource={chatMessages}
                renderItem={(item) => (
                  <div style={{
                    marginBottom: '12px',
                    textAlign: item.sender === 'You' ? 'right' : 'left'
                  }}>
                    <div style={{
                      display: 'inline-block',
                      padding: '8px 12px',
                      borderRadius: item.sender === 'You' 
                        ? '12px 12px 0 12px' 
                        : '12px 12px 12px 0',
                      background: item.sender === 'You' 
                        ? '#6366F1' 
                        : '#e5e7eb',
                      color: item.sender === 'You' ? 'white' : 'black',
                      maxWidth: '80%'
                    }}>
                      <div style={{ fontWeight: 'bold' }}>{item.sender}</div>
                      <div>{item.text}</div>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        color: item.sender === 'You' 
                          ? 'rgba(255,255,255,0.7)' 
                          : 'rgba(0,0,0,0.5)',
                        marginTop: '4px'
                      }}>
                        {item.timestamp}
                      </div>
                    </div>
                  </div>
                )}
              />
              <div ref={chatEndRef} />
            </div>
            <div style={{
              padding: '12px',
              borderTop: '1px solid #f0f0f0',
              background: 'white'
            }}>
              <Space.Compact style={{ width: '100%' }}>
                <TextArea
                  placeholder="Type your message..."
                  autoSize={{ minRows: 1, maxRows: 3 }}
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  style={{ borderRadius: '6px 0 0 6px' }}
                  disabled={isSendingMessage}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  onClick={handleSendMessage}
                  style={{ borderRadius: '0 6px 6px 0' }}
                  disabled={!messageInput.trim() || isSendingMessage}
                  loading={isSendingMessage}
                />
              </Space.Compact>
            </div>
          </Card>
        )}
        <Button
          type="primary"
          shape="circle"
          size="large"
          icon={<MessageOutlined />}
          onClick={() => setIsChatOpen(!isChatOpen)}
          style={{
            alignSelf: 'flex-end',
            marginTop: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
          }}
        />
      </div>

      {/* Profile Modal */}
      <Modal
        title="User Profile"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button key="close" onClick={handleModalCancel}>
            Close
          </Button>
        ]}
      >
        <div style={{ marginBottom: '16px' }}>
          <Text strong>Name:</Text>
          <Text style={{ display: 'block' }}>{getRole?.fullName}</Text>
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Text strong>Role:</Text>
          <Text style={{ display: 'block' }}>
            <Tag color={getRole?.role === 'DOCTOR' ? 'blue' : 'green'}>
              {getRole?.role === 'DOCTOR' ? 'Doctor' : 'Clinician'}
            </Tag>
          </Text>
        </div>
        <div>
          <Text strong>Email:</Text>
          <Text style={{ display: 'block' }}>{getRole?.email}</Text>
        </div>
      </Modal>
    </Layout>
  );
}