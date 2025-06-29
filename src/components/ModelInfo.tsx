import React from 'react';
import { MinecraftGeometry } from '../types/MinecraftModel';

interface ModelInfoProps {
  geometry: MinecraftGeometry | null;
  className?: string;
}

export const ModelInfo: React.FC<ModelInfoProps> = ({ geometry, className }) => {
  if (!geometry) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          Model Information
        </h3>
        <p className="text-gray-400">No model loaded</p>
      </div>
    );
  }

  const totalCubes = geometry.bones.reduce((total, bone) => {
    return total + (bone.cubes?.length || 0);
  }, 0);

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        Model Information
      </h3>
      
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Identifier:</span>
          <span className="text-white font-mono text-xs bg-gray-700 px-2 py-1 rounded">
            {geometry.description.identifier}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400">Texture Size:</span>
          <span className="text-blue-400">
            {geometry.description.texture_width} × {geometry.description.texture_height}
          </span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 flex items-center gap-1">
            Bones:
          </span>
          <span className="text-purple-400">{geometry.bones.length}</span>
        </div>
        
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-400 flex items-center gap-1">
            Cubes:
          </span>
          <span className="text-green-400">{totalCubes}</span>
        </div>
        
        {geometry.description.visible_bounds_width && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-400">Bounds:</span>
            <span className="text-yellow-400">
              {geometry.description.visible_bounds_width} × {geometry.description.visible_bounds_height}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};