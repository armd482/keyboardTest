"use client";

import { Suspense, useCallback, useEffect, useState, useRef } from "react";
import styles from "./page.module.css";
import Keyboard from "@/components/Keyboard";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls } from "@react-three/drei";
import CanvasLoading from "@/components/CanvasLoading";
import { ColorResult, SketchPicker } from "react-color";
import { key, tenKey } from "@/constant";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const DEFAULT_KEY_COLOR = {};
[...key, ...tenKey, "cube"].forEach((el) => {
  Object.assign(DEFAULT_KEY_COLOR, { [el]: "#ffffff" });
});

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlRef = useRef<OrbitControlsImpl>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const optionRef = useRef<HTMLDivElement>(null);
  const [keyType, setKeyType] = useState<"tkl" | "full">("full");
  const [boardType, setBoardType] = useState<"metal" | "plastic">("metal");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [keyColor, setKeyColor] = useState<{ [key: string]: string }>(DEFAULT_KEY_COLOR);
  const [color, setColor] = useState<string>("#ffffff");
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

  const handleClickOutside = () => {
    setSelectedKey(null);
  };

  const handleClickReset = () => {
    setSelectedKey(null);
    setKeyColor(DEFAULT_KEY_COLOR);
    const control = controlRef.current;
    if (control) {
      control.reset();
    }
    console.log(DEFAULT_KEY_COLOR);
  };

  const handleClickImageButton = () => {
    const canvas = canvasRef.current;
    const control = controlRef.current;
    if (!canvas || !control) return;
    setSelectedKey(null);
    control.reset();
    requestAnimationFrame(() => {
      const image = canvas.toDataURL("image/png");
      console.log(image);
    });
  };
  /* console.log(color); */
  useEffect(() => {
    if (selectedKey && selectedKey !== "all") {
      setColor(keyColor[selectedKey]);
    }
  }, [selectedKey, keyColor]);

  useEffect(() => {
    const clickOuter = (e: MouseEvent) => {
      if (!canvasWrapperRef.current?.contains(e.target as Node) && !optionRef.current?.contains(e.target as Node)) {
        setSelectedKey(null);
      }
    };
    document.addEventListener("click", clickOuter);
    return () => {
      document.removeEventListener("click", clickOuter);
    };
  }, []);

  return (
    <>
      <div className={styles.buttonWrapper}>
        <button onClick={() => setKeyType("tkl")}>tkl</button>
        <button onClick={() => setKeyType("full")}>full</button>
      </div>
      <div className={styles.wrapper}>
        <div className={styles.canvasWrapper} ref={canvasWrapperRef}>
          <Suspense fallback={<CanvasLoading />}>
            <Canvas
              ref={canvasRef}
              camera={{
                fov: 45, //시야각
                near: 0.2, //가까이 있는 물체 렌더링 범위
                position: [0, 1.5, 0.6], //위치
              }}
              style={{ width: "500px" }}
              gl={{ preserveDrawingBuffer: true, antialias: true }}
              onPointerMissed={handleClickOutside}
            >
              <Keyboard
                keyType={keyType}
                boardType={boardType}
                selectedKey={selectedKey}
                changeSelectedKey={changeSelectedKey}
                keyColor={keyColor}
              />
              <Environment preset="city" />
              <OrbitControls ref={controlRef} />
            </Canvas>
          </Suspense>
        </div>
        <div className={styles.optionWrapper} ref={optionRef}>
          <div>선택: {selectedKey}</div>
          <div className={styles.buttonWrapper}>
            <button onClick={() => setSelectedKey("all")}>전체</button>
            {/* <button onClick={() => setSelectedKey(null)}>선택 해제</button> */}
            <button onClick={handleClickReset}>초기화</button>
          </div>
          <div className={styles.buttonWrapper}>
            <button onClick={() => setBoardType("metal")}>금속</button>
            <button onClick={() => setBoardType("plastic")}>플라스틱</button>
          </div>
          <div className={styles.colorPickerWrapper}>
            <SketchPicker color={color} onChange={changeColor} disableAlpha />
            {!selectedKey && <div className={styles.disabledBox} />}
          </div>
          <button onClick={handleClickImageButton}>사진 저장</button>
        </div>
      </div>
    </>
  );
}
