import React, { FC } from "react";
import styles from "@/styles/Dashboard.module.scss";
import { Button, Dropdown, MenuProps, Table, Tabs, TabsProps, Tag } from "antd";
import SvgIcons from "@/components/SvgIcons";
import Layout2 from "@/components/Layout2/Layout2";
import { useSession } from "next-auth/react";

const EnrolledCourseList: FC = () => {
  const dropdownMenu: MenuProps["items"] = [
    {
      key: "1",
      label: "Edit",
    },
    {
      key: "2",
      label: "Block",
    },
    {
      key: "3",
      label: "Delete",
    },
  ];

  const columns: any = [
    {
      title: "NAME",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "EMAIL",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "ROLES",
      dataIndex: "roles",
      align: "center",
      render: (_: any, { roles }: any) => (
        <>
          {roles.map((role: any) => {
            return <Tag key={role}>{role.toUpperCase()}</Tag>;
          })}
        </>
      ),
      key: "roles",
    },
    {
      title: "DATE JOINED",
      align: "center",
      dataIndex: "dateJoined",
      key: "dateJoined",
    },
    {
      title: "LAST ACTIVITY",
      align: "center",
      dataIndex: "lastActivity",
      key: "activity",
    },
    {
      title: "ACTIONS",
      align: "center",
      dataIndex: "actions",
      render: (_: any, user: any) => (
        <>
          <Dropdown menu={{ items: dropdownMenu }} placement="bottomRight" arrow={{ pointAtCenter: true }}>
            {SvgIcons.threeDots}
          </Dropdown>
        </>
      ),
      key: "actions",
    },
  ];

  const data = [
    {
      key: "1",
      name: "John Brown",
      email: "abc@gmail.com",
      roles: ["Learner", "Admin"],
      dateJoined: "22nd Sep, 2023",
      lastActivity: "4d ago",
      actions: "25% Completed",
    },
    {
      key: "2",
      name: "Arjun",
      email: "xyz@gmail.com",
      roles: ["Learner"],
      dateJoined: "15th Jul, 2023",
      lastActivity: "4d ago",
      actions: "21% Completed",
    },
    {
      key: "3",
      name: "Joe Black",
      email: "joe@gmail.com",
      roles: ["Learner", "Educator"],
      dateJoined: "2nd Aug, 2023",
      lastActivity: "4d ago",
      actions: "50% Completed",
    },
  ];

  return <Table size="small" className="users_table" columns={columns} dataSource={data} />;
};

const Users: FC = () => {
  const { data: user } = useSession();

  const onChange = (key: string) => {
    console.log(key);
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Active Users",
      children: <EnrolledCourseList />,
    },
    {
      key: "2",
      label: "Inactive Users",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "Banned Users",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <Layout2>
      <section className={styles.dashboard_content}>
        <h2>Hello {user?.user?.name}</h2>
        <h3>Users</h3>
        <Tabs
          tabBarGutter={60}
          tabBarStyle={{
            borderColor: "gray",
          }}
          tabBarExtraContent={
            <Button type="primary" className={styles.add_user_btn}>
              <span>Add User</span>
              {SvgIcons.arrowRight}
            </Button>
          }
          defaultActiveKey="1"
          items={items}
          onChange={onChange}
        />
      </section>
    </Layout2>
  );
};

export default Users;
