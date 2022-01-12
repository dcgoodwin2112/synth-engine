import { getNoteFrequency } from "./noteToHz";

test("test getNoteFrequency", () => {
  // A2 == ~110Hz
  expect(Math.round(getNoteFrequency("A2"))).toBe(110);
  // A3 == ~220Hz
  expect(Math.round(getNoteFrequency("A3"))).toBe(220);
  // A4 == 440Hz
  expect(getNoteFrequency("A4")).toBe(440);
  // A5 == ~880Hz
  expect(Math.round(getNoteFrequency("A5"))).toBe(880);
  // A6 == ~1760Hz
  expect(Math.round(getNoteFrequency("A6"))).toBe(1760);
});

test("test getNoteFrequency with octave", () => {
  expect(Math.round(getNoteFrequency("A4", -2))).toBe(
    Math.round(getNoteFrequency("A2"))
  );
  expect(Math.round(getNoteFrequency("A4", -1))).toBe(
    Math.round(getNoteFrequency("A3"))
  );
  expect(Math.round(getNoteFrequency("A4", 0))).toBe(
    Math.round(getNoteFrequency("A4"))
  );
  expect(Math.round(getNoteFrequency("A4", 1))).toBe(
    Math.round(getNoteFrequency("A5"))
  );
  expect(Math.round(getNoteFrequency("A4", 2))).toBe(
    Math.round(getNoteFrequency("A6"))
  );
});
