import React, { useEffect, useState } from "react";
import { Title } from "@app/components";
import { add, edit, allLocality } from "@app/utils/locality";
import { Badge, Button, Card, Form, Input, message, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import LocalityForm from "./components/LocalityForm";

const LocalityList: React.FC = () => {
  const [locality, setLocality] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [localitiesModalVisible, setLocalitiesModalVisible] =
    useState<boolean>(false);
  const [selectedLocality, setSelectedLocality] = useState<any>(undefined);
  const [form] = Form.useForm();

  let searchInput;
  useEffect(() => {
    const fetchData = async () => {
      const localities = await allLocality();
      const sortedLocalities = localities.sort(
        (ser1, ser2) => ser2.id - ser1.id
      );
      setLocality(sortedLocalities);
    };

    fetchData().catch((error) => console.log(error));
  }, []);

  const handleLocalityModalVisible = (flag?: boolean) => {
    form.resetFields();
    setSelectedLocality(undefined);
    setLocalitiesModalVisible(!!flag);
  };

  const onEditLocality = (record: any) => {
    form.resetFields();
    setSelectedLocality(record);
    setLocalitiesModalVisible(true);
  };

  const handleAdd = () => {
    form
      .validateFields()
      .then(async (values) => {
        const localities: any = selectedLocality ? selectedLocality : {};

        localities.name = values.name;
        localities.description = values.description;
        localities.district = { id: values.district };

        if (selectedLocality === undefined) {
          localities.createdBy = localStorage.user;
          localities.status = 1;

          const result = locality.some(
            (locality) =>
              locality.name.replace(/\s+/g, "").toLowerCase() ===
              values.name.replace(/\s+/g, "").toLowerCase()
          );
          if (result) {
            message.error({
              content: " Posto administrativo repetido.",
              className: "custom-class",
              style: {
                marginTop: "10vh",
              },
            });
          } else {
            const { data } = await add(localities);
            const local = [...locality, data];
            const sortedLocalities = local.sort((l1, l2) => l2.id - l1.id);
            setLocality(sortedLocalities);

            message.success({
              content: "Registado com Sucesso!",
              className: "custom-class",
              style: {
                marginTop: "10vh",
              },
            });
            handleLocalityModalVisible(false);
          }
        } else {
          localities.updatedBy = localStorage.user;
          localities.status = values.status;
          const { data } = await edit(localities);
          setLocality((existingItems) => {
            return existingItems.map((item, j) => {
              return item.id === selectedLocality.id ? data : item;
            });
          });

          message.success({
            content: "Actualizado com Sucesso!",
            className: "custom-class",
            style: {
              marginTop: "10vh",
            },
          });
          handleLocalityModalVisible(false);
        }
      })
      .catch((error) => {
        const errSt = JSON.stringify(error);
        const errObj = JSON.parse(errSt);
        message.error({
          content: "Não foi possível Registar o  Posto Administrativo",
          className: "custom-class",
          style: {
            marginTop: "10vh",
          },
        });
      });
  };

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
            onClick={() =>
              handleReset(clearFilters, selectedKeys, confirm, dataIndex)
            }
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

  const handleReset = (clearFilters, selectedKeys, confirm, dataIndex) => {
    clearFilters();
    setSearchText(searchText);
    handleSearch(selectedKeys, confirm, dataIndex);
  };

  const columns = [
    {
      title: "Nome do Distrito",
      dataIndex: "serviceType",
      key: "type",
      render: (text, record) => record?.district?.name,
    },
    {
      title: "Posto Administrativo",
      dataIndex: "name",
      key: "type",
      ...getColumnSearchProps("name"),
      render: (text, record) => record?.name,
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "type",
      ...getColumnSearchProps("description"),
      render: (text, record) => record?.description,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "type",
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
            onClick={() => onEditLocality(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title />
      <Card
        title="Postos Administrativos"
        bordered={false}
        headStyle={{ color: "#17a2b8" }}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleLocalityModalVisible(true)}
            >
              Adicionar Postos Administrativos
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={locality}
          bordered
        ></Table>
      </Card>
      <LocalityForm
        form={form}
        locality={selectedLocality}
        modalVisible={localitiesModalVisible}
        handleModalVisible={handleLocalityModalVisible}
        handleAdd={handleAdd}
      />
    </>
  );
};

export default LocalityList;
