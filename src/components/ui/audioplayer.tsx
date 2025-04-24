import { getFileUrl } from '@/lib/network/getFileUrl';
import { useEffect, useRef } from 'react';
import WaveSurfer from 'wavesurfer.js';

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const secondsRemainder = Math.round(seconds) % 60;
  const paddedSeconds = `0${secondsRemainder}`.slice(-2);
  return `${minutes}:${paddedSeconds}`;
};

const createGradients = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
  gradient.addColorStop(0, '#656666');
  gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666');
  gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff');
  gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff');
  gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1');
  gradient.addColorStop(1, '#B1B1B1');

  const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35);
  progressGradient.addColorStop(0, '#EE772F'); // Top color
  progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926');
  progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff');
  progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff');
  progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094');
  progressGradient.addColorStop(1, '#F6B094');

  return [gradient, progressGradient];
};

export function AudioPlayer({ fileName, trackId }: { fileName: string; trackId: string }) {
  const wsRef = useRef<WaveSurfer | null>(null);

  const waveformRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<HTMLDivElement>(null);
  const hoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!wsRef.current && waveformRef.current) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (ctx) {
        try {
          const [gradient, progressGradient] = createGradients(canvas, ctx);

          wsRef.current = WaveSurfer.create({
            container: waveformRef.current,
            waveColor: gradient,
            progressColor: progressGradient,
            barWidth: 2,
            url: getFileUrl(fileName),
          });

          wsRef.current?.on('interaction', () => {
            wsRef.current?.playPause();
          });

          wsRef.current?.on('decode', duration => {
            if (durationRef.current) {
              durationRef.current.textContent = formatTime(duration);
            }
          });
          wsRef.current?.on('timeupdate', currentTime => {
            if (timeRef.current) {
              timeRef.current.textContent = formatTime(currentTime);
            }
          });
        } catch (e) {
          console.log(e);
          wsRef.current = null;
        }
      }
    }
  }, []);

  return (
    <div
      data-testid={`audio-player-${trackId}`}
      onPointerMove={e => {
        if (hoverRef.current) {
          hoverRef.current.style.width = `${e.nativeEvent.offsetX}px`;
        }
      }}
      ref={waveformRef}
      className="group relative cursor-pointer"
    >
      <span
        ref={timeRef}
        id="time"
        className="absolute z-11 top-[50%] left-0 -mt-px translate-y-[-50%] bg-black opacity-[0.75] text-[11px] p-[2px] text-[#ddd]"
      >
        0:00
      </span>
      <span
        ref={durationRef}
        id="duration"
        className="absolute z-11 top-[50%] right-0 -mt-px translate-y-[-50%] bg-black opacity-[0.75] text-[11px] p-[2px] text-[#ddd]"
      >
        0:00
      </span>
      <div
        ref={hoverRef}
        id="hover"
        className="absolute top-0 left-0 z-10 pointer-events-none h-full w-[0] mix-blend-overlay bg-white/50 opacity-0 transition-opacity duration-0 ease-linear group-hover:opacity-[1]"
      ></div>
    </div>
  );
}
