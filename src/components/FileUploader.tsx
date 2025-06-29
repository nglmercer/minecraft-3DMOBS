import React, { useRef } from 'react';

interface FileUploaderProps {
  onModelLoad: (model: any) => void;
  onTextureLoad: (texture: string) => void;
  className?: string;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onModelLoad,
  onTextureLoad,
  className
}) => {
  const modelInputRef = useRef<HTMLInputElement>(null);
  const textureInputRef = useRef<HTMLInputElement>(null);

  const handleModelFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const model = JSON.parse(result);
        onModelLoad(model);
      } catch (error) {
        console.error('Error parsing model file:', error);
        alert('Error parsing model file. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleTextureFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      onTextureLoad(result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          Load Files
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Model File (.geo.json)
            </label>
            <button
              onClick={() => modelInputRef.current?.click()}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Choose Model File
            </button>
            <input
              ref={modelInputRef}
              type="file"
              accept=".json,.geo.json"
              onChange={handleModelFile}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Texture File (.png)
            </label>
            <button
              onClick={() => textureInputRef.current?.click()}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              Choose Texture File
            </button>
            <input
              ref={textureInputRef}
              type="file"
              accept=".png,.jpg,.jpeg"
              onChange={handleTextureFile}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
};