import React, { useEffect, useRef, useState } from 'react';

interface WaveformVisualizerProps {
  audioBlob?: Blob | null;
  audioUrl?: string | null;
  isRecording?: boolean;
  audioStream?: MediaStream | null;
  height?: number;
  width?: number;
  barWidth?: number;
  barGap?: number;
  barColor?: string;
  backgroundColor?: string;
  showTime?: boolean;
}

export default function WaveformVisualizer({
  audioBlob,
  audioUrl,
  isRecording = false,
  audioStream,
  height = 100,
  width = 600,
  barWidth = 2,
  barGap = 1,
  barColor = '#3b82f6',
  backgroundColor = 'transparent',
  showTime = true
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Draw waveform from audio data
  const drawWaveform = (dataArray: Uint8Array, bufferLength: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);

    const barCount = Math.floor(width / (barWidth + barGap));
    const step = Math.floor(bufferLength / barCount);

    ctx.fillStyle = barColor;

    for (let i = 0; i < barCount; i++) {
      const dataIndex = i * step;
      const value = dataArray[dataIndex] || 0;
      const barHeight = (value / 255) * height;
      const x = i * (barWidth + barGap);
      const y = (height - barHeight) / 2;

      ctx.fillRect(x, y, barWidth, barHeight);
    }
  };

  // Draw static waveform from audio file
  const drawStaticWaveform = async (source: Blob | string) => {
    try {
      const audioContext = new AudioContext();
      const arrayBuffer = typeof source === 'string'
        ? await fetch(source).then(r => r.arrayBuffer())
        : await source.arrayBuffer();

      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      const channelData = audioBuffer.getChannelData(0);
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);

      const barCount = Math.floor(width / (barWidth + barGap));
      const step = Math.floor(channelData.length / barCount);

      ctx.fillStyle = barColor;

      for (let i = 0; i < barCount; i++) {
        let sum = 0;
        for (let j = 0; j < step; j++) {
          sum += Math.abs(channelData[i * step + j] || 0);
        }
        const average = sum / step;
        const barHeight = average * height * 2;
        const x = i * (barWidth + barGap);
        const y = (height - barHeight) / 2;

        ctx.fillRect(x, y, barWidth, barHeight);
      }

      setDuration(audioBuffer.duration);
    } catch (error) {
      console.error('Failed to draw static waveform:', error);
    }
  };

  // Real-time recording visualization
  useEffect(() => {
    if (!isRecording || !audioStream) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (analyserRef.current) {
        analyserRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      return;
    }

    const setupRecordingVisualization = async () => {
      try {
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(audioStream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 2048;
        source.connect(analyserRef.current);

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
          if (!isRecording || !analyserRef.current) return;

          animationRef.current = requestAnimationFrame(draw);
          analyserRef.current.getByteTimeDomainData(dataArray);
          drawWaveform(dataArray, bufferLength);
        };

        draw();
      } catch (error) {
        console.error('Failed to setup recording visualization:', error);
      }
    };

    setupRecordingVisualization();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isRecording, audioStream]);

  // Static waveform from blob or URL
  useEffect(() => {
    if (isRecording) return;

    if (audioBlob) {
      drawStaticWaveform(audioBlob);
    } else if (audioUrl) {
      drawStaticWaveform(audioUrl);
    }
  }, [audioBlob, audioUrl, isRecording]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="rounded-lg border border-white/10"
        style={{ width: '100%', maxWidth: `${width}px`, height: `${height}px` }}
      />
      {showTime && (duration > 0 || isRecording) && (
        <div className="flex justify-between items-center mt-2 text-xs text-blue-300">
          <span>{formatTime(currentTime)}</span>
          {duration > 0 && <span>{formatTime(duration)}</span>}
        </div>
      )}
      {isRecording && (
        <div className="absolute top-2 right-2 flex items-center space-x-2 bg-red-500/80 px-2 py-1 rounded-full">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
          <span className="text-white text-xs font-bold">REC</span>
        </div>
      )}
    </div>
  );
}
