import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-solid-svg-icons';

export function FileListHeader() {
  return (
    <div className="flex justify-between items-center h-10 px-2 py-1 border-b">
      <div className="w-full">
        <input
          type="text"
          className="outline-none border rounded px-1 w-full text-gray-600"
          placeholder="検索"
        />
      </div>
      <div className="ml-2">
        <span className="cursor-pointer text-gray-600">
          <FontAwesomeIcon icon={faFile} className="fa-fw" />
        </span>
      </div>
    </div>
  );
}
