import * as THREE from 'three';
import { MinecraftModel, MinecraftGeometry, Bone, Cube, Vector3, AdvancedUV, FaceUV, isAdvancedUV, isSimpleUV } from '../types/MinecraftModel';

interface ModelCreationOptions {
  flipUvY?: boolean;
  isPlayerModel?: boolean;
}

export class ModelParser {
  static parseModel(modelData: MinecraftModel): MinecraftGeometry | null {
    console.log('Parsing model data:', modelData);
    
    try {
      // Handle new format (minecraft:geometry array)
      if (modelData['minecraft:geometry'] && Array.isArray(modelData['minecraft:geometry'])) {
        const geometry = modelData['minecraft:geometry'][0];
        console.log('Found new format geometry:', geometry);
        
        if (geometry && geometry.description && geometry.bones) {
          return geometry;
        }
      }
            
      const geometryKeys = Object.keys(modelData).filter(key => key.startsWith('geometry.'));
      if (geometryKeys.length > 0) {
        const firstGeometry = modelData[geometryKeys[0]];
        if (firstGeometry && firstGeometry.bones) {
          return {
            description: {
              identifier: geometryKeys[0],
              texture_width: firstGeometry.texturewidth || 64,
              texture_height: firstGeometry.textureheight || 64,
              visible_bounds_width: firstGeometry.visible_bounds_width,
              visible_bounds_height: firstGeometry.visible_bounds_height,
              visible_bounds_offset: firstGeometry.visible_bounds_offset
            },
            bones: firstGeometry.bones
          };
        }
      }
      
      console.error('No valid geometry found in model data');
      return null;
    } catch (error) {
      console.error('Error parsing model:', error);
      return null;
    }
  };

  static createThreeJSModel(
    geometry: MinecraftGeometry, 
    texture?: THREE.Texture,
    options: ModelCreationOptions = {}
  ): THREE.Group {
    const { flipUvY = true, isPlayerModel = true } = options;
    console.log("options", options);
    
    const modelGroup = new THREE.Group();
    const boneMap = new Map<string, THREE.Group>();
    
    // CORRECCIÓN 1: Ajustar las posiciones de los bones (pivots)
    geometry.bones.forEach(boneInfo => {
      const bone = new THREE.Group();
      bone.name = boneInfo.name;

      if (boneInfo.pivot) {
        const pivotX = isPlayerModel ? -boneInfo.pivot[0] : boneInfo.pivot[0];
        // CAMBIO PRINCIPAL: Reducir la escala del eje Y y corregir la dirección
        const pivotY = (boneInfo.pivot[1] / 16) * 0.1; // Reduce la separación vertical
        const pivotZ = boneInfo.pivot[2] / 16;
        
        bone.position.set(pivotX / 16, pivotY, pivotZ);
      }

      if (boneInfo.rotation) {
        const rotX = isPlayerModel ? -THREE.MathUtils.degToRad(boneInfo.rotation[0]) : THREE.MathUtils.degToRad(boneInfo.rotation[0]);
        const rotY = isPlayerModel ? -THREE.MathUtils.degToRad(boneInfo.rotation[1]) : THREE.MathUtils.degToRad(boneInfo.rotation[1]);
        const rotZ = THREE.MathUtils.degToRad(boneInfo.rotation[2]);
        bone.rotation.set(rotX, rotY, rotZ);
      }
      boneMap.set(boneInfo.name, bone);
    });

    geometry.bones.forEach(boneInfo => {
      const bone = boneMap.get(boneInfo.name);
      if (!bone) return;
      if (boneInfo.parent && boneMap.has(boneInfo.parent)) {
        boneMap.get(boneInfo.parent)!.add(bone);
      } else {
        modelGroup.add(bone);
      }
    });
    
    // CORRECCIÓN 2: Ajustar las posiciones de los cubos dentro de cada bone
    geometry.bones.forEach(boneInfo => {
      const bone = boneMap.get(boneInfo.name);
      if (!bone || !boneInfo.cubes) return;
      
      boneInfo.cubes.forEach((cube) => {
        const mesh = this.createCubeMesh(cube, geometry.description, texture, boneInfo.mirror, flipUvY);
        const pivot = boneInfo.pivot || [0, 0, 0];
        
        const pivotX = isPlayerModel ? -pivot[0] : pivot[0];
        // CAMBIO PRINCIPAL: Corregir la posición Y del mesh
        const pivotY = pivot[1] / 16; // Sin inversión negativa
        const pivotZ = pivot[2] / 16;
        
        mesh.position.set(pivotX / 16, -pivotY, -pivotZ);
        bone.add(mesh);
      });
    });

    if (isPlayerModel) {
      modelGroup.scale.x = -1;
    }
    
    return modelGroup;
  }
  
  private static createCubeMesh(
    cube: Cube, 
    description: any, 
    texture: THREE.Texture | undefined, 
    boneMirror: boolean | undefined,
    flipUvY: boolean
  ): THREE.Mesh {
    const inflate = cube.inflate || 0;
    //@ts-ignore
    const size = (cube.size as number[]).map(s => s + inflate);
    
    const geometry = new THREE.BoxGeometry(size[0], size[1], size[2]);
    
    // CORRECCIÓN 3: Ajustar la traslación del cubo
    geometry.translate(
        (cube.origin[0] + size[0] / 2),
        (cube.origin[1] + size[1] / 2), // Mantener coordenadas originales
        (cube.origin[2] + size[2] / 2)
    );
    
    // CORRECCIÓN 4: Aplicar escala uniforme
    geometry.scale(1 / 16, 1 / 16, 1 / 16);

    let material: THREE.Material;
    if (texture && cube.uv) {
      let advancedUVs = isSimpleUV(cube.uv) ? this.convertSimpleToAdvancedUV(cube) : cube.uv as AdvancedUV;

      this.applyAdvancedUVMapping(
        geometry, 
        advancedUVs, 
        description.texture_width, 
        description.texture_height, 
        cube.mirror || boneMirror,
        flipUvY
      );

      material = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.1,
        side: THREE.FrontSide,
      });
    } else {
      material = new THREE.MeshLambertMaterial({ color: 0xcccccc, wireframe: true });
    }

    return new THREE.Mesh(geometry, material);
  }

  private static convertSimpleToAdvancedUV(cube: Cube): AdvancedUV {
    if (!isSimpleUV(cube.uv)) return {};
    const [u, v] = cube.uv as [number, number];
    const [w, h, d] = cube.size as [number, number, number];

    return {
      east:   { uv: [u + d + w, v + d], uv_size: [-w, h] },
      west:   { uv: [u, v + d], uv_size: [w, h] },
      up:     { uv: [u + d, v], uv_size: [w, d] },
      down:   { uv: [u + d + w, v], uv_size: [w, -d] },
      south:  { uv: [u + d + w + d, v + d], uv_size: [-d, h] },
      north:  { uv: [u + d, v + d], uv_size: [w, h] },
    };
  }

  private static applyAdvancedUVMapping(
    geometry: THREE.BoxGeometry,
    uvData: AdvancedUV,
    textureWidth: number,
    textureHeight: number,
    mirror: boolean = false,
    flipY: boolean = true
  ) {
    const uvAttribute = geometry.getAttribute('uv') as THREE.BufferAttribute;
    
    const faceOrder: (keyof AdvancedUV)[] = ['east', 'west', 'up', 'down', 'north', 'south'];
    
    faceOrder.forEach((faceName, faceIndex) => {
      const faceUV = uvData[faceName];
      if (!faceUV) return;

      let [u, v] = faceUV.uv;
      let [uvWidth, uvHeight] = faceUV.uv_size;
      
      let u1 = u / textureWidth;
      let v1 = v / textureHeight;
      let u2 = (u + uvWidth) / textureWidth;
      let v2 = (v + uvHeight) / textureHeight;

      if (flipY) {
        v1 = 1 - v1;
        v2 = 1 - v2;
      }

      if (mirror) {
        [u1, u2] = [u2, u1];
      }

      const baseIndex = faceIndex * 4;
      this.applyFaceUVCoordinates(uvAttribute, baseIndex, faceName, u1, v1, u2, v2);
    });

    uvAttribute.needsUpdate = true;
  }

  private static applyFaceUVCoordinates(
    uvAttribute: THREE.BufferAttribute,
    baseIndex: number,
    faceName: string,
    u1: number, v1: number, u2: number, v2: number
  ) {
    const minU = Math.min(u1, u2);
    const maxU = Math.max(u1, u2);
    const minV = Math.min(v1, v2);
    const maxV = Math.max(v1, v2);

    switch(faceName) {
      case 'east':
        uvAttribute.setXY(baseIndex + 0, minU, maxV);
        uvAttribute.setXY(baseIndex + 1, maxU, maxV);
        uvAttribute.setXY(baseIndex + 2, minU, minV);
        uvAttribute.setXY(baseIndex + 3, maxU, minV);
        break;
        
      case 'west':
        uvAttribute.setXY(baseIndex + 0, maxU, maxV);
        uvAttribute.setXY(baseIndex + 1, minU, maxV);
        uvAttribute.setXY(baseIndex + 2, maxU, minV);
        uvAttribute.setXY(baseIndex + 3, minU, minV);
        break;
        
      case 'up':
        uvAttribute.setXY(baseIndex + 0, minU, minV);
        uvAttribute.setXY(baseIndex + 1, maxU, minV);
        uvAttribute.setXY(baseIndex + 2, minU, maxV);
        uvAttribute.setXY(baseIndex + 3, maxU, maxV);
        break;
        
      case 'down':
        uvAttribute.setXY(baseIndex + 0, minU, maxV);
        uvAttribute.setXY(baseIndex + 1, maxU, maxV);
        uvAttribute.setXY(baseIndex + 2, minU, minV);
        uvAttribute.setXY(baseIndex + 3, maxU, minV);
        break;
        
      case 'north':
        uvAttribute.setXY(baseIndex + 0, maxU, maxV);
        uvAttribute.setXY(baseIndex + 1, minU, maxV);
        uvAttribute.setXY(baseIndex + 2, maxU, minV);
        uvAttribute.setXY(baseIndex + 3, minU, minV);
        break;
        
      case 'south':
        uvAttribute.setXY(baseIndex + 0, minU, maxV);
        uvAttribute.setXY(baseIndex + 1, maxU, maxV);
        uvAttribute.setXY(baseIndex + 2, minU, minV);
        uvAttribute.setXY(baseIndex + 3, maxU, minV);
        break;
    }
  }
}