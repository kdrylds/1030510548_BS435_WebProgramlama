const aiImageImports = import.meta.glob("../assets/ai-images/*.{webp,png,jpg,jpeg}", {
  eager: true,
  import: "default",
});

const aiImageUrls: string[] = Object.values(aiImageImports) as string[];

export type GameImage = {
  id: number;
  src: string;
  isAI: boolean;
};

export function pickRandomImages(count: number): GameImage[] {
  if (aiImageUrls.length === 0) {
    console.warn("No AI images found in assets/ai-images");
    return [];
  }

  const shuffled = [...aiImageUrls]
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
  if (aiImageUrls.length === 0) {
    console.warn("No AI images found in assets/ai-images");
  }

  // 1 adet AI + 2 adet Picsum (gerçek görünüm için)
  const aiSrc = aiImageUrls.length > 0
    ? aiImageUrls[Math.floor(Math.random() * aiImageUrls.length)]
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
  if (aiImageUrls.length === 0) {
    console.warn("No AI images found in assets/ai-images");
  }

  // 1 adet AI + 4 adet Picsum (gerçek görünüm için)
  const aiSrc = aiImageUrls.length > 0
    ? aiImageUrls[Math.floor(Math.random() * aiImageUrls.length)]
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
  if (aiImageUrls.length === 0) {
    console.warn("No AI images found in assets/ai-images");
  }

  // 1 adet AI + 4 adet Picsum (gerçek görünüm için)
  const aiSrc = aiImageUrls.length > 0
    ? aiImageUrls[Math.floor(Math.random() * aiImageUrls.length)]
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
