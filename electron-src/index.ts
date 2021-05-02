// Native
import { join } from 'path';
import { format } from 'url';
import { Project } from 'models/Project';

// Packages
import {
  BrowserWindow,
  app,
  ipcMain,
  IpcMainEvent,
  IpcMainInvokeEvent,
} from 'electron';
import isDev from 'electron-is-dev';
import prepareNext from 'electron-next';
import installExtension, {
  REACT_DEVELOPER_TOOLS,
} from 'electron-devtools-installer';
import { homedir } from 'os';
import fs from 'fs';
import { dirname } from 'path';
import electron from 'electron';
import {
  ApiActions,
  ApiRequest,
  ApiResponse,
  ProjectConfig,
  WisteriaConfig,
} from 'messages';

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  installExtension(REACT_DEVELOPER_TOOLS)
    .then((name: any) => console.log(`Added Extension:  ${name}`))
    .catch((err: any) => console.log('An error occurred: ', err));

  await prepareNext('./renderer');

  const conf = await readConfig();

  const mainWindow = new BrowserWindow({
    width: conf.window.width,
    height: conf.window.height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      worldSafeExecuteJavaScript: true,
      preload: join(__dirname, 'preload.js'),
    },
  });
  mainWindow.setPosition(conf.window.x, conf.window.y);
  mainWindow.webContents.openDevTools();

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: join(__dirname, '../renderer/out/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  mainWindow.loadURL(url);
});

// Quit the app once all windows are closed
app.on('window-all-closed', app.quit);

// listen the channel `message` and resend the received message to the renderer process
ipcMain.on('message', (event: IpcMainEvent, message: any) => {
  event.sender.send('message', message);
});

ipcMain.handle(
  'message',
  async <T extends ApiActions>(
    _: IpcMainInvokeEvent,
    [action, arg]: [T, ApiRequest<T>],
  ): Promise<ApiResponse<T>> => {
    const a: ApiActions = action;
    switch (a) {
      case 'readConfig':
        return await readConfig();
      case 'saveConfig':
        return await saveConfig(arg as ApiRequest<typeof a>);
      case 'addProject':
        return await openProjectDialog();
      case 'readProjectConfig':
        return await readProjectConfig();
    }
  },
);

const DefaultConfig: WisteriaConfig = {
  window: {
    x: 100,
    y: 100,
    width: 800,
    height: 600,
  },
  buffer: {
    content: '',
  },
};

async function readConfig(): Promise<WisteriaConfig> {
  const home = homedir();
  const confPath = join(home, '.config', 'wisteria', 'config.json');
  const result = await fs.promises
    .readFile(confPath, 'utf8')
    .catch((err: Error) => err);
  if (result instanceof Error) {
    return DefaultConfig;
  }

  return JSON.parse(result);
}

async function saveConfig(config: WisteriaConfig) {
  const home = homedir();
  const confPath = join(home, '.config', 'wisteria', 'config.json');
  await fs.promises
    .mkdir(dirname(confPath), { recursive: true })
    .catch((err: Error) => err);
  await fs.promises
    .writeFile(confPath, JSON.stringify(config, null, 2), 'utf8')
    .catch((err: Error) => err);

  return {};
}

async function openProjectDialog(): Promise<Project | null> {
  const result = await electron.dialog
    .showOpenDialog(null as any, { properties: ['openDirectory'] })
    .catch((err: Error) => err);
  if (result instanceof Error) {
    return null;
  }

  const [dir] = result.filePaths;
  if (dir == null) {
    return null;
  }
  const projects = await readProjectConfig();

  const project = { path: dir };
  await saveProjectConfig({
    ...projects,
    projects: [...projects.projects, project],
  });

  return project;
}

async function readProjectConfig(): Promise<ProjectConfig> {
  const home = homedir();
  const confPath = join(home, '.config', 'wisteria', 'projects.json');

  const result = await fs.promises
    .readFile(confPath, 'utf8')
    .catch((err: Error) => err);
  if (result instanceof Error) {
    return { projects: [] };
  }

  return JSON.parse(result);
}

async function saveProjectConfig(config: ProjectConfig): Promise<void> {
  const home = homedir();
  const confPath = join(home, '.config', 'wisteria', 'projects.json');

  await fs.promises
    .mkdir(dirname(confPath), { recursive: true })
    .catch((err: Error) => err);
  await fs.promises
    .writeFile(confPath, JSON.stringify(config, null, 2), 'utf8')
    .catch((err: Error) => err);
}
