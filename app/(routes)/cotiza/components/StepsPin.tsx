"use client";

import Paso1 from "./paso1";
import Paso2 from "./paso2";

const StepsPin = () => {
  return (
    <section className="relative bg-white">
      <div className="relative">
        <Paso1 />

        {/* contenedor del paso 2 */}
        <div className="relative z-20">
          <Paso2 />
        </div>
      </div>
    </section>
  );
};

export default StepsPin;