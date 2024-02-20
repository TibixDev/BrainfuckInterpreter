class BrainfuckInterpreter {
    program: string[]
    mem: Uint8Array
    head: number
    pc: number
    out: number[]
    debug: boolean
    executionFinished: boolean

    constructor(program: string, memSize: number = 1024) {
        const allowedChars = "+-<>[].,".split("")
        this.program = program.split("").filter(char => allowedChars.includes(char))
        this.mem = new Uint8Array(memSize)
        this.head = 0
        this.pc = 0
        this.out = [];
        this.debug = false;
        this.executionFinished = false;

        this.logDebug(`Initialized new BFI with a ${memSize} bytes of memory`)
        const init = Date.now()
        while (!this.executionFinished) {
            this.processInstruction()
        }
        console.log(`Runtime: ${(Date.now() - init).toFixed(2)}ms`)
    }

    /**
     * Logs a message to the console if debug is enabled
     * @param args - The arguments to log
     */
    logDebug(...args: any[]) {
        if (this.debug) {
            //console.log(this.program.join(""))
            //console.log(" ".repeat(this.pc) + "^")
            console.log(`[BFI] [PC${this.pc || 0}] [H${this.head || 0}]`, ...args)
        }
    }

    /**
     * Finds the pair for a string
     * @param {string[]} localArr - The array to search
     * @param {string} starter - The starter character(s) to find a pair for
     * @param {number} starterIndex - The index to start searching from
     * @param {string} ender - The ender character(s) to find a pair for
     * @param {boolean} [reverse=false] - Whether to search backwards
     * @returns {(number|null)} The index of the ender character or null
     */
    seekPair(arr: string[], starter: string, starterIndex: number, ender: string, reverse: boolean = false) : number|null {
        let localArr = [...arr];
        if (reverse) {
            localArr = localArr.reverse();
            starterIndex = localArr.length - starterIndex;
        }

        let nests = 0;
        for (let i = starterIndex + 1; i < localArr.length; i++) {
            if (localArr[i] === starter) {
                nests++;
            } else if (localArr[i] === ender) {
                if (nests === 0) {
                    return !reverse ? i : localArr.length - i - 1;
                } else {
                    nests--;
                }
            }
        }
        return null;
    }

    /**
     * Processes the current instruction that `this.pc` points to
     */
    processInstruction() {
        const instruction = this.program[this.pc]
        let shouldIncrementPc = true
        if (!instruction) {
            this.executionFinished = true;
            console.log(Buffer.from(this.out).toString("utf8"))
            return
        }
        switch (instruction) {
            // Increment the value at the current head
            case "+":
                this.logDebug("Got '+' (ADD) instruction.")
                this.mem[this.head] += 1
                break
            // Decrement the value at the current head
            case "-":
                this.logDebug("Got '-' (SUBTRACT) instruction.")
                this.mem[this.head] -= 1
                break
            // Move left
            case "<":
                this.logDebug("Got '<' (MOVLEFT) instruction.")
                this.head -= 1;
                // Wrap around
                if (this.head === -1) {
                    this.head = this.mem.length - 1;
                    this.logDebug("> Unsafe '<' detected, wrapping around... (This should not happen)")
                }
                break
            // Move right
            case ">":
                this.logDebug("Got '>' (MOVRIGHT) instruction.")
                this.head += 1;
                // Wrap around
                if (this.head === this.mem.length) {
                    this.logDebug("> Unsafe '>' detected, wrapping around... (This should not happen)")
                    this.head = 0;
                }
                break
            // Write
            case ".":
                const val = this.mem[this.head];
                this.logDebug(`Got '.' (WRITE) instruction. (RAW: ${val})`)
                this.out.push(val);
                //console.clear();
                //console.log(Buffer.from(this.out).toString("utf8"));
                break
            // Read
            case ",":
                let input = null; 
                this.logDebug(`[UNFINISHED] Got ',' (READ) instruction.`)
                break
            // Jump if zero (JZ)
            case "[":
                this.logDebug(`Got '[' (JZ) instruction at ${this.pc}.`)
                //console.log(this.mem[this.head], 0, this.mem[this.head] === 0)
                if (this.mem[this.head] === 0) {
                    shouldIncrementPc = false;
                    const jmpTo = this.seekPair(this.program, "[", this.pc, "]")
                    if (!jmpTo) {
                        this.logDebug(`[CRITICAL] JZ - Could find matching ']' for '['. Halting...`)
                        this.executionFinished = true
                    } else {
                        this.pc = jmpTo;
                        this.logDebug(`> [JZ] ${this.mem[this.head]} was 0, jumped to ${jmpTo}`)
                    }
                }
                break
            // Jump if not zero (JNZ)
            case "]":
                this.logDebug(`Got ']' (JNZ) instruction at ${this.pc}`)
                if (this.mem[this.head] !== 0) {
                    shouldIncrementPc = false;
                    const jmpTo = this.seekPair(this.program, "]", this.pc, "[", true)
                    if (!jmpTo) {
                        this.logDebug(`> [CRITICAL] JNZ - Could find matching '[' for ']'. Halting...`)
                        this.executionFinished = true
                    } else {
                        this.pc = jmpTo;
                        this.logDebug(`> [JNZ] ${this.mem[this.head]} wasn't 0, jumped to ${jmpTo}`)
                    }
                }
                break

            default:
                this.logDebug(`[UNIMPLEMENTED] Got '${instruction} (UNK) instruction.'`)
                break
        }
        if (shouldIncrementPc) {
            this.pc++
        }
    }
}

let prog = `
>++++++++[<+++++++++>-]<.>++++[<+++++++>-]<+.+++++++..+++.>>++++++[<+++++++>-]<+
+.------------.>++++++[<+++++++++>-]<+.<.+++.------.--------.>>>++++[<++++++++>-
]<+.`
let bfi = new BrainfuckInterpreter(prog, 2048)
console.log(prog);