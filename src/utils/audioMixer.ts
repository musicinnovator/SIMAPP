export class AudioMixer {
  private audioContext: AudioContext | null = null;
  private musicSource: AudioBufferSourceNode | null = null;
  private voiceSource: AudioBufferSourceNode | null = null;
  private musicGain: GainNode | null = null;
  private voiceGain: GainNode | null = null;
  private masterGain: GainNode | null = null;
  private destination: MediaStreamAudioDestinationNode | null = null;

  constructor() {
    if (typeof window !== 'undefined' && window.AudioContext) {
      this.audioContext = new AudioContext();
      this.setupNodes();
    }
  }

  private setupNodes() {
    if (!this.audioContext) return;

    this.musicGain = this.audioContext.createGain();
    this.voiceGain = this.audioContext.createGain();
    this.masterGain = this.audioContext.createGain();
    this.destination = this.audioContext.createMediaStreamDestination();

    this.musicGain.connect(this.masterGain);
    this.voiceGain.connect(this.masterGain);
    this.masterGain.connect(this.audioContext.destination);
    this.masterGain.connect(this.destination);
  }

  setMusicVolume(volume: number) {
    if (this.musicGain) {
      this.musicGain.gain.value = volume / 100;
    }
  }

  setVoiceVolume(volume: number) {
    if (this.voiceGain) {
      this.voiceGain.gain.value = volume / 100;
    }
  }

  setMasterVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = volume / 100;
    }
  }

  async loadAudioBuffer(audioData: Blob): Promise<AudioBuffer | null> {
    if (!this.audioContext) return null;

    try {
      const arrayBuffer = await audioData.arrayBuffer();
      return await this.audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error('Error loading audio buffer:', error);
      return null;
    }
  }

  playMusicBuffer(buffer: AudioBuffer) {
    if (!this.audioContext || !this.musicGain) return;

    if (this.musicSource) {
      this.musicSource.stop();
    }

    this.musicSource = this.audioContext.createBufferSource();
    this.musicSource.buffer = buffer;
    this.musicSource.connect(this.musicGain);
    this.musicSource.start(0);
  }

  playVoiceBuffer(buffer: AudioBuffer) {
    if (!this.audioContext || !this.voiceGain) return;

    if (this.voiceSource) {
      this.voiceSource.stop();
    }

    this.voiceSource = this.audioContext.createBufferSource();
    this.voiceSource.buffer = buffer;
    this.voiceSource.connect(this.voiceGain);
    this.voiceSource.start(0);
  }

  stop() {
    if (this.musicSource) {
      this.musicSource.stop();
      this.musicSource = null;
    }
    if (this.voiceSource) {
      this.voiceSource.stop();
      this.voiceSource = null;
    }
  }

  getDestinationStream(): MediaStream | null {
    return this.destination?.stream || null;
  }

  async mixAndExport(
    musicBlob: Blob | null,
    voiceBlob: Blob | null,
    musicVolume: number,
    voiceVolume: number,
    duration: number
  ): Promise<Blob | null> {
    if (!this.audioContext) return null;

    try {
      const offlineContext = new OfflineAudioContext(
        2,
        this.audioContext.sampleRate * duration,
        this.audioContext.sampleRate
      );

      const musicGainNode = offlineContext.createGain();
      const voiceGainNode = offlineContext.createGain();
      const masterGainNode = offlineContext.createGain();

      musicGainNode.gain.value = musicVolume / 100;
      voiceGainNode.gain.value = voiceVolume / 100;
      masterGainNode.gain.value = 1.0;

      musicGainNode.connect(masterGainNode);
      voiceGainNode.connect(masterGainNode);
      masterGainNode.connect(offlineContext.destination);

      if (musicBlob) {
        const musicBuffer = await this.loadAudioBuffer(musicBlob);
        if (musicBuffer) {
          const musicSource = offlineContext.createBufferSource();
          musicSource.buffer = musicBuffer;
          musicSource.connect(musicGainNode);
          musicSource.start(0);
        }
      }

      if (voiceBlob) {
        const voiceBuffer = await this.loadAudioBuffer(voiceBlob);
        if (voiceBuffer) {
          const voiceSource = offlineContext.createBufferSource();
          voiceSource.buffer = voiceBuffer;
          voiceSource.connect(voiceGainNode);
          voiceSource.start(0);
        }
      }

      const renderedBuffer = await offlineContext.startRendering();
      return await this.bufferToWave(renderedBuffer, renderedBuffer.length);
    } catch (error) {
      console.error('Error mixing audio:', error);
      return null;
    }
  }

  private async bufferToWave(buffer: AudioBuffer, length: number): Promise<Blob> {
    const numberOfChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1;
    const bitDepth = 16;

    const bytesPerSample = bitDepth / 8;
    const blockAlign = numberOfChannels * bytesPerSample;

    const data = new Float32Array(length * numberOfChannels);
    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        data[i * numberOfChannels + channel] = channelData[i];
      }
    }

    const dataLength = data.length * bytesPerSample;
    const bufferLength = 44 + dataLength;
    const arrayBuffer = new ArrayBuffer(bufferLength);
    const view = new DataView(arrayBuffer);

    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, bufferLength - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataLength, true);

    let offset = 44;
    for (let i = 0; i < data.length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]));
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
      offset += 2;
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  dispose() {
    this.stop();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}

export async function mergeAudioTracks(
  vocalBlob: Blob,
  musicBlob: Blob,
  vocalVolume: number = 0.75,
  musicVolume: number = 0.80
): Promise<Blob> {
  const audioContext = new AudioContext();

  try {
    const vocalArrayBuffer = await vocalBlob.arrayBuffer();
    const musicArrayBuffer = await musicBlob.arrayBuffer();

    const vocalBuffer = await audioContext.decodeAudioData(vocalArrayBuffer);
    const musicBuffer = await audioContext.decodeAudioData(musicArrayBuffer);

    const duration = Math.max(vocalBuffer.duration, musicBuffer.duration);
    const sampleRate = audioContext.sampleRate;
    const offlineContext = new OfflineAudioContext(2, sampleRate * duration, sampleRate);

    const vocalSource = offlineContext.createBufferSource();
    const musicSource = offlineContext.createBufferSource();
    const vocalGain = offlineContext.createGain();
    const musicGain = offlineContext.createGain();

    vocalSource.buffer = vocalBuffer;
    musicSource.buffer = musicBuffer;
    vocalGain.gain.value = vocalVolume;
    musicGain.gain.value = musicVolume;

    vocalSource.connect(vocalGain);
    musicSource.connect(musicGain);
    vocalGain.connect(offlineContext.destination);
    musicGain.connect(offlineContext.destination);

    vocalSource.start(0);
    musicSource.start(0);

    const renderedBuffer = await offlineContext.startRendering();

    return bufferToWaveBlob(renderedBuffer);
  } finally {
    await audioContext.close();
  }
}

function bufferToWaveBlob(buffer: AudioBuffer): Blob {
  const numberOfChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = 1;
  const bitDepth = 16;
  const length = buffer.length;

  const bytesPerSample = bitDepth / 8;
  const blockAlign = numberOfChannels * bytesPerSample;

  const data = new Float32Array(length * numberOfChannels);
  for (let channel = 0; channel < numberOfChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i * numberOfChannels + channel] = channelData[i];
    }
  }

  const dataLength = data.length * bytesPerSample;
  const bufferLength = 44 + dataLength;
  const arrayBuffer = new ArrayBuffer(bufferLength);
  const view = new DataView(arrayBuffer);

  const writeString = (offset: number, string: string) => {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  };

  writeString(0, 'RIFF');
  view.setUint32(4, bufferLength - 8, true);
  writeString(8, 'WAVE');
  writeString(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, format, true);
  view.setUint16(22, numberOfChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * blockAlign, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitDepth, true);
  writeString(36, 'data');
  view.setUint32(40, dataLength, true);

  let offset = 44;
  for (let i = 0; i < data.length; i++) {
    const sample = Math.max(-1, Math.min(1, data[i]));
    view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7fff, true);
    offset += 2;
  }

  return new Blob([arrayBuffer], { type: 'audio/wav' });
}

