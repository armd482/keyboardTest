"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import styles from "./page.module.css";
import Keyboard from "@/components/Keyboard";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import CanvasLoading from "@/components/CanvasLoading";
import { ColorResult, SketchPicker } from "react-color";
import { key, tenKey } from "@/constant";

export default function Home() {
  const [keyType, setKeyType] = useState<"tkl" | "full">("full");
  const [boardType, setBoardType] = useState<"metal" | "plastic">("metal");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [keyColor, setKeyColor] = useState<{ [key: string]: string }>(() => {
    const k = [...key, ...tenKey, "cube"];
    const c = {};
    k.map((el) => {
      Object.assign(c, { [el]: "#ffffff" });
    });
    return c;
  });
  const [color, setColor] = useState<string>("#000000");
  const changeSelectedKey = useCallback((value: string | null) => {
    setSelectedKey(value);
  }, []);

  const changeColor = (c: ColorResult) => {
    setColor(c.hex);
    if (!selectedKey) {
      return;
    }
    if (selectedKey === "all") {
      setKeyColor(() => {
        const col = {};
        [...key, ...tenKey].forEach((el) => Object.assign(col, { [el]: c.hex }));
        return col;
      });
      return;
    }
    if (selectedKey === "cube") {
      const col = {};
      setKeyColor((prev) => ({ ...prev, cube: c.hex }));
      return col;
    }
    setKeyColor((prev) => ({ ...prev, [selectedKey]: c.hex }));
  };
  /* console.log(color); */
  useEffect(() => {
    if (selectedKey && selectedKey !== "all") {
      setColor(keyColor[selectedKey]);
    }
  }, [selectedKey, keyColor]);
  return (
    <>
      <div className={styles.buttonWrapper}>
        <button onClick={() => setKeyType("tkl")}>tkl</button>
        <button onClick={() => setKeyType("full")}>full</button>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.canvasWrapper}>
          <Suspense fallback={<CanvasLoading />}>
            <Canvas
              camera={{
                fov: 45, //시야각
                near: 0.2, //가까이 있는 물체 렌더링 범위
                position: [0, 1.5, 0.6], //위치
              }}
              style={{ width: "500px", backgroundColor: "gray" }}
            >
              <Keyboard
                keyType={keyType}
                boardType={boardType}
                selectedKey={selectedKey}
                changeSelectedKey={changeSelectedKey}
                keyColor={keyColor}
              />
              <Environment preset="warehouse" background />
              <OrbitControls />
              {/* <ambientLight /> */}
            </Canvas>
          </Suspense>
        </div>
        <div className={styles.optionWrapper}>
          <div className={styles.buttonWrapper}>
            <button onClick={() => setSelectedKey("all")}>전체</button>
            <button onClick={() => setSelectedKey(null)}>선택 해제</button>
          </div>
          <div className={styles.buttonWrapper}>
            <button onClick={() => setBoardType("metal")}>금속</button>
            <button onClick={() => setBoardType("plastic")}>플라스틱</button>
          </div>

          {selectedKey && <SketchPicker color={color} onChange={changeColor} width={190} />}
        </div>
      </div>
    </>
  );
}