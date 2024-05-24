"use client";

import { useGLTF } from "@react-three/drei";
import { ThreeEvent } from "@react-three/fiber";
import { key, tenKey } from "@/constant";

type KeyboardProps = {
  keyType: "tkl" | "full";
  boardType: "metal" | "plastic";
  selectedKey: string | null;
  changeSelectedKey: (value: string | null) => void;
  keyColor: { [key: string]: string };
};

export default function Keyboard({ keyType, selectedKey, changeSelectedKey, keyColor, boardType }: KeyboardProps) {
  const { nodes, materials } = useGLTF(keyType === "tkl" ? "/glb/TKL_keyboard.glb" : "/glb/keyboard.glb") as any;
  const handleClickKey = (e: ThreeEvent<MouseEvent>, value: string) => {
    e.stopPropagation();
    if (selectedKey === value) {
      changeSelectedKey(null);
      return;
    }
    changeSelectedKey(value);
  };
  const keyArr = keyType === "tkl" ? [...key] : [...key, ...tenKey];
  const scale = keyType === "tkl" ? 2.5 : 0.04;

  return (
    <>
      <group onPointerDown={(e: any) => handleClickKey(e, e.object.material.name)}>
        <mesh
          geometry={nodes.cube.geometry}
          material={materials.cube}
          rotation={keyType === "tkl" ? [-1.2, 0, 0] : [0.4, 0, 0]}
          position={[0, 0, 0]}
          material-color={keyColor["cube"]}
          material-metalness={boardType === "metal" ? 0.9 : 0}
          material-roughness={boardType === "metal" ? 0.2 : 0.7}
          scale={scale}
        />
        {keyArr.map((el) => (
          <mesh
            key={el}
            geometry={nodes[el].geometry}
            position={[0, 0, 0]}
            rotation={keyType === "tkl" ? [-1.2, 0, 0] : [0.4, 0, 0]}
            scale={scale}
          >
            <meshStandardMaterial
              color={keyColor[el]}
              opacity={selectedKey !== null && selectedKey !== "all" && selectedKey !== el ? 0.5 : 1}
              transparent={true}
              name={el}
            />
          </mesh>
        ))}
      </group>
    </>
  );
}
useGLTF.preload("/glb/TKL_keyboard.glb");
useGLTF.preload("/glb/keyboard.glb");
