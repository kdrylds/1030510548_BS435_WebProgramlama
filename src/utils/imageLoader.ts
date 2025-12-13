const croppedAiImports = import.meta.glob(
  "../assets/ai-images/_cropped/*.{webp,png,jpg,jpeg}",
  { eager: true, import: "default" }
);

const originalAiImports = import.meta.glob(
  "../assets/ai-images/*.{webp,png,jpg,jpeg}",
  { eager: true, import: "default" }
);

// Önce _cropped klasörünü kullan, yoksa orijinal dosyalara geri dön
const aiImagePool: string[] = (() => {
  const cropped = Object.values(croppedAiImports) as string[];
  if (cropped.length > 0) return cropped;
  return Object.values(originalAiImports) as string[];
})();

export type GameImage = {
  id: number;
  src: string;
  isAI: boolean;
};

export function pickRandomImages(count: number): GameImage[] {
  if (aiImagePool.length === 0) {
    console.warn("No AI images found in assets/ai-images (or _cropped)");
    return [];
  }

  const shuffled = [...aiImagePool]
    .map((src) => ({ src, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .slice(0, count)
    .map((item, idx) => ({ id: idx + 1, src: item.src, isAI: false }));

  // Rastgele bir tanesini AI olarak işaretle
  const aiIndex = Math.floor(Math.random() * shuffled.length);
  shuffled[aiIndex].isAI = true;

  return shuffled;
}

export function pickEasySet(): GameImage[] {
  if (aiImagePool.length === 0) {
    console.warn("No AI images found in assets/ai-images (or _cropped)");
  }

  // 1 adet AI + 2 adet Picsum (gerçek görünüm için)
  const aiSrc = aiImagePool.length > 0
    ? aiImagePool[Math.floor(Math.random() * aiImagePool.length)]
    : "";

  const picsumImages: GameImage[] = Array.from({ length: 2 }).map((_, idx) => {
    const seed = Math.random().toString(36).slice(2, 10);
    return {
      id: idx + 1,
      src: `https://picsum.photos/seed/${seed}/600/600`,
      isAI: false,
    };
  });

  const aiImage: GameImage = {
    id: picsumImages.length + 1,
    src: aiSrc,
    isAI: true,
  };

  const combined = [...picsumImages, aiImage]
    .map((img) => ({ ...img, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((img, idx) => ({ id: idx + 1, src: img.src, isAI: img.isAI }));

  return combined;
}

export function pickNormalSet(): GameImage[] {
  if (aiImagePool.length === 0) {
    console.warn("No AI images found in assets/ai-images (or _cropped)");
  }

  // 1 adet AI + 4 adet Picsum (gerçek görünüm için)
  const aiSrc = aiImagePool.length > 0
    ? aiImagePool[Math.floor(Math.random() * aiImagePool.length)]
    : "";

  const picsumImages: GameImage[] = Array.from({ length: 4 }).map((_, idx) => {
    const seed = Math.random().toString(36).slice(2, 10);
    return {
      id: idx + 1,
      src: `https://picsum.photos/seed/${seed}/600/600`,
      isAI: false,
    };
  });

  const aiImage: GameImage = {
    id: picsumImages.length + 1,
    src: aiSrc,
    isAI: true,
  };

  const combined = [...picsumImages, aiImage]
    .map((img) => ({ ...img, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((img, idx) => ({ id: idx + 1, src: img.src, isAI: img.isAI }));

  return combined;
}

export function pickHardSet(): GameImage[] {
  if (aiImagePool.length === 0) {
    console.warn("No AI images found in assets/ai-images (or _cropped)");
  }

  // 1 adet AI + 4 adet Picsum (gerçek görünüm için)
  const aiSrc = aiImagePool.length > 0
    ? aiImagePool[Math.floor(Math.random() * aiImagePool.length)]
    : "";

  const picsumImages: GameImage[] = Array.from({ length: 4 }).map((_, idx) => {
    const seed = Math.random().toString(36).slice(2, 10);
    return {
      id: idx + 1,
      src: `https://picsum.photos/seed/${seed}/600/600`,
      isAI: false,
    };
  });

  const aiImage: GameImage = {
    id: picsumImages.length + 1,
    src: aiSrc,
    isAI: true,
  };

  const combined = [...picsumImages, aiImage]
    .map((img) => ({ ...img, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((img, idx) => ({ id: idx + 1, src: img.src, isAI: img.isAI }));

  return combined;
}
