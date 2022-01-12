import { getNoteFrequency } from "./noteToHz";

test('getNoteFrequency' , () => {
    expect(getNoteFrequency("A4")).toBe(440);
})