/**
 * City avenue audio: soft car engine + light background music.
 * Engine eases in/out — no dry cuts when stopping.
 */

const FILES = {
  idle: '/city3d/engine-idle.wav',
  drive: '/city3d/engine-drive.wav',
  rev: '/city3d/engine-rev.wav',
  brake: '/city3d/brake.wav',
  music: '/city3d/bg-music.wav',
};

async function loadBuffer(ctx, url) {
  const res = await fetch(url);
  const raw = await res.arrayBuffer();
  return ctx.decodeAudioData(raw.slice(0));
}

function makeLoop(ctx, buffer, dest) {
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  const gain = ctx.createGain();
  gain.gain.value = 0;
  src.connect(gain);
  gain.connect(dest);
  src.start();
  return { src, gain };
}

export function createEngineAudio() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return {
      unlock() {},
      playIntro() {},
      setDrive() {},
      setMuted() {},
      fadeOut() {},
      fadeIn() {},
      dispose() {},
    };
  }

  const ctx = new AudioCtx();
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);

  // Engine bus — warmer, less “lata” (tinny)
  const engineBus = ctx.createGain();
  engineBus.gain.value = 0.55;
  const muffler = ctx.createBiquadFilter();
  muffler.type = 'lowpass';
  muffler.frequency.value = 1400;
  muffler.Q.value = 0.45;
  const presence = ctx.createBiquadFilter();
  presence.type = 'peaking';
  presence.frequency.value = 120;
  presence.Q.value = 0.7;
  presence.gain.value = 1.6;
  const highCut = ctx.createBiquadFilter();
  highCut.type = 'highshelf';
  highCut.frequency.value = 2500;
  highCut.gain.value = -6;
  presence.connect(muffler);
  muffler.connect(highCut);
  highCut.connect(engineBus);
  engineBus.connect(master);

  // Music bus
  const musicBus = ctx.createGain();
  musicBus.gain.value = 1;
  const musicFilter = ctx.createBiquadFilter();
  musicFilter.type = 'lowpass';
  musicFilter.frequency.value = 4200;
  musicFilter.connect(musicBus);
  musicBus.connect(master);

  let idle = null;
  let drive = null;
  let music = null;
  let buffers = null;
  let muted = false;
  let unlocked = false;
  let ready = false;
  let mode = 'idle';
  let loadPromise = null;
  let musicStarted = false;
  let fadedOut = false;
  let disposeTimer = null;
  const MASTER_ON = 0.62;

  const now = () => ctx.currentTime;

  function setMaster(v, t = 0.2) {
    master.gain.cancelScheduledValues(now());
    master.gain.linearRampToValueAtTime(muted ? 0 : Math.max(0, v), now() + t);
  }

  function fade(gainNode, value, t = 0.25) {
    if (!gainNode) return;
    gainNode.gain.cancelScheduledValues(now());
    gainNode.gain.linearRampToValueAtTime(Math.max(0, value), now() + t);
  }

  function easeRate(src, value, t = 0.45) {
    if (!src) return;
    src.playbackRate.cancelScheduledValues(now());
    src.playbackRate.linearRampToValueAtTime(value, now() + t);
  }

  async function ensureLoaded() {
    if (ready) return true;
    if (!loadPromise) {
      loadPromise = (async () => {
        const [idleBuf, driveBuf, revBuf, brakeBuf, musicBuf] = await Promise.all([
          loadBuffer(ctx, FILES.idle),
          loadBuffer(ctx, FILES.drive),
          loadBuffer(ctx, FILES.rev),
          loadBuffer(ctx, FILES.brake),
          loadBuffer(ctx, FILES.music),
        ]);
        buffers = {
          idle: idleBuf,
          drive: driveBuf,
          rev: revBuf,
          brake: brakeBuf,
          music: musicBuf,
        };
        idle = makeLoop(ctx, idleBuf, presence);
        drive = makeLoop(ctx, driveBuf, presence);
        music = makeLoop(ctx, musicBuf, musicFilter);
        ready = true;
      })().catch((err) => {
        console.warn('City audio load failed', err);
        loadPromise = null;
        return false;
      });
    }
    await loadPromise;
    return ready;
  }

  function playOneShot(buffer, volume = 0.35, rate = 1) {
    if (!buffer || muted) return;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = rate;
    const g = ctx.createGain();
    g.gain.value = 0;
    src.connect(g);
    g.connect(presence);
    src.start();
    const dur = buffer.duration / rate;
    const t0 = now();
    g.gain.linearRampToValueAtTime(volume, t0 + 0.04);
    g.gain.linearRampToValueAtTime(volume * 0.7, t0 + dur * 0.55);
    g.gain.linearRampToValueAtTime(0, t0 + Math.max(0.12, dur - 0.02));
  }

  function ensureMusicPlaying() {
    if (!music || musicStarted || muted) return;
    musicStarted = true;
    fade(music.gain, 0.3, 2.4);
  }

  /** Soft coast back to idle — never cuts dry */
  function coastToIdle() {
    fade(drive?.gain, 0, 0.95);
    fade(idle?.gain, 0.3, 0.8);
    easeRate(drive?.src, 0.88, 0.9);
    easeRate(idle?.src, 1.0, 0.85);
    muffler.frequency.cancelScheduledValues(now());
    muffler.frequency.linearRampToValueAtTime(1400, now() + 0.8);
    if (music && musicStarted && !muted) fade(music.gain, 0.3, 0.7);
    mode = 'idle';
  }

  return {
    async unlock() {
      if (ctx.state === 'suspended') await ctx.resume();
      await ensureLoaded();
      unlocked = true;
      if (!muted) setMaster(0.62, 0.3);
      ensureMusicPlaying();
    },

    async playIntro() {
      if (!unlocked) await this.unlock();
      if (!ready || muted) return;
      setMaster(0.62, 0.12);
      ensureMusicPlaying();
      fade(idle?.gain, 0.1, 0.12);
      fade(drive?.gain, 0, 0.12);
      // lighter revs
      playOneShot(buffers.rev, 0.28, 0.92);
      window.setTimeout(() => playOneShot(buffers.rev, 0.22, 1.0), 480);
      window.setTimeout(() => {
        playOneShot(buffers.rev, 0.18, 1.05);
        fade(idle?.gain, 0.28, 0.55);
        easeRate(idle?.src, 1, 0.5);
        mode = 'idle';
      }, 980);
    },

    /**
     * @param {{ moving: boolean, accel: boolean, braking: boolean }} state
     */
    setDrive({ moving, accel, braking }) {
      if (!unlocked || !ready) return;

      if (!moving) {
        if (mode !== 'idle') coastToIdle();
        return;
      }

      if (braking) {
        // soft slowdown — no sharp brake “lata”
        if (mode !== 'brake') {
          playOneShot(buffers.brake, 0.12, 0.9);
          mode = 'brake';
        }
        fade(drive?.gain, 0.12, 0.35);
        fade(idle?.gain, 0.26, 0.35);
        easeRate(drive?.src, 0.9, 0.4);
        easeRate(idle?.src, 0.96, 0.4);
        muffler.frequency.linearRampToValueAtTime(1200, now() + 0.35);
        if (music && musicStarted && !muted) fade(music.gain, 0.28, 0.4);
        return;
      }

      mode = 'drive';
      // gentle accel — volume sobe pouco, pitch sobe suave
      const rate = accel ? 1.08 : 1.01;
      fade(drive?.gain, accel ? 0.32 : 0.24, 0.35);
      fade(idle?.gain, accel ? 0.1 : 0.16, 0.35);
      easeRate(drive?.src, rate, 0.4);
      easeRate(idle?.src, accel ? 1.03 : 1.0, 0.4);
      muffler.frequency.cancelScheduledValues(now());
      muffler.frequency.linearRampToValueAtTime(accel ? 1700 : 1400, now() + 0.4);
      if (music && musicStarted && !muted) {
        fade(music.gain, accel ? 0.24 : 0.3, 0.5);
      }
    },

    setMuted(value) {
      muted = value;
      if (fadedOut) {
        setMaster(0, 0.12);
        return;
      }
      setMaster(value ? 0 : MASTER_ON, 0.12);
      if (!value && ready) {
        ensureMusicPlaying();
        if (music) fade(music.gain, 0.3, 0.5);
      }
    },

    /** Soft exit — used when leaving the avenue / scrolling away */
    fadeOut(duration = 0.85) {
      fadedOut = true;
      const t = Math.max(0.2, duration);
      master.gain.cancelScheduledValues(now());
      master.gain.linearRampToValueAtTime(0, now() + t);
      // ease engine layers down too, so it coasts instead of muting mid-rev
      fade(drive?.gain, 0, t);
      fade(idle?.gain, 0, t * 0.9);
      if (music) fade(music.gain, 0, t);
      easeRate(drive?.src, 0.9, t);
      easeRate(idle?.src, 0.95, t);
    },

    /** Soft return when the avenue is visible again */
    fadeIn(duration = 0.9) {
      if (muted) return;
      fadedOut = false;
      const t = Math.max(0.25, duration);
      setMaster(MASTER_ON, t);
      if (music && musicStarted) fade(music.gain, 0.3, t);
      else ensureMusicPlaying();
      fade(idle?.gain, mode === 'idle' ? 0.28 : 0.12, t);
      if (mode === 'drive' || mode === 'brake') fade(drive?.gain, 0.2, t);
    },

    dispose() {
      if (disposeTimer) window.clearTimeout(disposeTimer);
      try {
        idle?.src.stop();
        drive?.src.stop();
        music?.src.stop();
        ctx.close();
      } catch {
        /* ignore */
      }
    },

    /** Fade then tear down — for unmount / leaving projects */
    disposeSoft(duration = 0.8) {
      this.fadeOut(duration);
      if (disposeTimer) window.clearTimeout(disposeTimer);
      disposeTimer = window.setTimeout(() => this.dispose(), Math.ceil(duration * 1000) + 60);
    },
  };
}
