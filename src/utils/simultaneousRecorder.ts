/**
 * Simultaneous Recorder
 *
 * Captures both microphone input (voice) and system audio output (accompaniment)
 * simultaneously and mixes them into a single recording.
 */

export class SimultaneousRecorder {
  private voiceStream: MediaStream | null = null;
  private musicAudioContext: AudioContext | null = null;
  private musicDestination: MediaStreamAudioDestinationNode | null = null;
  private combinedStream: MediaStream | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isRecording = false;

  /**
   * Initialize the recorder with microphone and music sources
   */
  async initialize(musicAudioContext: AudioContext): Promise<void> {
    try {
      // Get microphone access
      this.voiceStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      // Store the music audio context
      this.musicAudioContext = musicAudioContext;

      // Create a destination node to capture music output
      this.musicDestination = this.musicAudioContext.createMediaStreamDestination();

      console.log('SimultaneousRecorder initialized successfully');
    } catch (error) {
      console.error('Failed to initialize SimultaneousRecorder:', error);
      throw new Error('Microphone access denied or audio context unavailable');
    }
  }

  /**
   * Connect a Tone.js or Web Audio node to be captured
   */
  connectMusicSource(sourceNode: any): void {
    if (!this.musicDestination || !this.musicAudioContext) {
      console.error('Recorder not initialized');
      return;
    }

    try {
      // If it's a Tone.js node, connect it to the destination
      if (sourceNode && typeof sourceNode.connect === 'function') {
        sourceNode.connect(this.musicDestination);
        console.log('Music source connected to recorder');
      }
    } catch (error) {
      console.error('Failed to connect music source:', error);
    }
  }

  /**
   * Start recording both voice and music
   */
  async startRecording(voiceVolume: number = 1.0, musicVolume: number = 0.7): Promise<void> {
    if (this.isRecording) {
      console.warn('Already recording');
      return;
    }

    if (!this.voiceStream || !this.musicDestination || !this.musicAudioContext) {
      throw new Error('Recorder not initialized. Call initialize() first.');
    }

    try {
      // Create audio context for mixing
      const mixContext = new AudioContext();

      // Create source nodes
      const voiceSource = mixContext.createMediaStreamSource(this.voiceStream);
      const musicSource = mixContext.createMediaStreamSource(this.musicDestination.stream);

      // Create gain nodes for volume control
      const voiceGain = mixContext.createGain();
      const musicGain = mixContext.createGain();
      voiceGain.gain.value = voiceVolume;
      musicGain.gain.value = musicVolume;

      // Create destination for combined stream
      const combinedDestination = mixContext.createMediaStreamDestination();

      // Connect: voice -> gain -> destination
      voiceSource.connect(voiceGain);
      voiceGain.connect(combinedDestination);

      // Connect: music -> gain -> destination
      musicSource.connect(musicGain);
      musicGain.connect(combinedDestination);

      this.combinedStream = combinedDestination.stream;

      // Create MediaRecorder with the combined stream
      const mimeType = this.getSupportedMimeType();
      this.mediaRecorder = new MediaRecorder(this.combinedStream, {
        mimeType,
        audioBitsPerSecond: 128000 // 128 kbps
      });

      this.audioChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(100); // Collect data every 100ms
      this.isRecording = true;

      console.log('Recording started with mimeType:', mimeType);
    } catch (error) {
      console.error('Failed to start recording:', error);
      throw error;
    }
  }

  /**
   * Stop recording and return the recorded blob
   */
  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || !this.isRecording) {
        reject(new Error('Not currently recording'));
        return;
      }

      this.mediaRecorder.onstop = () => {
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const blob = new Blob(this.audioChunks, { type: mimeType });
        this.isRecording = false;
        console.log('Recording stopped. Blob size:', blob.size, 'bytes');
        resolve(blob);
      };

      this.mediaRecorder.onerror = (event: any) => {
        console.error('MediaRecorder error:', event.error);
        reject(event.error);
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Get the best supported MIME type for recording
   */
  private getSupportedMimeType(): string {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/ogg;codecs=opus',
      'audio/mp4',
      'audio/wav'
    ];

    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }

    return 'audio/webm'; // Fallback
  }

  /**
   * Check if recording is in progress
   */
  isActive(): boolean {
    return this.isRecording;
  }

  /**
   * Clean up resources
   */
  dispose(): void {
    if (this.mediaRecorder && this.isRecording) {
      this.mediaRecorder.stop();
    }

    if (this.voiceStream) {
      this.voiceStream.getTracks().forEach(track => track.stop());
      this.voiceStream = null;
    }

    if (this.combinedStream) {
      this.combinedStream.getTracks().forEach(track => track.stop());
      this.combinedStream = null;
    }

    this.musicDestination = null;
    this.musicAudioContext = null;
    this.audioChunks = [];
    this.isRecording = false;

    console.log('SimultaneousRecorder disposed');
  }
}

export const globalSimultaneousRecorder = new SimultaneousRecorder();
