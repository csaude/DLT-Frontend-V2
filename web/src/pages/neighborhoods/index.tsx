import React, { useEffect, useState } from "react";
import { Title } from "@app/components";
import {
  Badge,
  Button,
  Card,
  ConfigProvider,
  Form,
  Input,
  Space,
  Table,
  message,
} from "antd";
import Highlighter from "react-highlight-words";
import { EditOutlined, SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { add, allNeighborhoods, edit } from "@app/utils/neighborhoods";
import { useSelector } from "react-redux";
import ptPT from "antd/lib/locale-provider/pt_PT";
import NeighborhoodForm from "./components/NeighborhoodForm";

const NeighborhoodsList: React.FC = () => {
  const [neighborhoods, setNeighborhoods] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [selectedNeighborhood, setSelectedNeighborhood] =
    useState<any>(undefined);
  const [form] = Form.useForm();

  const districtsSelector = useSelector(
    (state: any) => state?.district.loadedDistricts
  );
  const localitiesSelector = useSelector(
    (state: any) => state?.locality?.loadedLocalities
  );

  let searchInput;
  useEffect(() => {
    const fetchData = async () => {
      const neighborhoods = await allNeighborhoods();
      const sortedNeighborhoods = neighborhoods.sort((n1, n2) => n2.id - n1.id);
      setNeighborhoods(sortedNeighborhoods);
    };

    fetchData().catch((error) => console.log(error));

    const sortedDistricts = districtsSelector?.sort((dist1, dist2) =>
      dist1?.name.localeCompare(dist2.name)
    );
    const sortedLocalities = localitiesSelector?.sort((loc1, loc2) =>
      loc1?.name.localeCompare(loc2.name)
    );

    setDistricts(sortedDistricts);
    setLocalities(sortedLocalities);
  }, []);

  const neighborhoodsSort = (data: any) => {
    const neighborhood = [...neighborhoods, data];
    const sortedNeighborhoods = neighborhood.sort(
      (ser1, ser2) => ser2.id - ser1.id
    );
    setNeighborhoods(sortedNeighborhoods);
  };

  const handleModalVisible = (flag?: boolean) => {
    form.resetFields();
    setModalVisible(!!flag);
    setSelectedNeighborhood(undefined);
  };

  const onEditNeighborhood = (record: any) => {
    form.resetFields();
    setSelectedNeighborhood(record);
    setModalVisible(true);
  };

  const filterObjects = (data) => (formatter) =>
    data?.map((item) => ({
      text: formatter(item),
      value: formatter(item),
    }));

  const handleAdd = () => {
    form
      .validateFields()
      .then(async (values) => {
        const neighborhood: any = selectedNeighborhood
          ? selectedNeighborhood
          : {};

        neighborhood.name = values.name;
        neighborhood.description = values.description;
        // neighborhood.latitude = values.latitude;
        // neighborhood.longitude = values.longitude;
        neighborhood.locality = { id: values.locality };
        neighborhood.us = { id: values.us };
        neighborhood.status = values.status;

        if (selectedNeighborhood === undefined) {
          neighborhood.status = 1;
          neighborhood.createdBy = localStorage.user;

          const result = neighborhoods.some(
            (neighborhoods) =>
              neighborhoods.name.replace(/\s+/g, "").toLowerCase() ===
                values.name.replace(/\s+/g, "").toLowerCase() &&
              neighborhoods.locality.id == values.locality
          );
          if (result) {
            message.error({
              content: "Bairro Residencial repetido.",
              className: "custom-class",
              style: {
                marginTop: "10vh",
              },
            });
          } else {
            const { data } = await add(neighborhood);
            neighborhoodsSort(data);

            message.success({
              content: "Registado com Sucesso!",
              className: "custom-class",
              style: {
                marginTop: "10vh",
              },
            });
            handleModalVisible(false);
          }
        } else {
          neighborhood.updatedBy = localStorage.user;

          const { data } = await edit(neighborhood);
          setNeighborhoods((existingItems) => {
            return existingItems.map((item) => {
              return item.id === selectedNeighborhood.id ? data : item;
            });
          });

          message.success({
            content: "Actualizado com Sucesso!",
            className: "custom-class",
            style: {
              marginTop: "10vh",
            },
          });
          handleModalVisible(false);
        }
      })
      .catch((error) => {
        console.log(error);
        message.error({
          content: "Não foi possível Registar o Bairro Residencial",
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
            icon={<SearchOutlined rev={undefined} />}
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
      <SearchOutlined
        style={{ color: filtered ? "#1890ff" : undefined }}
        rev={undefined}
      />
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
      title: "Distrito",
      dataIndex: "district",
      key: "district",
      render: (text, record) => record.locality?.district.name,
      filters: filterObjects(districts)((i) => i?.name),
      onFilter: (value, record) => record.locality?.district.name == value,
      filterSearch: true,
    },
    {
      title: "Posto Administrativo",
      dataIndex: "locality",
      key: "locality",
      render: (text, record) => record?.locality?.name,
      filters: filterObjects(localities)((i) => i?.name),
      onFilter: (value, record) => record.locality?.name == value,
      filterSearch: true,
    },
    {
      title: "Nome do Bairro",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (text, record) => record?.name,
    },
    {
      title: "US mais Próxima",
      dataIndex: "us",
      key: "us",
      render: (text, record) => record?.us?.name,
    },
    {
      title: "Observação",
      dataIndex: "remarks",
      key: "remarks",
      render: (text, record) => record?.description,
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
            icon={<EditOutlined rev={undefined} />}
            onClick={() => onEditNeighborhood(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title />
      <Card
        title="Lista de Bairros Residenciais"
        bordered={false}
        headStyle={{ color: "#17a2b8" }}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined rev={undefined} />}
              onClick={() => handleModalVisible(true)}
            >
              Adicionar Bairro Residencial
            </Button>
          </Space>
        }
      >
        <ConfigProvider locale={ptPT}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={neighborhoods}
            bordered
          ></Table>
        </ConfigProvider>
      </Card>
      <NeighborhoodForm
        form={form}
        neighborhood={selectedNeighborhood}
        modalVisible={modalVisible}
        handleModalVisible={handleModalVisible}
        handleAdd={handleAdd}
      />
    </>
  );
};

export default NeighborhoodsList;
