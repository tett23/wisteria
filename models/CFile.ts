export type CFile = {
  path: string;
  body: string;
};

export type CDirectory = {
  path: string;
  entries: CDirectoryEntry[];
};

export type CDirectoryEntry =
  | { type: 'file'; path: string }
  | { type: 'directory'; path: string };

export type CEntry = CFile | CDirectory;
