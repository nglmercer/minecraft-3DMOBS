import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { MinecraftGeometry } from '../types/MinecraftModel';
import { ModelParser } from '../utils/ModelParser';

interface ModelViewerProps {
  geometry: MinecraftGeometry | null;
  texture: string | null;
  className?: string;
}

export const ModelViewer: React.FC<ModelViewerProps> = ({ geometry, texture, className }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const rendererRef = useRef<THREE.WebGLRenderer>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const modelRef = useRef<THREE.Group>();
  const frameRef = useRef<number>();
  const controlsRef = useRef<{
    mouseDown: boolean;
    mouseX: number;
    mouseY: number;
    rotationX: number;
    rotationY: number;
    zoom: number;
  }>({
    mouseDown: false,
    mouseX: 0,
    mouseY: 0,
    rotationX: 0,
    rotationY: 0,
    zoom: 1
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 2, 0);
    cameraRef.current = camera;

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    mountRef.current.appendChild(renderer.domElement);

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 20, 10);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.1;
    directionalLight.shadow.camera.far = 100;
    directionalLight.shadow.camera.left = -20;
    directionalLight.shadow.camera.right = 20;
    directionalLight.shadow.camera.top = 20;
    directionalLight.shadow.camera.bottom = -20;
    scene.add(directionalLight);

    // Add additional lights for better visibility
    const light2 = new THREE.DirectionalLight(0xffffff, 0.4);
    light2.position.set(-10, 10, -10);
    scene.add(light2);

    const light3 = new THREE.DirectionalLight(0xffffff, 0.3);
    light3.position.set(0, -10, 10);
    scene.add(light3);

    // Add grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x444444);
    scene.add(gridHelper);

    // Mouse controls
    const handleMouseDown = (event: MouseEvent) => {
      controlsRef.current.mouseDown = true;
      controlsRef.current.mouseX = event.clientX;
      controlsRef.current.mouseY = event.clientY;
    };

    const handleMouseUp = () => {
      controlsRef.current.mouseDown = false;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!controlsRef.current.mouseDown || !modelRef.current) return;

      const deltaX = event.clientX - controlsRef.current.mouseX;
      const deltaY = event.clientY - controlsRef.current.mouseY;

      controlsRef.current.rotationY += deltaX * 0.01;
      controlsRef.current.rotationX += deltaY * 0.01;

      // Clamp vertical rotation
      controlsRef.current.rotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, controlsRef.current.rotationX));

      modelRef.current.rotation.y = controlsRef.current.rotationY;
      modelRef.current.rotation.x = controlsRef.current.rotationX;

      controlsRef.current.mouseX = event.clientX;
      controlsRef.current.mouseY = event.clientY;
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
      controlsRef.current.zoom *= zoomFactor;
      controlsRef.current.zoom = Math.max(0.1, Math.min(10, controlsRef.current.zoom));
      
      if (modelRef.current) {
        modelRef.current.scale.setScalar(controlsRef.current.zoom);
      }
    };

    renderer.domElement.addEventListener('mousedown', handleMouseDown);
    renderer.domElement.addEventListener('mouseup', handleMouseUp);
    renderer.domElement.addEventListener('mousemove', handleMouseMove);
    renderer.domElement.addEventListener('wheel', handleWheel);

    // Animation loop
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !camera || !renderer) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      
      renderer.domElement.removeEventListener('mousedown', handleMouseDown);
      renderer.domElement.removeEventListener('mouseup', handleMouseUp);
      renderer.domElement.removeEventListener('mousemove', handleMouseMove);
      renderer.domElement.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      
      if (mountRef.current && renderer.domElement.parentNode) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    if (!geometry || !sceneRef.current) return;

    setIsLoading(true);

    // Remove previous model
    if (modelRef.current) {
      sceneRef.current.remove(modelRef.current);
    }

    // Reset controls
    controlsRef.current.rotationX = 0;
    controlsRef.current.rotationY = 0;
    controlsRef.current.zoom = 1;

    // Load texture if provided
    const loadModel = async () => {
      let textureObj: THREE.Texture | undefined;
      
      if (texture) {
        const textureLoader = new THREE.TextureLoader();
        try {
          textureObj = await new Promise<THREE.Texture>((resolve, reject) => {
            textureLoader.load(
              texture,
              resolve,
              undefined,
              reject
            );
          });
          textureObj.magFilter = THREE.NearestFilter;
          textureObj.minFilter = THREE.NearestFilter;
          textureObj.wrapS = THREE.RepeatWrapping;
          textureObj.wrapT = THREE.RepeatWrapping;
        } catch (error) {
          console.warn('Failed to load texture:', error);
        }
      }

      // Create model
      const model = ModelParser.createThreeJSModel(geometry, textureObj);
      
      // Calculate appropriate scale based on model bounds
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const maxDimension = Math.max(size.x, size.y, size.z);
      
      // Scale model to fit nicely in view (target size around 4 units)
      const targetSize = 4;
      const scale = maxDimension > 0 ? targetSize / maxDimension : 1;
      model.scale.setScalar(scale);
      
      // Center the model
      const center = box.getCenter(new THREE.Vector3());
      model.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
      
      modelRef.current = model;
      sceneRef.current!.add(model);
      
      console.log('Model loaded with bounds:', { size, maxDimension, scale });
      setIsLoading(false);
    };

    loadModel();
  }, [geometry, texture]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mountRef}
        className="w-full h-full bg-gray-900 rounded-lg overflow-hidden"
        style={{ minHeight: '400px' }}
      />
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-white text-lg">Loading model...</div>
        </div>
      )}
      <div className="absolute bottom-4 left-4 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
        <div>Click and drag to rotate</div>
        <div>Scroll to zoom</div>
      </div>
    </div>
  );
};