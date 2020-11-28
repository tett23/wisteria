import React from 'react';

export type FileProps = {
  filename: string;
  body: string;
};

export function File(props: FileProps) {
  return (
    <div className="h12">
      <FileName filename={props.filename}></FileName>
      <Body body={props.body}></Body>
    </div>
  );
}

type FileNameProps = {
  filename: string;
};

function FileName({ filename }: FileNameProps) {
  return <div className="font-semibold">{filename}</div>;
}

type BodyProps = {
  body: string;
};

function Body({ body }: BodyProps) {
  return (
    <div className="text-gray-400 min-h-12 max-h-12 overflow-hidden break-all">
      {body}
    </div>
  );
}
