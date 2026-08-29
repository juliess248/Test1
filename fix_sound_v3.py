from pathlib import Path
from datetime import datetime
import shutil

path = Path("public/index.html")
if not path.exists():
    raise SystemExit("❌ public/index.html not found")

html = path.read_text(encoding="utf-8")

backup = Path(
    f"public/index.html.backup-sound-v3-{datetime.now():%Y%m%d-%H%M%S}"
)
shutil.copy2(path, backup)
print(f"✓ Backup created: {backup}")


def replace_between(text, start_marker, end_marker, replacement):
    start = text.find(start_marker)
    if start == -1:
        raise SystemExit(f"❌ Could not find start marker: {start_marker!r}")
    end = text.find(end_marker, start)
    if end == -1:
        raise SystemExit(f"❌ Could not find end marker: {end_marker!r}")
    return text[:start] + replacement + text[end:]


def replace_exact(text, old, new, label):
    count = text.count(old)
    if count != 1:
        raise SystemExit(
            f"❌ Expected exactly one match for {label}, found {count}"
        )
    return text.replace(old, new, 1)


# ------------------------------------------------------------------
# 1. Replace tap() and deleteSound(), and add a new hunga() function,
#    leaving word()/pangram()/unlock() and everything else untouched.
# ------------------------------------------------------------------

START_MARKER = "  function tap(){"
END_MARKER = "  function word(){"

NEW_FUNCTIONS = """  function tap(){

    playWhenReady(
      c => {

        const t =
          c.currentTime +
          0.002;

        /*
          Short filtered noise transient — the
          "tick" of a physical/glass tile, not an
          electronic beep.
        */
        const noiseDuration = 0.012;

        const bufferSize =
          Math.max(
            1,
            Math.floor(
              c.sampleRate *
              noiseDuration
            )
          );

        const buffer =
          c.createBuffer(
            1,
            bufferSize,
            c.sampleRate
          );

        const data =
          buffer.getChannelData(0);

        for(
          let i = 0;
          i < bufferSize;
          i++
        ){
          data[i] =
            Math.random() * 2 - 1;
        }

        const noise =
          c.createBufferSource();

        noise.buffer =
          buffer;

        const bandpass =
          c.createBiquadFilter();

        bandpass.type =
          'bandpass';

        bandpass.frequency
          .setValueAtTime(
            2600,
            t
          );

        bandpass.Q
          .setValueAtTime(
            1.2,
            t
          );

        const noiseGain =
          c.createGain();

        noiseGain.gain
          .setValueAtTime(
            0.0001,
            t
          );

        noiseGain.gain
          .linearRampToValueAtTime(
            0.05,
            t + 0.002
          );

        noiseGain.gain
          .exponentialRampToValueAtTime(
            0.0001,
            t + noiseDuration
          );

        noise.connect(
          bandpass
        );

        bandpass.connect(
          noiseGain
        );

        noiseGain.connect(
          c.destination
        );

        noise.onended =
          () => {

            try{
              noise.disconnect();
            }catch(error){}

            try{
              bandpass.disconnect();
            }catch(error){}

            try{
              noiseGain.disconnect();
            }catch(error){}

          };

        noise.start(t);
        noise.stop(t + noiseDuration + 0.005);


        /*
          Tiny falling tonal component gives the
          tick a glassy resonance instead of a
          pure electronic beep.
        */
        const toneDuration = 0.035;

        const osc =
          c.createOscillator();

        const oscGain =
          c.createGain();

        osc.type =
          'triangle';

        osc.frequency
          .setValueAtTime(
            950,
            t
          );

        osc.frequency
          .exponentialRampToValueAtTime(
            560,
            t + toneDuration
          );

        oscGain.gain
          .setValueAtTime(
            0.0001,
            t
          );

        oscGain.gain
          .linearRampToValueAtTime(
            0.045,
            t + 0.004
          );

        oscGain.gain
          .exponentialRampToValueAtTime(
            0.0001,
            t + toneDuration
          );

        osc.connect(
          oscGain
        );

        oscGain.connect(
          c.destination
        );

        osc.onended =
          () => {

            try{
              osc.disconnect();
            }catch(error){}

            try{
              oscGain.disconnect();
            }catch(error){}

          };

        osc.start(t);
        osc.stop(t + toneDuration + 0.02);

      }
    );

  }


  function deleteSound(){

    playWhenReady(
      c => {

        const t =
          c.currentTime +
          0.002;

        /*
          Noticeably quieter and shorter than the
          previous descending tone — a light nudge,
          not a competing sound.
        */
        const duration = 0.05;

        const oscillator =
          c.createOscillator();

        const gain =
          c.createGain();


        oscillator.type =
          'sine';


        oscillator.frequency
          .setValueAtTime(
            480,
            t
          );

        oscillator.frequency
          .exponentialRampToValueAtTime(
            260,
            t + duration
          );


        gain.gain
          .setValueAtTime(
            0.0001,
            t
          );

        gain.gain
          .linearRampToValueAtTime(
            0.035,
            t + 0.004
          );

        gain.gain
          .exponentialRampToValueAtTime(
            0.0001,
            t + duration
          );


        oscillator.connect(
          gain
        );

        gain.connect(
          c.destination
        );


        oscillator.onended =
          () => {

            try{
              oscillator.disconnect();
            }catch(error){}

            try{
              gain.disconnect();
            }catch(error){}

          };


        oscillator.start(t);
        oscillator.stop(t + duration + 0.02);

      }
    );

  }


  function hunga(){

    playWhenReady(
      c => {

        const t =
          c.currentTime +
          0.002;

        /*
          Warm soft pop, distinct from the letter
          tick — its own sound rather than reusing
          tap().
        */
        const duration = 0.16;

        const osc =
          c.createOscillator();

        const gain =
          c.createGain();

        const filter =
          c.createBiquadFilter();


        osc.type =
          'sine';

        osc.frequency
          .setValueAtTime(
            220,
            t
          );

        osc.frequency
          .exponentialRampToValueAtTime(
            340,
            t + 0.03
          );

        osc.frequency
          .exponentialRampToValueAtTime(
            260,
            t + duration
          );


        filter.type =
          'lowpass';

        filter.frequency
          .setValueAtTime(
            1200,
            t
          );


        gain.gain
          .setValueAtTime(
            0.0001,
            t
          );

        gain.gain
          .linearRampToValueAtTime(
            0.12,
            t + 0.012
          );

        gain.gain
          .exponentialRampToValueAtTime(
            0.0001,
            t + duration
          );


        osc.connect(
          filter
        );

        filter.connect(
          gain
        );

        gain.connect(
          c.destination
        );


        osc.onended =
          () => {

            try{
              osc.disconnect();
            }catch(error){}

            try{
              filter.disconnect();
            }catch(error){}

            try{
              gain.disconnect();
            }catch(error){}

          };


        osc.start(t);
        osc.stop(t + duration + 0.02);

      }
    );

  }


  /*
    Keep these for backward compatibility.

    If any existing part of the game still calls
    SOUND.word() or SOUND.pangram(), the website
    will not break.
  */

  """

html = replace_between(html, START_MARKER, END_MARKER, NEW_FUNCTIONS)
print("✓ Replaced tap() with a glass-tile tick, quieted deleteSound(), added hunga()")


# ------------------------------------------------------------------
# 2. Expose hunga in the SOUND module's returned object.
# ------------------------------------------------------------------

OLD_RETURN = """    delete:
      deleteSound,

    word,"""

NEW_RETURN = """    delete:
      deleteSound,

    hunga,

    word,"""

html = replace_exact(html, OLD_RETURN, NEW_RETURN, "SOUND return object")
print("✓ Exposed SOUND.hunga()")


# ------------------------------------------------------------------
# 3. Make the Hunga button call SOUND.hunga() instead of SOUND.tap().
# ------------------------------------------------------------------

OLD_HUNGA_HANDLER = """    /*
      Immediate feedback when Hunga is pressed.

      Use the SAME reliable audio system as
      the hive letters.
    */
    if(
      typeof SOUND !== 'undefined' &&
      SOUND &&
      typeof SOUND.tap === 'function'
    ){
      SOUND.tap();
    }"""

NEW_HUNGA_HANDLER = """    /*
      Immediate feedback when Hunga is pressed.

      Uses its own warm pop sound rather than
      reusing the letter tick.
    */
    if(
      typeof SOUND !== 'undefined' &&
      SOUND &&
      typeof SOUND.hunga === 'function'
    ){
      SOUND.hunga();
    }"""

html = replace_exact(html, OLD_HUNGA_HANDLER, NEW_HUNGA_HANDLER, "Hunga button handler")
print("✓ Hunga button now plays its own sound instead of the letter tick")


path.write_text(html, encoding="utf-8")

print("")
print("Letter → short filtered transient + falling tonal component (glass tile)")
print("Bora/delete → quieter and shorter than before")
print("Hunga → its own warm soft pop (no longer reuses the letter tick)")
print("Reward hierarchy unchanged: word → pangram → puzzle completion, one sound each")
print("Rank-up remains visual only — no sound stacking with correct-word feedback")
print("")
print("✓ Done")
