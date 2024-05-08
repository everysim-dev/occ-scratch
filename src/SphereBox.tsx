import { useEffect, useState, useCallback } from "react";
import "./App.css";
import shapeToUrl from "./shapeToUrl";
import initOpenCascade from "opencascade.js";
import "@google/model-viewer";
import debounce from "lodash/debounce";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "model-viewer": ModelViewerJSX &
        React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}

interface ModelViewerJSX {
  src: string;
  poster?: string;
  class?: string;
  // ... others
}

function SphereBox() {
  const [modelUrl, setModelUrl] = useState<string>();
  const [sphereSize, setSphereSize] = useState<number>(0.65); // 초기 구의 크기 설정

  const createModel = useCallback((size: number) => {
    initOpenCascade().then((oc) => {
      const box = new oc.BRepPrimAPI_MakeBox_2(1, 1, 1);
      const sphere = new oc.BRepPrimAPI_MakeSphere_5(
        new oc.gp_Pnt_3(0.5, 0.5, 0.5),
        size
      );
      const cut = new oc.BRepAlgoAPI_Cut_3(
        box.Shape(),
        sphere.Shape(),
        new oc.Message_ProgressRange_1()
      );
      cut.Build(new oc.Message_ProgressRange_1());
      setModelUrl(shapeToUrl(oc, cut.Shape()));
    });
  }, []);

  useEffect(() => {
    createModel(sphereSize);
  }, [sphereSize, createModel]); // sphereSize를 종속성 배열에 추가

  const debouncedSetSphereSize = useCallback(debounce(setSphereSize, 300), []); // 300ms의 디바운스

  const handleSliderChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetSphereSize(Number(event.target.value));
  };

  return (
    <div className="App">
      <header className="App-header">
        <img
          className="App-logo"
          src="https://github.com/donalffons/opencascade.js/raw/master/images/logo.svg"
          alt="Ocjs Logo"
        />
        <p>
          Edit <code>src/Test1.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://ocjs.org/docs/about"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn OpenCascade.js
        </a>
        <input
          type="range"
          min="0.51"
          max="0.8"
          step="0.01"
          value={sphereSize}
          onChange={handleSliderChange}
        />
        {modelUrl === undefined ? (
          <p>Loading...</p>
        ) : (
          <model-viewer class="App-viewport" src={modelUrl} camera-controls />
        )}
      </header>
    </div>
  );
}

export default SphereBox;
