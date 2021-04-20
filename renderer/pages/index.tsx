import { VerticalEditor } from 'components/VerticalEditor';
import { editorBody } from 'modules/editor';
import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import Layout from '../components/Layout';

const IndexPage = () => {
  return (
    <Layout>
      <VerticalEditor />
      <hr></hr>
      <TextArea></TextArea>
    </Layout>
  );
};

export default IndexPage;

function TextArea() {
  const [content, setContent] = useRecoilState(editorBody);
  const onChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  }, []);

  return (
    <textarea
      className="border-2 w-screen h-48"
      onChange={onChange}
      value={content ?? ''}
    ></textarea>
  );
}
