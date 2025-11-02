import React from "react";
import "./App.css";
import videoBg from "./assets/cyberpunk.mp4";

const App: React.FC = () => {
  return (
    <div className="app-container">
      {/* 🔹 Arka plan videosu */}
      <video
        className="background-video"
        autoPlay
        loop
        muted
        playsInline
      >
        <source src={videoBg} type="video/mp4" />
        Tarayıcınız video etiketini desteklemiyor.
      </video>

      {/* 🔹 İçerik */}
      <div className="content">
        <h1>⚡ ⚡</h1>
        <p>Are you ready to uncover the secrets?</p>
      </div>
    </div>
  );
};

export default App;
