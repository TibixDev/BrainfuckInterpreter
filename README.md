# Brainfuck Interpreter

This is a simple Brainfuck interpreter written in TypeScript. Brainfuck is an esoteric programming language known for its minimalism and Turing-completeness. The language consists of only eight simple commands and an instruction pointer.

## Features

- **Interpret Brainfuck Code**: Parse and execute Brainfuck code.
- **Memory Management**: Allocate memory and handle memory wrapping.
- **Debugging Support**: Enable debug mode to trace the execution flow.

## Usage

To use this interpreter, instantiate a `BrainfuckInterpreter` object with the Brainfuck code as a string input. Optionally, you can specify the size of the memory array (default is 1024 bytes).

```typescript
// Example usage
const bfCode = '...'; // Your Brainfuck code here
const interpreter = new BrainfuckInterpreter(bfCode);
```

## Example

Here's a sample usage of the interpreter with a simple Brainfuck program:

```typescript
// Example Brainfuck program
const bfProgram = `>++++++++[<+++++++++>-]<.>++++[<+++++++>-]<+.+++++++..+++.>>++++++[<+++++++>-]<+
+.------------.>++++++[<+++++++++>-]<+.<.+++.------.--------.>>>++++[<++++++++>-
]<+.`;

// Instantiate the interpreter
const bfi = new BrainfuckInterpreter(bfProgram, 2048);
```

## Contributing

Contributions are welcome! Feel free to open issues and pull requests.

## License

This project is licensed under the [MIT License](LICENSE).