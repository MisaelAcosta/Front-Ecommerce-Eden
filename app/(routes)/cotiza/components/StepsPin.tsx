"use client";

import { useRef } from "react";
import Paso1 from "./paso1";
import Paso2 from "./paso2";

const StepsPin = () => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <section className="relative bg-black">
      <div className="relative">
        <Paso1 />

        {/* contenedor del paso 2 */}
        <div className="relative z-20">
          <Paso2
            fileInputRef={fileInputRef}
            fileName=""
            fileSizeLabel="0 KB"
            modelFile={null}
            quote={null}
            uploadStatus="idle"
            uploadError={null}
            scalePercent={100}
            quoteScalePercent={null}
            canRequote={false}
            onFileChange={() => undefined}
            onOpenPicker={() => undefined}
            onScaleChange={() => undefined}
            onRequote={() => undefined}
          />
        </div>
      </div>
    </section>
  );
};

export default StepsPin;
