import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { DemoEntry } from '@/data/demoRegistry';

interface ExerciseDemoModalProps {
  exerciseName: string;
  demo: DemoEntry;
  onClose: () => void;
}

function LottiePlayer({ src }: { src: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let destroyed = false;
    import('lottie-web').then(lottie => {
      if (destroyed || !containerRef.current) return;
      const anim = lottie.default.loadAnimation({
        container: containerRef.current,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: src,
      });
      return () => anim.destroy();
    });
    return () => { destroyed = true; };
  }, [src]);

  return <div ref={containerRef} className="w-full h-full" />;
}

function VideoPlayer({ src }: { src: string }) {
  return (
    <video
      src={src}
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-contain rounded-lg"
    />
  );
}

function GifPlayer({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-contain rounded-lg"
    />
  );
}

export function ExerciseDemoModal({ exerciseName, demo, onClose }: ExerciseDemoModalProps) {
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85" onClick={onClose}>
      <div
        className="bg-card rounded-2xl p-4 w-[340px] max-w-[92vw] space-y-3"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground leading-tight pr-2">{exerciseName}</h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-secondary text-muted-foreground active:bg-primary/20 shrink-0"
          >
            <X size={16} />
          </button>
        </div>

        <div className="bg-black/40 rounded-xl overflow-hidden aspect-[4/3] flex items-center justify-center">
          {demo.type === 'lottie' && <LottiePlayer src={demo.src} />}
          {demo.type === 'video' && <VideoPlayer src={demo.src} />}
          {demo.type === 'gif' && <GifPlayer src={demo.src} alt={exerciseName} />}
        </div>
      </div>
    </div>
  );
}
