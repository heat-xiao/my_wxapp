require('../../helpers/lib/weapp-adapter')
import * as THREE from '../../helpers/lib/three.js';
import GLTFLoader from '../../helpers/lib/GLTFLoader.js';


Page({

  data: {
  
  },
  onLoad(options) {
  
  },

  onReady() {
  
  },
  onShow: function () {
  
  },

  init() {
    const loader = new GLTFLoader();
    loader.load('../../helpers/lib/glTF/DamagedHelmet.gltf', function (gltf) {
      gltf.scene.traverse(function (child) {
        if (child.isMesh) {
          child.material.envMap = envMap;
        }
      });
      scene.add(gltf.scene);
    });
  }

})