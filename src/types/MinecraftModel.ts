// Types for Minecraft Bedrock Edition model geometry

export interface Vector3 {
  0: number;
  1: number;
  2: number;
}

export interface UV {
  0: number;
  1: number;
}

export interface FaceUV {
  uv: [number, number];
  uv_size: [number, number];
}

export interface AdvancedUV {
  north?: FaceUV;
  south?: FaceUV;
  east?: FaceUV;
  west?: FaceUV;
  up?: FaceUV;
  down?: FaceUV;
}

export interface Cube {
  origin: Vector3;
  size: Vector3;
  uv: UV | AdvancedUV;
  inflate?: number;
  mirror?: boolean;
}

export interface Locators {
  [key: string]: Vector3;
}

export interface Bone {
  name: string;
  pivot: Vector3;
  cubes?: Cube[];
  parent?: string;
  neverRender?: boolean;
  mirror?: boolean;
  inflate?: number;
  reset?: boolean;
  bind_pose_rotation?: Vector3;
  rotation?: Vector3;
  locators?: Locators;
}

export interface ModelDescription {
  identifier: string;
  texture_width: number;
  texture_height: number;
  visible_bounds_width?: number;
  visible_bounds_height?: number;
  visible_bounds_offset?: Vector3;
}

export interface MinecraftGeometry {
  description: ModelDescription;
  bones: Bone[];
}

export interface MinecraftModel {
  format_version: string;
  'minecraft:geometry'?: MinecraftGeometry[];
  // Legacy format support
  [geometryName: string]: any;
}

export interface TextureSet {
  format_version: string;
  'minecraft:texture_set': {
    color: string;
    metalness_emissive_roughness_subsurface?: string;
  };
}

export type BoneName = 
  | 'body' | 'waist' | 'head' | 'hat' | 'rightArm' | 'leftArm' 
  | 'rightItem' | 'leftItem' | 'rightLeg' | 'leftLeg' | 'helmet'
  | 'rightArmArmor' | 'leftArmArmor' | 'rightLegging' | 'leftLegging'
  | 'rightBoot' | 'leftBoot' | 'rightSock' | 'leftSock' | 'bodyArmor'
  | 'belt' | 'root' | 'cape' | 'left_wing' | 'right_wing' | 'leftSleeve'
  | 'rightSleeve' | 'leftPants' | 'rightPants' | 'jacket' | 'arm0' | 'arm1'
  | 'leg0' | 'leg1' | 'leg2' | 'leg3' | 'bed' | 'snout' | 'jaw' | 'look_at'
  | 'tentacles_0' | 'tentacles_1' | 'tentacles_2' | 'tentacles_3' | 'tentacles_4'
  | 'tentacles_5' | 'tentacles_6' | 'tentacles_7' | 'tentacles_8';

export function isValidGeometry(obj: any): obj is MinecraftGeometry {
  return obj && 
         obj.description &&
         typeof obj.description.identifier === 'string' &&
         Array.isArray(obj.bones) && 
         obj.bones.every((bone: any) => 
           typeof bone.name === 'string' && 
           Array.isArray(bone.pivot) && 
           bone.pivot.length === 3
         );
}

export function isAdvancedUV(uv: any): uv is AdvancedUV {
  return uv && typeof uv === 'object' && !Array.isArray(uv) && 
         (uv.north || uv.south || uv.east || uv.west || uv.up || uv.down);
}

export function isSimpleUV(uv: any): uv is UV {
  return Array.isArray(uv) && uv.length >= 2 && 
         typeof uv[0] === 'number' && typeof uv[1] === 'number';
}