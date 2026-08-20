import { useCallback, useEffect, useRef, useState } from "react";
import { Bomb, Worm, Grid3X3 } from "lucide-react";
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
    if (state !== "play") return;
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

/* ---------------- shell ---------------- */
const GAMES = [
  { id: "minesweeper", label: "Minesweeper", icon: Bomb, node: <Minesweeper /> },
  { id: "snake", label: "Snake", icon: Worm, node: <Snake /> },
  { id: "ttt", label: "Tic Tac Toe", icon: Grid3X3, node: <TicTacToe /> },
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
