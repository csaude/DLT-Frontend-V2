import React, { useEffect, useState } from "react";
import { Title } from "@app/components";
import {
  Badge,
  Button,
  Card,
  ConfigProvider,
  Form,
  Input,
  message,
  Space,
  Table,
} from "antd";
import ptPT from "antd/lib/locale-provider/pt_PT";
import Highlighter from "react-highlight-words";
import { SearchOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import { add, edit, queryAll } from "@app/utils/subservice";
import SubServiceForm from "./components/SubServiceForm";

const SubServicesList: React.FC = () => {
  const [subServices, setSubServices] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [subServiceModalVisible, setSubServiceModalVisible] =
    useState<boolean>(false);
  const [selectedSubService, setSelectedSubService] = useState<any>(undefined);
  const [form] = Form.useForm();

  let searchInput;
  useEffect(() => {
    const fetchData = async () => {
      const subServices = await queryAll();
      const sortedSubServices = subServices.sort((s1, s2) => s2.id - s1.id);
      setSubServices(sortedSubServices);
    };

    fetchData().catch((error) => console.log(error));
  }, []);

  const handleSubServiceModalVisible = (flag?: boolean) => {
    form.resetFields();
    setSelectedSubService(undefined);
    setSubServiceModalVisible(!!flag);
  };

  const onEditSubService = (record: any) => {
    form.resetFields();
    setSelectedSubService(record);
    setSubServiceModalVisible(true);
  };

  const handleAdd = () => {
    form
      .validateFields()
      .then(async (values) => {
        const subService: any = selectedSubService ? selectedSubService : {};

        subService.service = { id: values.service };
        subService.name = values.name;
        subService.remarks = values.remarks;
        subService.mandatory = values.mandatory;

        if (selectedSubService === undefined) {
          subService.createdBy = localStorage.user;
          subService.status = 1;

          const result = subServices.some(
            (subServices) =>
              subServices.name.replace(/\s+/g, "").toLowerCase() ===
                values.name.replace(/\s+/g, "").toLowerCase() &&
              subServices.service.id == values.service
          );
          if (result) {
            message.error({
              content: " Sub-Serviço repetido.",
              className: "custom-class",
              style: {
                marginTop: "10vh",
              },
            });
          } else {
            const { data } = await add(subService);
            const ss = [...subServices, data];
            const sortedSubServices = ss.sort((s1, s2) => s2.id - s1.id);
            setSubServices(sortedSubServices);

            message.success({
              content: "Registado com Sucesso!",
              className: "custom-class",
              style: {
                marginTop: "10vh",
              },
            });
            handleSubServiceModalVisible(false);
          }
        } else {
          subService.updatedBy = localStorage.user;
          subService.status = values.status;
          const { data } = await edit(subService);
          setSubServices((existingItems) => {
            return existingItems.map((item) => {
              return item.id === selectedSubService.id ? data : item;
            });
          });

          message.success({
            content: "Actualizado com Sucesso!",
            className: "custom-class",
            style: {
              marginTop: "10vh",
            },
          });
          handleSubServiceModalVisible(false);
        }
      })
      .catch(() => {
        message.error({
          content: "Não foi possível Registar o Sub-Serviço",
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });
      });
  };

  const filterItem = (data) => (formatter) =>
    data.map((item) => ({
      text: formatter(item),
      value: formatter(item),
    }));

  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={"Pesquisar "}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Pesquisar
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size="small"
            style={{ width: 90 }}
          >
            Limpar
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filtrar
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.select(), 100);
      }
    },
    render: (value, record) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          key={record}
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={value ? value.toString() : ""}
        />
      ) : (
        value
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText(searchText);
  };

  const columns = [
    {
      title: "Serviço",
      dataIndex: "serviceId",
      key: "record.service.id",
      render: (text, record) => record.service.name,
    },
    {
      title: "Sub-Serviço",
      dataIndex: "id",
      key: "id",
      ...getColumnSearchProps("name"),
      render: (text, record) => record.name,
    },
    {
      title: "Mandatório",
      dataIndex: "mandatory",
      key: "mandatory",
      filters: filterItem([0, 1])((i) => i),
      onFilter: (value, record) => record?.mandatory == value,
      render: (text, record) => record.mandatory,
    },
    {
      title: "Observação",
      dataIndex: "remarks",
      key: "remarks",
      ...getColumnSearchProps("remarks"),
      render: (text, record) => record.remarks,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (text, record) => (
        <Badge
          className="site-badge-count-190"
          count={record.status == 1 ? "Activo" : "Inactivo"}
          style={
            record.status == 1
              ? { backgroundColor: "#52c41a" }
              : { backgroundColor: "#f5222d" }
          }
        />
      ),
      filters: [
        {
          text: "Activo",
          value: 1,
        },
        {
          text: "Inactivo",
          value: 0,
        },
      ],
      onFilter: (value, record) => record?.status == value,
      filterSearch: true,
    },
    {
      title: "Acção",
      dataIndex: "",
      key: "x",
      render: (text, record) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => onEditSubService(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title />
      <Card
        title="Lista de Sub-Serviços DREAMS"
        bordered={false}
        headStyle={{ color: "#17a2b8" }}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleSubServiceModalVisible(true)}
            >
              Adicionar Sub-Serviço
            </Button>
          </Space>
        }
      >
        <ConfigProvider locale={ptPT}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={subServices}
            bordered
          />
        </ConfigProvider>
      </Card>
      <SubServiceForm
        form={form}
        subService={selectedSubService}
        modalVisible={subServiceModalVisible}
        handleModalVisible={handleSubServiceModalVisible}
        handleAdd={handleAdd}
      />
    </>
  );
};

export default SubServicesList;
