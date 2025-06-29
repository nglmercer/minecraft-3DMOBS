import React, { useState } from 'react';
import { MinecraftGeometry, Bone } from '../types/MinecraftModel';

interface BoneHierarchyProps {
  geometry: MinecraftGeometry | null;
  className?: string;
}

interface BoneNodeProps {
  bone: Bone;
  children: Bone[];
  level: number;
}

const BoneNode: React.FC<BoneNodeProps> = ({ bone, children, level }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [isVisible, setIsVisible] = useState(true);
  
  const hasChildren = children.length > 0;
  const cubeCount = bone.cubes?.length || 0;
  
  return (
    <div className="select-none">
      <div 
        className={`flex items-center gap-2 py-1 px-2 rounded hover:bg-gray-700 cursor-pointer transition-colors`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => hasChildren && setIsExpanded(!isExpanded)}
      >
        
        
        <span className="text-white text-sm font-medium flex-1">
          {bone.name}
        </span>
        
        {cubeCount > 0 && (
          <span className="text-xs text-gray-400 bg-gray-600 px-2 py-0.5 rounded">
            {cubeCount} cube{cubeCount !== 1 ? 's' : ''}
          </span>
        )}
        
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsVisible(!isVisible);
          }}
          className="p-1 hover:bg-gray-600 rounded transition-colors"
        >
        </button>
      </div>
      
      {hasChildren && isExpanded && (
        <div>
          {children.map(childBone => (
            <BoneNode
              key={childBone.name}
              bone={childBone}
              children={[]} // We'll need to calculate children for each bone
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const BoneHierarchy: React.FC<BoneHierarchyProps> = ({ geometry, className }) => {
  if (!geometry) {
    return (
      <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
        <h3 className="text-white text-lg font-semibold mb-4">Bone Hierarchy</h3>
        <p className="text-gray-400">No model loaded</p>
      </div>
    );
  }

  // Build hierarchy
  const boneMap = new Map(geometry.bones.map(bone => [bone.name, bone]));
  const rootBones: Bone[] = [];
  const childrenMap = new Map<string, Bone[]>();

  // Initialize children map
  geometry.bones.forEach(bone => {
    childrenMap.set(bone.name, []);
  });

  // Build parent-child relationships
  geometry.bones.forEach(bone => {
    if (bone.parent && boneMap.has(bone.parent)) {
      const siblings = childrenMap.get(bone.parent) || [];
      siblings.push(bone);
      childrenMap.set(bone.parent, siblings);
    } else {
      rootBones.push(bone);
    }
  });

  const renderBone = (bone: Bone, level = 0): React.ReactNode => {
    const children = childrenMap.get(bone.name) || [];
    return (
      <BoneNode
        key={bone.name}
        bone={bone}
        children={children}
        level={level}
      />
    );
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
      <h3 className="text-white text-lg font-semibold mb-4">Bone Hierarchy</h3>
      
      <div className="space-y-1 max-h-96 overflow-y-auto">
        {rootBones.map(bone => renderBone(bone))}
      </div>
    </div>
  );
};