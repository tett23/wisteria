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
import { CDirectory, CFile, CDirectoryEntry } from 'models/CFile';
import { WError } from '../models/WError';

electron.protocol.registerSchemesAsPrivileged([
  {
    scheme: 'workers',
    privileges: {
      standard: true,
      secure: true,
      allowServiceWorkers: true,
      supportFetchAPI: true,
      corsEnabled: true,
    },
  },
]);

// Prepare the renderer once the app is ready
app.on('ready', async () => {
  if (isDev) {
    const { default: installExtension, REACT_DEVELOPER_TOOLS } = await import(
      'electron-devtools-installer'
    );
    await installExtension(REACT_DEVELOPER_TOOLS).catch((err: Error) => err);
  }

  await prepareNext('./renderer');

  const conf = await readConfig();

  const session = electron.session.defaultSession;
  session.protocol.registerFileProtocol('workers', (request, callback) => {
    const url = new URL(request.url);

    callback({
      path: join(__dirname, 'workers', url.host),
    });
  });

  const mainWindow = new BrowserWindow({
    width: conf.window.width,
    height: conf.window.height,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      worldSafeExecuteJavaScript: true,
      nativeWindowOpen: true,
      nodeIntegrationInWorker: true,
      preload: join(__dirname, 'preload.js'),
    },
  });
  mainWindow.setPosition(conf.window.x, conf.window.y);
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

  const url = isDev
    ? 'http://localhost:8000/'
    : format({
        pathname: join(__dirname, '../../renderer/out/index.html'),
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
      case 'listDirectoryFiles':
        return listDirectoryFiles(arg as ApiRequest<typeof a>);
      case 'readFile':
        return readFile(arg as ApiRequest<typeof a>);
      case 'writeFile':
        return writeFile(arg as ApiRequest<typeof a>);
      case 'deleteFile':
        return deleteFile(arg as ApiRequest<typeof a>);
      case 'renameFile':
        return renameFile(arg as ApiRequest<typeof a>);
      case 'listDirectory':
        return listDirectory(arg as ApiRequest<typeof a>);
      case 'createDirectory':
        return createDirectory(arg as ApiRequest<typeof a>);
      case 'removeDirectory':
        return removeDirectory(arg as ApiRequest<typeof a>);
      case 'renameDirectory':
        return renameDirectory(arg as ApiRequest<typeof a>);
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
  buffers: {
    current: {
      buffer: null,
      changed: false,
    },
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

  console.log('result', result);

  return await (async () => JSON.parse(result))()
    .catch((err: Error) => err)
    .then(() => DefaultConfig);
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

async function listDirectoryFiles(path: string): Promise<CFile[]> {
  const ps = (await fs.promises.readdir(path, 'utf8')).map(async (item) => {
    const entryPath = join(path, item);
    const stat = await fs.promises.stat(entryPath);
    if (stat.isDirectory()) {
      return [];
    }

    return [
      {
        path: entryPath,
        body: await fs.promises.readFile(entryPath, 'utf8'),
      },
    ];
  });

  return (await Promise.all(ps)).flatMap((v) => v);
}

async function readFile(path: string): Promise<CFile | null> {
  const result = await fs.promises
    .readFile(path, 'utf8')
    .catch((err: Error) => err);
  if (result instanceof Error) {
    return null;
  }

  return {
    path,
    body: result,
  };
}

async function writeFile(file: CFile): Promise<null | WError> {
  const result = await fs.promises
    .writeFile(file.path, file.body, 'utf8')
    .catch((err: Error) => err);
  if (result instanceof Error) {
    return WError.from(result);
  }

  return null;
}

async function deleteFile(path: string): Promise<null | WError> {
  const result = await fs.promises.unlink(path).catch((err: Error) => err);
  if (result instanceof Error) {
    return WError.from(result);
  }

  return null;
}

async function renameFile({
  src,
  dst,
}: {
  src: string;
  dst: string;
}): Promise<null | WError> {
  const result = await fs.promises.rename(src, dst).catch((err: Error) => err);
  if (result instanceof Error) {
    return WError.from(result);
  }

  return null;
}

async function listDirectory(path: string): Promise<CDirectory | WError> {
  const entries = await fs.promises
    .readdir(path, 'utf8')
    .catch((err: Error) => err);
  if (entries instanceof Error) {
    return WError.from(entries);
  }

  const ps = entries.map(
    async (entry): Promise<CDirectoryEntry> => {
      const entryPath = join(path, entry);
      const stat = await fs.promises.stat(entryPath);

      if (stat.isDirectory()) {
        return { type: 'directory', path: entryPath };
      }

      return { type: 'file', path: entryPath };
    },
  );

  const result = await Promise.all(ps).catch((err: Error) => err);
  if (result instanceof Error) {
    return WError.from(result);
  }

  return {
    path,
    entries: result,
  };
}

async function createDirectory(path: string): Promise<CDirectory | WError> {
  const result = await fs.promises
    .mkdir(path, { recursive: true })
    .catch((err: Error) => err);
  if (result instanceof Error) {
    return WError.from(result);
  }

  return listDirectory(path);
}

async function removeDirectory(path: string): Promise<null | WError> {
  const result = fs.promises.rmdir(path).catch((err: Error) => err);
  if (result instanceof Error) {
    return WError.from(result);
  }

  return null;
}

async function renameDirectory({
  src,
  dst,
}: {
  src: string;
  dst: string;
}): Promise<null | WError> {
  const result = await fs.promises.rename(src, dst).catch((err: Error) => err);
  if (result instanceof Error) {
    return WError.from(result);
  }

  return null;
}
