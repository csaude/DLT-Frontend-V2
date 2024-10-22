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
import Highlighter from "react-highlight-words";
import { SearchOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import UsForm from "./components/UsForm";
import { allUs, add, edit } from "@app/utils/uSanitaria";
import { useSelector } from "react-redux";
import ptPT from "antd/lib/locale-provider/pt_PT";
import { query } from "@app/utils/users";
import { MNE_DONOR } from "@app/utils/contants";

const UsList: React.FC = () => {
  const [uss, setUss] = useState<any[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [localities, setLocalities] = useState<any[]>([]);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [usModalVisible, setUsModalVisible] = useState<boolean>(false);
  const [selectedUs, setSelectedUs] = useState<any>(undefined);
  const [form] = Form.useForm();
  const [allowDataEntry, setAllowDataEntry] = useState(true);

  const provincesSelector = useSelector(
    (state: any) => state?.province.loadedProvinces
  );
  const districtsSelector = useSelector(
    (state: any) => state?.district.loadedDistricts
  );
  const localitiesSelector = useSelector(
    (state: any) => state?.locality?.loadedLocalities
  );

  let searchInput;
  useEffect(() => {
    const fetchData = async () => {
      const uss = await allUs();
      const sortedUss = uss.sort((ser1, ser2) => ser2.id - ser1.id);
      setUss(sortedUss);
      const loggedUser = await query(localStorage.user);

      if ([MNE_DONOR].includes(loggedUser.profiles.id)) {
        setAllowDataEntry(false);
      }
    };

    fetchData().catch((error) => console.log(error));

    const sortedProvinces = provincesSelector?.sort((prov1, prov2) =>
      prov1?.name.localeCompare(prov2.name)
    );
    const sortedDistricts = districtsSelector?.sort((dist1, dist2) =>
      dist1?.name.localeCompare(dist2.name)
    );
    const sortedLocalities = localitiesSelector?.sort((loc1, loc2) =>
      loc1?.name.localeCompare(loc2.name)
    );

    setProvinces(sortedProvinces);
    setDistricts(sortedDistricts);
    setLocalities(sortedLocalities);
  }, []);

  const usSort = (data: any) => {
    const us = [...uss, data];
    const sortedUss = us.sort((ser1, ser2) => ser2.id - ser1.id);
    setUss(sortedUss);
  };

  const handleUsModalVisible = (flag?: boolean) => {
    form.resetFields();
    setUsModalVisible(!!flag);
    setSelectedUs(undefined);
  };

  const onEditUs = (record: any) => {
    form.resetFields();
    setSelectedUs(record);
    setUsModalVisible(true);
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
        const us: any = selectedUs ? selectedUs : {};

        us.code = values.code;
        us.name = values.name;
        us.description = values.description;
        us.latitude = values.latitude;
        us.longitude = values.longitude;
        us.locality = { id: values.locality };
        us.usType = { id: values.usType };
        us.status = values.status;

        if (selectedUs === undefined) {
          us.status = 1;
          us.createdBy = localStorage.user;

          const result = uss.some(
            (uss) =>
              uss.name.replace(/\s+/g, "").toLowerCase() ===
                values.name.replace(/\s+/g, "").toLowerCase() &&
              uss.locality.id == values.locality
          );
          if (result) {
            message.error({
              content: " Unidade Sanitária repetida.",
              className: "custom-class",
              style: {
                marginTop: "10vh",
              },
            });
          } else {
            const { data } = await add(us);
            usSort(data);

            message.success({
              content: "Registado com Sucesso!",
              className: "custom-class",
              style: {
                marginTop: "10vh",
              },
            });
            handleUsModalVisible(false);
          }
        } else {
          us.updatedBy = localStorage.user;

          const { data } = await edit(us);
          setUss((existingItems) => {
            return existingItems.map((item) => {
              return item.id === selectedUs.id ? data : item;
            });
          });

          message.success({
            content: "Actualizado com Sucesso!",
            className: "custom-class",
            style: {
              marginTop: "10vh",
            },
          });
          handleUsModalVisible(false);
        }
      })
      .catch((error) => {
        console.log(error);
        message.error({
          content: "Não foi possível Registar o US",
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
      title: "Código da US",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Nome da Us",
      dataIndex: "name",
      key: "name",
      ...getColumnSearchProps("name"),
      render: (text, record) => record?.name,
    },
    {
      title: "Nível da US",
      dataIndex: "usType",
      key: "usType",
      render: (text, record) => record?.usType?.type,
    },
    {
      title: "Província",
      dataIndex: "province",
      key: "province",
      render: (text, record) => record?.locality?.district?.province?.name,
      filters: filterObjects(provinces)((i) => i?.name),
      onFilter: (value, record) =>
        record.locality?.district?.province?.name == value,
      filterSearch: true,
    },
    {
      title: "Nome do Distrito",
      dataIndex: "district",
      key: "district",
      render: (text, record) => record?.locality?.district?.name,
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
            onClick={() => onEditUs(record)}
          />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Title />
      <Card
        title="Lista de Unidades Sanitárias "
        bordered={false}
        headStyle={{ color: "#17a2b8" }}
        extra={
          <Space>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => handleUsModalVisible(true)}
              hidden={!allowDataEntry}
            >
              Adicionar Unidade Sanitária
            </Button>
          </Space>
        }
      >
        <ConfigProvider locale={ptPT}>
          <Table
            rowKey="id"
            columns={columns}
            dataSource={uss}
            bordered
          ></Table>
        </ConfigProvider>
      </Card>
      <UsForm
        form={form}
        us={selectedUs}
        modalVisible={usModalVisible}
        handleModalVisible={handleUsModalVisible}
        handleAdd={handleAdd}
        allowDataEntry={allowDataEntry}
      />
    </>
  );
};

export default UsList;
