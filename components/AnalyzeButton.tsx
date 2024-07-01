import React from 'react';

interface AnalyzeButtonProps {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  uploadProgress: number;
}

export const AnalyzeButton: React.FC<AnalyzeButtonProps> = ({ onClick, uploadProgress }) => {
  return (
    <div className="flex justify-center items-center mb-5">
      {uploadProgress === 0 || uploadProgress === 100 ? (
        <button onClick={onClick} className="bg-blue-500 text-white py-2 px-5 rounded-lg cursor-pointer text-lg hover:bg-blue-700">
          Analyze Image
        </button>
      ) : (
        <progress value={uploadProgress} max="100" className="w-1/2"></progress>
      )}
    </div>
  );
};
