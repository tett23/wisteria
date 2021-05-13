import React, { useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useAddProject } from 'modules/projects/useAddProject';

export function AddProjectButton() {
  const addProject = useAddProject();
  const onClick = useCallback(async () => {
    const result = await global.api
      .message('addProject', {})
      .catch((err: Error) => err);
    if (result instanceof Error || result == null) {
      return;
    }

    addProject(result);
  }, []);

  return (
    <button onClick={onClick}>
      <FontAwesomeIcon icon={faPlus}></FontAwesomeIcon>
    </button>
  );
}
