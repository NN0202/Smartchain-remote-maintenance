// src/components/Stacker3DViewer.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

const Stacker3DViewer: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current!;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#eeeeee');

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      10000
    );
    camera.position.set(0, 400, 1000);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;

    // 灯光
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1);
    hemiLight.position.set(0, 200, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(100, 100, 100);
    scene.add(dirLight);

    // 网格辅助
    const gridSize = 1000;
    const gridHelper = new THREE.GridHelper(gridSize, 20);
    scene.add(gridHelper);

    // 加载 STL
    const loader = new STLLoader();
    loader.load(
      '/models/stacker.stl',
      (geometry) => {
        geometry.computeBoundingBox();

        const material = new THREE.MeshStandardMaterial({
          color: 0x0077be,
          metalness: 0.2,
          roughness: 0.7,
        });
        const mesh = new THREE.Mesh(geometry, material);

        const box = geometry.boundingBox!;
        const size = new THREE.Vector3();
        box.getSize(size);

        const targetSize = gridSize * 0.8;
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = targetSize / maxDim;
        mesh.scale.setScalar(scale);

        scene.add(mesh);

        // 🌟 缩放后重新计算 bbox
        const boxAfterScale = new THREE.Box3().setFromObject(mesh);
        const centerAfterScale = new THREE.Vector3();
        boxAfterScale.getCenter(centerAfterScale);

        const minY = boxAfterScale.min.y;

        console.log('bbox after scale:', boxAfterScale);
        console.log('center after scale:', centerAfterScale);

        // 🌟 真正居中
        mesh.position.x -= centerAfterScale.x;
        mesh.position.y -= minY;
        mesh.position.z -= centerAfterScale.z;

        // 相机
        const distance = targetSize * 1.2;
        camera.position.set(0, distance, distance);
        controls.target.set(0, 0, 0);
        controls.update();
      },
      (xhr) => {
        console.log(`加载进度: ${(xhr.loaded / xhr.total) * 100}%`);
      },
      (err) => {
        console.error('加载 STL 出错', err);
      }
    );

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      controls.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '400px',
        background: '#ddd',
        borderRadius: '4px',
      }}
    />
  );
};

export default Stacker3DViewer;
