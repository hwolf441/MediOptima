import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Form,
  Input,
  Card,
  Row,
  Col,
  Statistic,
  Radio,
  Table,
  Tag,
  Modal,
  notification,
  Spin,
  Typography,
} from "antd";
import React, { useState, useEffect } from "react";
import {
  UserOutlined,
  BellOutlined,
  DashboardOutlined,
  LogoutOutlined,
  TeamOutlined,
  UserAddOutlined,
  LockOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MedicineBoxOutlined,
  ShoppingCartOutlined,
  DesktopOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Chart from "react-apexcharts";
import { toast } from "react-toastify";
import { staffApi } from "../../services/api/";

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

export default function AdminPage() {
  // Authentication and navigation
  const { getRole, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // State management
  const [activeTab, setActiveTab] = useState("dashboard");
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [collapsed, setCollapsed] = useState(false);

  // Check admin role from token
  useEffect(() => {
    if (getRole() !== "ADMIN") {
      navigate("/unauthorized");
    }
  }, [getRole, navigate]);

  const {
    data: staffData = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["staff"],
    queryFn: () => staffApi.getStaffList(),
    staleTime: 5 * 60 * 1000,
    retry: 2,
    onError: (error) => {
      toast.error(error.message || "Failed to fetch staff data");
    },
  });

  // Mutations with token
  const { mutate: createStaff, isLoading: isCreating } = useMutation({
    mutationFn: (staffData) => staffApi.createStaff(staffData),
    onSuccess: () => {
      queryClient.invalidateQueries(["staff"]);
      notification.success({
        message: "Staff member created successfully!",
        placement: "topRight",
      });
      form.resetFields();
    },
    onError: (error) => {
      notification.error({
        message: "Failed to create staff",
        description: error.message,
        placement: "topRight",
      });
    },
  });

  const { mutate: updateStatus, isLoading: isUpdating } = useMutation({
    mutationFn: ({ staffId, isActive, reason }) =>
      staffApi.updateStaffStatus(staffId, { isActive, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries(["staff"]);
      notification.success({
        message: "Staff status updated!",
        placement: "topRight",
      });
      setIsModalOpen(false);
    },
    onError: (error) => {
      notification.error({
        message: "Update failed",
        description: error.message,
        placement: "topRight",
      });
    },
  });

  // Handlers
  const handleStatusChange = (staffId, isActive, reason = "") => {
    updateStatus({ staffId, isActive, reason });
  };

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

  // Data processing for charts
  const chartData = staffData?.reduce(
    (acc, staff) => {
      const role = staff?.role?.toLowerCase() || "other";
      if (role in acc) {
        acc[role]++;
      }
      return acc;
    },
    {
      doctor: 0,
      clinician: 0,
      procurement: 0,
      receptionist: 0,
      admin: 0,
      other: 0,
    }
  );

  const chartOptions = {
    chart: {
      type: "donut",
      height: 350,
    },
    labels: [
      "Doctors",
      "Clinicians",
      "Procurement",
      "Receptionists",
      "Admins",
      "Others",
    ],
    colors: ["#6366F1", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#64748B"],
  };

  const chartSeries = chartData
    ? [
        chartData.doctor,
        chartData.clinician,
        chartData.procurement,
        chartData.receptionist,
        chartData.admin,
        chartData.other,
      ]
    : [0, 0, 0, 0, 0, 0];

  // Menu items
  const menuItems = [
    {
      key: "dashboard",
      icon: <DashboardOutlined style={{ fontSize: "18px" }} />,
      label: "Dashboard",
    },
    {
      key: "staff",
      icon: <TeamOutlined style={{ fontSize: "18px" }} />,
      label: "Staff Management",
    },
    {
      key: "doctors",
      icon: <MedicineBoxOutlined style={{ fontSize: "18px" }} />,
      label: "Doctors",
    },
    {
      key: "procurement",
      icon: <ShoppingCartOutlined style={{ fontSize: "18px" }} />,
      label: "Procurement",
    },
    {
      key: "reception",
      icon: <DesktopOutlined style={{ fontSize: "18px" }} />,
      label: "Reception",
    },
  ];

  const userMenuItems = [
    {
      key: "profile",
      label: "Profile",
    },
    {
      key: "settings",
      label: "Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      danger: true,
      onClick: handleLogout,
    },
  ];

  // Table columns
  const columns = [
    {
      title: "Name",
      dataIndex: "fullName",
      key: "name",
      render: (text) => (
        <span style={{ fontWeight: 500 }}>{text || "N/A"}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => text || "N/A",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (text) => {
        if (!text) return "N/A";
        return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
      },
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "status",
      render: (isActive) => {
        if (typeof isActive !== "boolean") {
          return <Tag color="default">UNKNOWN</Tag>;
        }
        return (
          <Tag color={isActive ? "green" : "red"}>
            {isActive ? "ACTIVE" : "INACTIVE"}
          </Tag>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div>
          {record.isActive ? (
            <Button
              danger
              icon={<LockOutlined />}
              onClick={() => {
                setSelectedStaff(record);
                setIsModalOpen(true);
              }}
              loading={isUpdating && selectedStaff?.staffId === record.id}
            >
              Suspend
            </Button>
          ) : (
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              onClick={() => handleStatusChange(record.staffId, true)}
              loading={isUpdating && selectedStaff?.staffId === record.id}
            >
              Activate
            </Button>
          )}
        </div>
      ),
    },
  ];

  // Loading and error states
  if (isLoading)
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

  if (isError)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Card title="Error" variant="borderless">
          <p>{error.message}</p>
          <Button type="primary" onClick={() => window.location.reload()}>
            Retry
          </Button>
        </Card>
      </div>
    );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        width={280}
        style={{
          boxShadow: "2px 0 8px 0 rgba(29, 35, 41, 0.05)",
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
        }}
      >
        <div
          className="logo"
          style={{
            color: "#6366F1",
            textAlign: "center",
            padding: "16px",
            fontSize: collapsed ? "20px" : "24px",
            fontWeight: "bold",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {collapsed ? "MO" : "Sanusvelle"}
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[activeTab]}
          onSelect={({ key }) => setActiveTab(key)}
          style={{ borderRight: 0 }}
          items={menuItems}
        />
      </Sider>

      <Layout style={{ marginLeft: collapsed ? 80 : 280 }}>
        <Header
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 1px 4px 0 rgba(0, 21, 41, 0.12)",
            position: "sticky",
            top: 0,
            zIndex: 1,
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <Title level={4} style={{ margin: 0 }}>
              Admin Dashboard
            </Title>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Dropdown
              menu={{
                items: userMenuItems,
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  cursor: "pointer",
                }}
              >
                <Avatar
                  style={{ backgroundColor: "#6366F1" }}
                  icon={<UserOutlined />}
                />
                {!collapsed && <span>Admin</span>}
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            background: "#fff",
            minHeight: "calc(100vh - 112px)",
          }}
        >
          {activeTab === "dashboard" ? (
            <>
              <Row gutter={[24, 24]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Total Staff"
                      value={staffData?.length || 0}
                      prefix={<TeamOutlined />}
                      valueStyle={{ color: "#6366F1" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Active Staff"
                      value={
                       
                          staffData?.filter((s) => s.isActive === true).length || 0
                      }
                      prefix={<CheckCircleOutlined />}
                      valueStyle={{ color: "#10B981" }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={6}>
                  <Card>
                    <Statistic
                      title="Suspended Staff"
                      value={
                        
                          staffData?.filter((s) => s.isActive === false).length || 0
                      }
                      prefix={<CloseCircleOutlined />}
                      valueStyle={{ color: "#EF4444" }}
                    />
                  </Card>
                </Col>
              </Row>

              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <Card
                    title="Staff Distribution"
                    variant="borderless"
                    style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}
                  >
                    <Chart
                      options={chartOptions}
                      series={chartSeries}
                      type="donut"
                      height={350}
                    />
                  </Card>
                </Col>
              </Row>
            </>
          ) : activeTab === "staff" ? (
            <>
              <Card
                title="Register New Staff"
                style={{
                  width: "100%",
                  marginBottom: 24,
                  boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)",
                }}
              >
                <Form form={form} layout="vertical" onFinish={createStaff}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Staff ID"
                        name="staffId"
                        rules={[
                          {
                            required: true,
                            message: "Please enter staff ID!",
                          },
                        ]}
                      >
                        <Input placeholder="Enter staff ID" size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Username"
                        name="username"
                        rules={[
                          {
                            required: true,
                            message: "Please enter username!",
                          },
                        ]}
                      >
                        <Input placeholder="Enter username" size="large" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Full Name"
                        name="fullName"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Enter full name" size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: "email" }]}
                      >
                        <Input placeholder="Enter email" size="large" />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Phone Number"
                        name="phoneNumber"
                        rules={[{ required: true }]}
                      >
                        <Input placeholder="Enter phone number" size="large" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Role"
                        name="role"
                        rules={[{ required: true }]}
                      >
                        <Radio.Group size="large">
                          <Radio.Button value="DOCTOR">Doctor</Radio.Button>
                          <Radio.Button value="CLINICIAN">
                            Clinician
                          </Radio.Button>
                          <Radio.Button value="PROCUREMENT">
                            Procurement
                          </Radio.Button>
                          <Radio.Button value="RECEPTIONIST">
                            Receptionist
                          </Radio.Button>
                          <Radio.Button value="ADMIN">Admin</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                    </Col>
                  </Row>

                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                          { required: true, message: "Please enter password!" },
                        ]}
                      >
                        <Input.Password
                          placeholder="Enter password"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Confirm Password"
                        name="confirmPassword"
                        dependencies={["password"]}
                        rules={[
                          {
                            required: true,
                            message: "Please confirm password!",
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("password") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject("Passwords do not match!");
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          placeholder="Confirm password"
                          size="large"
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      icon={<UserAddOutlined />}
                      style={{ marginRight: 12 }}
                      loading={isCreating}
                    >
                      Create Staff Account
                    </Button>
                  </Form.Item>
                </Form>
              </Card>

              <Card
                title="Staff Members"
                variant="borderless"
                style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.03)" }}
              >
                <Table
                  columns={columns}
                  dataSource={staffData}
                  rowKey="id"
                  pagination={{ pageSize: 10 }}
                />
              </Card>
            </>
          ) : (
            <Card style={{ minHeight: 300 }}>
              <Title level={4} style={{ textAlign: "center" }}>
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}{" "}
                Management
              </Title>
              <p style={{ textAlign: "center" }}>
                This section is under development
              </p>
            </Card>
          )}
        </Content>
      </Layout>

      <Modal
  title={`Suspend ${selectedStaff?.fullName}`}
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  footer={[
    <Button key="back" onClick={() => setIsModalOpen(false)}>
      Cancel
    </Button>,
    <Button
      key="submit"
      type="primary"
      danger
      onClick={() => {
        const reason = document.getElementById("suspensionReason").value;
        if (!reason) {
          notification.warning({
            message: "Reason required",
            description: "Please provide a reason for suspension",
            placement: "topRight",
          });
          return;
        }
        handleStatusChange(selectedStaff.staffId, false, reason);
      }}
      loading={isUpdating}
    >
      Suspend Staff
    </Button>,
  ]}
>
  <Form layout="vertical">
    <Form.Item label="Reason for Suspension" required>
      <Input.TextArea
        id="suspensionReason"
        rows={4}
        placeholder="Enter reason for suspending this staff member"
      />
    </Form.Item>
  </Form>
</Modal>
    </Layout>
  );
}
