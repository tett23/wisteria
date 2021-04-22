import { Preview } from 'components/Preview';
import { ProjectViewContainer } from 'components/ProjectView';
import { editorBody } from 'modules/editor';
import React, { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import Layout from '../components/Layout';

const IndexPage = () => {
  return (
    <Layout>
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div>
          <ProjectViewContainer />
        </div>
        <div>
          <Preview />
          <hr></hr>
          <TextArea></TextArea>
        </div>
      </div>
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
