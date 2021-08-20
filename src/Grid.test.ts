import { GridProps, getLines } from "./Grid";

describe("lines test", () => {
  describe("horizontal", () => {
    it("resolves lineendings with multiple words in one line", () => {
      const grid: GridProps = {
        width: 10,
        height: 1,
        horizontal: [
          { word: "ABC", x: 0, y: 0 },
          { word: "DEF", x: 4, y: 0 },
          { word: "GHI", x: 7, y: 0 },
        ],
        vertical: [],
      };
      const lines = getLines(grid);
      expect(lines.horizontal).toEqual([[2, 3, 6]]);
    });
    it("resolves lineendings with one word per line", () => {
      const grid: GridProps = {
        width: 3,
        height: 3,
        horizontal: [
          { word: "ABC", x: 0, y: 0 },
          { word: "DE", x: 1, y: 1 },
          { word: "FGHI", x: -1, y: 2 },
        ],
        vertical: [
          { word: "AS", x: 0, y: 0 },
          { word: "BDH", x: 1, y: 0 },
          { word: "EIJ", x: 2, y: 1 },
        ],
      };

      const hLines = getLines(grid);
      expect(hLines.horizontal).toEqual([[], [0], []]);
    });
  });
  describe("vertical", () => {
    it("resolves lineendings with multiple words in one line", () => {
      const grid: GridProps = {
        width: 1,
        height: 10,
        horizontal: [],
        vertical: [
          { word: "ABC", x: 0, y: 0 },
          { word: "DEF", x: 0, y: 4 },
          { word: "GHI", x: 0, y: 7 }
        ],
      };
      const lines = getLines(grid);
      expect(lines.vertical).toEqual([[2, 3, 6]]);
    });
    it("resolves lineendings with one word per line", () => {
      const grid: GridProps = {
        width: 3,
        height: 3,
        horizontal: [
          { word: "ABC", x: 0, y: 0 },
          { word: "DE", x: 1, y: 1 },
          { word: "FGHI", x: -1, y: 2 },
        ],
        vertical: [
          { word: "AS", x: 0, y: 0 },
          { word: "BDH", x: 1, y: 0 },
          { word: "EIJ", x: 2, y: 1 },
        ],
      };

      const hLines = getLines(grid);
      expect(hLines.vertical).toEqual([[1], [], [0]]);
    });
  });
});
