import * as THREE from 'three';
import { MinecraftModel, MinecraftGeometry, Bone, Cube, Vector3, AdvancedUV, FaceUV, isAdvancedUV, isSimpleUV } from '../types/MinecraftModel';

export class ModelParser {
  static parseModel(modelData: MinecraftModel): MinecraftGeometry | null {
    console.log('Parsing model data:', modelData);
    
    try {
      // Handle new format (minecraft:geometry array)
      if (modelData['minecraft:geometry'] && Array.isArray(modelData['minecraft:geometry'])) {
        const geometry = modelData['minecraft:geometry'][0];
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
  }

  static createThreeJSModel(
    geometry: MinecraftGeometry,
    texture?: THREE.Texture,
  ): THREE.Group {
    
    const modelGroup = new THREE.Group();
    const boneMap = new Map<string, THREE.Object3D>();

    // PASO 1: Crear todos los huesos sin aplicar transformaciones aún
    geometry.bones.forEach(boneInfo => {
      const boneGroup = new THREE.Group();
      boneGroup.name = boneInfo.name;
      boneMap.set(boneInfo.name, boneGroup);
    });

    // PASO 2: Construir la jerarquía de padres e hijos
    geometry.bones.forEach(boneInfo => {
      const bone = boneMap.get(boneInfo.name);
      if (!bone) return;

      if (boneInfo.parent && boneMap.has(boneInfo.parent)) {
        boneMap.get(boneInfo.parent)!.add(bone);
      } else {
        modelGroup.add(bone);
      }
    });
    
    // PASO 3: Aplicar transformaciones y crear cubos
    geometry.bones.forEach(boneInfo => {
      const boneGroup = boneMap.get(boneInfo.name);
      if (!boneGroup) return;
      
      // Aplicar pivot y rotación correctamente
      this.applyBoneTransforms(boneGroup, boneInfo);
      
      // Crear cubos para este hueso
      if (boneInfo.cubes) {
        boneInfo.cubes.forEach((cubeInfo) => {
          const mesh = this.createCubeMesh(cubeInfo, boneInfo, geometry.description, texture);
          boneGroup.add(mesh);
        });
      }
    });

    // PASO 4: Escalar el modelo completo
    const BEDROCK_SCALE = 1 / 16;
    modelGroup.scale.set(BEDROCK_SCALE, BEDROCK_SCALE, BEDROCK_SCALE);
    
    return modelGroup;
  }

  private static applyBoneTransforms(boneGroup: THREE.Object3D, boneInfo: Bone): void {
    const pivot = boneInfo.pivot || [0, 0, 0];
    const rotation = boneInfo.rotation || [0, 0, 0];

    // Convertir coordenadas de Bedrock a Three.js
    // Bedrock: X derecha, Y arriba, Z hacia adelante
    // Three.js: X derecha, Y arriba, Z hacia nosotros
    
    // Aplicar pivot - este es el punto alrededor del cual rota el hueso
    boneGroup.position.set(
      pivot[0],  // X permanece igual
      pivot[1],  // Y permanece igual  
      -pivot[2]  // Z se invierte
    );

    // Aplicar rotación
    // Las rotaciones en Bedrock están en grados, Three.js usa radianes
    boneGroup.rotation.set(
      THREE.MathUtils.degToRad(-rotation[0]), // Pitch (X) se invierte
      THREE.MathUtils.degToRad(-rotation[1]), // Yaw (Y) se invierte
      THREE.MathUtils.degToRad(rotation[2])   // Roll (Z) permanece igual
    );
  }
  
  private static createCubeMesh(
    cube: Cube, 
    bone: Bone,
    description: any, 
    texture: THREE.Texture | undefined,
  ): THREE.Mesh {
    const inflate = cube.inflate || 0;
    const size = cube.size;
    
    const geometry = new THREE.BoxGeometry(
      size[0] + inflate * 2, 
      size[1] + inflate * 2, 
      size[2] + inflate * 2
    );
    
    // CORRECCIÓN CLAVE: Posicionamiento del cubo relativo al pivot del hueso
    const origin = cube.origin || [0, 0, 0];
    const pivot = bone.pivot || [0, 0, 0];
    
    // Calcular posición del centro del cubo
    const cubeCenter = [
      origin[0] + size[0] / 2,
      origin[1] + size[1] / 2, 
      origin[2] + size[2] / 2
    ];
    
    // Posición relativa al pivot del hueso
    const relativePosition = [
      cubeCenter[0] - pivot[0],
      cubeCenter[1] - pivot[1],
      cubeCenter[2] - pivot[2]
    ];
    
    // Aplicar transformación de coordenadas Bedrock -> Three.js
    geometry.translate(
      relativePosition[0],   // X permanece igual
      relativePosition[1],   // Y permanece igual
      -relativePosition[2]   // Z se invierte
    );

    // Crear material
    let material: THREE.Material;
    if (texture && cube.uv) {
      const flipY = true;
      let advancedUVs = isSimpleUV(cube.uv) 
        ? this.convertSimpleToAdvancedUV(cube) 
        : cube.uv as AdvancedUV;

      this.applyAdvancedUVMapping(
        geometry,
        advancedUVs,
        description.texture_width,
        description.texture_height,
        cube.mirror || bone.mirror,
        flipY
      );

      material = new THREE.MeshLambertMaterial({
        map: texture,
        transparent: true,
        alphaTest: 0.1,
        side: THREE.FrontSide,
      });
    } else {
      material = new THREE.MeshLambertMaterial({ 
        color: 0xcccccc, 
        wireframe: false,
        transparent: true,
        opacity: 0.8
      });
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = `${bone.name}_cube`;
    
    return mesh;
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

  // Método de utilidad para debugging
  static debugBoneHierarchy(modelGroup: THREE.Group): void {
    console.log('=== JERARQUÍA DE HUESOS ===');
    
    function printBone(obj: THREE.Object3D, indent: string = '') {
      console.log(`${indent}${obj.name || 'unnamed'}`);
      console.log(`${indent}  Position: (${obj.position.x.toFixed(2)}, ${obj.position.y.toFixed(2)}, ${obj.position.z.toFixed(2)})`);
      console.log(`${indent}  Rotation: (${THREE.MathUtils.radToDeg(obj.rotation.x).toFixed(1)}°, ${THREE.MathUtils.radToDeg(obj.rotation.y).toFixed(1)}°, ${THREE.MathUtils.radToDeg(obj.rotation.z).toFixed(1)}°)`);
      console.log(`${indent}  Children: ${obj.children.length}`);
      
      obj.children.forEach(child => {
        if (child instanceof THREE.Group) {
          printBone(child, indent + '  ');
        }
      });
    }
    
    printBone(modelGroup);
    console.log('========================');
  }
}