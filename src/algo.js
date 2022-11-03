import { printHTML } from './tool';

/** @param {import('./tool').NS} ns */
export async function main(ns) {
  const list = ns.codingcontract.getContractTypes();
  for (const item of list) {
    printHTML(item);
  }
}

export const ContractSolvers = {
  /** 
   * A prime factor is a factor that is a prime number. What is the largest prime factor of {@link n}? 
   * 
   * @param {number} n
   * @return {number}
  */
  "Find Largest Prime Factor": (n) => {
    if (typeof n !== "number") throw new Error("solver expected number");
    let fac = 2;
    let n = n;
    while (n > (fac - 1) * (fac - 1)) {
      while (n % fac === 0) {
        n = Math.round(n / fac);
      }
      ++fac;
    }

    return n === 1 ? fac - 1 : n;
  },

  /** 
   * Given the following integer array {@link list}, find the contiguous subarray
   * (containing at least one number) which has the largest sum and return that sum.
   * 'Sum' refers to the sum of all the numbers in the subarray.
   * 
   * @param {number[]} list
   * @param {number}
  */
  "Subarray with Maximum Sum": (list) => {
    for (let i = 1; i < list.length; i++) {
      list[i] = Math.max(list[i], list[i] + list[i - 1]);
    }

    return Math.max(...list);
  },

  /**
   * It is possible write four as a sum in exactly four different ways:
   *     3 + 1
   *     2 + 2
   *     2 + 1 + 1
   *     1 + 1 + 1 + 1
   * How many different distinct ways can the number {@link n} be written as a sum of at least
   * two positive integers?
   * 
   * @param {number} n
   * @param {number}
  */
  "Total Ways to Sum": (n) => {
    if (typeof n !== "number") throw new Error("solver expected number");
    const ways = [1];
    ways.length = n + 1;
    ways.fill(0, 1);
    for (let i = 1; i < n; ++i) {
      for (let j = i; j <= n; ++j) {
        ways[j] += ways[j - i];
      }
    }

    return ways[n];
  },

  /**
   * How many different distinct ways can the number {@link n} be written
   * as a sum of integers contained in the set {@link list}?
   * You may use each integer in the set zero or more times.
   * 
   * @param {[number, number[]]}
   * @return {number}
  */
  "Total Ways to Sum II": ([n, list]) => {
    const ways = [1];
    ways.length = n + 1;
    ways.fill(0, 1);
    for (let i = 0; i < list.length; i++) {
      for (let j = list[i]; j <= n; j++) {
        ways[j] += ways[j - list[i]];
      }
    }
    return ways[n];
  },

  /**
   * Given the following array of arrays of numbers representing a 2D matrix {@link matrix},
   * return the elements of the matrix as an array in spiral order.
   * 
   * @param {number[][]} matrix
   * @return {number[]}
  */
  "Spiralize Matrix": (matrix) => {
    /** @type {number[]} */
    const spiral = [];
    const m = matrix.length;
    const n = matrix[0].length;
    let u = 0;
    let d = m - 1;
    let l = 0;
    let r = n - 1;
    let k = 0;
    while (true) {
      // Up
      for (let col = l; col <= r; col++) { spiral[k++] = matrix[u][col]; }
      if (++u > d) { break; }

      // Right
      for (let row = u; row <= d; row++) { spiral[k++] = matrix[row][r]; }
      if (--r < l) { break; }

      // Down
      for (let col = r; col >= l; col--) { spiral[k++] = matrix[d][col]; }
      if (--d < u) { break; }

      // Left
      for (let row = d; row >= u; row--) { spiral[k++] = matrix[row][l]; }
      if (++l > r) { break; }
    }
    return spiral;
  },

  /**
   * You are given the following array of integers: {@link list}
   * Each element in the array represents your MAXIMUM jump length
   * at that position. This means that if you are at position i and your
   * maximum jump length is n, you can jump to any position from i to i+n.
   * Assuming you are initially positioned
   * at the start of the array, determine whether you are
   * able to reach the last index.
   * Your answer should be submitted as 1 or 0, representing true and false respectively
   * 
   * @param {number[]} list
   * @return {0 | 1}
  */
  "Array Jumping Game": (list) => {
    const n = list.length;
    let i = 0;
    for (let reach = 0; i < n && i <= reach; ++i) {
      reach = Math.max(i + list[i], reach);
    }
    return i == 1 ? 1 : 0;
  },

  /**
   * You are given the following array of integers: {@link list}
   * Each element in the array represents your MAXIMUM jump length
   * at that position. This means that if you are at position i and your
   * maximum jump length is n, you can jump to any position from i to i+n.
   * Assuming you are initially positioned
   * at the start of the array, determine the minimum number of
   * jumps to reach the end of the array.
   * If it's impossible to reach the end, then the answer should be 0.
   * 
   * @param {number[]} list
   * @return {number}
  */
  "Array Jumping Game II": (list) => {
    const n = list.length;
    let reach = 0;
    let jumps = 0;
    let lastJump = -1;
    while (reach < n - 1) {
      let jumpedFrom = -1;
      for (let i = reach; i > lastJump; i--) {
        if (i + list[i] > reach) {
          reach = i + list[i];
          jumpedFrom = i;
        }
      }
      if (jumpedFrom === -1) {
        jumps = 0;
        break;
      }
      lastJump = jumpedFrom;
      jumps++;
    }
    return jumps;
  },

  /**
   * Given the following array of arrays of numbers representing a list of
   * intervals: {@link data}, merge all overlapping intervals.
   * Example:
   * [[1, 3], [8, 10], [2, 6], [10, 16]]
   * would merge into [[1, 6], [8, 16]].
   * The intervals must be returned in ASCENDING order.
   * You can assume that in an interval, the first number will always be
   * smaller than the second.
   * 
   * @param {[number, number][]} data
   * @return {[number, number][]}
  */
  "Merge Overlapping Intervals": (data) => {
    data.sort((a, b) => a[0] - b[0]);

    const result = [];
    let start = data[0][0];
    let end = data[0][1];
    for (const interval of data) {
      if (interval[0] <= end) {
        end = Math.max(end, interval[1]);
      } else {
        result.push([start, end]);
        start = interval[0];
        end = interval[1];
      }
    }
    result.push([start, end]);
    return result;
  },

  /**
   * Given the following string containing only digits: {@link data}, return
   * an array with all possible valid IP address combinations
   * that can be created from the string.
   * Note that an octet cannot begin with a '0' unless the number
   * itself is actually 0. For example, '192.168.010.1' is not a valid IP.\n\n
   * Examples:
   * 25525511135 -> ["255.255.11.135", "255.255.111.35"]\n
   * 1938718066 -> ["193.87.180.66"]
   * 
   * @param {string} data
   * @return {string[]}
  */
  "Generate IP Addresses": (data) => {
    const ret = [];
    for (let a = 1; a <= 3; ++a) {
      for (let b = 1; b <= 3; ++b) {
        for (let c = 1; c <= 3; ++c) {
          for (let d = 1; d <= 3; ++d) {
            if (a + b + c + d === data.length) {
              const A = parseInt(data.substring(0, a), 10);
              const B = parseInt(data.substring(a, a + b), 10);
              const C = parseInt(data.substring(a + b, a + b + c), 10);
              const D = parseInt(data.substring(a + b + c, a + b + c + d), 10);
              if (A <= 255 && B <= 255 && C <= 255 && D <= 255) {
                const ip = [A.toString(), ".", B.toString(), ".", C.toString(), ".", D.toString()].join("");
                if (ip.length === data.length + 3) {
                  ret.push(ip);
                }
              }
            }
          }
        }
      }
    }

    return ret;
  },

  /**
   * You are given the following array of stock prices (which are numbers): {@link data}
   * where the i-th element represents the stock price on day i.
   * Determine the maximum possible profit you can earn using at most
   * one transaction (i.e. you can only buy and sell the stock once). If no profit can be made
   * then the answer should be 0. Note that you have to buy the stock before you can sell it.
   * 
   * @param {number[]} data
   * @return {number}
  */
  "Algorithmic Stock Trader I": (data) => {
    let maxCur = 0;
    let maxSoFar = 0;
    for (let i = 1; i < data.length; ++i) {
      maxCur = Math.max(0, (maxCur += data[i] - data[i - 1]));
      maxSoFar = Math.max(maxCur, maxSoFar);
    }

    return maxSoFar;
  },

  /**
   * You are given the following array of stock prices (which are numbers): {@link data}
   * where the i-th element represents the stock price on day i.
   * Determine the maximum possible profit you can earn using as many
   * transactions as you'd like. A transaction is defined as buying
   * and then selling one share of the stock. Note that you cannot
   * engage in multiple transactions at once. In other words, you
   * must sell the stock before you buy it again.
   * If no profit can be made, then the answer should be 0.
   * 
   * @param {number[]} data
   * @return {number}
  */
  "Algorithmic Stock Trader II": (data) => {
    let profit = 0;
    for (let p = 1; p < data.length; ++p) {
      profit += Math.max(data[p] - data[p - 1], 0);
    }

    return profit;
  },

  /**
   * You are given the following array of stock prices (which are numbers): {@link data}
   * where the i-th element represents the stock price on day i.
   * Determine the maximum possible profit you can earn using at most
   * two transactions. A transaction is defined as buying
   * and then selling one share of the stock. Note that you cannot
   * engage in multiple transactions at once. In other words, you
   * must sell the stock before you buy it again.
   * If no profit can be made, then the answer should be 0.
   *
   * @param {number[]} data
   * @return {number}
  */
  "Algorithmic Stock Trader III": (data) => {
    let hold1 = Number.MIN_SAFE_INTEGER;
    let hold2 = Number.MIN_SAFE_INTEGER;
    let release1 = 0;
    let release2 = 0;
    for (const price of data) {
      release2 = Math.max(release2, hold2 + price);
      hold2 = Math.max(hold2, release1 - price);
      release1 = Math.max(release1, hold1 + price);
      hold1 = Math.max(hold1, price * -1);
    }

    return release2;
  },

  /**
   * You are given the following array with two elements: [{@link k}, {@link prices}]
   * The first element is an integer k. The second element is an
   * array of stock prices (which are numbers) where the i-th element
   * represents the stock price on day i.
   * Determine the maximum possible profit you can earn using at most
   * k transactions. A transaction is defined as buying and then selling
   * one share of the stock. Note that you cannot engage in multiple
   * transactions at once. In other words, you must sell the stock before
   * you can buy it again.
   * If no profit can be made, then the answer should be 0.
   * 
   * @param {[number, number[]]}
   * @return {number}
  */
  "Algorithmic Stock Trader IV": ([k, prices]) => {
    const len = prices.length;
    if (len < 2) {
      return parseInt(ans) === 0;
    }
    if (k > len / 2) {
      let res = 0;
      for (let i = 1; i < len; ++i) {
        res += Math.max(prices[i] - prices[i - 1], 0);
      }

      return parseInt(ans) === res;
    }

    const hold = [];
    const rele = [];
    hold.length = k + 1;
    rele.length = k + 1;
    for (let i = 0; i <= k; ++i) {
      hold[i] = Number.MIN_SAFE_INTEGER;
      rele[i] = 0;
    }

    let cur;
    for (let i = 0; i < len; ++i) {
      cur = prices[i];
      for (let j = k; j > 0; --j) {
        rele[j] = Math.max(rele[j], hold[j] + cur);
        hold[j] = Math.max(hold[j], rele[j - 1] - cur);
      }
    }

    return rele[k];
  },

  /**
   * Given a triangle, find the minimum path sum from top to bottom. In each step
   * of the path, you may only move to adjacent numbers in the row below.
   * The triangle is represented as a 2D array of numbers: {@link map}
   * Example: If you are given the following triangle: 
   * [[2],
   *  [3,4],
   *  [6,5,7],
   *  [4,1,8,3]]
   * The minimum path sum is 11 (2 -> 3 -> 5 -> 1).
   * 
   * @param {number[][]} map
   * @return {number}
  */
  "Minimum Path Sum in a Triangle": (map) => {
    const n = map.length;
    const dp = map[n - 1].slice();
    for (let i = n - 2; i > -1; --i) {
      for (let j = 0; j < map[i].length; ++j) {
        dp[j] = Math.min(dp[j], dp[j + 1]) + map[i][j];
      }
    }

    return dp[0];
  },

  /**
   * You are in a grid with {@link m} rows and {@link n} columns,
   * and you are positioned in the top-left corner of that grid.
   * You are trying to reach the bottom-right corner of the grid,
   * but you can only move down or right on each step.
   * Determine how many unique paths there are from start to finish.
   * 
   * @param {[number, number]}
   * @return {number}
  */
  "Unique Paths in a Grid I": ([m, n]) => {
    const currentRow = [];
    currentRow.length = n;

    for (let i = 0; i < n; i++) {
      currentRow[i] = 1;
    }
    for (let row = 1; row < m; row++) {
      for (let i = 1; i < n; i++) {
        currentRow[i] += currentRow[i - 1];
      }
    }

    return currentRow[n - 1];
  },

  /**
   * You are located in the top-left corner of the given grid: {@link grid}
   * You are trying reach the bottom-right corner of the grid, but you can only
   * move down or right on each step. Furthermore, there are obstacles on the grid
   * that you cannot move onto. These obstacles are denoted by 1, while empty spaces are denoted by 0.
   * Determine how many unique paths there are from start to finish.
   * NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
   * 
   * @param {number[][]} grid
   * @return {number}
  */
  "Unique Paths in a Grid II": (grid) => {
    const obstacleGrid = [];
    obstacleGrid.length = grid.length;
    for (let i = 0; i < obstacleGrid.length; ++i) {
      obstacleGrid[i] = grid[i].slice();
    }

    for (let i = 0; i < obstacleGrid.length; i++) {
      for (let j = 0; j < obstacleGrid[0].length; j++) {
        if (obstacleGrid[i][j] == 1) {
          obstacleGrid[i][j] = 0;
        } else if (i == 0 && j == 0) {
          obstacleGrid[0][0] = 1;
        } else {
          obstacleGrid[i][j] = (i > 0 ? obstacleGrid[i - 1][j] : 0) + (j > 0 ? obstacleGrid[i][j - 1] : 0);
        }
      }
    }

    return obstacleGrid[obstacleGrid.length - 1][obstacleGrid[0].length - 1];
  },

  /**
   * You are located in the top-left corner of the given grid: {@link grid}.
   * You are trying to find the shortest path to the bottom-right corner of the grid,
   * but there are obstacles on the grid that you cannot move onto.
   * These obstacles are denoted by 1, while empty spaces are denoted by 0.
   * Determine the shortest path from start to finish, if one exists.
   * The answer should be given as a string of UDLR characters, indicating the moves along the path
   * NOTE: If there are multiple equally short paths, any of them is accepted as answer.
   * If there is no path, the answer should be an empty string.
   * NOTE: The data returned for this contract is an 2D array of numbers representing the grid.
   * Examples:
   * [[0,1,0,0,0],
   *  [0,0,0,1,0]]
   * Answer: 'DRRURRD'
   * [[0,1],
   *  [1,0]]
   * Answer: ''
   * 
   * @param {number[][]} grid
   * @return {string}
  */
  "Shortest Path in a Grid": (grid) => {
    const Directions = { U: [-1, 0], D: [1, 0], L: [0, -1], R: [0, 1] };
    /** @typedef {{pos:[number, number], path:string}} Path */

    /** @type {Path[]} */
    let list = [{ pos: [0, 0], path: '' }];
    while (true) {
      const item = list.shift();
      if (!item) { return ''; }
      const { pos, path } = item;
      for (const [k, v] of Object.entries(Directions)) {
        const newPos = [pos[0] + v[0], pos[1] + v[1]];
        if (newPos[0] >= 0 && newPos[0] < grid[0].length
          && newPos[1] >= 0 && newPos[1] < grid.length
          && grid[newPos[1]][newPos[0]] == 0) {
          grid[newPos[1]][newPos[0]] == 2;
          if (newPos[0] == grid[0].length - 1 && newPos[1] == grid.length - 1) return path + k;
          list.push({ pos: newPos, path: path + k });
        }
      }
    }
  },

  /**
   * Given the following string: {@link str}
   * remove the minimum number of invalid parentheses in order to validate
   * the string. If there are multiple minimal ways to validate the string,
   * provide all of the possible results. The answer should be provided
   * as an array of strings. If it is impossible to validate the string
   * the result should be an array with only an empty string.
   * IMPORTANT: The string may contain letters, not just parentheses.
   * Examples:\n
   * "()())()" -> [()()(), (())()]\n
   * "(a)())()" -> [(a)()(), (a())()]\n
   * ")(" -> [""]
   * 
   * @param {string} str
   * @return {string[]}
  */
  "Sanitize Parentheses in Expression": (str) => {
    if (typeof data !== "string") throw new Error("solver expected string");
    let left = 0;
    let right = 0;
    const res = [];

    for (let i = 0; i < data.length; ++i) {
      if (data[i] === "(") {
        ++left;
      } else if (data[i] === ")") {
        left > 0 ? --left : ++right;
      }
    }

    function dfs(pair, index, left, right, s, solution, res,) {
      if (s.length === index) {
        if (left === 0 && right === 0 && pair === 0) {
          for (let i = 0; i < res.length; i++) {
            if (res[i] === solution) {
              return;
            }
          }
          res.push(solution);
        }
        return;
      }

      if (s[index] === "(") {
        if (left > 0) {
          dfs(pair, index + 1, left - 1, right, s, solution, res);
        }
        dfs(pair + 1, index + 1, left, right, s, solution + s[index], res);
      } else if (s[index] === ")") {
        if (right > 0) dfs(pair, index + 1, left, right - 1, s, solution, res);
        if (pair > 0) dfs(pair - 1, index + 1, left, right, s, solution + s[index], res);
      } else {
        dfs(pair, index + 1, left, right, s, solution + s[index], res);
      }
    }

    dfs(0, 0, left, right, data, "", res);

    return res;
  },
  /**
   * You are given the following string which contains only digits between 0 and 9: {@link str},
   * You are also given a target number of {@link n}. Return all possible ways
   * you can add the +(add), -(subtract), and *(multiply) operators to the string such
   * that it evaluates to the target number. (Normal order of operations applies.)
   * The provided answer should be an array of strings containing the valid expressions.
   * The data provided by this problem is an array with two elements. The first element
   * is the string of digits, while the second element is the target number: [{@link str}, {@link n}]
   * NOTE: The order of evaluation expects script operator precedence
   * NOTE: Numbers in the expression cannot have leading 0's. In other words,
   * "1+01" is not a valid expression
   * Examples:\n\n
   * Input: digits = "123", target = 6\n
   * Output: [1+2+3, 1*2*3]\n\n
   * Input: digits = "105", target = 5\n
   * Output: [1*0+5, 10-5]
   * 
   * @param {[string, number]}
   * @return {string[]}
  */
  "Find All Valid Math Expressions": ([str, n]) => {
    const n = data[0];
    const str = data[1];

    function helper(res, path, num, target, pos, evaluated, multed) {
      if (pos === num.length) {
        if (target === evaluated) {
          res.push(path);
        }
        return;
      }

      for (let i = pos; i < num.length; ++i) {
        if (i != pos && num[pos] == "0") {
          break;
        }
        const cur = parseInt(num.substring(pos, i + 1));

        if (pos === 0) {
          helper(res, path + cur, num, target, i + 1, cur, cur);
        } else {
          helper(res, path + "+" + cur, num, target, i + 1, evaluated + cur, cur);
          helper(res, path + "-" + cur, num, target, i + 1, evaluated - cur, -cur);
          helper(res, path + "*" + cur, num, target, i + 1, evaluated - multed + multed * cur, multed * cur);
        }
      }
    }

    const result = [];
    helper(result, "", n, str, 0, 0, 0);

    return result;
  },

  /**
   * You are given the following decimal Value: {@link n}
   * Convert it to a binary representation and encode it as an 'extended Hamming code'. Eg:
   * Value 8 is expressed in binary as '1000', which will be encoded
   * with the pattern 'pppdpddd', where p is a parity bit and d a data bit,
   * or '10101' (Value 21) will result into (pppdpdddpd) '1001101011'.
   * The answer should be given as a string containing only 1s and 0s.
   * NOTE: the endianness of the data bits is reversed in relation to the endianness of the parity bits.
   * NOTE: The bit at index zero is the overall parity bit, this should be set last.
   * NOTE 2: You should watch the Hamming Code video from 3Blue1Brown, which explains the 'rule' of encoding,
   * including the first index parity bit mentioned in the previous note.
   * Extra rule for encoding:
   * There should be no leading zeros in the 'data bit' section
   * 
   * @param {number} n
   * @return {string}
  */
  "HammingCodes: Integer to Encoded Binary": (n) => {
    return HammingEncode(data);
  },

  /**
   * You are given the following encoded binary string: {@link str}
   * Treat it as an extended Hamming code with 1 'possible' error at a random index.
   * Find the 'possible' wrong bit, fix it and extract the decimal value, which is hidden inside the string.
   * Note: The length of the binary string is dynamic, but it's encoding/decoding follows Hamming's 'rule'
   * Note 2: Index 0 is an 'overall' parity bit. Watch the Hamming code video from 3Blue1Brown for more information
   * Note 3: There's a ~55% chance for an altered Bit. So... MAYBE there is an altered Bit 😉
   * Note: The endianness of the encoded decimal value is reversed in relation to the endianness of the Hamming code. Where
   * the Hamming code is expressed as little-endian (LSB at index 0), the decimal value encoded in it is expressed as big-endian
   * (MSB at index 0).
   * Extra note for automation: return the decimal value as a string
   * 
   * @param {string} str
  */
  "HammingCodes: Encoded Binary to Integer": (str) => {
    return HammingDecode(str);
  },

  /**
   * You are given the following data, representing a graph.
   * Note that "graph", as used here, refers to the field of graph theory, and has
   * no relation to statistics or plotting.
   * The first element of the data represents the number of vertices in the graph: {@link n}.
   * Each vertex is a unique number between 0 and {@link n} - 1.
   * The next element of the data represents the edges of the graph: {@link edges}
   * Two vertices u,v in a graph are said to be adjacent if there exists an edge [u,v].
   * Note that an edge [u,v] is the same as an edge [v,u], as order does not matter.
   * You must construct a 2-coloring of the graph, meaning that you have to assign each
   * vertex in the graph a "color", either 0 or 1, such that no two adjacent vertices have
   * the same color. Submit your answer in the form of an array, where element i
   * represents the color of vertex i. If it is impossible to construct a 2-coloring of
   * the given graph, instead submit an empty array.
   * Examples:
   * Input: [4, [[0, 2], [0, 3], [1, 2], [1, 3]]]
   * Output: [0, 0, 1, 1]
   * Input: [3, [[0, 1], [0, 2], [1, 2]]]
   * Output: []
   * 
   * @param {[number, number[][]]}
   * @return {number[]}
   * 
  */
  "Proper 2-Coloring of a Graph": ([n, edges]) => {
    
  },
  // {
  //   name: "Compression I: RLE Compression",
  //     difficulty: 2,
  //       numTries: 10,
  //         desc: (plaintext: unknown): string => {
  //           return [
  //             "Run-length encoding (RLE) is a data compression technique which encodes data as a series of runs of",
  //             "a repeated single character. Runs are encoded as a length, followed by the character itself. Lengths",
  //             "are encoded as a single ASCII digit; runs of 10 characters or more are encoded by splitting them",
  //             "into multiple runs.\n\n",
  //             "You are given the following input string:\n",
  //             `&nbsp; &nbsp; ${plaintext}\n`,
  //             "Encode it using run-length encoding with the minimum possible output length.\n\n",
  //             "Examples:\n",
  //             "&nbsp; &nbsp; aaaaabccc &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;-> &nbsp;5a1b3c\n",
  //             "&nbsp; &nbsp; aAaAaA &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -> &nbsp;1a1A1a1A1a1A\n",
  //             "&nbsp; &nbsp; 111112333 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;-> &nbsp;511233\n",
  //             "&nbsp; &nbsp; zzzzzzzzzzzzzzzzzzz &nbsp;-> &nbsp;9z9z1z &nbsp;(or 9z8z2z, etc.)\n",
  //           ].join(" ");
  //         },
  //           gen: (): string => {
  //             const length = 50 + Math.floor(25 * (Math.random() + Math.random()));
  //             let plain = "";

  //             while (plain.length < length) {
  //               const r = Math.random();

  //               let n = 1;
  //               if (r < 0.3) {
  //                 n = 1;
  //               } else if (r < 0.6) {
  //                 n = 2;
  //               } else if (r < 0.9) {
  //                 n = Math.floor(10 * Math.random());
  //               } else {
  //                 n = 10 + Math.floor(5 * Math.random());
  //               }

  //               const c = comprGenChar();
  //               plain += c.repeat(n);
  //             }

  //             return plain.substring(0, length);
  //           },
  //             solver: (plain: unknown, ans: string): boolean => {
  //               if (typeof plain !== "string") throw new Error("solver expected string");
  //               if (ans.length % 2 !== 0) {
  //                 return false;
  //               }

  //               let ans_plain = "";
  //               for (let i = 0; i + 1 < ans.length; i += 2) {
  //                 const length = ans.charCodeAt(i) - 0x30;
  //                 if (length < 0 || length > 9) {
  //                   return false;
  //                 }

  //                 ans_plain += ans[i + 1].repeat(length);
  //               }
  //               if (ans_plain !== plain) {
  //                 return false;
  //               }

  //               let length = 0;
  //               for (let i = 0; i < plain.length;) {
  //                 let run_length = 1;
  //                 while (i + run_length < plain.length && plain[i + run_length] === plain[i]) {
  //                   ++run_length;
  //                 }
  //                 i += run_length;

  //                 while (run_length > 0) {
  //                   run_length -= 9;
  //                   length += 2;
  //                 }
  //               }

  //               return ans.length <= length;
  //             },
  //   },
  // {
  //   name: "Compression II: LZ Decompression",
  //     difficulty: 4,
  //       numTries: 10,
  //         desc: (compressed: unknown): string => {
  //           return [
  //             "Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to",
  //             "earlier parts of the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk",
  //             "begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data,",
  //             "which is either:\n\n",
  //             "1. Exactly L characters, which are to be copied directly into the uncompressed data.\n",
  //             "2. A reference to an earlier part of the uncompressed data. To do this, the length is followed",
  //             "by a second ASCII digit X: each of the L output characters is a copy of the character X",
  //             "places before it in the uncompressed data.\n\n",
  //             "For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character",
  //             "is the start of a new chunk. The two chunk types alternate, starting with type 1, and the final",
  //             "chunk may be of either type.\n\n",
  //             "You are given the following LZ-encoded string:\n",
  //             `&nbsp; &nbsp; ${compressed}\n`,
  //             "Decode it and output the original string.\n\n",
  //             "Example: decoding '5aaabb450723abb' chunk-by-chunk\n",
  //             "&nbsp; &nbsp; 5aaabb &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; -> &nbsp;aaabb\n",
  //             "&nbsp; &nbsp; 5aaabb45 &nbsp; &nbsp; &nbsp; &nbsp; -> &nbsp;aaabbaaab\n",
  //             "&nbsp; &nbsp; 5aaabb450 &nbsp; &nbsp; &nbsp; &nbsp;-> &nbsp;aaabbaaab\n",
  //             "&nbsp; &nbsp; 5aaabb45072 &nbsp; &nbsp; &nbsp;-> &nbsp;aaabbaaababababa\n",
  //             "&nbsp; &nbsp; 5aaabb450723abb &nbsp;-> &nbsp;aaabbaaababababaabb",
  //           ].join(" ");
  //         },
  //           gen: (): string => {
  //             return comprLZEncode(comprLZGenerate());
  //           },
  //             solver: (compr: unknown, ans: string): boolean => {
  //               if (typeof compr !== "string") throw new Error("solver expected string");
  //               return ans === comprLZDecode(compr);
  //             },
  //   },
  // {
  //   name: "Compression III: LZ Compression",
  //     difficulty: 10,
  //       numTries: 10,
  //         desc: (plaintext: unknown): string => {
  //           return [
  //             "Lempel-Ziv (LZ) compression is a data compression technique which encodes data using references to",
  //             "earlier parts of the data. In this variant of LZ, data is encoded in two types of chunk. Each chunk",
  //             "begins with a length L, encoded as a single ASCII digit from 1 to 9, followed by the chunk data,",
  //             "which is either:\n\n",
  //             "1. Exactly L characters, which are to be copied directly into the uncompressed data.\n",
  //             "2. A reference to an earlier part of the uncompressed data. To do this, the length is followed",
  //             "by a second ASCII digit X: each of the L output characters is a copy of the character X",
  //             "places before it in the uncompressed data.\n\n",
  //             "For both chunk types, a length of 0 instead means the chunk ends immediately, and the next character",
  //             "is the start of a new chunk. The two chunk types alternate, starting with type 1, and the final",
  //             "chunk may be of either type.\n\n",
  //             "You are given the following input string:\n",
  //             `&nbsp; &nbsp; ${plaintext}\n`,
  //             "Encode it using Lempel-Ziv encoding with the minimum possible output length.\n\n",
  //             "Examples (some have other possible encodings of minimal length):\n",
  //             "&nbsp; &nbsp; abracadabra &nbsp; &nbsp; -> &nbsp;7abracad47\n",
  //             "&nbsp; &nbsp; mississippi &nbsp; &nbsp; -> &nbsp;4miss433ppi\n",
  //             "&nbsp; &nbsp; aAAaAAaAaAA &nbsp; &nbsp; -> &nbsp;3aAA53035\n",
  //             "&nbsp; &nbsp; 2718281828 &nbsp; &nbsp; &nbsp;-> &nbsp;627182844\n",
  //             "&nbsp; &nbsp; abcdefghijk &nbsp; &nbsp; -> &nbsp;9abcdefghi02jk\n",
  //             "&nbsp; &nbsp; aaaaaaaaaaaa &nbsp; &nbsp;-> &nbsp;3aaa91\n",
  //             "&nbsp; &nbsp; aaaaaaaaaaaaa &nbsp; -> &nbsp;1a91031\n",
  //             "&nbsp; &nbsp; aaaaaaaaaaaaaa &nbsp;-> &nbsp;1a91041",
  //           ].join(" ");
  //         },
  //           gen: (): string => {
  //             return comprLZGenerate();
  //           },
  //             solver: (plain: unknown, ans: string): boolean => {
  //               if (typeof plain !== "string") throw new Error("solver expected string");
  //               return comprLZDecode(ans) === plain && ans.length <= comprLZEncode(plain).length;
  //             },
  //   },
  // {
  //   desc: (_data: unknown): string => {
  //     if (!Array.isArray(_data)) throw new Error("data should be array of string");
  //     const data = _data as [string, number];
  //     return [
  //       "Caesar cipher is one of the simplest encryption technique.",
  //       "It is a type of substitution cipher in which each letter in the plaintext ",
  //       "is replaced by a letter some fixed number of positions down the alphabet.",
  //       "For example, with a left shift of 3, D would be replaced by A, ",
  //       "E would become B, and A would become X (because of rotation).\n\n",
  //       "You are given an array with two elements:\n",
  //       `&nbsp;&nbsp;["${data[0]}", ${data[1]}]\n`,
  //       "The first element is the plaintext, the second element is the left shift value.\n\n",
  //       "Return the ciphertext as uppercase string. Spaces remains the same.",
  //     ].join(" ");
  //   },
  //     difficulty: 1,
  //       gen: (): [string, number] => {
  //         // return [plaintext, shift value]
  //         const words = [
  //           "ARRAY",
  //           "CACHE",
  //           "CLOUD",
  //           "DEBUG",
  //           "EMAIL",
  //           "ENTER",
  //           "FLASH",
  //           "FRAME",
  //           "INBOX",
  //           "LINUX",
  //           "LOGIC",
  //           "LOGIN",
  //           "MACRO",
  //           "MEDIA",
  //           "MODEM",
  //           "MOUSE",
  //           "PASTE",
  //           "POPUP",
  //           "PRINT",
  //           "QUEUE",
  //           "SHELL",
  //           "SHIFT",
  //           "TABLE",
  //           "TRASH",
  //           "VIRUS",
  //         ];
  //         return [
  //           words
  //             .sort(() => Math.random() - 0.5)
  //             .slice(0, 5)
  //             .join(" "),
  //           Math.floor(Math.random() * 25 + 1),
  //         ];
  //       },
  //         name: "Encryption I: Caesar Cipher",
  //           numTries: 10,
  //             solver: (_data: unknown, ans: string): boolean => {
  //               if (!Array.isArray(_data)) throw new Error("data should be array of string");
  //               const data = _data as [string, number];
  //               // data = [plaintext, shift value]
  //               // build char array, shifting via map and join to final results
  //               const cipher = [...data[0]]
  //                 .map((a) => (a === " " ? a : String.fromCharCode(((a.charCodeAt(0) - 65 - data[1] + 26) % 26) + 65)))
  //                 .join("");
  //               return cipher === ans;
  //             },
  //   },
  // {
  //   desc: (_data: unknown): string => {
  //     if (!Array.isArray(_data)) throw new Error("data should be array of string");
  //     const data = _data as [string, string];
  //     return [
  //       "Vigenère cipher is a type of polyalphabetic substitution. It uses ",
  //       "the Vigenère square to encrypt and decrypt plaintext with a keyword.\n\n",
  //       "&nbsp;&nbsp;Vigenère square:\n",
  //       "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;A B C D E F G H I J K L M N O P Q R S T U V W X Y Z \n",
  //       "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; +----------------------------------------------------\n",
  //       "&nbsp;&nbsp;&nbsp;&nbsp; A | A B C D E F G H I J K L M N O P Q R S T U V W X Y Z \n",
  //       "&nbsp;&nbsp;&nbsp;&nbsp; B | B C D E F G H I J K L M N O P Q R S T U V W X Y Z A \n",
  //       "&nbsp;&nbsp;&nbsp;&nbsp; C | C D E F G H I J K L M N O P Q R S T U V W X Y Z A B\n",
  //       "&nbsp;&nbsp;&nbsp;&nbsp; D | D E F G H I J K L M N O P Q R S T U V W X Y Z A B C\n",
  //       "&nbsp;&nbsp;&nbsp;&nbsp; E | E F G H I J K L M N O P Q R S T U V W X Y Z A B C D\n",
  //       "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;...\n",
  //       "&nbsp;&nbsp;&nbsp;&nbsp; Y | Y Z A B C D E F G H I J K L M N O P Q R S T U V W X\n",
  //       "&nbsp;&nbsp;&nbsp;&nbsp; Z | Z A B C D E F G H I J K L M N O P Q R S T U V W X Y\n\n",
  //       "For encryption each letter of the plaintext is paired with the corresponding letter of a repeating keyword.",
  //       "For example, the plaintext DASHBOARD is encrypted with the keyword LINUX:\n",
  //       "&nbsp;&nbsp; Plaintext: DASHBOARD\n",
  //       "&nbsp;&nbsp; Keyword:&nbsp;&nbsp;&nbsp;LINUXLINU\n",
  //       "So, the first letter D is paired with the first letter of the key L. Therefore, row D and column L of the ",
  //       "Vigenère square are used to get the first cipher letter O. This must be repeated for the whole ciphertext.\n\n",
  //       "You are given an array with two elements:\n",
  //       `&nbsp;&nbsp;["${data[0]}", "${data[1]}"]\n`,
  //       "The first element is the plaintext, the second element is the keyword.\n\n",
  //       "Return the ciphertext as uppercase string.",
  //     ].join(" ");
  //   },
  //     difficulty: 2,
  //       gen: (): [string, string] => {
  //         // return [plaintext, keyword]
  //         const words = [
  //           "ARRAY",
  //           "CACHE",
  //           "CLOUD",
  //           "DEBUG",
  //           "EMAIL",
  //           "ENTER",
  //           "FLASH",
  //           "FRAME",
  //           "INBOX",
  //           "LINUX",
  //           "LOGIC",
  //           "LOGIN",
  //           "MACRO",
  //           "MEDIA",
  //           "MODEM",
  //           "MOUSE",
  //           "PASTE",
  //           "POPUP",
  //           "PRINT",
  //           "QUEUE",
  //           "SHELL",
  //           "SHIFT",
  //           "TABLE",
  //           "TRASH",
  //           "VIRUS",
  //         ];
  //         const keys = [
  //           "ALGORITHM",
  //           "BANDWIDTH",
  //           "BLOGGER",
  //           "BOOKMARK",
  //           "BROADBAND",
  //           "BROWSER",
  //           "CAPTCHA",
  //           "CLIPBOARD",
  //           "COMPUTING",
  //           "COMMAND",
  //           "COMPILE",
  //           "COMPRESS",
  //           "COMPUTER",
  //           "CONFIGURE",
  //           "DASHBOARD",
  //           "DATABASE",
  //           "DESKTOP",
  //           "DIGITAL",
  //           "DOCUMENT",
  //           "DOWNLOAD",
  //           "DYNAMIC",
  //           "EMOTICON",
  //           "ENCRYPT",
  //           "EXABYTE",
  //           "FIREWALL",
  //           "FIRMWARE",
  //           "FLAMING",
  //           "FLOWCHART",
  //           "FREEWARE",
  //           "GIGABYTE",
  //           "GRAPHICS",
  //           "HARDWARE",
  //           "HYPERLINK",
  //           "HYPERTEXT",
  //           "INTEGER",
  //           "INTERFACE",
  //           "INTERNET",
  //           "ITERATION",
  //           "JOYSTICK",
  //           "JUNKMAIL",
  //           "KEYBOARD",
  //           "KEYWORD",
  //           "LURKING",
  //           "MACINTOSH",
  //           "MAINFRAME",
  //           "MALWARE",
  //           "MONITOR",
  //           "NETWORK",
  //           "NOTEBOOK",
  //           "COMPUTER",
  //           "OFFLINE",
  //           "OPERATING",
  //           "PASSWORD",
  //           "PHISHING",
  //           "PLATFORM",
  //           "PODCAST",
  //           "PRINTER",
  //           "PRIVACY",
  //           "PROCESS",
  //           "PROGRAM",
  //           "PROTOCOL",
  //           "REALTIME",
  //           "RESTORE",
  //           "RUNTIME",
  //           "SCANNER",
  //           "SECURITY",
  //           "SHAREWARE",
  //           "SNAPSHOT",
  //           "SOFTWARE",
  //           "SPAMMER",
  //           "SPYWARE",
  //           "STORAGE",
  //           "TERMINAL",
  //           "TEMPLATE",
  //           "TERABYTE",
  //           "TOOLBAR",
  //           "TYPEFACE",
  //           "USERNAME",
  //           "UTILITY",
  //           "VERSION",
  //           "VIRTUAL",
  //           "WEBMASTER",
  //           "WEBSITE",
  //           "WINDOWS",
  //           "WIRELESS",
  //           "PROCESSOR",
  //         ];
  //         return [
  //           words
  //             .sort(() => Math.random() - 0.5)
  //             .slice(0, 5)
  //             .join(""),
  //           keys.sort(() => Math.random() - 0.5)[0],
  //         ];
  //       },
  //         name: "Encryption II: Vigenère Cipher",
  //           numTries: 10,
  //             solver: (_data: unknown, ans: string): boolean => {
  //               if (!Array.isArray(_data)) throw new Error("data should be array of string");
  //               const data = _data as [string, string];
  //               // data = [plaintext, keyword]
  //               // build char array, shifting via map and corresponding keyword letter and join to final results
  //               const cipher = [...data[0]]
  //                 .map((a, i) => {
  //                   return a === " "
  //                     ? a
  //                     : String.fromCharCode(((a.charCodeAt(0) - 2 * 65 + data[1].charCodeAt(i % data[1].length)) % 26) + 65);
  //                 })
  //                 .join("");
  //               return cipher === ans;
  //             },
  //   },
}

function HammingEncode(data) {
  const enc = [0];
  const data_bits = data.toString(2).split("").reverse();

  data_bits.forEach((e, i, a) => {
    a[i] = parseInt(e);
  });

  let k = data_bits.length;

  /* NOTE: writing the data like this flips the endianness, this is what the
   * original implementation by Hedrauta did so I'm keeping it like it was. */
  for (let i = 1; k > 0; i++) {
    if ((i & (i - 1)) != 0) {
      enc[i] = data_bits[--k];
    } else {
      enc[i] = 0;
    }
  }

  let parity = 0;

  /* Figure out the subsection parities */
  for (let i = 0; i < enc.length; i++) {
    if (enc[i]) {
      parity ^= i;
    }
  }

  parity = parity.toString(2).split("").reverse();
  parity.forEach((e, i, a) => {
    a[i] = parseInt(e);
  });

  /* Set the parity bits accordingly */
  for (let i = 0; i < parity.length; i++) {
    enc[2 ** i] = parity[i] ? 1 : 0;
  }

  parity = 0;
  /* Figure out the overall parity for the entire block */
  for (let i = 0; i < enc.length; i++) {
    if (enc[i]) {
      parity++;
    }
  }

  /* Finally set the overall parity bit */
  enc[0] = parity % 2 == 0 ? 0 : 1;

  return enc.join("");
}

export function HammingEncodeProperly(data) {
  /* How many bits do we need?
   * n = 2^m
   * k = 2^m - m - 1
   * where k is the number of data bits, m the number
   * of parity bits and n the number of total bits. */

  let m = 1;

  while (2 ** (2 ** m - m - 1) - 1 < data) {
    m++;
  }

  const n = 2 ** m;
  const k = 2 ** m - m - 1;

  const enc = [0];
  const data_bits = data.toString(2).split("").reverse();

  data_bits.forEach((e, i, a) => {
    a[i] = parseInt(e);
  });

  /* Flip endianness as in the original implementation by Hedrauta
   * and write the data back to front
   * XXX why do we do this? */
  for (let i = 1, j = k; i < n; i++) {
    if ((i & (i - 1)) != 0) {
      enc[i] = data_bits[--j] ? data_bits[j] : 0;
    }
  }

  let parity = 0;

  /* Figure out the subsection parities */
  for (let i = 0; i < n; i++) {
    if (enc[i]) {
      parity ^= i;
    }
  }

  parity = parity.toString(2).split("").reverse();
  parity.forEach((e, i, a) => {
    a[i] = parseInt(e);
  });

  /* Set the parity bits accordingly */
  for (let i = 0; i < m; i++) {
    enc[2 ** i] = parity[i] ? 1 : 0;
  }

  parity = 0;
  /* Figure out the overall parity for the entire block */
  for (let i = 0; i < n; i++) {
    if (enc[i]) {
      parity++;
    }
  }

  /* Finally set the overall parity bit */
  enc[0] = parity % 2 == 0 ? 0 : 1;

  return enc.join("");
}

function HammingDecode(data) {
  let err = 0;
  const bits = [];

  /* TODO why not just work with an array of digits from the start? */
  for (const i in data.split("")) {
    const bit = parseInt(data[i]);
    bits[i] = bit;

    if (bit) {
      err ^= +i;
    }
  }

  /* If err != 0 then it spells out the index of the bit that was flipped */
  if (err) {
    /* Flip to correct */
    bits[err] = bits[err] ? 0 : 1;
  }

  /* Now we have to read the message, bit 0 is unused (it's the overall parity bit
   * which we don't care about). Each bit at an index that is a power of 2 is
   * a parity bit and not part of the actual message. */

  let ans = "";

  for (let i = 1; i < bits.length; i++) {
    /* i is not a power of two so it's not a parity bit */
    if ((i & (i - 1)) != 0) {
      ans += bits[i];
    }
  }

  /* TODO to avoid ambiguity about endianness why not let the player return the extracted (and corrected)
   * data bits, rather than guessing at how to convert it to a decimal string? */
  return parseInt(ans, 2);
}
