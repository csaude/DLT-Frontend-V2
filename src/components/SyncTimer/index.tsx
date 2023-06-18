import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import { sync } from "../../database/sync";
import { ErrorHandler, SuccessHandler } from "../SyncIndicator";
import { useToast } from "native-base";
import { Context } from "../../routes/DrawerNavigator";
import SpinnerModal from "../Modal/SpinnerModal";

const SyncTimer = () => {
  const toast = useToast();
  const loggedUser: any = useContext(Context);
  const [open, setOpen] = useState(false);
  const title = "Sincronização Automática";
  const message =
    "Aguarde por favor..., Do Momento o aplicativo encontra-se sincronizando com o servidor";

  const executeSync = useCallback(() => {
    sync({ username: loggedUser?.username })
      .then(() =>
        toast.show({
          placement: "top",
          render: () => {
            return <SuccessHandler />;
          },
        })
      )
      .then(() => setOpen(false))
      .catch(() => {
        setOpen(false);
        toast.show({
          placement: "top",
          render: () => {
            return <ErrorHandler />;
          },
        });
      });
  }, []);

  const checkInternetConnection = useCallback(async () => {
    const netInfoState = await NetInfo.fetch();

    if (netInfoState.isConnected) {
      console.log("Conexão à internet disponível!");
      setOpen(true);
      executeSync();
    } else {
      console.log("Sem conexão à internet.");
      setOpen(false);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(checkInternetConnection, 30 * 60 * 1000); // Executa a verificação a cada 30 minutos(para testar pode reduzir para 1 e depois devolver assim que fechar o teste)

    return () => {
      clearInterval(interval); // Limpa o intervalo quando o componente é desmontado
    };
  }, []);

  return (
    <View>
      <SpinnerModal open={open} title={title} message={message} />
    </View>
  );
};

export default memo(SyncTimer);
