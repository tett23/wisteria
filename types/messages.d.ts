declare module 'messages' {
  import { Project } from 'models/Project';
  import { CFile } from 'models/CFile';

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

  type ProjectConfig = {
    projects: Project[];
  };

  type ApiMessage = {
    readConfig: [{}, WisteriaConfig];
    saveConfig: [WisteriaConfig, {}];
    addProject: [{}, Project | null];
    readProjectConfig: [{}, ProjectConfig];
    listDirectoryFiles: [string, CFile[]];
  };

  type ApiActions = keyof ApiMessage;
  type ApiRequest<T extends ApiActions> = ApiMessage[T][0];
  type ApiResponse<T extends ApiActions> = ApiMessage[T][1];
}
