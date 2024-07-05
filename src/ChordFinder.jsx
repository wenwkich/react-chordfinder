import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const keys = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
const modes = [
  {
    name: "Ionian (Major)",
    intervals: [0, 2, 4, 5, 7, 9, 11],
    chordTypes: ["", "m", "m", "", "", "m", "dim"],
  },
  {
    name: "Dorian",
    intervals: [0, 2, 3, 5, 7, 9, 10],
    chordTypes: ["m", "m", "", "", "m", "dim", ""],
  },
  {
    name: "Phrygian",
    intervals: [0, 1, 3, 5, 7, 8, 10],
    chordTypes: ["m", "", "", "m", "dim", "", "m"],
  },
  {
    name: "Lydian",
    intervals: [0, 2, 4, 6, 7, 9, 11],
    chordTypes: ["", "", "", "dim", "", "m", "m"],
  },
  {
    name: "Mixolydian",
    intervals: [0, 2, 4, 5, 7, 9, 10],
    chordTypes: ["", "m", "m", "", "m", "dim", ""],
  },
  {
    name: "Aeolian (Natural Minor)",
    intervals: [0, 2, 3, 5, 7, 8, 10],
    chordTypes: ["m", "dim", "", "m", "m", "", ""],
  },
  {
    name: "Locrian",
    intervals: [0, 1, 3, 5, 6, 8, 10],
    chordTypes: ["dim", "", "m", "m", "", "", "m"],
  },
];

const ChordFinder = () => {
  const [selectedKey, setSelectedKey] = useState("C");
  const [selectedMode, setSelectedMode] = useState(modes[0]);
  const [bassNote, setBassNote] = useState("");
  const [melodicNotes, setMelodicNotes] = useState([]);
  const [chords, setChords] = useState([]);
  const [voicingOptions, setVoicingOptions] = useState({
    add7: false,
    add9: false,
    add11: false,
    add13: false,
    sus2: false,
    sus4: false,
  });

  useEffect(() => {
    generateChords();
  }, [selectedKey, selectedMode, voicingOptions]);

  const generateScale = () => {
    const keyIndex = keys.indexOf(selectedKey);
    return selectedMode.intervals.map(
      (interval) => keys[(keyIndex + interval) % 12]
    );
  };

  const generateChords = () => {
    const scaleNotes = generateScale();
    const newChords = scaleNotes.map((root, index) => {
      const chordType = selectedMode.chordTypes[index];
      const romanNumeral = ["I", "II", "III", "IV", "V", "VI", "VII"][index];
      let chordNotes = [
        root,
        scaleNotes[(index + 2) % 7],
        scaleNotes[(index + 4) % 7],
      ];

      // Apply voicing options
      if (voicingOptions.sus2) {
        chordNotes[1] = scaleNotes[(index + 1) % 7];
      }
      if (voicingOptions.sus4) {
        chordNotes[1] = scaleNotes[(index + 3) % 7];
      }
      if (voicingOptions.add7) {
        chordNotes.push(scaleNotes[(index + 6) % 7]);
      }
      if (voicingOptions.add9) {
        chordNotes.push(scaleNotes[(index + 1) % 7]);
      }
      if (voicingOptions.add11) {
        chordNotes.push(scaleNotes[(index + 3) % 7]);
      }
      if (voicingOptions.add13) {
        chordNotes.push(scaleNotes[(index + 5) % 7]);
      }

      // Remove duplicates
      chordNotes = [...new Set(chordNotes)];

      return { root, chordType, romanNumeral, notes: chordNotes };
    });
    setChords(newChords);
  };

  const handleBassNoteChange = (note) => {
    setBassNote(note);
  };

  const handleMelodicNoteChange = (note) => {
    setMelodicNotes((prev) =>
      prev.includes(note) ? prev.filter((n) => n !== note) : [...prev, note]
    );
  };

  const handleVoicingOptionChange = (option) => {
    setVoicingOptions((prev) => ({ ...prev, [option]: !prev[option] }));
  };

  const getNoteColor = (note, idx) => {
    if (note === bassNote && idx == 0) return "text-blue-500";
    if (melodicNotes.includes(note)) return "text-green-500";
    return "text-black";
  };

  const getChordName = (chord) => {
    let name = `${chord.root}${chord.chordType}`;
    if (voicingOptions.sus2) name += "sus2";
    if (voicingOptions.sus4) name += "sus4";
    if (voicingOptions.add7) name += "7";
    if (voicingOptions.add9) name += "9";
    if (voicingOptions.add11) name += "11";
    if (voicingOptions.add13) name += "13";
    return name;
  };

  return (
    <div className="p-4">
      <div className="flex space-x-4 mb-4">
        <Select onValueChange={setSelectedKey}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a key" />
          </SelectTrigger>
          <SelectContent>
            {keys.map((key) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          onValueChange={(modeName) =>
            setSelectedMode(modes.find((m) => m.name === modeName) || modes[0])
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a mode" />
          </SelectTrigger>
          <SelectContent>
            {modes.map((mode) => (
              <SelectItem key={mode.name} value={mode.name}>
                {mode.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="text-left ">Select a bass note:</div>
      <div className="mt-4 flex space-x-2">
        {generateScale().map((note) => (
          <button
            key={note}
            className={`px-2 py-1 rounded ${
              bassNote === note ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => handleBassNoteChange(note)}
          >
            {note}
          </button>
        ))}
      </div>
      <div className="text-left mt-4">Select melodic notes:</div>
      <div className="mt-4 flex space-x-2">
        {generateScale().map((note) => (
          <button
            key={note}
            className={`px-2 py-1 rounded ${
              melodicNotes.includes(note)
                ? "bg-green-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => handleMelodicNoteChange(note)}
          >
            {note}
          </button>
        ))}
      </div>
      <div className="text-left mt-4">Select alterations: </div>
      <div className="mt-4 flex flex-wrap gap-4">
        {Object.keys(voicingOptions).map((option) => (
          <label key={option} className="flex items-center">
            <Checkbox
              checked={voicingOptions[option]}
              onCheckedChange={() => handleVoicingOptionChange(option)}
            />
            <span className="ml-2">{option}</span>
          </label>
        ))}
      </div>
      <div className="mt-8 text-left">
        {chords.map((chord) => (
          <div key={chord.root + chord.chordType} className="mb-2">
            <span className="font-bold">
              {chord.chordType == "m" || chord.chordType == "dim"
                ? chord.romanNumeral.toLowerCase()
                : chord.romanNumeral}
              {chord.chordType == "dim" ? "°" : ""} ({getChordName(chord)}):
            </span>
            {chord.notes.map((note, idx) => (
              <span key={note} className={`ml-1 ${getNoteColor(note, idx)}`}>
                {note}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChordFinder;
