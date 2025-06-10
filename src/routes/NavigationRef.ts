import {
  createNavigationContainerRef,
  CommonActions,
} from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function navigate(params: any = {}) {
  if (navigationRef.isReady()) {
    navigationRef.navigate(params);
  }
}

export function resetTo(name: string) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: name,
          },
        ],
      })
    );
  }
}
