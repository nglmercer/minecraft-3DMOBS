import React from 'react';

interface SampleModelsProps {
  onLoadSample: (modelJson: string, textureUrl?: string) => void;
  className?: string;
}

const sampleModels = [
  {
    name: 'Allay',
    description: 'Friendly flying mob from Minecraft',
    featured: true
  },
  {
    name: 'camel',
    description: 'Camel Mob',
    featured: false
  },
  {
    name: 'Happy Ghast',
    description: 'Large floating mob with tentacles',
    featured: true
  },
  {
    name: 'Simple Cube',
    description: 'Basic cube model for testing',
    featured: false
  },
  {
    name: 'Player Head',
    description: 'Simple player head model',
    featured: false
  }
];

export const SampleModels: React.FC<SampleModelsProps> = ({ onLoadSample, className }) => {
  const handleLoadSample = async (modelName: string) => {
    try {
      let modelData;
      let textureUrl;

      switch (modelName) {
        case 'Allay':
          modelData = {
            "format_version": "1.21.0",
            "minecraft:geometry": [
              {
                "description": {
                  "identifier": "geometry.allay",
                  "texture_width": 32,
                  "texture_height": 32,
                  "visible_bounds_width": 1.3,
                  "visible_bounds_height": 1,
                  "visible_bounds_offset": [ 0, 0.4, 0 ]
                },
                "bones": [
                  {
                    "name": "root",
                    "pivot": [ 0, 1, 0 ],
                    "locators": {
                      "lead_hold": [ 0, 25, 0 ]
                    }
                  },
                  {
                    "name": "head",
                    "parent": "root",
                    "pivot": [ 0, 5, 0 ]
                  },
                  {
                    "name": "look_at",
                    "parent": "head",
                    "pivot": [ 0, 5, 0.75 ],
                    "cubes": [
                      {
                        "origin": [ -2.5, 5.01, -2.5 ],
                        "size": [ 5, 5, 5 ],
                        "uv": [ 0, 0 ]
                      }
                    ]
                  },
                  {
                    "name": "body",
                    "parent": "root",
                    "pivot": [ 0, 5, 0 ],
                    "cubes": [
                      {
                        "origin": [ -1.5, 1, -1 ],
                        "size": [ 3, 4, 2 ],
                        "uv": [ 0, 10 ]
                      },
                      {
                        "origin": [ -1.5, 0, -1 ],
                        "size": [ 3, 5, 2 ],
                        "inflate": -0.2,
                        "uv": [ 0, 16 ]
                      }
                    ],
                    "locators": {
                      "lead": [ 0, 6, 0 ]
                    }
                  },
                  {
                    "name": "rightItem",
                    "parent": "body",
                    "pivot": [ 0, 0, -2 ],
                    "rotation": [ -80, 0, 0 ]
                  },
                  {
                    "name": "right_arm",
                    "parent": "body",
                    "pivot": [ -1.75, 4.5, 0 ],
                    "cubes": [
                      {
                        "origin": [ -2.5, 1, -1 ],
                        "size": [ 1, 4, 2 ],
                        "uv": [ 23, 0 ]
                      }
                    ]
                  },
                  {
                    "name": "left_arm",
                    "parent": "body",
                    "pivot": [ 1.75, 4.5, 0 ],
                    "cubes": [
                      {
                        "origin": [ 1.5, 1, -1 ],
                        "size": [ 1, 4, 2 ],
                        "uv": [ 23, 6 ]
                      }
                    ]
                  },
                  {
                    "name": "left_wing",
                    "parent": "body",
                    "pivot": [ 0.5, 4, 1 ],
                    "cubes": [
                      {
                        "origin": [ 0.5, -1, 1 ],
                        "size": [ 0, 5, 8 ],
                        "uv": [ 16, 14 ]
                      }
                    ]
                  },
                  {
                    "name": "right_wing",
                    "parent": "body",
                    "pivot": [ -0.5, 4, 1 ],
                    "cubes": [
                      {
                        "origin": [ -0.5, -1, 1 ],
                        "size": [ 0, 5, 8 ],
                        "uv": [ 16, 14 ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
          ;
          textureUrl = 'https://raw.githubusercontent.com/Mojang/bedrock-samples/main/resource_pack/textures/entity/allay/allay.png';
          break;

        case 'Happy Ghast':
          modelData = {
            "format_version": "1.21.0",
            "minecraft:geometry": [
              {
                "description": {
                  "identifier": "geometry.happy_ghast",
                  "texture_width": 64,
                  "texture_height": 64,
                  "visible_bounds_width": 6,
                  "visible_bounds_height": 7,
                  "visible_bounds_offset": [0, 2, 0]
                },
                "bones": [
                  {
                    "name": "body",
                    "pivot": [0, 0, 0],
                    "cubes": [
                      {
                        "origin": [-32, 0, -32],
                        "size": [64, 64, 64],
                        "uv": {
                          "north": {"uv": [16, 16], "uv_size": [16, 16]},
                          "east": {"uv": [0, 16], "uv_size": [16, 16]},
                          "south": {"uv": [48, 16], "uv_size": [16, 16]},
                          "west": {"uv": [32, 16], "uv_size": [16, 16]},
                          "up": {"uv": [16, 0], "uv_size": [16, 16]},
                          "down": {"uv": [32, 16], "uv_size": [16, -16]}
                        }
                      },
                      {
                        "origin": [-30.5, 1.5, -30.5],
                        "size": [61, 61, 61],
                        "inflate": -0.5,
                        "uv": {
                          "north": {"uv": [16, 48], "uv_size": [16, 16]},
                          "east": {"uv": [0, 48], "uv_size": [16, 16]},
                          "south": {"uv": [48, 48], "uv_size": [16, 16]},
                          "west": {"uv": [32, 48], "uv_size": [16, 16]},
                          "up": {"uv": [16, 32], "uv_size": [16, 16]},
                          "down": {"uv": [32, 48], "uv_size": [16, -16]}
                        }
                      },
                      {
                        "origin": [-32.6, -0.6, -32.6],
                        "size": [65.2, 65.2, 65.2],
                        "inflate": 0.2,
                        "uv": {
                          "north": {"uv": [16, 16], "uv_size": [16, 16]},
                          "east": {"uv": [0, 16], "uv_size": [16, 16]},
                          "south": {"uv": [48, 16], "uv_size": [16, 16]},
                          "west": {"uv": [32, 16], "uv_size": [16, 16]},
                          "up": {"uv": [16, 0], "uv_size": [16, 16]},
                          "down": {"uv": [32, 16], "uv_size": [16, -16]}
                        }
                      }
                    ],
                    "locators": {
                      "lead": [0, 0, 0],
                      "lead_hold": [0, 24, 0],
                      "multi_lead_hold_1": [31, 24, 31],
                      "multi_lead_hold_2": [31, 24, -27],
                      "multi_lead_hold_3": [-31, 24, -27],
                      "multi_lead_hold_4": [-31, 24, 31]
                    }
                  },
                  {
                    "name": "tentacles_0",
                    "parent": "body",
                    "pivot": [-15.2, 4, -20],
                    "cubes": [{"origin": [-19.2, -16, -24], "size": [8, 20, 8], "uv": {"north": {"uv": [2, 2], "uv_size": [2, 5]}, "east": {"uv": [0, 2], "uv_size": [2, 5]}, "south": {"uv": [6, 2], "uv_size": [2, 5]}, "west": {"uv": [4, 2], "uv_size": [2, 5]}, "up": {"uv": [2, 0], "uv_size": [2, 2]}, "down": {"uv": [4, 2], "uv_size": [2, -2]}}}]
                  },
                  {
                    "name": "tentacles_1",
                    "parent": "body",
                    "pivot": [5.2, 4, -20],
                    "cubes": [{"origin": [1.2, -24, -24], "size": [8, 28, 8], "uv": {"north": {"uv": [2, 2], "uv_size": [2, 7]}, "east": {"uv": [0, 2], "uv_size": [2, 7]}, "south": {"uv": [6, 2], "uv_size": [2, 7]}, "west": {"uv": [4, 2], "uv_size": [2, 7]}, "up": {"uv": [2, 0], "uv_size": [2, 2]}, "down": {"uv": [4, 2], "uv_size": [2, -2]}}}]
                  },
                  {
                    "name": "tentacles_2",
                    "parent": "body",
                    "pivot": [25.2, 4, -20],
                    "cubes": [{"origin": [21.2, -12, -24], "size": [8, 16, 8], "uv": {"north": {"uv": [2, 2], "uv_size": [2, 4]}, "east": {"uv": [0, 2], "uv_size": [2, 4]}, "south": {"uv": [6, 2], "uv_size": [2, 4]}, "west": {"uv": [4, 2], "uv_size": [2, 4]}, "up": {"uv": [2, 0], "uv_size": [2, 2]}, "down": {"uv": [4, 2], "uv_size": [2, -2]}}}]
                  },
                  {
                    "name": "tentacles_3",
                    "parent": "body",
                    "pivot": [-25.2, 4, 0],
                    "cubes": [{"origin": [-29.2, -16, -4], "size": [8, 20, 8], "uv": {"north": {"uv": [2, 2], "uv_size": [2, 5]}, "east": {"uv": [0, 2], "uv_size": [2, 5]}, "south": {"uv": [6, 2], "uv_size": [2, 5]}, "west": {"uv": [4, 2], "uv_size": [2, 5]}, "up": {"uv": [2, 0], "uv_size": [2, 2]}, "down": {"uv": [4, 2], "uv_size": [2, -2]}}}]
                  },
                  {
                    "name": "tentacles_4",
                    "parent": "body",
                    "pivot": [-5.2, 4, 0],
                    "cubes": [{"origin": [-9.2, -16, -4], "size": [8, 20, 8], "uv": {"north": {"uv": [2, 2], "uv_size": [2, 5]}, "east": {"uv": [0, 2], "uv_size": [2, 5]}, "south": {"uv": [6, 2], "uv_size": [2, 5]}, "west": {"uv": [4, 2], "uv_size": [2, 5]}, "up": {"uv": [2, 0], "uv_size": [2, 2]}, "down": {"uv": [4, 2], "uv_size": [2, -2]}}}]
                  },
                  {
                    "name": "tentacles_5",
                    "parent": "body",
                    "pivot": [15.2, 4, 0],
                    "cubes": [{"origin": [11.2, -24, -4], "size": [8, 28, 8], "uv": {"north": {"uv": [2, 2], "uv_size": [2, 7]}, "east": {"uv": [0, 2], "uv_size": [2, 7]}, "south": {"uv": [6, 2], "uv_size": [2, 7]}, "west": {"uv": [4, 2], "uv_size": [2, 7]}, "up": {"uv": [2, 0], "uv_size": [2, 2]}, "down": {"uv": [4, 2], "uv_size": [2, -2]}}}]
                  },
                  {
                    "name": "tentacles_6",
                    "parent": "body",
                    "pivot": [-15.2, 4, 20],
                    "cubes": [{"origin": [-19.2, -28, 16], "size": [8, 32, 8], "uv": {"north": {"uv": [2, 2], "uv_size": [2, 8]}, "east": {"uv": [0, 2], "uv_size": [2, 8]}, "south": {"uv": [6, 2], "uv_size": [2, 8]}, "west": {"uv": [4, 2], "uv_size": [2, 8]}, "up": {"uv": [2, 0], "uv_size": [2, 2]}, "down": {"uv": [4, 2], "uv_size": [2, -2]}}}]
                  },
                  {
                    "name": "tentacles_7",
                    "parent": "body",
                    "pivot": [5.2, 4, 20],
                    "cubes": [{"origin": [1.2, -28, 16], "size": [8, 32, 8], "uv": {"north": {"uv": [2, 2], "uv_size": [2, 8]}, "east": {"uv": [0, 2], "uv_size": [2, 8]}, "south": {"uv": [6, 2], "uv_size": [2, 8]}, "west": {"uv": [4, 2], "uv_size": [2, 8]}, "up": {"uv": [2, 0], "uv_size": [2, 2]}, "down": {"uv": [4, 2], "uv_size": [2, -2]}}}]
                  },
                  {
                    "name": "tentacles_8",
                    "parent": "body",
                    "pivot": [25.2, 4, 20],
                    "cubes": [{"origin": [21.2, -16, 16], "size": [8, 20, 8], "uv": {"north": {"uv": [2, 2], "uv_size": [2, 5]}, "east": {"uv": [0, 2], "uv_size": [2, 5]}, "south": {"uv": [6, 2], "uv_size": [2, 5]}, "west": {"uv": [4, 2], "uv_size": [2, 5]}, "up": {"uv": [2, 0], "uv_size": [2, 2]}, "down": {"uv": [4, 2], "uv_size": [2, -2]}}}]
                  }
                ]
              }
            ]
          };
          textureUrl = 'https://raw.githubusercontent.com/Mojang/bedrock-samples/main/resource_pack/textures/entity/happy_ghast/happy_ghast.png';
          break;

        case 'Simple Cube':
          modelData = {
            "format_version": "1.21.0",
            "minecraft:geometry": [
              {
                "description": {
                  "identifier": "geometry.simple_cube",
                  "texture_width": 16,
                  "texture_height": 16
                },
                "bones": [
                  {
                    "name": "root",
                    "pivot": [0, 0, 0],
                    "cubes": [
                      {
                        "origin": [-4, 0, -4],
                        "size": [8, 8, 8],
                        "uv": [0, 0]
                      }
                    ]
                  }
                ]
              }
            ]
          };
          break;

        case 'Player Head':
          modelData = {
            "format_version": "1.21.0",
            "minecraft:geometry": [
              {
                "description": {
                  "identifier": "geometry.player_head",
                  "texture_width": 64,
                  "texture_height": 64
                },
                "bones": [
                  {
                    "name": "head",
                    "pivot": [0, 0, 0],
                    "cubes": [
                      {
                        "origin": [-4, 0, -4],
                        "size": [8, 8, 8],
                        "uv": [0, 0]
                      }
                    ]
                  }
                ]
              }
            ]
          };
          break;
        
        case 'camel':
          modelData = {
            "format_version": "1.21.0",
            "minecraft:geometry": [
              {
                "description": {
                  "identifier": "geometry.camel",
                  "texture_width": 128,
                  "texture_height": 128,
                  "visible_bounds_width": 4,
                  "visible_bounds_height": 5,
                  "visible_bounds_offset": [0, 1.5, 0]
                },
                "bones": [
                  {
                    "name": "root",
                    "pivot": [0, 0, 0],
                    "locators": {
                      "root_standing": [0, 32, 0],
                      "root_sitting": [0, 12, 0]
                    }
                  },
                  {
                    "name": "body",
                    "parent": "root",
                    "pivot": [0.5, 20, 9.5],
                    "cubes": [
                      {"origin": [-7.5, 20, -14], "size": [15, 12, 27], "uv": [0, 25]}
                    ],
                    "locators": {
                      "driver_seat": [0, 30, -11],
                      "back_seat": [0, 30, 10],
                      "multi_lead_1": [7, 32, 7],
                      "multi_lead_2": [7, 32, -8],
                      "multi_lead_3": [-7, 32, -8],
                      "multi_lead_4": [-7, 32, 7],
                      "lead_hold": [0, 46, 0]
                    }
                  },
                  {
                    "name": "saddle",
                    "parent": "body",
                    "pivot": [0.5, 20, 9.5],
                    "cubes": [
                      {"origin": [-4.5, 32, -6], "size": [9, 5, 11], "inflate": 0.1, "uv": [74, 64]},
                      {"origin": [-3.5, 37, -6], "size": [7, 3, 11], "inflate": 0.1, "uv": [92, 114]},
                      {"origin": [-7.5, 20, -14], "size": [15, 12, 27], "inflate": 0.1, "uv": [0, 89]}
                    ]
                  },
                  {
                    "name": "tail",
                    "parent": "body",
                    "pivot": [0, 29, 13],
                    "cubes": [
                      {"origin": [-1.5, 15, 13], "size": [3, 14, 0], "pivot": [0, 29, 13], "rotation": [0, 180, 0], "uv": [122, 0]}
                    ]
                  },
                  {
                    "name": "head",
                    "parent": "body",
                    "pivot": [0.5, 25, -10],
                    "cubes": [
                      {"origin": [-3.5, 22, -25], "size": [7, 8, 19], "uv": [60, 24]},
                      {"origin": [-3.5, 30, -25], "size": [7, 14, 7], "uv": [21, 0]},
                      {"origin": [-2.5, 39, -31], "size": [5, 5, 6], "uv": [50, 0]}
                    ],
                    "locators": {
                      "lead": [0, 25, -15]
                    }
                  },
                  {
                    "name": "bridle",
                    "parent": "head",
                    "pivot": [0.5, 25, -10],
                    "cubes": [
                      {"origin": [-3.5, 22, -25], "size": [7, 8, 19], "inflate": 0.1, "uv": [60, 87]},
                      {"origin": [-3.5, 30, -25], "size": [7, 14, 7], "inflate": 0.1, "uv": [21, 64]},
                      {"origin": [-2.5, 39, -31.1], "size": [5, 5, 6], "inflate": 0.1, "uv": [50, 64]},
                      {"origin": [2.5, 40, -28], "size": [1, 2, 2], "uv": [74, 70]},
                      {"origin": [-3.5, 40, -28], "size": [1, 2, 2], "uv": [74, 70], "mirror": true}
                    ]
                  },
                  {
                    "name": "left_ear",
                    "parent": "head",
                    "pivot": [3, 43, -19.5],
                    "cubes": [
                      {"origin": [3, 42.5, -20.5], "size": [3, 1, 2], "uv": [45, 0]}
                    ]
                  },
                  {
                    "name": "right_ear",
                    "parent": "head",
                    "pivot": [-3, 43, -19.5],
                    "cubes": [
                      {"origin": [-6, 42.5, -20.5], "size": [3, 1, 2], "uv": [67, 0]}
                    ]
                  },
                  {
                    "name": "reins",
                    "parent": "head",
                    "pivot": [3.7, 41, -27],
                    "cubes": [
                      {"origin": [3.7, 34, -27], "size": [0, 7, 15], "uv": [98, 42]},
                      {"origin": [-3.7, 34, -12], "size": [7.4, 7, 0], "uv": [84, 57]},
                      {"origin": [-3.7, 34, -27], "size": [0, 7, 15], "uv": [98, 42]}
                    ]
                  },
                  {
                    "name": "hump",
                    "parent": "body",
                    "pivot": [0.5, 32, 0],
                    "cubes": [
                      {"origin": [-4.5, 32, -6], "size": [9, 5, 11], "uv": [74, 0]}
                    ]
                  },
                  {
                    "name": "right_front_leg",
                    "parent": "root",
                    "pivot": [-4.9, 23, -10.5],
                    "cubes": [
                      {"origin": [-7.4, 0, -13], "size": [5, 21, 5], "uv": [0, 26]}
                    ]
                  },
                  {
                    "name": "left_front_leg",
                    "parent": "root",
                    "pivot": [4.9, 23, -10.5],
                    "cubes": [
                      {"origin": [2.4, 0, -13], "size": [5, 21, 5], "uv": [0, 0]}
                    ]
                  },
                  {
                    "name": "left_hind_leg",
                    "parent": "root",
                    "pivot": [4.9, 23, 9.5],
                    "cubes": [
                      {"origin": [2.4, 0, 7], "size": [5, 21, 5], "uv": [58, 16]}
                    ]
                  },
                  {
                    "name": "right_hind_leg",
                    "parent": "root",
                    "pivot": [-4.9, 23, 9.5],
                    "cubes": [
                      {"origin": [-7.4, 0, 7], "size": [5, 21, 5], "uv": [94, 16]}
                    ]
                  }
                ]
              }
            ]
          };
          textureUrl = 'https://raw.githubusercontent.com/Mojang/bedrock-samples/main/resource_pack/textures/entity/camel/camel.png';
          break;
        
        default:
          throw new Error('Unknown model');
      }

      onLoadSample(JSON.stringify(modelData), textureUrl);
    } catch (error) {
      console.error('Error loading sample model:', error);
      alert('Error loading sample model: ' + error);
    }
  };

  return (
    <div className={`bg-gray-800 rounded-lg p-6 border border-gray-700 ${className}`}>
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        Sample Models
      </h3>
      
      <div className="space-y-3">
        {sampleModels.map((model, index) => (
          <div
            key={index}
            className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-colors cursor-pointer"
            onClick={() => handleLoadSample(model.name)}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-white font-medium">{model.name}</h4>
                </div>
                <p className="text-gray-300 text-sm">{model.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-600">
        <p className="text-gray-400 text-xs">
          Sample models demonstrate different Minecraft Bedrock geometry formats
        </p>
      </div>
    </div>
  );
};