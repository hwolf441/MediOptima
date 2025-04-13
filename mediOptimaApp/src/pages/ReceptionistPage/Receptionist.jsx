import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Form,
  Input,
  notification,
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Tag,
  Spin,
  Typography,
  Modal,
  Select,
} from "antd";
import {
  UserOutlined,
  BellOutlined,
  DashboardOutlined,
  LogoutOutlined,
  TeamOutlined,
  FileDoneOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { patientApi,userApi } from "../../services/api";
import { dashboardApi } from "../../services/api";
import { toast } from "react-toastify";
import Chart from "react-apexcharts";

const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

export default function ReceptionistDashboard() {
  // Authentication and navigation
  const { getRole, logout } = useAuth();
  const navigate = useNavigate();
  

  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shouldFetch, setShouldFetch] = useState(false);
  

  // Priority options
  const priorityOptions = [
    { value: "normal", label: "Normal" },
    { value: "urgent", label: "Urgent" },
    { value: "emergency", label: "Emergency" },
    { value: "vip", label: "VIP" },
  ];

  // Check receptionist role
  useEffect(() => {
    if (getRole() !== "RECEPTIONIST") {
      navigate("/unauthorized");
    }
  }, [getRole, navigate]);

 // Fetch current user data
 const { data: currentUser } = useQuery({
  queryKey: ["gettingcurrentUser"],
  queryFn: () => userApi.getCurrentUser(),
  staleTime: 1000 * 60 * 60, // 1 hour
  retry: false,
  onError: (error) => {
    console.error('Failed to fetch user data:', error);
  }
});




  // Data fetching with React Query 
  const {
    data: statistics = {
      total: 0,
      waiting: 0,
      inProgress: 0,
      completed: 0,
    },
    isLoading,
  } = useQuery({
    queryKey: ["receptionistStats"],
    queryFn: () => dashboardApi.getReceptionStats(),
    enabled: shouldFetch, // Only fetch when shouldFetch is true
    staleTime: Infinity, // Never stale 
    onError: (error) => {
      toast.error(error.message || "Failed to fetch reception stats");
    },
  });

  const { data: patients = [], isLoading: isLoadingPatients } = useQuery({
    queryKey: ["recentPatients"],
    queryFn: () => dashboardApi.getRecentPatients(),
    enabled: shouldFetch, // Only fetch when shouldFetch is true
    staleTime: Infinity, // Never stale
    onError: (error) => {
      console.error("Recent patients fetch error:", error);
      toast.error(error.message || "Failed to load recent patients");
    },
  });
  // Mutation for registering new patient
  const { mutate: registerPatient, isLoading: isRegistering } = useMutation({
    mutationFn: (patientData) => {
      const payload = {
        ...patientData,

        status: "waiting", // Default status
      };

      return patientApi.registerPatient(payload);
    },
    onSuccess: () => {
      notification.success({
        message: "Patient registered successfully!",
        placement: "topRight",
      });
      form.resetFields();
      setActiveTab("dashboard");
       // Trigger data refresh after successful submission
       setShouldFetch(true);
    },
    onError: (error) => {
      notification.error({
        message: "Registration failed",
        description: error.message,
        placement: "topRight",
      });
    },
  });

  // Logout function
 const handleLogout = async () => {
    try {
      await logout();
      notification.success({
        message: "Logged out successfully!",
        description: "You have been securely signed out.",
        duration: 2,
        placement: "topRight",
        onClose: () => navigate("/", { replace: true }),
      });
    } catch (error) {
      notification.error({
        message: "Logout failed",
        description: error.message,
        duration: 4,
        placement: "topRight",
      });
    }
  };
  

  const showProfileModal = () => {
    setIsModalVisible(true);
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };
  
  // Chart data
  const chartOptions = {
    chart: {
      type: "bar",
      height: 350,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        columnWidth: "60%",
      },
    },
    dataLabels: { enabled: false },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          fontWeight: 500,
        },
      },
    },
    colors: ["#6366F1", "#8B5CF6", "#EC4899"],
    grid: {
      borderColor: "#f0f0f0",
      strokeDashArray: 3,
    },
  };

  const chartSeries = [
    {
      name: "Patients",
      data: patients.dailyTotals || [0, 0, 0, 0, 0, 0, 0],
    },
  ];

 
  if (isLoading || isLoadingPatients) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  return (
    <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
      <Sider
        collapsible
        theme="light"
        width={280}
        style={{
          boxShadow: "2px 0 8px 0 rgba(29, 35, 41, 0.05)",
          background: "#fff",
          position: "fixed",
          height: "100vh",
          zIndex: 1,
        }}
      >
        <div
          style={{
            padding: "24px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Title level={4} style={{ margin: 0, color: "#6366F1" }}>
            Sanusvelle
          </Title>
        </div>

        <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Avatar
              size="large"
              style={{ backgroundColor: "#6366F1" }}
              icon={<UserOutlined />}
            />
            <div style={{ marginLeft: "12px" }}>
              <Text strong>{currentUser?.fullName?.split(" ")[0] || 'User'}</Text>
              <Text
                type="secondary"
                style={{ display: "block", fontSize: "12px" }}
              >
                Receptionist
              </Text>
            </div>
          </div>
        </div>

        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activeTab]}
          onSelect={({ key }) => setActiveTab(key)}
          style={{ borderRight: 0, padding: "8px" }}
        >
          <Menu.Item
            key="dashboard"
            icon={<DashboardOutlined style={{ fontSize: "18px" }} />}
            style={{ borderRadius: "8px", marginBottom: "8px" }}
          >
            Dashboard
          </Menu.Item>
          <Menu.Item
            key="register"
            icon={<FileDoneOutlined style={{ fontSize: "18px" }} />}
            style={{ borderRadius: "8px" }}
          >
            Register Patient
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout style={{ marginLeft: 280 }}>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 4px 0 rgba(0, 21, 41, 0.08)",
            position: "sticky",
            top: 0,
            zIndex: 1,
            height: "64px",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            {activeTab === "dashboard"
              ? "Reception Dashboard"
              : "Register Patient"}
          </Title>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item key="profile" onClick={showProfileModal}>
                    My Profile
                  </Menu.Item>
                  <Menu.Divider />
                  <Menu.Item
                    key="logout"
                    icon={<LogoutOutlined />}
                    onClick={() => {
                     handleLogout(); 
                    }}
                    danger
                  >
                    Logout
                  </Menu.Item>
                </Menu>
              }
              trigger={["click"]}
              placement="bottomRight"
            >
              <Button
                icon={<BellOutlined />}
                shape="circle"
                style={{ border: "none", boxShadow: "none" }}
              />
            </Dropdown>
          </div>
        </Header>

        <Content style={{ margin: "24px", minHeight: "calc(100vh - 112px)" }}>
          {activeTab === "dashboard" ? (
            <>
              <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                  <Card bordered={false} style={{ borderRadius: "12px" }}>
                    <Statistic
                      title="Total Patients Today"
                      value={statistics.total}
                      prefix={<TeamOutlined />}
                      valueStyle={{ color: "#6366F1", fontSize: "28px" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card bordered={false} style={{ borderRadius: "12px" }}>
                    <Statistic
                      title="Waiting"
                      value={statistics.waiting}
                      prefix={<ClockCircleOutlined />}
                      valueStyle={{ color: "#F59E0B", fontSize: "28px" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card bordered={false} style={{ borderRadius: "12px" }}>
                    <Statistic
                      title="In Progress"
                      value={statistics.inProgress}
                      prefix={<FileDoneOutlined />}
                      valueStyle={{ color: "#3B82F6", fontSize: "28px" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card bordered={false} style={{ borderRadius: "12px" }}>
                    <Statistic
                      title="Completed"
                      value={statistics.completed}
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: "#10B981", fontSize: "28px" }}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Card
                    title={
                      <span style={{ fontWeight: 500 }}>
                        Weekly Patient Statistics
                      </span>
                    }
                    bordered={false}
                    style={{ borderRadius: "12px" }}
                  >
                    <Chart
                      options={chartOptions}
                      series={chartSeries}
                      type="bar"
                      height={350}
                    />
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <Card
              title={
                <span style={{ fontWeight: 500 }}>Register New Patient</span>
              }
              style={{
                width: "100%",
                maxWidth: "800px",
                margin: "0 auto",
                borderRadius: "12px",
                boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
              }}
            >
              <Form form={form} layout="vertical" onFinish={registerPatient}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Full Name"
                      name="fullName"
                      rules={[
                        {
                          required: true,
                          message: "Please enter patient name",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Patient's full name"
                        size="large"
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="ID/NEMIS/Birth Cert No"
                      name="idNumber"
                      rules={[
                        {
                          required: true,
                          message: "Please enter identification number",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Identification number"
                        size="large"
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Phone Number"
                      name="phoneNumber"
                      rules={[
                        {
                          required: true,
                          message: "Please enter phone number",
                        },
                        {
                          pattern: new RegExp(/^[0-9]{10}$/),
                          message: "Please enter valid phone number",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Patient's phone number"
                        size="large"
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Guardian/Spouse Number"
                      name="guardianPhone"
                      rules={[
                        {
                          pattern: new RegExp(/^[0-9]{10}$/),
                          message: "Please enter valid phone number",
                        },
                      ]}
                    >
                      <Input
                        placeholder="Alternative contact"
                        size="large"
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Location"
                      name="location"
                      rules={[
                        { required: true, message: "Please enter location" },
                      ]}
                    >
                      <Input
                        placeholder="Residence area"
                        size="large"
                        style={{ borderRadius: "6px" }}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Priority Level"
                      name="priority"
                      rules={[
                        { required: true, message: "Please select priority" },
                      ]}
                      initialValue="normal"
                    >
                      <Select
                        size="large"
                        style={{ borderRadius: "6px" }}
                        placeholder="Select priority level"
                      >
                        {priorityOptions.map((option) => (
                          <Option key={option.value} value={option.value}>
                            {option.label}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {/* New Row for Age and Sex */}
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Age"
                      name="age"
                      rules={[
                        {
                          required: true,
                          message: "Please enter patient's age",
                        },
                        {
                          pattern: new RegExp(/^[0-9]{1,3}$/),
                          message: "Please enter a valid age (1-120)",
                        },
                        () => ({
                          validator(_, value) {
                            if (!value || (value > 0 && value < 121)) {
                              return Promise.resolve();
                            }
                            return Promise.reject(
                              new Error("Age must be between 1-120")
                            );
                          },
                        }),
                      ]}
                    >
                      <Input
                        placeholder="Patient's age"
                        size="large"
                        style={{ borderRadius: "6px" }}
                        type="number"
                        min={1}
                        max={120}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Sex"
                      name="sex"
                      rules={[{ required: true, message: "Please select sex" }]}
                    >
                      <Select
                        size="large"
                        style={{ borderRadius: "6px" }}
                        placeholder="Select sex"
                      >
                        <Option value="Male">Male</Option>
                        <Option value="Female">Female</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{
                      marginRight: "12px",
                      borderRadius: "6px",
                      width: "200px",
                    }}
                    loading={isRegistering}
                  >
                    Register Patient
                  </Button>
                  <Button
                    size="large"
                    onClick={() => setActiveTab("dashboard")}
                    style={{ borderRadius: "6px" }}
                  >
                    Cancel
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}
        </Content>
      </Layout>

     {/* Profile Modal */}
     <Modal
        title="User Profile"
        open={isModalVisible}
        onCancel={handleModalCancel}
        footer={[
          <Button
            key="close"
            onClick={handleModalCancel}
            style={{ borderRadius: "6px" }}
          >
            Close
          </Button>,
        ]}
      >
        {currentUser ? (
          <div>
            <div style={{ marginBottom: "16px" }}>
              <Text strong>Full Name:</Text>
              <Text style={{ display: "block" }}>{currentUser.fullName}</Text>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Text strong>Staff ID:</Text>
              <Text style={{ display: "block" }}>{currentUser.staffId}</Text>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Text strong>Role:</Text>
              <Text style={{ display: "block" }}>
                <Tag color="blue">{currentUser.role}</Tag>
              </Text>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Text strong>Phone Number:</Text>
              <Text style={{ display: "block" }}>{currentUser.phoneNumber}</Text>
            </div>
            <div style={{ marginBottom: "16px" }}>
              <Text strong>Username:</Text>
              <Text style={{ display: "block" }}>{currentUser.username}</Text>
            </div>
            <div>
              <Text strong>Email:</Text>
              <Text style={{ display: "block" }}>{currentUser.email}</Text>
            </div>
          </div>
        ) : (
          <Spin />
        )}
      </Modal>
    </Layout>
  );
}
