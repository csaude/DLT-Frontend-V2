import React, { useEffect, useState } from "react";
import { Title } from "@app/components";
import { add, edit, allDistrict } from "@app/utils/district";
import { allProvinces } from "@app/utils/locality";
import { Badge, Button, Card, Form, Input, message, Space, Table } from "antd";
import Highlighter from "react-highlight-words";
import { SearchOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import DistrictForm from "./components/DistrictForm";

const DistrictList: React.FC = () => {
  const [districts, setDistricts] = useState<any[]>([]);
  const [province, setProvince] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [districtModalVisible, setDistrictModalVisible] =
    useState<boolean>(false);
  const [selectedDistrict, setSelectedDistrict] = useState<any>(undefined);
  const [form] = Form.useForm();

  let searchInput;
  useEffect(() => {
    const fetchData = async () => {
      const districts = await allDistrict();
      const sortedDistricts = districts.sort(
        (ser1, ser2) => ser2.code - ser1.code
      );

      const provinces = await allProvinces();

      setDistricts(sortedDistricts);
      setProvince(provinces);
    };

    fetchData().catch((error) => console.log(error));
  }, []);

  const districtSort = (data: any) => {
    const dists = [...districts, data];
    const sortedDistricts = dists.sort((ser1, ser2) => ser2.code - ser1.code);

    setDistricts(sortedDistricts);
  };

  const handleDistrictModalVisible = (flag?: boolean) => {
    form.resetFields();
    setSelectedDistrict(undefined);
    setDistrictModalVisible(!!flag);
  };

  const onEditDistrict = (record: any) => {
    form.resetFields();
    setSelectedDistrict(record);
    setDistrictModalVisible(true);
  };

  const handleAdd = () => {
    form
      .validateFields()
      .then(async (values) => {
        const district: any = selectedDistrict ? selectedDistrict : {};

        district.code = values.code;
        district.name = values.name;
        district.status = values.status;
        district.province = { id: values.province };

        if (selectedDistrict === undefined) {
          district.status = 1;
          district.createdBy = localStorage.user;

          const result = districts.some(
            (district) =>
              district.name.replace(/\s+/g, "").toLowerCase() ===
              values.name.replace(/\s+/g, "").toLowerCase()
          );
          if (result) {
            message.error({
              content: " Distrito repetido.",
              className: "custom-class",
              style: {
                marginTop: "10vh",
              },
            });
          } else {
            const { data } = await add(district);
            districtSort(data);

            message.success({
              content: "Registado com Sucesso!",
              className: "custom-class",
              style: {
                marginTop: "10vh",
              },
            });

            handleDistrictModalVisible(false);
          }
        } else {
          district.updatedBy = localStorage.user;

          const { data } = await edit(district);
          setDistricts((existingItems) => {
            return existingItems.map((item) => {
              return item.id === selectedDistrict.id ? data : item;
            });
          });

          message.success({
            content: "Actualizado com Sucesso!",
            className: "custom-class",
            style: {
              marginTop: "10vh",
            },
          });
          handleDistrictModalVisible(false);
        }
      })
      .catch(() => {
        message.error({
          content: "Não foi possível Registar o Distrito",
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
    render: (value) =>
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
      title: "Código do Distrito",
      dataIndex: "serviceType",
      key: "type",
      render: (text, record) => record?.code,
    },
    {
      title: "Nome do Distrito",
      dataIndex: "name",
      key: "type",
      ...getColumnSearchProps("name"),
      render: (text, record) => record?.name,
    },
    {
      title: "Província",
      dataIndex: "name",
      key: "type",
      render: (text, record) => record?.province?.name,
      filters: filterItem(province)((i) => i.name),
      onFilter: (value, record) => record?.province?.name == value,
      filterSearch: true,
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
            onClick={() => onEditDistrict(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title />
      <Card
        title="Lista de Distritos"
        bordered={false}
        headStyle={{ color: "#17a2b8" }}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleDistrictModalVisible(true)}
            >
              Adicionar Distrito
            </Button>
          </Space>
        }
      >
        <Table
          rowKey="id"
          columns={columns}
          dataSource={districts}
          bordered
        ></Table>
      </Card>
      <DistrictForm
        form={form}
        district={selectedDistrict}
        modalVisible={districtModalVisible}
        handleModalVisible={handleDistrictModalVisible}
        handleAdd={handleAdd}
      />
    </>
  );
};

export default DistrictList;
