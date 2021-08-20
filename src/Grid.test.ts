import { GridProps, getLines, word } from "./Grid";

describe("lines test", () => {
  describe("horizontal", () => {
    it("resolves lineendings with multiple words in one line", () => {
      const grid: GridProps = {
        grid: [["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]],
        words: [word(0, 0, 2, 0), word(4, 0, 6, 0), word(7, 0, 9, 0)],
        offsetX: 0,
        offsetY: 0,
      };
      const lines = getLines(grid);
      expect(lines.horizontal).toEqual([[2, 3, 6]]);
    });
    it("resolves lineendings with one word per line", () => {
      const grid: GridProps = {
        grid: [
          // -1, 0, 1, 2
          ["", "A", "B", "C"],
          ["", "S", "D", "E"],
          ["F", "G", "H", "I"],
        ],
        words: [
          word(0, 0, 2, 0),
          word(1, 1, 2, 1),
          word(-1, 2, 2, 2),
          word(0, 0, 0, 1),
          word(1, 0, 1, 2),
          word(2, 1, 2, 3),
        ],
        offsetX: 1,
        offsetY: 0,
      };

      const lines = getLines(grid);
      expect(lines.horizontal).toEqual([[], [0], []]);
    });
  });
  describe("vertical", () => {
    it("resolves lineendings with multiple words in one line", () => {
      const grid: GridProps = {
        grid: [
          ["A"],
          ["B"],
          ["C"],
          ["D"],
          ["E"],
          ["F"],
          ["G"],
          ["H"],
          ["I"],
          ["J"],
        ],
        words: [word(0, 0, 0, 2), word(0, 4, 0, 6), word(0, 7, 0, 9)],
        offsetX: 0,
        offsetY: 0,
      };
      const lines = getLines(grid);
      expect(lines.vertical).toEqual([[2, 3, 6]]);
    });
    it("resolves lineendings with one word per line", () => {
      const grid: GridProps = {
        grid: [
          ["", "A", "N", "D"],
          ["", "M", "O", "S"],
          ["B", "O", "W", "L"],
        ],
        words: [
          word(0, 0, 2, 0),
          word(1, 1, 2, 1),
          word(-1, 2, 3, 2),
          word(0, 0, 0, 1),
          word(1, 0, 1, 2),
          word(2, 1, 2, 3),
        ],
        offsetX: 1,
        offsetY: 0,
      };

      const lines = getLines(grid);
      expect(lines.vertical).toEqual([[1], [], [0]]);
    });
  });
});
