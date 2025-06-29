import { useState } from 'react';
import { ModelViewer } from './components/ModelViewer';
import { FileUploader } from './components/FileUploader';
import { ModelInfo } from './components/ModelInfo';
import { BoneHierarchy } from './components/BoneHierarchy';
import { SampleModels } from './components/SampleModels';
import { ModelParser } from './utils/ModelParser';
import { MinecraftGeometry, MinecraftModel } from './types/MinecraftModel';

function App() {
  const [currentGeometry, setCurrentGeometry] = useState<MinecraftGeometry | null>(null);
  const [currentTexture, setCurrentTexture] = useState<string | null>(null);

  const handleModelLoad = (modelData: MinecraftModel) => {
    console.log('Loading model data:', modelData);
    
    try {
      const geometry = ModelParser.parseModel(modelData);
      if (geometry) {
        setCurrentGeometry(geometry);
        console.log('Model loaded successfully:', geometry);
      } else {
        console.error('Failed to parse model - no valid geometry found');
        alert('Failed to parse model. Please check the file format. The model should contain either "minecraft:geometry" array or "geometry.*" properties.');
      }
    } catch (error) {
      console.error('Error parsing model:', error);
      alert('Error parsing model: ' + error);
    }
  };

  const handleTextureLoad = (textureData: string) => {
    setCurrentTexture(textureData);
    console.log('Texture loaded');
  };

  const handleSampleLoad = (modelJson: string, textureUrl?: string) => {
    try {
      console.log('Loading sample model JSON:', modelJson);
      const modelData = JSON.parse(modelJson);
      handleModelLoad(modelData);
      
      if (textureUrl) {
        setCurrentTexture(textureUrl);
      }
    } catch (error) {
      console.error('Error loading sample:', error);
      alert('Error loading sample: ' + error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white">Minecraft Bedrock Model Viewer</h1>
                <p className="text-gray-400 text-sm">3D model viewer and editor for Minecraft Bedrock Edition</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/Mojang/bedrock-samples"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
              >
                <span className="hidden sm:inline">Bedrock Samples</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel */}
          <div className="lg:col-span-1 space-y-6">
            <FileUploader
              onModelLoad={handleModelLoad}
              onTextureLoad={handleTextureLoad}
            />
            
            <SampleModels onLoadSample={handleSampleLoad} />
            
            <ModelInfo geometry={currentGeometry} />
          </div>

          {/* Center Panel - 3D Viewer */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h2 className="text-white text-xl font-semibold mb-4">3D Viewer</h2>
              <ModelViewer
                geometry={currentGeometry}
                texture={currentTexture}
                className="h-96"
              />
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-1">
            <BoneHierarchy geometry={currentGeometry} />
          </div>
        </div>

        {/* Instructions */}
        {!currentGeometry && (
          <div className="mt-12 bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-white text-xl font-semibold mb-4">Getting Started</h2>
            <div className="space-y-4 text-gray-300">
              <p>
                Welcome to the Minecraft Bedrock Model Viewer! This tool allows you to load and view 3D models 
                from Minecraft Bedrock Edition.
              </p>
              
              <div className="space-y-2">
                <h3 className="text-white font-medium">To get started:</h3>
                <ol className="list-decimal list-inside space-y-1 text-sm">
                  <li>Try loading a sample model from the left panel</li>
                  <li>Or upload your own .geo.json model file</li>
                  <li>Optionally add a texture file (.png) for better visualization</li>
                  <li>Use mouse controls to rotate and zoom the model</li>
                  <li>Explore the bone hierarchy in the right panel</li>
                </ol>
              </div>
              
              <div className="pt-4 border-t border-gray-600">
                <p className="text-sm text-gray-400">
                  Model files can be found in Minecraft Bedrock resource packs or downloaded from the 
                  official Mojang bedrock-samples repository.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center text-gray-400 text-sm">
            <span>Built with</span>
            <span>using Three.js and React</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;