import { useCallback, useEffect, useRef, useState } from "react";
import { Bomb, Worm, Grid3X3, Brain, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------- shared ---------------- */
function useHighScore(key: string) {
  const [score, setScore] = useState(0);
  useEffect(() => {
    const v = localStorage.getItem(`portfolio-hs-${key}`);
    if (v) setScore(Number(v));
  }, [key]);
  const submit = useCallback(
    (v: number) =>
      setScore((prev) => {
        if (v > prev) {
          localStorage.setItem(`portfolio-hs-${key}`, String(v));
          return v;
        }
        return prev;
      }),
    [key],
  );
  return [score, submit] as const;
}

/* ---------------- Snake ---------------- */
const SIZE = 15;

function Snake() {
  const [snake, setSnake] = useState([{ x: 7, y: 7 }]);
  const [food, setFood] = useState({ x: 3, y: 3 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [dead, setDead] = useState(false);
  const [score, setScore] = useState(0);
  const [best, submit] = useHighScore("snake");
  const dirRef = useRef(dir);
  dirRef.current = dir;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, { x: number; y: number }> = {
        ArrowUp: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 },
      };
      const d = map[e.key];
      if (!d) return;
      e.preventDefault();
      const cur = dirRef.current;
      if (cur.x + d.x === 0 && cur.y + d.y === 0) return;
      setDir(d);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (dead) return;
    const t = setInterval(() => {
      setSnake((s) => {
        const head = s[0]!;
        const next = { x: head.x + dirRef.current.x, y: head.y + dirRef.current.y };
        if (
          next.x < 0 ||
          next.y < 0 ||
          next.x >= SIZE ||
          next.y >= SIZE ||
          s.some((c) => c.x === next.x && c.y === next.y)
        ) {
          setDead(true);
          setScore((sc) => {
            submit(sc);
            return sc;
          });
          return s;
        }
        const grew = next.x === food.x && next.y === food.y;
        if (grew) {
          setScore((sc) => sc + 1);
          setFood({
            x: Math.floor(Math.random() * SIZE),
            y: Math.floor(Math.random() * SIZE),
          });
        }
        return [next, ...(grew ? s : s.slice(0, -1))];
      });
    }, 140);
    return () => clearInterval(t);
  }, [dead, food, submit]);

  const reset = () => {
    setSnake([{ x: 7, y: 7 }]);
    setDir({ x: 1, y: 0 });
    setDead(false);
    setScore(0);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        Score {score} · Best {best} · arrow keys to move
      </p>
      <div
        className="grid gap-px rounded-md bg-muted p-1"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1rem)` }}
      >
        {Array.from({ length: SIZE * SIZE }).map((_, i) => {
          const x = i % SIZE;
          const y = Math.floor(i / SIZE);
          const isSnake = snake.some((c) => c.x === x && c.y === y);
          const isFood = food.x === x && food.y === y;
          return (
            <div
              key={i}
              className={cn(
                "h-4 w-4 rounded-[3px]",
                isSnake ? "bg-primary" : isFood ? "bg-destructive" : "bg-card",
              )}
            />
          );
        })}
      </div>
      {dead && (
        <button
          onClick={reset}
          className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
        >
          Game over — play again
        </button>
      )}
    </div>
  );
}

/* ---------------- Minesweeper ---------------- */
const MS = 9;
const MINES = 10;

type Cell = { mine: boolean; open: boolean; flag: boolean; n: number };

function buildBoard(): Cell[] {
  const cells: Cell[] = Array.from({ length: MS * MS }, () => ({
    mine: false,
    open: false,
    flag: false,
    n: 0,
  }));
  let placed = 0;
  while (placed < MINES) {
    const i = Math.floor(Math.random() * cells.length);
    if (!cells[i]!.mine) {
      cells[i]!.mine = true;
      placed++;
    }
  }
  cells.forEach((c, i) => {
    if (c.mine) return;
    const x = i % MS;
    const y = Math.floor(i / MS);
    let n = 0;
    for (let dy = -1; dy <= 1; dy++)
      for (let dx = -1; dx <= 1; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= MS || ny >= MS) continue;
        if (cells[ny * MS + nx]!.mine) n++;
      }
    c.n = n;
  });
  return cells;
}

function Minesweeper() {
  const [cells, setCells] = useState<Cell[]>(buildBoard);
  const [state, setState] = useState<"play" | "lost" | "won">("play");
  const [best, submit] = useHighScore("minesweeper");

  const open = (i: number) => {
    if (state !== "play" || cells[i]!.open || cells[i]!.flag) return;
    const next = cells.map((c) => ({ ...c }));
    const flood = (idx: number) => {
      const c = next[idx];
      if (!c || c.open || c.flag) return;
      c.open = true;
      if (c.n === 0 && !c.mine) {
        const x = idx % MS;
        const y = Math.floor(idx / MS);
        for (let dy = -1; dy <= 1; dy++)
          for (let dx = -1; dx <= 1; dx++) {
            const nx = x + dx;
            const ny = y + dy;
            if (nx < 0 || ny < 0 || nx >= MS || ny >= MS) continue;
            flood(ny * MS + nx);
          }
      }
    };
    if (next[i]!.mine) {
      next.forEach((c) => {
        if (c.mine) c.open = true;
      });
      setState("lost");
    } else {
      flood(i);
      const remaining = next.filter((c) => !c.open && !c.mine).length;
      if (remaining === 0) {
        setState("won");
        submit(best + 1);
      }
    }
    setCells(next);
  };

  const flag = (e: React.MouseEvent, i: number) => {
    e.preventDefault();
    if (state !== "play" || cells[i]?.open) return;
    setCells((cs) => cs.map((c, idx) => (idx === i ? { ...c, flag: !c.flag } : c)));
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        {state === "play" ? "Right-click to flag" : state === "won" ? "Cleared!" : "Boom."} · Wins{" "}
        {best}
      </p>
      <div className="grid gap-px rounded-md bg-muted p-1" style={{ gridTemplateColumns: `repeat(${MS}, 1.75rem)` }}>
        {cells.map((c, i) => (
          <button
            key={i}
            onClick={() => open(i)}
            onContextMenu={(e) => flag(e, i)}
            className={cn(
              "h-7 w-7 rounded-[3px] text-xs font-semibold",
              c.open ? "bg-card" : "bg-secondary hover:bg-accent",
              c.open && c.mine && "bg-destructive text-destructive-foreground",
            )}
          >
            {c.flag && !c.open ? "⚑" : c.open ? (c.mine ? "✳" : c.n || "") : ""}
          </button>
        ))}
      </div>
      <button
        onClick={() => {
          setCells(buildBoard());
          setState("play");
        }}
        className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
      >
        New game
      </button>
    </div>
  );
}

/* ---------------- Tic Tac Toe ---------------- */
const WINS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function TicTacToe() {
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [best, submit] = useHighScore("ttt");

  const winner = WINS.map(([a, b, c]) =>
    board[a!] && board[a!] === board[b!] && board[a!] === board[c!] ? board[a!] : null,
  ).find(Boolean);

  const play = (i: number) => {
    if (board[i] || winner) return;
    const next = [...board];
    next[i] = "X";
    const empty = next.map((v, idx) => (v ? null : idx)).filter((v) => v !== null) as number[];
    const aiWin = WINS.map(([a, b, c]) =>
      next[a!] && next[a!] === next[b!] && next[a!] === next[c!] ? next[a!] : null,
    ).find(Boolean);
    if (!aiWin && empty.length) {
      const pick = empty[Math.floor(Math.random() * empty.length)]!;
      next[pick] = "O";
    }
    setBoard(next);
    const final = WINS.map(([a, b, c]) =>
      next[a!] && next[a!] === next[b!] && next[a!] === next[c!] ? next[a!] : null,
    ).find(Boolean);
    if (final === "X") submit(best + 1);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        {winner ? `${winner} wins` : "Your turn (X)"} · Wins {best}
      </p>
      <div className="grid grid-cols-3 gap-1">
        {board.map((v, i) => (
          <button
            key={i}
            onClick={() => play(i)}
            className="h-16 w-16 rounded-md border border-border bg-card text-2xl font-semibold hover:bg-accent"
          >
            {v}
          </button>
        ))}
      </div>
      <button
        onClick={() => setBoard(Array(9).fill(null))}
        className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
      >
        Reset
      </button>
    </div>
  );
}

/* ---------------- Memory Match ---------------- */
const MEMORY_PAIRS = ["🎮", "🚀", "💎", "⚡", "🌟", "🎯", "🎨", "🔮"];

type MemoryCard = {
  id: number;
  symbol: string;
  matched: boolean;
};

function createMemoryDeck(): MemoryCard[] {
  const deck = [...MEMORY_PAIRS, ...MEMORY_PAIRS]
    .map((symbol) => ({ symbol, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item, id) => ({ id, symbol: item.symbol, matched: false }));
  return deck;
}

function MemoryMatch() {
  const [cards, setCards] = useState<MemoryCard[]>(createMemoryDeck);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [best, submit] = useHighScore("memory");
  const [won, setWon] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleCardClick = (id: number) => {
    if (flipped.length >= 2 || flipped.includes(id) || cards[id]?.matched || won) {
      return;
    }

    if (flipped.length === 0) {
      setFlipped([id]);
    } else if (flipped.length === 1) {
      const firstId = flipped[0]!;
      const secondId = id;
      setFlipped([firstId, secondId]);
      const nextMoves = moves + 1;
      setMoves(nextMoves);

      if (cards[firstId]!.symbol === cards[secondId]!.symbol) {
        const nextCards = cards.map((c) =>
          c.id === firstId || c.id === secondId ? { ...c, matched: true } : c,
        );
        setCards(nextCards);
        setFlipped([]);
        if (nextCards.every((c) => c.matched)) {
          setWon(true);
          submit(best + 1);
        }
      } else {
        timeoutRef.current = setTimeout(() => {
          setFlipped([]);
          timeoutRef.current = null;
        }, 650);
      }
    }
  };

  const reset = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
    setCards(createMemoryDeck());
    setFlipped([]);
    setMoves(0);
    setWon(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        {won ? `Cleared in ${moves} moves!` : `Moves: ${moves}`} · Wins {best}
      </p>
      <div className="grid grid-cols-4 gap-2 rounded-md bg-muted p-2">
        {cards.map((c) => {
          const isFaceUp = flipped.includes(c.id) || c.matched;
          return (
            <button
              key={c.id}
              onClick={() => handleCardClick(c.id)}
              disabled={isFaceUp || won}
              aria-label={isFaceUp ? c.symbol : "Hidden card"}
              className={cn(
                "flex h-14 w-14 select-none items-center justify-center rounded-md border text-xl font-semibold transition-all",
                isFaceUp
                  ? c.matched
                    ? "border-primary/40 bg-primary/15 text-primary cursor-default"
                    : "border-border bg-card text-foreground cursor-default"
                  : "border-border bg-secondary hover:bg-accent text-transparent cursor-pointer active:scale-95",
              )}
            >
              {isFaceUp ? c.symbol : "?"}
            </button>
          );
        })}
      </div>
      <button
        onClick={reset}
        className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
      >
        {won ? "Play again" : "New game"}
      </button>
    </div>
  );
}

/* ---------------- 2048 ---------------- */
function slideRow(row: number[]): { row: number[]; points: number } {
  const nonZero = row.filter((v) => v !== 0);
  const result: number[] = [];
  let points = 0;
  for (let i = 0; i < nonZero.length; i++) {
    if (i + 1 < nonZero.length && nonZero[i] === nonZero[i + 1]) {
      const merged = nonZero[i]! * 2;
      result.push(merged);
      points += merged;
      i++;
    } else {
      result.push(nonZero[i]!);
    }
  }
  while (result.length < 4) {
    result.push(0);
  }
  return { row: result, points };
}

function spawnTile(board: number[]): number[] {
  const empty: number[] = [];
  board.forEach((v, i) => {
    if (v === 0) empty.push(i);
  });
  if (empty.length === 0) return board;
  const idx = empty[Math.floor(Math.random() * empty.length)]!;
  const next = [...board];
  next[idx] = Math.random() < 0.9 ? 2 : 4;
  return next;
}

function init2048(): number[] {
  return spawnTile(spawnTile(Array(16).fill(0)));
}

function hasMovesLeft(b: number[]): boolean {
  if (b.some((v) => v === 0)) return true;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const curr = b[r * 4 + c]!;
      if (c < 3 && curr === b[r * 4 + c + 1]) return true;
      if (r < 3 && curr === b[(r + 1) * 4 + c]) return true;
    }
  }
  return false;
}

function moveBoard(
  board: number[],
  dir: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown",
): { next: number[]; points: number; moved: boolean } {
  const next = [...board];
  let points = 0;

  if (dir === "ArrowLeft") {
    for (let r = 0; r < 4; r++) {
      const row = [next[r * 4]!, next[r * 4 + 1]!, next[r * 4 + 2]!, next[r * 4 + 3]!];
      const res = slideRow(row);
      points += res.points;
      for (let c = 0; c < 4; c++) next[r * 4 + c] = res.row[c]!;
    }
  } else if (dir === "ArrowRight") {
    for (let r = 0; r < 4; r++) {
      const row = [next[r * 4 + 3]!, next[r * 4 + 2]!, next[r * 4 + 1]!, next[r * 4]!];
      const res = slideRow(row);
      points += res.points;
      for (let c = 0; c < 4; c++) next[r * 4 + 3 - c] = res.row[c]!;
    }
  } else if (dir === "ArrowUp") {
    for (let c = 0; c < 4; c++) {
      const col = [next[c]!, next[4 + c]!, next[8 + c]!, next[12 + c]!];
      const res = slideRow(col);
      points += res.points;
      for (let r = 0; r < 4; r++) next[r * 4 + c] = res.row[r]!;
    }
  } else if (dir === "ArrowDown") {
    for (let c = 0; c < 4; c++) {
      const col = [next[12 + c]!, next[8 + c]!, next[4 + c]!, next[c]!];
      const res = slideRow(col);
      points += res.points;
      for (let r = 0; r < 4; r++) next[(3 - r) * 4 + c] = res.row[r]!;
    }
  }

  const moved = next.some((v, i) => v !== board[i]);
  return { next, points, moved };
}

function getTileClass(val: number): string {
  switch (val) {
    case 0:
      return "bg-secondary/40 text-transparent border-transparent";
    case 2:
      return "bg-card text-card-foreground border-border font-semibold";
    case 4:
      return "bg-secondary text-secondary-foreground border-border font-semibold";
    case 8:
      return "bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30 font-bold";
    case 16:
      return "bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/30 font-bold";
    case 32:
      return "bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30 font-bold";
    case 64:
      return "bg-red-500/25 text-red-700 dark:text-red-300 border-red-500/40 font-bold";
    case 128:
      return "bg-yellow-500/30 text-yellow-800 dark:text-yellow-200 border-yellow-500/50 font-bold text-lg";
    case 256:
      return "bg-yellow-500/40 text-yellow-800 dark:text-yellow-200 border-yellow-500/60 font-bold text-lg";
    case 512:
      return "bg-primary/25 text-primary border-primary/40 font-bold text-lg";
    case 1024:
      return "bg-primary/40 text-primary-foreground border-primary/60 font-bold text-base";
    case 2048:
      return "bg-primary text-primary-foreground border-primary font-extrabold text-base ring-2 ring-primary/40";
    default:
      return "bg-primary text-primary-foreground border-primary font-extrabold text-sm";
  }
}

function Game2048() {
  const [board, setBoard] = useState<number[]>(init2048);
  const [score, setScore] = useState(0);
  const [dead, setDead] = useState(false);
  const [best, submit] = useHighScore("2048");

  const boardRef = useRef(board);
  boardRef.current = board;
  const scoreRef = useRef(score);
  scoreRef.current = score;
  const deadRef = useRef(dead);
  deadRef.current = dead;

  const handleMove = useCallback(
    (dir: "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown") => {
      if (deadRef.current) return;
      const { next, points, moved } = moveBoard(boardRef.current, dir);
      if (!moved) return;

      const withSpawn = spawnTile(next);
      const nextScore = scoreRef.current + points;
      setBoard(withSpawn);
      setScore(nextScore);
      submit(nextScore);

      if (!hasMovesLeft(withSpawn)) {
        setDead(true);
      }
    },
    [submit],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
        e.preventDefault();
        handleMove(e.key as "ArrowLeft" | "ArrowRight" | "ArrowUp" | "ArrowDown");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleMove]);

  const reset = () => {
    setBoard(init2048());
    setScore(0);
    setDead(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <p className="text-sm text-muted-foreground">
        Score {score} · Best {best} · arrow keys to move
      </p>
      <div className="grid grid-cols-4 gap-2 rounded-md bg-muted p-2">
        {board.map((val, i) => (
          <div
            key={i}
            className={cn(
              "flex h-14 w-14 select-none items-center justify-center rounded-md border text-xl transition-all",
              getTileClass(val),
            )}
          >
            {val !== 0 ? val : ""}
          </div>
        ))}
      </div>
      {dead ? (
        <button
          onClick={reset}
          className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground"
        >
          Game over — play again
        </button>
      ) : (
        <button
          onClick={reset}
          className="rounded-md border border-border px-3 py-1.5 text-sm hover:bg-accent"
        >
          New game
        </button>
      )}
    </div>
  );
}

/* ---------------- shell ---------------- */
const GAMES = [
  { id: "minesweeper", label: "Minesweeper", icon: Bomb, node: <Minesweeper /> },
  { id: "snake", label: "Snake", icon: Worm, node: <Snake /> },
  { id: "ttt", label: "Tic Tac Toe", icon: Grid3X3, node: <TicTacToe /> },
  { id: "memory", label: "Memory Match", icon: Brain, node: <MemoryMatch /> },
  { id: "2048", label: "2048", icon: Hash, node: <Game2048 /> },
];

export default function GamesApp() {
  const [active, setActive] = useState("minesweeper");
  const game = GAMES.find((g) => g.id === active);

  return (
    <div className="flex h-full">
      <nav className="w-44 shrink-0 border-r border-border bg-secondary/50 p-2">
        {GAMES.map((g) => (
          <button
            key={g.id}
            onClick={() => setActive(g.id)}
            className={cn(
              "mb-0.5 flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm",
              active === g.id ? "bg-accent font-medium" : "hover:bg-accent/60",
            )}
          >
            <g.icon className="h-4 w-4 text-primary" />
            {g.label}
          </button>
        ))}
      </nav>
      <div className="scroll-thin grid min-w-0 flex-1 place-items-center overflow-auto p-5">
        {game?.node}
      </div>
    </div>
  );
}
