type WisteriaConfig = {
  window: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  buffer: {
    content: string;
  };
};

type ApiMessage = {
  readConfig: [{}, WisteriaConfig];
  saveConfig: [WisteriaConfig, {}];
};

type ApiActions = keyof ApiMessage;
type ApiRequest<T extends ApiActions> = ApiMessage[T][0];
type ApiResponse<T extends ApiActions> = ApiMessage[T][1];
